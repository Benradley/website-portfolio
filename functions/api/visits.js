/* ================================================================
   VISIT EXPORT — Cloudflare Pages Function
   ================================================================
   Returns all logged visitor data as a downloadable CSV.
   PROTECTED — requires your secret admin key as a URL parameter:

     https://brsoftware.ca/api/visits?key=YOUR_SECRET_KEY

   Set your secret key in Cloudflare Pages → Settings →
   Environment Variables → add ADMIN_KEY as a secret.
   Anyone without the correct key gets a 401 Unauthorized response.
   ================================================================ */

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // --- Auth check ---
  const submittedKey = url.searchParams.get("key");
  if (!env.ADMIN_KEY || submittedKey !== env.ADMIN_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  // --- Fetch all records from KV ---
  let csv     = "IP Address,Times Visited,First Visit,Last Visit\n";
  let cursor  = undefined;

  // KV list() returns max 1000 keys per call — loop to handle all pages
  do {
    const page = await env.VISITS_KV.list({ cursor });

    for (const entry of page.keys) {
      const data = await env.VISITS_KV.get(entry.name, "json");
      if (data) {
        // Wrap IP in quotes in case it contains commas (IPv6 edge case)
        csv += `"${entry.name}",${data.count},"${data.firstVisit}","${data.lastVisit}"\n`;
      }
    }

    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);

  // --- Return as a downloadable CSV file ---
  return new Response(csv, {
    headers: {
      "Content-Type":        "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="visits-${new Date().toISOString().slice(0,10)}.csv"`,
      // Prevent the CSV from being cached — always return fresh data
      "Cache-Control":       "no-store",
    },
  });
}
