// ...existing code...
const clips = [
  { id: "clean_bright_f", label: "Clean Bright — F", key: "1", file: "hey_clean_bright_f.mp3" },
  { id: "clean_bright_m", label: "Clean Bright — M", key: "2", file: "hey_clean_bright_m.mp3" },
  { id: "hype_radio", label: "Hype Radio", key: "3", file: "hey_hype_radio.mp3" },
  { id: "whisper", label: "Playful Whisper", key: "4", file: "hey_whisper.mp3" },
  { id: "robotic", label: "Robotic Vox", key: "5", file: "hey_robotic.mp3" },
  { id: "retro_8bit", label: "Retro 8‑Bit", key: "6", file: "hey_retro_8bit.mp3" },
  { id: "cinematic", label: "Cinematic Wide", key: "7", file: "hey_cinematic.mp3" },
  { id: "telephone", label: "Telephone Lo‑Fi", key: "8", file: "hey_telephone.mp3" },
  { id: "short_snap", label: "Short Snap", key: "9", file: "hey_short_snap.mp3" },
  { id: "long_tag", label: "Long Tag", key: "0", file: "hey_long_tag.mp3" },
  { id: "chorus", label: "Stacked Chorus", key: "-", file: "hey_chorus.mp3" },
  { id: "dark_trailer", label: "Dark Trailer", key: "=", file: "hey_dark_trailer.mp3" },
];

const grid = document.getElementById("grid");
const audioMap = new Map();

function makeCard(c, idx) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <div class="row">
      <div class="title">${c.label}</div>
      <span class="kbd">${c.key}</span>
    </div>
    <div class="row">
      <div class="meta">${c.file}</div>
      <div class="controls">
        <button class="iconbtn" data-action="play" aria-label="Play ${c.label}">▶︎</button>
        <a class="iconbtn" href="${c.file}" download aria-label="Download ${c.label}">⬇︎</a>
      </div>
    </div>
  `;
  el.querySelector('[data-action="play"]').addEventListener("click", () => play(c.id));
  el.addEventListener("mouseenter", () => preview(c.id));
  el.addEventListener("mouseleave", stop);
  return el;
}

function load() {
  clips.forEach(c => {
    const a = new Audio(c.file);
    a.preload = "auto";
    audioMap.set(c.id, a);
    grid.appendChild(makeCard(c));
  });
}
function stop() {
  audioMap.forEach(a => { a.pause(); a.currentTime = 0; });
}
function preview(id) {
  stop();
  const a = audioMap.get(id);
  if (!a) return;
  a.volume = 0.6;
  a.currentTime = 0;
  a.play().catch(()=>{});
}
function play(id) {
  stop();
  const a = audioMap.get(id);
  if (!a) return;
  a.volume = 1;
  a.currentTime = 0;
  a.play().catch(()=>{});
}

document.getElementById("btn-random").addEventListener("click", async () => {
  stop();
  for (const c of shuffle([...clips])) {
    await playAndWait(c.id);
  }
});
document.getElementById("btn-stop").addEventListener("click", stop);

function playAndWait(id) {
  return new Promise(res => {
    const a = audioMap.get(id);
    if (!a) return res();
    a.currentTime = 0;
    a.play().catch(()=>{}); 
    a.onended = () => res();
  });
}
function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

window.addEventListener("keydown", (e) => {
  const key = e.key;
  const hit = clips.find(c => c.key === key);
  if (hit) play(hit.id);
});

load();
// ...existing code...

