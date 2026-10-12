const { getSupabaseConfig, requestSupabase, sendJson } = require("../_lib/supabase");
const { getAdminConfig, verifyAdminSession } = require("../_lib/admin-auth");
const { hashStudentPassword } = require("../_lib/student-auth");

function cleanField(value, label, maxLength) {
  if (typeof value !== "string") throw new Error(`${label} is required.`);
  const result = value.trim();
  if (!result || result.length > maxLength || /[\u0000-\u001f\u007f]/.test(result)) {
    throw new Error(`${label} must contain 1 to ${maxLength} valid characters.`);
  }
  return result;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed." });
  }
  try {
    getAdminConfig();
    if (!verifyAdminSession(req)) return sendJson(res, 401, { error: "Please sign in as admin." });
    getSupabaseConfig();
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const rollno = cleanField(body?.rollno, "Roll number", 30).toUpperCase();
    const name = cleanField(body?.name, "Student name", 80);
    const department = cleanField(body?.department, "Department", 80);
    const section = cleanField(body?.section, "Section", 30);
    if (typeof body?.password !== "string" || body.password.length < 12 || body.password.length > 256) {
      throw new Error("Student password must contain at least 12 characters.");
    }
    const passwordHash = await hashStudentPassword(body.password);
    const response = await requestSupabase("student_profiles?on_conflict=rollno", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        rollno,
        name,
        department,
        section,
        password_hash: passwordHash,
        updated_at: new Date().toISOString()
      })
    });
    if (!response.ok) {
      console.error("Supabase student enrollment failed.", response.status);
      return sendJson(res, 502, { error: "Unable to enroll this student." });
    }
    return sendJson(res, 201, { student: { rollno, name, department, section } });
  } catch (error) {
    const status = error instanceof SyntaxError ? 400
      : error.message.includes("not configured") ? 503
        : error.message.startsWith("Please sign in") ? 401
          : 400;
    if (status === 503) console.error("Admin student enrollment is unavailable.", error);
    return sendJson(res, status, {
      error: error instanceof SyntaxError ? "Request body must be valid JSON." : status === 503 ? "Enrollment service is not configured." : error.message
    });
  }
};
