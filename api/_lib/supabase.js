function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase environment variables are not configured.");
  }
  return {
    restUrl: `${url.replace(/\/+$/, "")}/rest/v1`,
    serviceKey
  };
}

async function requestSupabase(path, options = {}) {
  const { restUrl, serviceKey } = getSupabaseConfig();
  const response = await fetch(`${restUrl}/${path}`, {
    ...options,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      ...(options.headers || {})
    }
  });
  return response;
}

async function consumeIpLimit(req, key, limit, windowSeconds) {
  const realIp = req.headers?.["x-real-ip"];
  const forwardedFor = req.headers?.["x-forwarded-for"];
  const ip = typeof realIp === "string" ? realIp.trim()
    : typeof forwardedFor === "string" ? forwardedFor.split(",")[0].trim()
      : "";
  if (!ip) throw new Error("Unable to determine client address.");

  const { createHmac } = require("node:crypto");
  const clientHash = createHmac("sha256", key).update(ip).digest("hex");
  const { restUrl, serviceKey } = getSupabaseConfig();
  const response = await fetch(`${restUrl}/rpc/consume_leaderboard_submission`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      p_client_hash: clientHash,
      p_limit: limit,
      p_window_seconds: windowSeconds
    })
  });
  if (!response.ok) {
    console.error("Supabase request limit check failed.", response.status);
    throw new Error("Unable to check request limit.");
  }
  return response.json();
}

async function getAllRows(path) {
  const rows = [];
  const pageSize = 500;
  for (let offset = 0; ; offset += pageSize) {
    const response = await requestSupabase(path, {
      headers: {
        "Range-Unit": "items",
        Range: `${offset}-${offset + pageSize - 1}`
      }
    });
    if (!response.ok) {
      console.error("Supabase dashboard read failed.", response.status);
      throw new Error("Unable to load student progress.");
    }
    const page = await response.json();
    if (!Array.isArray(page)) throw new Error("Supabase returned an invalid dashboard response.");
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

function sendJson(res, statusCode, body) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(statusCode).json(body);
}

module.exports = { consumeIpLimit, getAllRows, getSupabaseConfig, requestSupabase, sendJson };
