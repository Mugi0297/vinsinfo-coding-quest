const { getSupabaseConfig, requestSupabase, sendJson } = require("../_lib/supabase");
const {
  clearStudentSessionCookie,
  getStudentProfile,
  getStudentSessionSecret,
  hashStudentPassword,
  limitLoginAttempts,
  setStudentSessionCookie,
  sign,
  verifyStudentPassword,
  verifyStudentSession,
  SESSION_MAX_AGE_SECONDS
} = require("../_lib/student-auth");

function normalizeRollno(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function cleanField(value, label, maxLength) {
  if (typeof value !== "string") throw new Error(`${label} is required.`);
  const result = value.trim();
  if (!result || result.length > maxLength || /[\u0000-\u001f\u007f]/.test(result)) {
    throw new Error(`${label} must contain 1 to ${maxLength} valid characters.`);
  }
  return result;
}

function studentResponseProfile(profile) {
  return {
    rollno: profile.rollno,
    name: profile.name,
    department: profile.department,
    section: profile.section
  };
}

function startStudentSession(profile, req, res) {
  const token = sign({
    role: "student",
    rollno: profile.rollno,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  }, getStudentSessionSecret());
  setStudentSessionCookie(res, req, token);
}

module.exports = async function handler(req, res) {
  if (!["GET", "POST", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST, DELETE");
    return sendJson(res, 405, { error: "Method not allowed." });
  }
  try {
    getSupabaseConfig();
    getStudentSessionSecret();
    if (req.method === "GET") {
      const session = verifyStudentSession(req);
      if (!session) return sendJson(res, 200, { authenticated: false });
      const profile = await getStudentProfile(session.rollno);
      if (!profile || !profile.password_hash) {
        clearStudentSessionCookie(res, req);
        return sendJson(res, 200, { authenticated: false });
      }
      return sendJson(res, 200, {
        authenticated: true,
        student: {
          rollno: profile.rollno,
          name: profile.name,
          department: profile.department,
          section: profile.section
        }
      });
    }
    if (req.method === "DELETE") {
      clearStudentSessionCookie(res, req);
      return sendJson(res, 200, { authenticated: false });
    }

    await limitLoginAttempts(req);
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return sendJson(res, 400, { error: "Request body must be a JSON object." });
    }
    if (body.action === "signup") {
      const name = cleanField(body.name, "Student name", 80);
      const rollno = normalizeRollno(cleanField(body.rollno, "Roll number", 30));
      const department = cleanField(body.department, "Department", 80);
      const section = cleanField(body.section, "Section", 30);
      if (typeof body.password !== "string" || body.password.length < 12 || body.password.length > 256) {
        return sendJson(res, 400, { error: "Password must contain at least 12 characters." });
      }
      const profile = { rollno, name, department, section };
      const passwordHash = await hashStudentPassword(body.password);
      const createResponse = await requestSupabase("student_profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({
          ...profile,
          password_hash: passwordHash,
          updated_at: new Date().toISOString()
        })
      });
      if (createResponse.status === 409) {
        return sendJson(res, 409, { error: "That roll number is already registered. Sign in or contact the admin if you need help." });
      }
      if (!createResponse.ok) {
        console.error("Student self-registration failed.", createResponse.status);
        return sendJson(res, 502, { error: "Unable to create your student account." });
      }
      startStudentSession(profile, req, res);
      return sendJson(res, 201, { authenticated: true, student: studentResponseProfile(profile) });
    }
    if (body.action && body.action !== "login") {
      return sendJson(res, 400, { error: "Unknown student authentication action." });
    }
    const rollno = normalizeRollno(body?.rollno);
    const password = typeof body?.password === "string" ? body.password : "";
    if (!rollno || rollno.length > 30 || password.length > 256) {
      return sendJson(res, 401, { error: "Invalid roll number or password." });
    }
    const profile = await getStudentProfile(rollno);
    const validPassword = profile?.password_hash
      ? await verifyStudentPassword(password, profile.password_hash)
      : false;
    if (!profile || !validPassword) return sendJson(res, 401, { error: "Invalid roll number or password." });

    startStudentSession(profile, req, res);
    return sendJson(res, 200, {
      authenticated: true,
      student: studentResponseProfile(profile)
    });
  } catch (error) {
    if (error instanceof SyntaxError) return sendJson(res, 400, { error: "Request body must be valid JSON." });
    if (error.message.endsWith("is required.") || error.message.includes("must contain")) {
      return sendJson(res, 400, { error: error.message });
    }
    if (error.statusCode === 429) {
      res.setHeader("Retry-After", "300");
      return sendJson(res, 429, { error: error.message });
    }
    if (error.message.includes("not configured")) {
      console.error(error.message);
      return sendJson(res, 503, { error: "Student login is not configured on this deployment." });
    }
    console.error("Student authentication failed.", error);
    return sendJson(res, 503, { error: "Student login is temporarily unavailable." });
  }
};
