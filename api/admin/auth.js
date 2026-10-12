const { consumeIpLimit, getSupabaseConfig, sendJson } = require("../_lib/supabase");
const {
  clearSessionCookie,
  getAdminConfig,
  safeEqual,
  setSessionCookie,
  sign,
  verifyAdminSession,
  SESSION_MAX_AGE_SECONDS
} = require("../_lib/admin-auth");

module.exports = async function handler(req, res) {
  if (!["GET", "POST", "DELETE"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST, DELETE");
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  let config;
  try {
    config = getAdminConfig();
  } catch (error) {
    console.error(error.message);
    return sendJson(res, 503, { error: "Admin login is not configured on this deployment." });
  }

  if (req.method === "GET") {
    return sendJson(res, 200, { authenticated: verifyAdminSession(req) });
  }

  if (req.method === "DELETE") {
    clearSessionCookie(res, req);
    return sendJson(res, 200, { authenticated: false });
  }

  try {
    getSupabaseConfig();
    const allowed = await consumeIpLimit(req, config.sessionSecret, 5, 300);
    if (!allowed) {
      res.setHeader("Retry-After", "300");
      return sendJson(res, 429, { error: "Too many login attempts. Try again in five minutes." });
    }
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const username = typeof body?.username === "string" ? body.username : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!safeEqual(username, config.username) || !safeEqual(password, config.password)) {
      return sendJson(res, 401, { error: "Invalid username or password." });
    }

    const token = sign({
      role: "admin",
      username: config.username,
      exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000
    }, config.sessionSecret);
    setSessionCookie(res, req, token);
    return sendJson(res, 200, { authenticated: true });
  } catch (error) {
    if (error instanceof SyntaxError) return sendJson(res, 400, { error: "Request body must be valid JSON." });
    if (error.message === "Unable to determine client address.") {
      return sendJson(res, 503, { error: "Admin login is temporarily unavailable." });
    }
    console.error("Admin login failed.", error);
    return sendJson(res, 503, { error: "Admin login is temporarily unavailable." });
  }
};
