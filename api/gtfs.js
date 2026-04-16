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
setInterval(render, 30000); // 30 másodpercenként frissít
function getMinutes(t){
 const now = new Date();
 const [h,m] = t.split(":").map(Number);
 const target = h*60+m;
 const current = now.getHours()*60+now.getMinutes();
 return target-current;
}
next.forEach(n=>{
  const min = getMinutes(n.t);

  let cls="white";
  if(min < 2) cls="red";
  else if(min > 10) cls="blue";

  html += `
  <div class="row ${cls}">
  ${t.line} | ${min} perc múlva | ${t.dest}
  </div>`;
});
