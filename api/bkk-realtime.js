
// ATTILA KÖZLEKEDÉS
// BKK / BKV GTFS-RT szerverproxy – Vercel
// Fájl helye: api/bkk-realtime.js
//
// Szükséges Vercel környezeti változó:
// BKK_API_KEY

const BKK_BASE =
  'https://go.bkk.hu/api/query/v1/ws/gtfs-rt/full/';

const FEEDS = {
  vehicles: 'VehiclePositions.pb',
  tripupdates: 'TripUpdates.pb'
};

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({
      ok: false,
      error: 'METHOD_NOT_ALLOWED',
      message: 'Csak GET kérés engedélyezett.'
    });
  }

  const feed = String(req.query.feed || '').toLowerCase();

  // 1. HEALTH – csak a Vercel-függvény és a kulcsbeállítás ellenőrzése.
  if (feed === 'health') {
    return res.status(200).json({
      ok: true,
      service: 'Attila Közlekedés BKK Proxy',
      endpointConfigured: true,
      apiKeyConfigured: Boolean(process.env.BKK_API_KEY),
      availableFeeds: Object.keys(FEEDS),
      note: 'Ez az ellenőrzés még nem kér le BKK járműadatot.'
    });
  }

  // 2. Csak az előre engedélyezett feedek kérhetők le.
  if (!Object.prototype.hasOwnProperty.call(FEEDS, feed)) {
    return res.status(400).json({
      ok: false,
      error: 'UNKNOWN_FEED',
      message: 'Engedélyezett értékek: health, vehicles, tripupdates.'
    });
  }

  // 3. A kulcs kizárólag a Vercel szerverén lehet.
  const apiKey = process.env.BKK_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      ok: false,
      error: 'BKK_API_KEY_MISSING',
      message: 'A BKK_API_KEY környezeti változó nincs beállítva a Vercelben.'
    });
  }

  const upstreamUrl =
    BKK_BASE +
    FEEDS[feed] +
    '?key=' +
    encodeURIComponent(apiKey);

  try {
    const upstream = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/x-protobuf, application/octet-stream'
      },
      cache: 'no-store'
    });

    if (!upstream.ok) {
      const errorText = await upstream.text();

      return res.status(502).json({
        ok: false,
        error: 'BKK_UPSTREAM_HTTP_ERROR',
        feed: feed,
        upstreamStatus: upstream.status,
        message: 'A BKK adatforrás HTTP hibát adott.',
        responsePreview: errorText.slice(0, 400)
      });
    }

    const content = Buffer.from(await upstream.arrayBuffer());

    if (content.length === 0) {
      return res.status(502).json({
        ok: false,
        error: 'BKK_EMPTY_FEED',
        feed: feed,
        message: 'A BKK üres adatfolyamot küldött.'
      });
    }

    res.setHeader(
      'Content-Type',
      'application/x-protobuf'
    );
    res.setHeader(
      'Content-Length',
      String(content.length)
    );
    res.setHeader(
      'X-BKK-Feed',
      feed
    );

    return res.status(200).send(content);

  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: 'BKK_PROXY_FETCH_ERROR',
      feed: feed,
      message: 'A Vercel proxy nem tudta elérni a BKK adatforrást.',
      detail: String(error && error.message || error).slice(0, 300)
    });
  }
};
