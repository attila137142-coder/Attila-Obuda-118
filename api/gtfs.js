async function loadGTFS(){

 const status = document.getElementById("status");
 status.innerText = "📦 GTFS betöltés...";

 // 🔁 több forrás – első működő nyer
 const SOURCES = [
  "IDE_A_GITHUB_RAW_LINK", // ← ide a sajátod
  // opcionális tartalék (ha van másik repo / fájl)
  // "https://raw.githubusercontent.com/USER/REPO/main/backup_gtfs.zip"
 ];

 let lastError = null;

 for (const url of SOURCES){
  try{
   status.innerText = "📦 Próbálom: " + url;

   const res = await fetch(url, { cache: "no-store" });

   if(!res.ok) throw new Error("HTTP " + res.status);

   const blob = await res.blob();

   // alap ellenőrzés: tényleg ZIP?
   const sig = new Uint8Array(await blob.slice(0,4).arrayBuffer());
   const isZip = sig[0]===0x50 && sig[1]===0x4B; // "PK"
   if(!isZip) throw new Error("Nem ZIP válasz");

   const zip = await JSZip.loadAsync(blob);

   const stopsTxt = await zip.file("stops.txt")?.async("string");
   const stopTimesTxt = await zip.file("stop_times.txt")?.async("string");
   const tripsTxt = await zip.file("trips.txt")?.async("string");

   if(!stopsTxt || !stopTimesTxt || !tripsTxt){
    throw new Error("Hiányzó GTFS fájl(ok)");
   }

   stops = parseCSV(stopsTxt);
   stopTimes = parseCSV(stopTimesTxt);
   trips = parseCSV(tripsTxt);

   // indexek
   tripsMap = {};
   stopTimesMap = {};

   trips.forEach(t => tripsMap[t.trip_id] = t);

   stopTimes.forEach(st=>{
    if(!stopTimesMap[st.stop_id]) stopTimesMap[st.stop_id] = [];
    stopTimesMap[st.stop_id].push(st);
   });

   status.innerText = `✔ GTFS kész: ${stops.length} megálló`;
   render();
   return; // ← siker, kilépünk

  }catch(e){
   console.error("Forrás hiba:", url, e);
   lastError = e;
  }
 }

 // ha egyik sem ment
 status.innerText = "❌ GTFS hiba: " + (lastError?.message || "ismeretlen");
}
