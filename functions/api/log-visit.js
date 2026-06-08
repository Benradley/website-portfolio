/* ================================================================
   VISIT LOGGER — Cloudflare Pages Function
   ================================================================
   Called silently by the portfolio page on every load.
   Logs the visitor's IP, increments their visit count, and
   records the timestamp of their most recent visit.

   Data is stored in Cloudflare KV under the visitor's IP address.
   This function never returns visitor data — it only writes it.
   ================================================================ */

export async function onRequestPost(context) {
  const { request, env } = context;

  // Only accept requests that came from brsoftware.ca
  const referer = request.headers.get("Referer") || "";
  if (!referer.includes("brsoftware.ca")) {
    return new Response("Forbidden", { status: 403 });
  }

  // CF-Connecting-IP is set by Cloudflare and is always the real visitor IP
  const ip        = request.headers.get("CF-Connecting-IP") || "unknown";
  const userAgent = request.headers.get("User-Agent")       || "";
  const now       = new Date().toISOString();

  try {
    const existing = await env.VISITS_KV.get(ip, "json");

    if (existing) {
      // Known visitor — increment count and update last seen
      await env.VISITS_KV.put(ip, JSON.stringify({
        count:      existing.count + 1,
        firstVisit: existing.firstVisit,
        lastVisit:  now,
      }));
    } else {
      // New visitor — create record
      await env.VISITS_KV.put(ip, JSON.stringify({
        count:      1,
        firstVisit: now,
        lastVisit:  now,
      }));
    }
  } catch (e) {
    // Silently swallow errors — never break the page over analytics
  }

  return new Response("ok", {
    headers: {
      "Access-Control-Allow-Origin": "https://brsoftware.ca",
    },
  });
}

// Handle OPTIONS preflight so browsers don't block the beacon
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin":  "https://brsoftware.ca",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}
