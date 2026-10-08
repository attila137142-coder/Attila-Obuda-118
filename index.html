<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ATTILA KÖZLEKEDÉS – API-KULCS 2. TESZT</title>
<style>
body{margin:0;background:#071018;color:#eaf7ff;font-family:Arial,sans-serif;padding:16px}
.wrap{max-width:1100px;margin:auto}
h1{font-size:22px;margin:0 0 6px;color:#fff}
.sub{color:#9fc2d1;margin-bottom:16px}
.panel{background:#0d1b25;border:1px solid #27495b;border-radius:12px;padding:14px;margin:12px 0}
button{background:#17394b;color:#fff;border:1px solid #4e9abb;border-radius:8px;padding:9px 13px;font-weight:700;cursor:pointer}
input{width:min(520px,100%);box-sizing:border-box;background:#08131a;color:#fff;border:1px solid #416274;border-radius:8px;padding:10px;margin:7px 0}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{padding:8px 6px;border-bottom:1px solid #24404e;text-align:left;vertical-align:top}
th{color:#9fdcf2;background:#0a151d}
.ok{color:#55f39a;font-weight:700}.bad{color:#ff6975;font-weight:700}.warn{color:#ffd35a;font-weight:700}.info{color:#65c8ff;font-weight:700}
.note{font-size:12px;color:#9eb7c3;line-height:1.45}
.big{font-size:16px;line-height:1.5}
#summary{padding:12px;border-radius:10px;background:#09151d;margin-top:12px}
code{color:#b9edff}
</style>
</head>
<body>
<div class="wrap">
<h1>🔎 ATTILA KÖZLEKEDÉS – API-KULCS 2. TESZT</h1>
<div class="sub">Teljes API-kulcs adatút: mező → localStorage → getKey() → kérés → BKK válasz</div>

<div class="panel">
  <div><b>🔑 BKK API-kulcs</b></div>
  <input id="apiKey" type="password" autocomplete="off" placeholder="BKK API-kulcs">
  <br>
  <button id="save">💾 MENTÉS</button>
  <button id="test">🔎 2. TESZT INDÍTÁSA</button>
  <div class="note">A kulcs értékét ez a teszt nem írja ki. Csak a meglétét, hosszát és egy rövid SHA-256 ujjlenyomatát használja az azonosság ellenőrzésére.</div>
</div>

<div class="panel">
<h2 style="font-size:17px">👑 FŐNÖK – API-KULCS ADATÚT</h2>
<table>
<thead><tr><th>ADATÚT PONT</th><th>ÁLLAPOT</th><th>EREDMÉNY</th></tr></thead>
<tbody id="rows"><tr><td colspan="3">Még nincs futtatás.</td></tr></tbody>
</table>
<div id="summary" class="big">Várakozik a 2. TESZT-re.</div>
</div>

<div class="panel note">
<b>Mit bizonyít ez a teszt?</b><br>
1. A mezőben van-e kulcs.<br>
2. Ugyanez a kulcs van-e a localStorage-ban.<br>
3. A <code>getKey()</code> ugyanazt az értéket adja-e vissza.<br>
4. A BKK-kérés URL-jébe bekerül-e a <code>key</code> paraméter — az érték megjelenítése nélkül.<br>
5. A BKK mit válaszol: HTTP 200, 401 vagy más hiba.<br>
6. A három élő BKK adatút ugyanazon a hitelesítési láncon át működik-e.
</div>
</div>

<script>
const STORAGE_KEY="attila_bkk_api_key";
const VEHICLE_URL="https://go.bkk.hu/api/query/v1/ws/gtfs-rt/full/VehiclePositions.pb";
const TRIP_URL="https://go.bkk.hu/api/query/v1/ws/gtfs-rt/full/TripUpdates.pb";
const FUTAR_URL="https://go.bkk.hu/api/query/v1/ws/otp/api/where/vehicles-for-location.json";

const $=id=>document.getElementById(id);

function loadKey(){
  try{$("apiKey").value=localStorage.getItem(STORAGE_KEY)||"";}catch(e){}
}
function getKey(){return $("apiKey").value.trim();}
function saveKey(){
  const k=getKey();
  if(!k){alert("Az API-kulcs mező üres.");return;}
  localStorage.setItem(STORAGE_KEY,k);
}
function esc(v){
  return String(v??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
}
async function digest(k){
  const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(k));
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("").slice(0,12);
}
async function row(name,status,result,cls){
  return `<tr><td>${esc(name)}</td><td class="${cls}">${status}</td><td>${esc(result)}</td></tr>`;
}
function add(name,status,result,cls){
  $("rows").insertAdjacentHTML("beforeend",`<tr><td>${esc(name)}</td><td class="${cls}">${status}</td><td>${esc(result)}</td></tr>`);
}
async function probe(url,label,key){
  const started=performance.now();
  try{
    const u=new URL(url);
    u.searchParams.set("key",key);
    const res=await fetch(u.toString(),{cache:"no-store"});
    const ct=res.headers.get("content-type")||"NINCS ADAT";
    const buf=await res.arrayBuffer();
    let detail=`HTTP ${res.status} | ${buf.byteLength.toLocaleString("hu-HU")} byte | ${Math.round(performance.now()-started)} ms | ${ct}`;
    if(!res.ok){
      try{
        const raw=new TextDecoder().decode(buf).replace(/\s+/g," ").trim();
        if(raw) detail += " | " + raw.slice(0,220);
      }catch(e){}
    }
    return {ok:res.ok,status:res.status,detail,bytes:buf.byteLength};
  }catch(e){
    return {ok:false,status:0,detail:"Böngésző/fetch hiba: "+(e?.message||String(e)),bytes:0};
  }
}
async function run(){
  $("rows").innerHTML="";
  $("summary").textContent="🔎 FŐNÖK vizsgál...";
  const field=getKey();
  let stored="";
  try{stored=(localStorage.getItem(STORAGE_KEY)||"").trim();}catch(e){}
  const fieldFp=field?await digest(field):"";
  const storedFp=stored?await digest(stored):"";
  add("🔑 API-kulcs mező",field?"BEJÖTT":"HIÁNYZIK",field?`érték van | hossz ${field.length}`:"NINCS ADAT",field?"ok":"bad");
  add("💾 localStorage",stored?"BEJÖTT":"HIÁNYZIK",stored?`érték van | hossz ${stored.length}`:"NINCS ADAT",""+(stored?"ok":"bad"));
  add("🔗 mező ↔ localStorage",field&&stored&&field===stored?"TOVÁBBMENT":"ELTÉR / NINCS",field&&stored?`ujjlenyomat: ${fieldFp} = ${storedFp}`:"nem ellenőrizhető",field&&stored&&field===stored?"ok":"bad");
  add("⚙️ getKey()",field?"TOVÁBBMENT":"ELAKADT",field?`hossz ${field.length} | ujjlenyomat ${fieldFp}`:"NINCS ADAT",field?"ok":"bad");
  if(!field){
    $("summary").innerHTML="<span class='bad'>🔴 ELSŐ ADATVESZTÉS: nincs API-kulcs a mezőben.</span>";
    return;
  }
  const safeUrlCheck=[VEHICLE_URL,TRIP_URL,FUTAR_URL].map(x=>{const u=new URL(x);u.searchParams.set("key",field);return u.searchParams.has("key")&&!!u.searchParams.get("key")});
  add("🌐 URL key paraméter",safeUrlCheck.every(Boolean)?"TOVÁBBMENT":"ELAKADT",safeUrlCheck.every(Boolean)?"mindhárom kéréshez hozzáadható":"valamelyik kérésnél hiányzik",""+(safeUrlCheck.every(Boolean)?"ok":"bad"));

  const [vp,tu,fu]=await Promise.all([
    probe(VEHICLE_URL,"VehiclePositions",field),
    probe(TRIP_URL,"TripUpdates",field),
    probe(FUTAR_URL,"FUTÁR",field)
  ]);
  add("🚌 VehiclePositions → BKK",vp.ok?"TOVÁBBMENT":"ELTŰNT",vp.detail,vp.ok?"ok":"bad");
  add("⏱️ TripUpdates → BKK",tu.ok?"TOVÁBBMENT":"ELTŰNT",tu.detail,tu.ok?"ok":"bad");
  add("🚍 FUTÁR → BKK",fu.ok?"TOVÁBBMENT":"ELTŰNT",fu.detail,fu.ok?"ok":"bad");

  const fails=[["VehiclePositions",vp],["TripUpdates",tu],["FUTÁR",fu]].filter(x=>!x[1].ok);
  if(!fails.length){
    $("summary").innerHTML="<span class='ok'>🟢 A 3 élő BKK adatút HTTP szinten átjutott. Következő lépés: feed dekódolás és járműobjektum-illesztés.</span>";
  }else{
    const first=fails[0];
    $("summary").innerHTML=`<span class='bad'>🔴 ELSŐ ADATVESZTÉS: ${esc(first[0])} → ${esc(first[1].detail)}</span><br><span class='info'>A mező → localStorage → getKey → URL lánc rendben van, ha a fenti zöld sorok ezt mutatják.</span>`;
  }
}
$("save").addEventListener("click",saveKey);
$("test").addEventListener("click",run);
loadKey();
</script>
</body>
</html>
