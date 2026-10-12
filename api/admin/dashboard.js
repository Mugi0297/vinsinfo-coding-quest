const { getAllRows, getSupabaseConfig, sendJson } = require("../_lib/supabase");
const { verifyAdminSession } = require("../_lib/admin-auth");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "Method not allowed." });
  }
  try {
    if (!verifyAdminSession(req)) return sendJson(res, 401, { error: "Please sign in to view the admin dashboard." });
    getSupabaseConfig();
    const [students, attempts] = await Promise.all([
      getAllRows("student_profiles?select=rollno,name,department,section,created_at,updated_at&order=updated_at.desc,rollno.asc"),
      getAllRows("student_attempts?select=id,rollno,level,status,score,correct_answers,question_count,passed,started_at,completed_at&order=started_at.desc,id.desc")
    ]);
    return sendJson(res, 200, { students, attempts });
  } catch (error) {
    if (error.message.startsWith("Admin login is not configured")) {
      return sendJson(res, 503, { error: "Admin dashboard login is not configured." });
    }
    console.error("Admin dashboard request failed.", error);
    return sendJson(res, 502, { error: "Unable to load the admin dashboard." });
  }
};
