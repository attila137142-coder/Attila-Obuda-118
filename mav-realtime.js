// Attila Közlekedés – MÁVPlusz / EMMA GraphQL proxy for Vercel
// Place this file at the repository root: api/mav-realtime.js

const UPSTREAM = 'https://emma.mav.hu/otp2-backend/otp/routers/default/index/graphql';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, GET, OPTIONS');
    return res.status(204).end();
  }
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      service: 'Attila Közlekedés MÁVPlusz proxy',
      endpointConfigured: true,
      note: 'A GET csak a Vercel-függvény jelenlétét ellenőrzi. Élő járműadat POST kéréssel kérhető.'
    });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, GET, OPTIONS');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'POST kérés szükséges.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) { body = null; }
    }
    if (!body || typeof body.query !== 'string' || !body.query.trim()) {
      return res.status(400).json({ error: 'INVALID_GRAPHQL_BODY', message: 'A kérésből hiányzik a GraphQL query.' });
    }

    const upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://emma.mav.hu',
        'Referer': 'https://emma.mav.hu/'
      },
      body: JSON.stringify({ query: body.query, variables: body.variables || {} })
    });

    const raw = await upstream.text();
    let data;
    try { data = JSON.parse(raw); }
    catch (_) {
      return res.status(502).json({
        error: 'UPSTREAM_NON_JSON',
        upstreamStatus: upstream.status,
        message: 'A MÁVPlusz/EMMA forrás nem JSON választ adott.',
        preview: raw.slice(0, 300)
      });
    }

    // Preserve the upstream HTTP status so the UI can distinguish proxy and source failures.
    if (!upstream.ok) {
      return res.status(502).json({
        error: 'UPSTREAM_HTTP_ERROR',
        upstreamStatus: upstream.status,
        message: 'A MÁVPlusz/EMMA adatforrás HTTP hibát adott.',
        upstream: data
      });
    }
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({
      error: 'MAV_UPSTREAM_UNREACHABLE',
      message: 'A Vercel függvény nem tudta elérni a MÁVPlusz/EMMA forrást.',
      detail: String(err && err.message || err).slice(0, 300)
    });
  }
};
