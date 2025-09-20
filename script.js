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
  { id: "navi", label: "Navi Fairy", key: "q", file: "hey_navi.mp3" },
  { id: "autotune_pop", label: "Auto‑Tune Pop", key: "w", file: "hey_autotune_pop.mp3" },
  { id: "vaporwave", label: "Vaporwave Lo‑Fi", key: "e", file: "hey_vaporwave.mp3" },
  { id: "brit_announce", label: "British Announcer", key: "r", file: "hey_brit_announce.mp3" },
  { id: "monster_low", label: "Monster Low", key: "t", file: "hey_monster_low.mp3" },
];

const grid = document.getElementById("grid");
const audioPlayer = createAudioPlayer();
audioPlayer.load(clips);

function createAudioPlayer() {
  let audioContext;
  const audioBuffers = new Map();
  let source = null;

  const initContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  };
  
  document.addEventListener('click', initContext, { once: true });
  document.addEventListener('keydown', initContext, { once: true });

  const load = (clipsToLoad) => {
    clipsToLoad.forEach(clip => {
      fetch(clip.file)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          audioBuffers.set(clip.id, audioBuffer);
        })
        .catch(e => console.error(`Error loading audio ${clip.id}:`, e));
    });
  };

  const play = (id, { gain = 1.0, onEnded = () => {} } = {}) => {
    if (!audioContext) initContext();
    if (!audioContext || !audioBuffers.has(id)) return;

    stop();

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(gain, audioContext.currentTime);
    gainNode.connect(audioContext.destination);

    source = audioContext.createBufferSource();
    source.buffer = audioBuffers.get(id);
    source.connect(gainNode);
    source.onended = onEnded;
    source.start(0);
  };

  const stop = () => {
    if (source) {
      source.onended = null;
      source.stop();
      source = null;
    }
  };

  return { load, play, stop };
}

function makeCard(c) {
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
  el.querySelector('[data-action="play"]').addEventListener("click", () => audioPlayer.play(c.id));
  el.addEventListener("mouseenter", () => audioPlayer.play(c.id, { gain: 0.6 }));
  el.addEventListener("mouseleave", () => audioPlayer.stop());
  return el;
}

function render() {
  clips.forEach(c => {
    grid.appendChild(makeCard(c));
  });
}

document.getElementById("btn-random").addEventListener("click", () => {
  const shuffled = shuffle([...clips]);
  let i = 0;
  
  function playNext() {
    if (i < shuffled.length) {
      audioPlayer.play(shuffled[i].id, { onEnded: playNext });
      i++;
    }
  }
  playNext();
});
document.getElementById("btn-stop").addEventListener("click", () => audioPlayer.stop());

function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

window.addEventListener("keydown", (e) => {
  const hit = clips.find(c => c.key === e.key);
  if (hit) audioPlayer.play(hit.id);
});

render();