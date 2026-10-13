const { consumeIpLimit, getSupabaseConfig, requestSupabase, sendJson } = require("./_lib/supabase");
const { getStudentProfile, getStudentSessionSecret, sign, verifyStudentSession } = require("./_lib/student-auth");
const ANSWERS = require("./_lib/answer-key.json");

const MAX_SCORE = 1020;
const MAX_LEVEL = 10;
const LEVEL_SEQUENCE = [10, 5, 1, 2, 3, 4, 6, 7, 8, 9];
const QUESTION_TIME_LIMIT = 60;
const MAX_LIVES = 5;
const QUESTIONS_PER_GAME = 30;

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function requireStudent(req) {
  const session = verifyStudentSession(req);
  if (!session) throw createError("Sign in with your student account to continue.", 401);
  const profile = await getStudentProfile(session.rollno);
  if (!profile || !profile.password_hash) throw createError("Student account is not enrolled.", 401);
  return profile;
}

function parseQuestionIndices(level, value) {
  const answerKey = ANSWERS[level];
  if (!Array.isArray(answerKey) || !answerKey.length || !Array.isArray(value)
    || value.length !== Math.min(QUESTIONS_PER_GAME, answerKey.length)) {
    throw createError("Question selection is invalid.", 400);
  }
  if (!value.every(index => Number.isInteger(index) && index >= 0 && index < answerKey.length)
    || new Set(value).size !== value.length) {
    throw createError("Question selection is invalid.", 400);
  }
  return value;
}

async function startAttempt(req, body, student) {
  const level = body.level;
  if (!Number.isInteger(level) || level < 1 || level > MAX_LEVEL) {
    throw createError("Level must be an integer from 1 to 10.", 400);
  }
  const levelPosition = LEVEL_SEQUENCE.indexOf(level);
  if (levelPosition === -1) throw createError("This level is not available.", 400);
  if (body.leaderboardConsent !== true) throw createError("Public leaderboard consent is required to start a run.", 400);
  const questionIndices = parseQuestionIndices(level, body.questionIndices);
  const { serviceKey } = getSupabaseConfig();
  const allowed = await consumeIpLimit(req, serviceKey, 25, 600);
  if (!allowed) throw createError("Too many runs started. Try again in about 10 minutes.", 429);

  if (levelPosition > 0) {
    const previousLevel = LEVEL_SEQUENCE[levelPosition - 1];
    const previousLevelQuery = new URLSearchParams({
      select: "id",
      rollno: `eq.${student.rollno}`,
      level: `eq.${previousLevel}`,
      passed: "eq.true",
      limit: "1"
    });
    if (student.progress_reset_at) previousLevelQuery.set("started_at", `gte.${student.progress_reset_at}`);
    const previousLevelResponse = await requestSupabase(`student_attempts?${previousLevelQuery}`);
    if (!previousLevelResponse.ok) {
      console.error("Supabase level access check failed.", previousLevelResponse.status);
      throw createError("Unable to verify your unlocked level.", 502);
    }
    const previousAttempts = await previousLevelResponse.json();
    if (!Array.isArray(previousAttempts) || !previousAttempts.length) {
      throw createError(`Pass Level ${levelPosition} before starting Level ${levelPosition + 1}.`, 403);
    }
  }

  const attemptResponse = await requestSupabase("student_attempts?select=id", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({
      rollno: student.rollno,
      level,
      question_count: questionIndices.length,
      question_indices: questionIndices,
      public_leaderboard_consent: true
    })
  });
  if (!attemptResponse.ok) {
    console.error("Supabase student attempt write failed.", attemptResponse.status);
    throw createError("Unable to register this run.", 502);
  }
  const attempts = await attemptResponse.json();
  if (!Array.isArray(attempts) || !attempts[0]?.id) throw createError("Unable to confirm this run registration.", 502);
  return String(attempts[0].id);
}

async function recordAnswer(body, student) {
  const attemptId = String(body.attemptId || "");
  if (!/^\d+$/.test(attemptId) || !Number.isSafeInteger(Number(attemptId)) || Number(attemptId) < 1) {
    throw createError("Attempt ID is invalid.", 400);
  }
  if (!Number.isInteger(body.questionNumber) || body.questionNumber < 0 || body.questionNumber >= QUESTIONS_PER_GAME) {
    throw createError("Question number is invalid.", 400);
  }
  if (body.questionIndex !== undefined
    && (!Number.isInteger(body.questionIndex) || body.questionIndex < 0)) {
    throw createError("Question selection is invalid.", 400);
  }
  if (body.selectedAnswer !== null
    && (typeof body.selectedAnswer !== "string" || !body.selectedAnswer.trim() || body.selectedAnswer.length > 500)) {
    throw createError("Selected answer is invalid.", 400);
  }

  const query = new URLSearchParams({
    select: "id,level,status,question_count,question_indices,current_question,server_score,server_correct_answers,lives_remaining,question_started_at,answer_history",
    id: `eq.${attemptId}`,
    rollno: `eq.${student.rollno}`,
    status: "eq.in_progress",
    completed_at: "is.null",
    limit: "1"
  });
  if (student.progress_reset_at) query.set("started_at", `gte.${student.progress_reset_at}`);
  const loadResponse = await requestSupabase(`student_attempts?${query}`);
  if (!loadResponse.ok) {
    console.error("Supabase active attempt read failed.", loadResponse.status);
    throw createError("Unable to load this run.", 502);
  }
  const rows = await loadResponse.json();
  const attempt = Array.isArray(rows) ? rows[0] : null;
  if (!attempt) throw createError("This run is no longer active.", 404);
  const answerHistory = attempt.answer_history;
  if (!Array.isArray(answerHistory)) throw createError("This run has invalid answer history.", 409);
  if (attempt.current_question !== body.questionNumber) {
    const previousAnswer = answerHistory.find(answer => answer.questionNumber === body.questionNumber);
    if (previousAnswer && previousAnswer.selectedAnswer === body.selectedAnswer) return previousAnswer.result;
    throw createError("This question has already been answered or is out of order.", 409);
  }
  const indices = attempt.question_indices;
  if (!Array.isArray(indices) || indices.length !== attempt.question_count
    || attempt.current_question >= indices.length) throw createError("This run has invalid question data.", 409);
  if (body.questionIndex !== undefined && indices[attempt.current_question] !== body.questionIndex) {
    console.error("Displayed question does not match the registered attempt.", {
      attemptId,
      questionNumber: body.questionNumber,
      displayedQuestionIndex: body.questionIndex,
      registeredQuestionIndex: indices[attempt.current_question]
    });
    throw createError("This question does not match the registered run. Please restart the level.", 409);
  }

  const answer = ANSWERS[attempt.level]?.[indices[attempt.current_question]];
  if (typeof answer !== "string") throw createError("The answer key for this run is unavailable.", 500);
  const elapsedMilliseconds = Math.max(0, Date.now() - new Date(attempt.question_started_at).getTime());
  const timedOut = body.selectedAnswer === null || elapsedMilliseconds >= QUESTION_TIME_LIMIT * 1000;
  const isCorrect = !timedOut && body.selectedAnswer === answer;
  const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
  const points = isCorrect
    ? 10 + Math.floor(Math.max(0, QUESTION_TIME_LIMIT - Math.min(elapsedSeconds, QUESTION_TIME_LIMIT)) / 5) * 2
    : 0;
  const livesRemaining = Math.max(0, attempt.lives_remaining - (isCorrect ? 0 : 1));
  const currentQuestion = attempt.current_question + 1;
  const nextQuestionStartedAt = new Date().toISOString();
  const values = {
    current_question: currentQuestion,
    server_score: attempt.server_score + points,
    server_correct_answers: attempt.server_correct_answers + (isCorrect ? 1 : 0),
    lives_remaining: livesRemaining,
    question_started_at: nextQuestionStartedAt,
    answer_history: [...answerHistory, {
      questionNumber: body.questionNumber,
      selectedAnswer: body.selectedAnswer,
      result: {
        correct: isCorrect,
        timedOut,
        points,
        score: attempt.server_score + points,
        correctAnswers: attempt.server_correct_answers + (isCorrect ? 1 : 0),
        lives: livesRemaining
      }
    }]
  };
  const updateQuery = new URLSearchParams({
    id: `eq.${attemptId}`,
    rollno: `eq.${student.rollno}`,
    current_question: `eq.${attempt.current_question}`,
    status: "eq.in_progress",
    select: "id"
  });
  const updateResponse = await requestSupabase(`student_attempts?${updateQuery}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify(values)
  });
  if (!updateResponse.ok) {
    console.error("Supabase answer submission failed.", updateResponse.status);
    throw createError("Unable to record this answer.", 502);
  }
  const updated = await updateResponse.json();
  if (!Array.isArray(updated) || !updated.length) throw createError("This question was already submitted.", 409);
  return values.answer_history[values.answer_history.length - 1].result;
}

async function finishAttempt(body, student) {
  const attemptId = String(body.attemptId || "");
  if (!/^\d+$/.test(attemptId) || !Number.isSafeInteger(Number(attemptId)) || Number(attemptId) < 1) {
    throw createError("Attempt ID is invalid.", 400);
  }
  const query = new URLSearchParams({
    select: "id,level,status,score,correct_answers,passed,question_count,current_question,server_score,server_correct_answers,lives_remaining",
    id: `eq.${attemptId}`,
    rollno: `eq.${student.rollno}`,
    limit: "1"
  });
  if (student.progress_reset_at) query.set("started_at", `gte.${student.progress_reset_at}`);
  const readResponse = await requestSupabase(`student_attempts?${query}`);
  if (!readResponse.ok) {
    console.error("Supabase attempt completion read failed.", readResponse.status);
    throw createError("Unable to load this run.", 502);
  }
  const rows = await readResponse.json();
  const attempt = Array.isArray(rows) ? rows[0] : null;
  if (!attempt) throw createError("This run is no longer active.", 404);

  if (attempt.status === "completed") {
    await recordPublicScore(attempt.id, attempt.level, student.name, attempt.score);
    return {
      score: attempt.score,
      correctAnswers: attempt.correct_answers,
      lives: attempt.lives_remaining,
      questionCount: attempt.question_count,
      passed: attempt.passed
    };
  }
  if (attempt.status !== "in_progress") throw createError("This run is no longer active.", 404);

  const passed = attempt.lives_remaining > 0
    && attempt.server_correct_answers >= Math.ceil(attempt.question_count * 0.6);
  const updateQuery = new URLSearchParams({
    id: `eq.${attemptId}`,
    rollno: `eq.${student.rollno}`,
    status: "eq.in_progress",
    completed_at: "is.null",
    select: "id"
  });
  const updateResponse = await requestSupabase(`student_attempts?${updateQuery}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({
      status: "completed",
      score: attempt.server_score,
      correct_answers: attempt.server_correct_answers,
      passed,
      completed_at: new Date().toISOString()
    })
  });
  if (!updateResponse.ok) {
    console.error("Supabase attempt completion write failed.", updateResponse.status);
    throw createError("Unable to save this run.", 502);
  }
  const updated = await updateResponse.json();
  if (!Array.isArray(updated) || !updated.length) throw createError("This run is already closed.", 409);
  await recordPublicScore(attempt.id, attempt.level, student.name, attempt.server_score);
  return {
    score: attempt.server_score,
    correctAnswers: attempt.server_correct_answers,
    lives: attempt.lives_remaining,
    questionCount: attempt.question_count,
    passed
  };
}

async function recordPublicScore(attemptId, level, name, score) {
  const response = await requestSupabase("leaderboard?on_conflict=attempt_id", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({ attempt_id: attemptId, name, score, level })
  });
  if (!response.ok) {
    console.error("Supabase verified leaderboard write failed.", response.status);
    throw createError("Run was saved but leaderboard update failed. Retry saving results.", 502);
  }
}

async function abandonAttempt(body, student) {
  const attemptId = String(body.attemptId || "");
  if (!/^\d+$/.test(attemptId)) throw createError("Attempt ID is invalid.", 400);
  const query = new URLSearchParams({
    id: `eq.${attemptId}`,
    rollno: `eq.${student.rollno}`,
    status: "eq.in_progress",
    completed_at: "is.null"
  });
  if (student.progress_reset_at) query.set("started_at", `gte.${student.progress_reset_at}`);
  const response = await requestSupabase(`student_attempts?${query}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ status: "abandoned", completed_at: new Date().toISOString() })
  });
  if (!response.ok) {
    console.error("Supabase attempt abandonment failed.", response.status);
    throw createError("Unable to close this run.", 502);
  }
}

async function getStudentProgress(student) {
  const query = new URLSearchParams({
    select: "level,score,passed",
    rollno: `eq.${student.rollno}`,
    status: "eq.completed",
    order: "completed_at.asc"
  });
  if (student.progress_reset_at) query.set("started_at", `gte.${student.progress_reset_at}`);
  const response = await requestSupabase(`student_attempts?${query}`);
  if (!response.ok) {
    console.error("Supabase student progress read failed.", response.status);
    throw createError("Unable to load your saved level progress.", 502);
  }
  const rows = await response.json();
  if (!Array.isArray(rows)) throw createError("Student progress response is invalid.", 502);
  const completedLevels = [...new Set(rows.filter(row => row.passed).map(row => row.level))]
    .filter(level => Number.isInteger(level) && level >= 1 && level <= MAX_LEVEL);
  const bestScores = {};
  rows.forEach(row => {
    if (Number.isInteger(row.level) && Number.isInteger(row.score)) {
      bestScores[row.level] = Math.max(bestScores[row.level] || 0, row.score);
    }
  });
  return { completedLevels, bestScores };
}

async function resetStudentProgress(student) {
  const resetAt = new Date().toISOString();
  const query = new URLSearchParams({
    rollno: `eq.${student.rollno}`,
    select: "rollno"
  });
  const response = await requestSupabase(`student_profiles?${query}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ progress_reset_at: resetAt, updated_at: resetAt })
  });
  if (!response.ok) {
    console.error("Supabase student progress reset failed.", response.status);
    throw createError("Unable to reset your saved level progress.", 502);
  }
  const rows = await response.json();
  if (!Array.isArray(rows) || !rows.length) throw createError("Unable to confirm your progress reset.", 502);
  return { reset: true };
}

module.exports = async function handler(req, res) {
  if (!["GET", "POST", "PATCH", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST, PATCH, DELETE");
    return sendJson(res, 405, { error: "Method not allowed." });
  }
  try {
    getSupabaseConfig();
    getStudentSessionSecret();
    const student = await requireStudent(req);
    if (req.method === "GET") return sendJson(res, 200, await getStudentProgress(student));
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) throw createError("Request body must be a JSON object.", 400);

    if (req.method === "POST") {
      if (body.action === "reset") return sendJson(res, 200, await resetStudentProgress(student));
      if (body.action === "answer") {
        const result = await recordAnswer(body, student);
        return sendJson(res, 200, result);
      }
      if (body.action !== "start") throw createError("Unknown student progress action.", 400);
      const attemptId = await startAttempt(req, body, student);
      return sendJson(res, 201, { attemptId });
    }
    if (req.method === "DELETE") {
      await abandonAttempt(body, student);
      return sendJson(res, 200, { saved: true });
    }
    const result = await finishAttempt(body, student);
    return sendJson(res, 200, result);
  } catch (error) {
    const statusCode = error.statusCode
      || (error instanceof SyntaxError ? 400
        : error.message.includes("not configured") ? 503 : 502);
    if (statusCode >= 500) console.error("Student progress request failed.", error);
    return sendJson(res, statusCode, {
      error: error instanceof SyntaxError ? "Request body must be valid JSON." : error.message
    });
  }
};
