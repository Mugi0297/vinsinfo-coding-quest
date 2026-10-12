const { createHmac, randomBytes, scrypt, timingSafeEqual } = require("node:crypto");
const { promisify } = require("node:util");
const { getSupabaseConfig, requestSupabase } = require("./supabase");

const scryptAsync = promisify(scrypt);
const COOKIE_NAME = "coding_quest_student";
const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;

function getStudentSessionSecret() {
  const secret = process.env.STUDENT_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("Student login is not configured. Set STUDENT_SESSION_SECRET to a random secret of at least 32 characters.");
  }
  return secret;
}

function getCookie(req) {
  const cookieHeader = req.headers?.cookie;
  if (typeof cookieHeader !== "string") return "";
  const cookie = cookieHeader.split(";").map(value => value.trim()).find(value => value.startsWith(`${COOKIE_NAME}=`));
  return cookie ? cookie.slice(COOKIE_NAME.length + 1) : "";
}

function sign(payload, secret) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function verifyStudentSession(req) {
  const secret = getStudentSessionSecret();
  const [encoded, suppliedSignature] = getCookie(req).split(".");
  if (!encoded || !suppliedSignature) return null;
  const expected = createHmac("sha256", secret).update(encoded).digest();
  const actual = Buffer.from(suppliedSignature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (payload.role !== "student" || typeof payload.rollno !== "string"
      || !Number.isInteger(payload.exp) || payload.exp <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function setStudentSessionCookie(res, req, token) {
  const secure = process.env.NODE_ENV === "production" || req.headers?.["x-forwarded-proto"] === "https";
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure ? "; Secure" : ""}`);
}

function clearStudentSessionCookie(res, req) {
  const secure = process.env.NODE_ENV === "production" || req.headers?.["x-forwarded-proto"] === "https";
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/api; Max-Age=0${secure ? "; Secure" : ""}`);
}

async function hashStudentPassword(password) {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("base64url")}$${derived.toString("base64url")}`;
}

async function verifyStudentPassword(password, storedHash) {
  const [algorithm, saltValue, derivedValue] = storedHash.split("$");
  if (algorithm !== "scrypt" || !saltValue || !derivedValue) return false;
  const salt = Buffer.from(saltValue, "base64url");
  const expected = Buffer.from(derivedValue, "base64url");
  const actual = await scryptAsync(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

async function getStudentProfile(rollno) {
  const query = new URLSearchParams({
    select: "rollno,name,department,section,password_hash,progress_reset_at",
    rollno: `eq.${rollno}`,
    limit: "1"
  });
  const response = await requestSupabase(`student_profiles?${query}`);
  if (!response.ok) {
    console.error("Supabase student account lookup failed.", response.status);
    throw new Error("Unable to verify student credentials.");
  }
  const profiles = await response.json();
  return Array.isArray(profiles) ? profiles[0] || null : null;
}

async function limitLoginAttempts(req) {
  const { serviceKey } = getSupabaseConfig();
  const { consumeIpLimit } = require("./supabase");
  const allowed = await consumeIpLimit(req, serviceKey, 10, 300);
  if (!allowed) {
    const error = new Error("Too many login attempts. Try again in five minutes.");
    error.statusCode = 429;
    throw error;
  }
}

module.exports = {
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
};
