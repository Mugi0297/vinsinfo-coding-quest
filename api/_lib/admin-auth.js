const { createHmac, timingSafeEqual } = require("node:crypto");

const COOKIE_NAME = "coding_quest_admin";
const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function getAdminConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!username?.trim() || !password || password.length < 12 || !sessionSecret || sessionSecret.length < 32) {
    throw new Error("Admin login is not configured. Set ADMIN_USERNAME, an ADMIN_PASSWORD of at least 12 characters, and an ADMIN_SESSION_SECRET of at least 32 characters.");
  }
  return { username: username.trim(), password, sessionSecret };
}

function safeEqual(actual, expected) {
  const actualHash = createHmac("sha256", "admin-credential-check").update(actual).digest();
  const expectedHash = createHmac("sha256", "admin-credential-check").update(expected).digest();
  return timingSafeEqual(actualHash, expectedHash) && actual.length === expected.length;
}

function sign(payload, secret) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function setSessionCookie(res, req, token) {
  const secure = process.env.NODE_ENV === "production" || req.headers?.["x-forwarded-proto"] === "https";
  const secureFlag = secure ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${SESSION_MAX_AGE_SECONDS}${secureFlag}`);
}

function clearSessionCookie(res, req) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0${process.env.NODE_ENV === "production" || req.headers?.["x-forwarded-proto"] === "https" ? "; Secure" : ""}`);
}

function getCookie(req, name) {
  const cookieHeader = req.headers?.cookie;
  if (typeof cookieHeader !== "string") return "";
  const cookie = cookieHeader.split(";").map(value => value.trim()).find(value => value.startsWith(`${name}=`));
  return cookie ? cookie.slice(name.length + 1) : "";
}

function verifyAdminSession(req) {
  const { sessionSecret } = getAdminConfig();
  const token = getCookie(req, COOKIE_NAME);
  const [encoded, suppliedSignature] = token.split(".");
  if (!encoded || !suppliedSignature) return false;
  const expectedSignature = createHmac("sha256", sessionSecret).update(encoded).digest();
  let actualSignature;
  try {
    actualSignature = Buffer.from(suppliedSignature, "base64url");
  } catch {
    return false;
  }
  if (actualSignature.length !== expectedSignature.length || !timingSafeEqual(actualSignature, expectedSignature)) return false;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    return payload.role === "admin"
      && payload.username === process.env.ADMIN_USERNAME
      && Number.isInteger(payload.exp)
      && payload.exp > Date.now();
  } catch {
    return false;
  }
}

module.exports = { getAdminConfig, safeEqual, setSessionCookie, clearSessionCookie, sign, verifyAdminSession, SESSION_MAX_AGE_SECONDS };
