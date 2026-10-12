const { consumeIpLimit, getSupabaseConfig, requestSupabase, sendJson } = require("./_lib/supabase");

const MAX_SCORE = 1020;
const MAX_LEVEL = 10;

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function cleanStudentField(value, name, maxLength) {
  if (typeof value !== "string") throw createError(`${name} is required.`, 400);
  const cleaned = Array.from(value.trim()).filter(character => !/[\u0000-\u001f\u007f]/.test(character)).join("");
  if (!cleaned || Array.from(cleaned).length > maxLength) {
    throw createError(`${name} must contain 1 to ${maxLength} characters.`, 400);
  }
  return cleaned;
}

function parseStudent(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw createError("Student details are required.", 400);
  return {
    name: cleanStudentField(value.name, "Student name", 80),
    rollno: cleanStudentField(value.rollno, "Roll number", 30).toUpperCase(),
    department: cleanStudentField(value.department, "Department", 80),
    section: cleanStudentField(value.section, "Section", 30)
  };
}

async function startAttempt(req, body) {
  const student = parseStudent(body.student);
  const level = body.level;
  const questionCount = body.questionCount;
  if (!Number.isInteger(level) || level < 1 || level > MAX_LEVEL) throw createError("Level must be an integer from 1 to 10.", 400);
  if (!Number.isInteger(questionCount) || questionCount < 1 || questionCount > 30) throw createError("Question count must be an integer from 1 to 30.", 400);

  const { serviceKey } = getSupabaseConfig();
  const allowed = await consumeIpLimit(req, serviceKey, 25, 600);
  if (!allowed) {
    const error = new Error("Too many runs started. Please try again in about 10 minutes.");
    error.statusCode = 429;
    throw error;
  }

  if (level > 1) {
    const previousLevelQuery = new URLSearchParams({
      select: "id",
      rollno: `eq.${student.rollno}`,
      level: `eq.${level - 1}`,
      passed: "eq.true",
      limit: "1"
    });
    const previousLevelResponse = await requestSupabase(`student_attempts?${previousLevelQuery}`);
    if (!previousLevelResponse.ok) {
      console.error("Supabase level access check failed.", previousLevelResponse.status);
      throw createError("Unable to verify your unlocked level.", 502);
    }
    const previousAttempts = await previousLevelResponse.json();
    if (!Array.isArray(previousAttempts) || !previousAttempts.length) {
      const error = new Error(`Pass Level ${level - 1} before starting Level ${level}.`);
      error.statusCode = 403;
      throw error;
    }
  }

  const profileResponse = await requestSupabase("student_profiles?on_conflict=rollno", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ ...student, updated_at: new Date().toISOString() })
  });
  if (!profileResponse.ok) {
    console.error("Supabase student profile write failed.", profileResponse.status);
    throw createError("Unable to save student details.", 502);
  }

  const attemptResponse = await requestSupabase("student_attempts?select=id", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ rollno: student.rollno, level, question_count: questionCount })
  });
  if (!attemptResponse.ok) {
    console.error("Supabase student attempt write failed.", attemptResponse.status);
    throw createError("Unable to register this run.", 502);
  }
  const attempts = await attemptResponse.json();
  if (!Array.isArray(attempts) || !attempts[0]?.id) throw createError("Unable to confirm this run registration.", 502);
  return String(attempts[0].id);
}

async function finishAttempt(body) {
  const attemptId = body.attemptId;
  const rollno = cleanStudentField(body.rollno, "Roll number", 30).toUpperCase();
  if (!/^\d+$/.test(String(attemptId)) || !Number.isSafeInteger(Number(attemptId)) || Number(attemptId) < 1) {
    throw createError("Attempt ID is invalid.", 400);
  }

  const filters = new URLSearchParams({
    id: `eq.${attemptId}`,
    rollno: `eq.${rollno}`,
    completed_at: "is.null",
    select: "id"
  });
  const values = { status: "abandoned", completed_at: new Date().toISOString() };
  if (body.abandoned !== true) {
    if (!Number.isInteger(body.score) || body.score < 0 || body.score > MAX_SCORE) throw createError(`Score must be an integer from 0 to ${MAX_SCORE}.`, 400);
    if (!Number.isInteger(body.questionCount) || body.questionCount < 1 || body.questionCount > 30) throw createError("Question count must be an integer from 1 to 30.", 400);
    if (!Number.isInteger(body.correctAnswers) || body.correctAnswers < 0 || body.correctAnswers > body.questionCount) {
      throw createError("Correct answer count is invalid.", 400);
    }
    Object.assign(values, {
      status: "completed",
      score: body.score,
      correct_answers: body.correctAnswers,
      passed: body.correctAnswers >= Math.ceil(body.questionCount * 0.6)
    });
  }
  const response = await requestSupabase(`student_attempts?${filters}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(values)
  });
  if (!response.ok) {
    console.error("Supabase student attempt update failed.", response.status);
    throw createError("Unable to save this run.", 502);
  }
  const updated = await response.json();
  if (!Array.isArray(updated) || !updated.length) {
    const error = new Error("This run is already closed or does not belong to this roll number.");
    error.statusCode = 404;
    throw error;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "PATCH") {
    res.setHeader("Allow", "POST, PATCH");
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  try {
    getSupabaseConfig();
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Request body must be a JSON object.");
    if (req.method === "POST") {
      const attemptId = await startAttempt(req, body);
      return sendJson(res, 201, { attemptId });
    }
    await finishAttempt(body);
    return sendJson(res, 200, { saved: true });
  } catch (error) {
    const statusCode = error.statusCode
      || (error instanceof SyntaxError ? 400 : error.message === "Supabase environment variables are not configured." ? 503 : 502);
    if (statusCode >= 500) console.error("Student progress request failed.", error);
    return sendJson(res, statusCode, { error: error instanceof SyntaxError ? "Request body must be valid JSON." : error.message });
  }
};
