export default async function handler(req, res) {

  try {
    const r = await fetch("https://go.bkk.hu/api/static/v1/public-gtfs/budapest_gtfs.zip");
    const buffer = await r.arrayBuffer();

    res.setHeader("Content-Type", "application/zip");
    res.send(Buffer.from(buffer));

  } catch (e) {
    res.status(500).json({error:"GTFS hiba"});
  }

}
