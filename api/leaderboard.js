const { createHmac } = require("node:crypto");

const MAX_SCORE = 1020;
const MAX_LEVEL = 10;
const LEADERBOARD_SIZE = 10;
const SUBMISSION_LIMIT = 10;
const SUBMISSION_WINDOW_SECONDS = 600;

function sendJson(res, statusCode, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(statusCode).json(body);
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase environment variables are not configured.");
  }
  return {
    restUrl: `${url.replace(/\/+$/, "")}/rest/v1/leaderboard`,
    serviceKey
  };
}

async function requestSupabase(url, serviceKey, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      ...(options.headers || {})
    }
  });
}

async function getTopEntries(restUrl, serviceKey, level) {
  const params = {
    select: "name,rollno,department,section,score,level,created_at",
    order: "score.desc,created_at.asc",
    limit: String(LEADERBOARD_SIZE)
  };
  if (level !== null) params.level = `eq.${level}`;
  const query = new URLSearchParams(params);
  const response = await requestSupabase(`${restUrl}?${query}`, serviceKey);
  if (!response.ok) {
    console.error("Supabase leaderboard read failed.", response.status, await response.text());
    throw new Error("Unable to load leaderboard entries.");
  }
  return response.json();
}

function getRequestedLevel(req) {
  const requestUrl = new URL(req.url || "/", "http://localhost");
  const rawLevel = requestUrl.searchParams.get("level");
  if (!rawLevel || rawLevel === "all") return null;
  const level = Number(rawLevel);
  if (!Number.isInteger(level) || level < 1 || level > MAX_LEVEL) {
    throw new Error(`Level must be "all" or an integer from 1 to ${MAX_LEVEL}.`);
  }
  return level;
}

function getClientIp(req) {
  const realIp = req.headers?.["x-real-ip"];
  const forwardedFor = req.headers?.["x-forwarded-for"];
  const ip = typeof realIp === "string" ? realIp.trim()
    : typeof forwardedFor === "string" ? forwardedFor.split(",")[0].trim()
      : "";
  return ip;
}

async function consumeSubmissionLimit(restUrl, serviceKey, req) {
  const clientIp = getClientIp(req);
  if (!clientIp) {
    throw new Error("Unable to determine client address for submission limit.");
  }
  const clientHash = createHmac("sha256", serviceKey).update(clientIp).digest("hex");
  const response = await requestSupabase(`${restUrl.replace(/\/leaderboard$/, "/rpc/consume_leaderboard_submission")}`, serviceKey, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      p_client_hash: clientHash,
      p_limit: SUBMISSION_LIMIT,
      p_window_seconds: SUBMISSION_WINDOW_SECONDS
    })
  });
  if (!response.ok) {
    console.error("Supabase submission rate limit failed.", response.status, await response.text());
    throw new Error("Unable to check submission limit.");
  }
  const allowed = await response.json();
  if (allowed !== true) {
    const error = new Error("Too many score submissions. Please try again in about 10 minutes.");
    error.statusCode = 429;
    throw error;
  }
}

function parseRun(body) {
  const entry = typeof body === "string" ? JSON.parse(body) : body;
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    throw new Error("Submit a valid leaderboard entry.");
  }

  const parseStudentField = (value, fieldName, maximumLength) => {
    if (typeof value !== "string") {
      throw new Error(`${fieldName} must be a non-empty string.`);
    }
    const normalized = Array.from(value.trim())
      .filter(character => !/[\u0000-\u001f\u007f]/.test(character))
      .join("");
    if (!normalized || Array.from(normalized).length > maximumLength) {
      throw new Error(`${fieldName} must contain 1 to ${maximumLength} characters.`);
    }
    return normalized;
  };
  const name = parseStudentField(entry.name, "Student name", 80);
  const rollno = parseStudentField(entry.rollno, "Roll number", 30);
  const department = parseStudentField(entry.department, "Department", 80);
  const section = parseStudentField(entry.section, "Section", 30);
  const score = entry.score;
  const level = entry.level;

  if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
    throw new Error(`Score must be an integer from 0 to ${MAX_SCORE}.`);
  }
  if (!Number.isInteger(level) || level < 1 || level > MAX_LEVEL) {
    throw new Error(`Level must be an integer from 1 to ${MAX_LEVEL}.`);
  }

  return { name, rollno, department, section, score, level };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return sendJson(res, 405, { error: "Method not allowed." });
  }

  let config;
  try {
    config = getSupabaseConfig();
  } catch (error) {
    console.error(error.message);
    return sendJson(res, 500, { error: "Leaderboard service is not configured." });
  }

  try {
    if (req.method === "GET") {
      let level;
      try {
        level = getRequestedLevel(req);
      } catch (error) {
        return sendJson(res, 400, { error: error.message });
      }
      const entries = await getTopEntries(config.restUrl, config.serviceKey, level);
      return sendJson(res, 200, { entries });
    }

    let entry;
    try {
      entry = parseRun(req.body);
    } catch (error) {
      return sendJson(res, 400, { error: error instanceof SyntaxError ? "Request body must be valid JSON." : error.message });
    }

    try {
      await consumeSubmissionLimit(config.restUrl, config.serviceKey, req);
    } catch (error) {
      if (error.statusCode === 429) {
        res.setHeader("Retry-After", String(SUBMISSION_WINDOW_SECONDS));
        return sendJson(res, 429, { error: error.message });
      }
      console.error("Unable to enforce leaderboard submission limit.", error);
      return sendJson(res, 503, { error: "Score submission is temporarily unavailable." });
    }

    const response = await requestSupabase(`${config.restUrl}?select=name,rollno,department,section,score,level,created_at`, config.serviceKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(entry)
    });
    if (!response.ok) {
      console.error("Supabase leaderboard write failed.", response.status, await response.text());
      return sendJson(res, 502, { error: "Unable to save this leaderboard score." });
    }

    const entries = await getTopEntries(config.restUrl, config.serviceKey, entry.level);
    return sendJson(res, 201, { entries });
  } catch (error) {
    console.error("Leaderboard API failed.", error);
    return sendJson(res, 502, { error: "Leaderboard service is temporarily unavailable." });
  }
};
