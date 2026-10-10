const MAX_SCORE = 1020;
const MAX_LEVEL = 10;
const LEADERBOARD_SIZE = 10;

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

async function getTopEntries(restUrl, serviceKey) {
  const query = new URLSearchParams({
    select: "name,score,level,created_at",
    order: "score.desc,created_at.asc",
    limit: String(LEADERBOARD_SIZE)
  });
  const response = await requestSupabase(`${restUrl}?${query}`, serviceKey);
  if (!response.ok) {
    console.error("Supabase leaderboard read failed.", response.status, await response.text());
    throw new Error("Unable to load leaderboard entries.");
  }
  return response.json();
}

function parseRun(body) {
  const entry = typeof body === "string" ? JSON.parse(body) : body;
  if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
    throw new Error("Submit a valid leaderboard entry.");
  }

  const name = Array.from(typeof entry.name === "string" ? entry.name.trim() : "")
    .filter(character => !/[\u0000-\u001f\u007f]/.test(character))
    .slice(0, 20)
    .join("") || "Player";
  const score = entry.score;
  const level = entry.level;

  if (!Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
    throw new Error(`Score must be an integer from 0 to ${MAX_SCORE}.`);
  }
  if (!Number.isInteger(level) || level < 1 || level > MAX_LEVEL) {
    throw new Error(`Level must be an integer from 1 to ${MAX_LEVEL}.`);
  }

  return { name, score, level };
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
      const entries = await getTopEntries(config.restUrl, config.serviceKey);
      return sendJson(res, 200, { entries });
    }

    let entry;
    try {
      entry = parseRun(req.body);
    } catch (error) {
      return sendJson(res, 400, { error: error instanceof SyntaxError ? "Request body must be valid JSON." : error.message });
    }

    const response = await requestSupabase(`${config.restUrl}?select=name,score,level,created_at`, config.serviceKey, {
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

    const entries = await getTopEntries(config.restUrl, config.serviceKey);
    return sendJson(res, 201, { entries });
  } catch (error) {
    console.error("Leaderboard API failed.", error);
    return sendJson(res, 502, { error: "Leaderboard service is temporarily unavailable." });
  }
};
