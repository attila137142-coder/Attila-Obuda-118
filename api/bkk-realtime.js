
<!DOCTYPE html>
<html lang="hu">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Attila Közlekedés – BKK Proxy Teszt</title>
<style>
*{box-sizing:border-box}
body{
  margin:0;padding:18px;background:#101820;color:#eaf3f8;
  font-family:Arial,sans-serif
}
main{max-width:900px;margin:auto}
h1{font-size:25px;color:#55d6ff}
h2{font-size:18px;color:#9de7ff}
.panel{
  background:#1b2935;border:1px solid #385064;
  border-radius:12px;padding:16px;margin:14px 0
}
button{
  border:0;border-radius:8px;padding:12px 16px;
  margin:5px;background:#087eae;color:white;
  font-weight:bold;font-size:15px;cursor:pointer
}
button:disabled{opacity:.5}
.status{font-weight:bold;color:#ffd166}
.ok{color:#55e69b}
.bad{color:#ff7777}
.small{font-size:13px;color:#b7c8d4}
.result{
  background:#0b1218;padding:12px;border-radius:8px;
  overflow-wrap:anywhere;white-space:pre-wrap;
  font-family:Consolas,monospace;font-size:13px
}
.row{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
</style>
</head>
<body>
<main>
<h1>ATTILA KÖZLEKEDÉS</h1>
<div class="small">BKK / BKV – SZERVERPROXY DIAGNOSZTIKA</div>

<div class="panel">
  <h2>Kapcsolat és ellenőrzés</h2>
  <p>Proxy címe:</p>
  <div class="result" id="proxyAddress"></div>
  <button onclick="runAll()">TELJES TESZT</button>
  <button onclick="testFeed('health')">KAPCSOLAT</button>
  <button onclick="testFeed('vehicles')">JÁRMŰVEK</button>
  <button onclick="testFeed('tripupdates')">MENETREND / KÉSÉS</button>
  <p id="overall" class="status">VÁRAKOZÁS – TESZT MÉG NEM INDULT</p>
</div>

<div class="panel">
  <h2>1. Proxy és API-kulcs állapota</h2>
  <div id="health" class="result">Még nincs tesztelve.</div>
</div>

<div class="panel">
  <h2>2. BKK VehiclePositions.pb</h2>
  <div id="vehicles" class="result">Még nincs tesztelve.</div>
</div>

<div class="panel">
  <h2>3. BKK TripUpdates.pb</h2>
  <div id="tripupdates" class="result">Még nincs tesztelve.</div>
</div>

<div class="panel">
  <h2>Összesített eredmény</h2>
  <div id="summary" class="result">A teszt még nem futott le.</div>
</div>

<p class="small">
  FIGYELEM: a HTTP 200 és a nem üres adatfolyam önmagában még nem bizonyítja,
  hogy a GTFS-RT protobuf-adatok helyesen feldolgozhatók.
  Ez az oldal nem jelenít meg és nem kér be BKK API-kulcsot.
</p>
</main>

<script>
const PROXY_BASE =
    "https://project-onkb8.vercel.app/api/bkk-realtime";

const results = {
  health:null,
  vehicles:null,
  tripupdates:null
};

document.getElementById("proxyAddress").textContent=PROXY_BASE;

function setText(id,text){
  document.getElementById(id).textContent=text;
}

function formatBytes(n){
  return n.toLocaleString("hu-HU")+" bájt";
}

async function testFeed(feed){
  const box=document.getElementById(feed);
  box.textContent="TESZT FOLYAMATBAN...";
  const started=performance.now();

  try{
    const response=await fetch(
      PROXY_BASE+"?feed="+encodeURIComponent(feed),
      {method:"GET",cache:"no-store"}
    );

    const elapsed=Math.round(performance.now()-started);
    const contentType=response.headers.get("content-type")||"nincs megadva";

    if(feed==="health"){
      const raw=await response.text();
      let data=null;

      try{data=JSON.parse(raw)}catch(e){}

      results.health={
        http:response.status,
        ok:response.ok,
        data:data
      };

      const configured=data &&
        (data.apiKeyConfigured===true ||
         data.apiKeyConfigured==="true");

      box.textContent=
        "HTTP: "+response.status+
        "\nVálaszidő: "+elapsed+" ms"+
        "\nContent-Type: "+contentType+
        "\nAPI-kulcs beállítva: "+
        (configured?"IGEN":data &&
          data.apiKeyConfigured===false?"NEM":"NEM ELLENŐRIZHETŐ")+
        "\n\nSzerverválasz:\n"+
        (data?JSON.stringify(data,null,2):raw.slice(0,1500));

    }else{
      const buffer=await response.arrayBuffer();
      const bytes=new Uint8Array(buffer);
      const preview=Array.from(bytes.slice(0,16))
        .map(x=>x.toString(16).padStart(2,"0"))
        .join(" ");

      results[feed]={
        http:response.status,
        ok:response.ok,
        bytes:bytes.length,
        contentType:contentType
      };

      box.textContent=
        "HTTP: "+response.status+
        "\nVálaszidő: "+elapsed+" ms"+
        "\nAdatméret: "+formatBytes(bytes.length)+
        "\nContent-Type: "+contentType+
        "\nElső 16 bájt (hex): "+(preview||"üres")+
        "\n\nEredmény: "+
        (response.ok && bytes.length>0
          ?"HTTP OK – ADAT ÉRKEZETT; protobuf feldolgozás még nincs ellenőrizve."
          :"HIBA – nincs megfelelő adatválasz.");
    }

  }catch(error){
    results[feed]={
      http:"HIBA",
      ok:false,
      error:String(error)
    };
    box.textContent=
      "KAPCSOLATI HIBA\n"+String(error)+
      "\n\nEllenőrizd, hogy a proxy szerveroldali fájlja telepítve van-e.";
  }

  updateSummary();
}

function updateSummary(){
  const names=["health","vehicles","tripupdates"];
  let lines=[];
  let allOk=true;

  for(const name of names){
    const r=results[name];
    if(!r){
      lines.push(name+": MÉG NINCS TESZTELVE");
      allOk=false;
    }else if(!r.ok){
      lines.push(name+": HIBA – HTTP "+r.http);
      allOk=false;
    }else if(name!=="health" && !r.bytes){
      lines.push(name+": ÜRES ADAT");
      allOk=false;
    }else{
      lines.push(name+": HTTP OK");
    }
  }

  setText("summary",lines.join("\n"));
  const overall=document.getElementById("overall");

  overall.textContent=allOk
    ?"A TESZTEK HTTP-SZINTEN SIKERESEK – A PROTOBUF FELDOLGOZÁS KÜLÖN ELLENŐRZENDŐ."
    :"A TESZT NEM TELJES VAGY HIBÁT TALÁLT.";

  overall.className="status "+(allOk?"ok":"bad");
}

async function runAll(){
  const buttons=document.querySelectorAll("button");
  buttons.forEach(b=>b.disabled=true);

  try{
    await testFeed("health");
    await testFeed("vehicles");
    await testFeed("tripupdates");
  }finally{
    buttons.forEach(b=>b.disabled=false);
  }
}
</script>
</body>
</html>
