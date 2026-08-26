const ACTION_KEYS = {
  page_view: new Set(["home"]),
  click: new Set(["youtube", "instagram", "tiktok", "share"]),
  source: new Set(["instagram", "tiktok", "youtube", "facebook", "direct", "other"]),
  language: new Set(["tr", "en"]),
  language_switch: new Set(["en_to_tr", "tr_to_en"]),
  app_fallback: new Set(["youtube", "instagram", "tiktok"]),
  retry_app: new Set(["youtube", "instagram", "tiktok"])
};

function cors(origin, allowedOrigin) {
  return {
    "access-control-allow-origin": allowedOrigin,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    "vary": "Origin"
  };
}

function response(body, status, headers = {}) {
  return new Response(body, { status, headers: { "content-type": "application/json; charset=utf-8", ...headers } });
}

async function visitorHash(request, env) {
  const ip = request.headers.get("cf-connecting-ip") || "";
  const ua = request.headers.get("user-agent") || "";
  const day = new Date().toISOString().slice(0, 10);
  const raw = new TextEncoder().encode(`${env.VISITOR_SALT || ""}|${day}|${ip}|${ua}`);
  const digest = await crypto.subtle.digest("SHA-256", raw);
  return Array.from(new Uint8Array(digest)).slice(0, 12).map(b => b.toString(16).padStart(2, "0")).join("");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://multiversaltherapy.github.io";
    const headers = cors(origin, allowedOrigin);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (origin && origin !== allowedOrigin) return response(JSON.stringify({ error: "origin_not_allowed" }), 403, headers);

    if (request.method === "GET" && url.pathname === "/api/context") {
      const country = String(request.cf?.country || "").toUpperCase();
      return response(JSON.stringify({ country }), 200, { ...headers, "cache-control": "no-store" });
    }

    if (request.method === "POST" && url.pathname === "/api/event") {
      if (origin !== allowedOrigin) return response(JSON.stringify({ error: "origin_required" }), 403, headers);
      const length = Number(request.headers.get("content-length") || 0);
      if (length > 1024) return response(JSON.stringify({ error: "payload_too_large" }), 413, headers);
      let data;
      try { data = await request.json(); }
      catch { return response(JSON.stringify({ error: "invalid_json" }), 400, headers); }
      const action = String(data?.action || "");
      const key = String(data?.key || "");
      if (!ACTION_KEYS[action]?.has(key)) return response(JSON.stringify({ error: "invalid_event" }), 400, headers);

      const visitor = await visitorHash(request, env);
      const country = String(request.cf?.country || "XX").toUpperCase();
      env.ANALYTICS.writeDataPoint({
        indexes: [action],
        blobs: [key, visitor, country],
        doubles: [1]
      });
      return response(JSON.stringify({ ok: true }), 202, { ...headers, "cache-control": "no-store" });
    }

    return response(JSON.stringify({ error: "not_found" }), 404, headers);
  }
};
