<!doctype html>
<html lang="hu">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BKK KULCS TESZT</title>
<style>
body{font-family:Arial,sans-serif;max-width:760px;margin:30px auto;padding:0 16px;background:#f4f6f8;color:#17202a}
h1{margin-bottom:6px}p{line-height:1.45}
label{font-weight:700;display:block;margin-top:20px}
input,button{box-sizing:border-box;width:100%;padding:12px;margin-top:8px;font-size:16px;border-radius:8px}
input{border:1px solid #aaa}button{border:0;background:#1769aa;color:#fff;font-weight:700;cursor:pointer}button:disabled{opacity:.6}
#status{margin-top:20px;padding:14px;border-radius:8px;background:#fff;border:1px solid #ccc;white-space:pre-wrap}
.ok{border-color:#238636!important}.err{border-color:#d1242f!important}.small{font-size:13px;color:#555}
</style>
</head>
<body>
<h1>🚌 BKK KULCS TESZT</h1>
<p>Teljesen különálló teszt. Nem használja az Attila Közlekedés kódját.</p>
<label for="key">BKK OpenData API-kulcs</label>
<input id="key" type="password" autocomplete="off" placeholder="Ide írd be a saját kulcsodat">
<button id="test">VehiclePositions.pb TESZT</button>
<div id="status">Még nincs teszt.</div>
<p class="small">A kulcsot ez az oldal nem menti localStorage-ba és nem írja ki.</p>
<script>
"use strict";
const ENDPOINT="https://go.bkk.hu/api/query/v1/ws/gtfs-rt/full/VehiclePositions.pb";
const $=id=>document.getElementById(id);
function show(text,cls=""){const box=$("status");box.textContent=text;box.className=cls;}
$("test").addEventListener("click",async()=>{
 const key=$("key").value.trim();
 if(!key){show("❌ Nincs megadva API-kulcs.","err");return;}
 $("test").disabled=true;show("⏳ Kérés folyamatban…");
 const started=performance.now();
 try{
  const res=await fetch(ENDPOINT+"?key="+encodeURIComponent(key),{cache:"no-store"});
  const buf=await res.arrayBuffer();
  const ms=Math.round(performance.now()-started);
  const ct=res.headers.get("content-type")||"";
  let preview="";try{preview=new TextDecoder().decode(buf.slice(0,500)).replace(/\s+/g," ").trim();}catch(e){}
  if(res.ok){show("✅ BKK VÁLASZ: HTTP "+res.status+" OK\nIdő: "+ms+" ms\nContent-Type: "+ct+"\nVálasz mérete: "+buf.byteLength.toLocaleString("hu-HU")+" bájt\n\nA BKK realtime szervere elfogadta a kulcsot.","ok");}
  else{show("❌ BKK VÁLASZ: HTTP "+res.status+"\nIdő: "+ms+" ms\nContent-Type: "+ct+"\nVálasz mérete: "+buf.byteLength.toLocaleString("hu-HU")+" bájt"+(preview?"\n\nSzerverüzenet: "+preview:"")+"\n\nA BKK realtime szervere nem fogadta el ezt a kérést.","err");}
 }catch(err){show("⚠️ BÖNGÉSZŐ / HÁLÓZATI HIBA\n\n"+String(err&&err.message?err.message:err)+"\n\nHa CORS vagy hálózati hiba jelenik meg, az külön vizsgálandó.","err");}
 finally{$("test").disabled=false;}
});
</script>
</body>
</html>
