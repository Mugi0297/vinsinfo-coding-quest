const { getSupabaseConfig, requestSupabase, sendJson } = require("./_lib/supabase");

const MAX_LEVEL = 10;
const LEADERBOARD_SIZE = 10;

async function getTopEntries(serviceKey, level) {
  const params = {
    select: "name,score,level",
    order: "score.desc,created_at.asc",
    limit: String(LEADERBOARD_SIZE)
  };
  if (level !== null) params.level = `eq.${level}`;
  const response = await requestSupabase(`leaderboard?${new URLSearchParams(params)}`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`
    }
  });
  if (!response.ok) {
    console.error("Supabase leaderboard read failed.", response.status, await response.text());
    throw new Error("Unable to load leaderboard entries.");
  }
  return response.json();
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "Leaderboard scores can only be recorded after a server-verified run." });
  }

  let config;
  try {
    config = getSupabaseConfig();
  } catch (error) {
    console.error(error.message);
    return sendJson(res, 500, { error: "Leaderboard service is not configured." });
  }

  try {
    const requestUrl = new URL(req.url || "/", "http://localhost");
    const rawLevel = requestUrl.searchParams.get("level");
    let level = null;
    if (rawLevel && rawLevel !== "all") {
      level = Number(rawLevel);
      if (!Number.isInteger(level) || level < 1 || level > MAX_LEVEL) {
        return sendJson(res, 400, { error: `Level must be "all" or an integer from 1 to ${MAX_LEVEL}.` });
      }
    }
    const entries = await getTopEntries(config.serviceKey, level);
    return sendJson(res, 200, { entries });
  } catch (error) {
    console.error("Leaderboard API failed.", error);
    return sendJson(res, 502, { error: "Leaderboard service is temporarily unavailable." });
  }
};
