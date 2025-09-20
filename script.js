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
  { id: "tts_flat", label: "TTS Flat Read", key: "j", file: "hey_tts_flat.mp3" },
  { id: "metal_scream", label: "Metal Scream", key: "k", file: "hey_metal_scream.mp3" },
  { id: "country_drawl", label: "Country Drawl", key: "l", file: "hey_country_drawl.mp3" },
  { id: "synthwave_lead", label: "Synthwave Lead", key: "a", file: "hey_synthwave_lead.mp3" },
  { id: "airport_pa", label: "Airport PA", key: "s", file: "hey_airport_pa.mp3" },
  { id: "cartoon_bounce", label: "Cartoon Bounce", key: "d", file: "hey_cartoon_bounce.mp3" },
  { id: "barbershop_quartet", label: "Barbershop Quartet", key: "z", file: "hey_barbershop_quartet.mp3" },
  { id: "crowd_chant", label: "Crowd Chant", key: "x", file: "hey_crowd_chant.mp3" },
  { id: "binaural_asmr", label: "Binaural ASMR", key: "c", file: "hey_binaural_asmr.mp3" },
  { id: "space_astronaut", label: "Space Astronaut PA", key: "v", file: "hey_space_astronaut.mp3" },
  { id: "opera_vibrato", label: "Opera Vibrato", key: "t", file: "hey_opera_vibrato.mp3" },
  { id: "brit_announce", label: "British Announcer", key: "y", file: "hey_brit_announce.mp3" },
  { id: "sports_announce", label: "Sports Announcer", key: "u", file: "hey_sports_announce.mp3" },
  { id: "choir_epic", label: "Epic Choir", key: "i", file: "hey_choir_epic.mp3" },
  { id: "gameshow_hype", label: "Game Show Hype", key: "o", file: "hey_gameshow_hype.mp3" },
  { id: "soft_piano_bed", label: "Soft Piano Bed", key: "p", file: "hey_soft_piano_bed.mp3" },
  { id: "lofi_tape", label: "Lo‑Fi Tape", key: "[", file: "hey_lofi_tape.mp3" },
  { id: "monster_low", label: "Monster Low", key: "]", file: "hey_monster_low.mp3" },
  { id: "child_joy", label: "Child Joy", key: ";", file: "hey_child_joy.mp3" },
  { id: "glitch_fx", label: "Glitch FX", key: "'", file: "hey_glitch_fx.mp3" },
];

const selections = new Map();

const grid = document.getElementById("grid");
const audioPlayer = createAudioPlayer();

function createAudioPlayer() {
  let audioContext;
  const audioBuffers = new Map();
  let source = null, currentId = null, startTime = 0, currentDur = 0, currentOffset = 0;

  const initContext = () => {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  document.addEventListener('click', initContext, { once: true });
  document.addEventListener('keydown', initContext, { once: true });

  const load = (clipsToLoad) => {
    // Defer decoding until first user gesture; mark placeholders
    clipsToLoad.forEach(clip => { if (!audioBuffers.has(clip.id)) audioBuffers.set(clip.id, null); });
  };

  const ensureBuffer = async (id) => {
    if (!audioContext) initContext(); let buf = audioBuffers.get(id);
    if (buf) return buf; const clip = clips.find(c => c.id === id);
    const res = await fetch(clip.file); const ab = await res.arrayBuffer();
    buf = await audioContext.decodeAudioData(ab); audioBuffers.set(id, buf); return buf;
  };

  const play = async (id, { gain = 1.0, onEnded = () => {}, start = 0, end = null } = {}) => {
    if (!audioContext) initContext(); if (!audioContext) return; stop();
    const gainNode = audioContext.createGain(); gainNode.gain.setValueAtTime(gain, audioContext.currentTime);
    gainNode.connect(audioContext.destination);
    try { const buf = await ensureBuffer(id); source = audioContext.createBufferSource();
      const maxEnd = end==null ? buf.duration : Math.min(end, buf.duration);
      const offset = Math.max(0, Math.min(start, buf.duration - 0.0001));
      const dur = Math.max(0, maxEnd - offset);
      currentId = id; startTime = audioContext.currentTime; currentDur = dur; currentOffset = offset;
      source.buffer = buf; source.connect(gainNode); source.onended = () => { currentId=null; onEnded(); }; source.start(0, offset, dur||undefined);
    } catch(e){ console.error(`Error decoding ${id}`, e); }
  };

  const stop = () => {
    if (source) { source.onended = null; source.stop(); source = null; }
    currentId = null;
  };

  return { load, play, stop, ensureBuffer, getProgress:(id)=> (id===currentId && currentDur>0)? Math.min(1,(audioContext.currentTime-startTime)/currentDur) : null };
}

function makeCard(c) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <div class="row">
      <div class="title">${c.label}</div>
      <span class="kbd">${c.key}</span>
    </div>
    <div class="wave"><canvas></canvas></div>
    <div class="selmeta"><span class="times" aria-live="polite">Select a region</span>
      <button class="iconbtn" data-action="dlsel" title="Download selection" aria-label="Download selection" disabled>⬇︎</button></div>
    <div class="row">
      <div class="controls">
        <button class="iconbtn" data-action="play" aria-label="Play clip">▶︎</button>
        <a class="iconbtn" href="${c.file}" download aria-label="Download full clip">⬇︎</a>
      </div>
    </div>
  `;
  el.querySelector('[data-action="play"]').addEventListener("click", () => playWithSelection(c.id));
  el.addEventListener("mouseenter", () => playWithSelection(c.id, { gain: 0.6 }));
  el.addEventListener("mouseleave", () => audioPlayer.stop());
  attachWaveInteractions(el, c);
  return el;
}

function playWithSelection(id, opts = {}) {
  const sel = selections.get(id);
  return sel ? audioPlayer.play(id, { ...opts, start: sel.start, end: sel.end }) : audioPlayer.play(id, opts);
}

function attachWaveInteractions(el, c){
  const cv = el.querySelector('canvas'); const times = el.querySelector('.times'); const btn = el.querySelector('[data-action="dlsel"]');
  let sel=null, dragging=false, dur=0, bufRef=null, lastP=null, raf=0;
  const toTime = x => Math.max(0, Math.min(1, x / cv.clientWidth));
  audioPlayer.ensureBuffer(c.id).then(buf=>{ bufRef=buf; dur=buf.duration; 
    if(selections.has(c.id)){ const s=selections.get(c.id); sel={start:s.start/dur,end:s.end/dur}; btn.disabled=false; times.textContent=`${s.start.toFixed(2)}s – ${s.end.toFixed(2)}s`; }
    drawWaveform(cv, bufRef, sel, audioPlayer.getProgress(c.id)); tick(); });
  const tick = ()=>{ const p = audioPlayer.getProgress(c.id); if(p!==lastP && bufRef){ drawWaveform(cv, bufRef, sel, p); lastP=p; } raf = requestAnimationFrame(tick); };
  cv.addEventListener('pointerdown', e=>{ dragging=true; sel={start:toTime(e.offsetX), end:toTime(e.offsetX)}; btn.disabled=true; });
  cv.addEventListener('pointermove', e=>{ if(!dragging) return; sel.end=toTime(e.offsetX); if(bufRef){ drawWaveform(cv, bufRef, sel, audioPlayer.getProgress(c.id)); const a=Math.min(sel.start,sel.end)*dur, b=Math.max(sel.start,sel.end)*dur; times.textContent=`${a.toFixed(2)}s – ${b.toFixed(2)}s`; }});
  window.addEventListener('pointerup', ()=>{ if(!dragging) return; dragging=false; 
    if(Math.abs(sel.end-sel.start)<0.005){ sel=null; btn.disabled=true; times.textContent='Select a region'; selections.delete(c.id);
      if(bufRef) drawWaveform(cv,bufRef,sel,audioPlayer.getProgress(c.id)); }
    else { btn.disabled=false; const a=Math.min(sel.start,sel.end)*dur, b=Math.max(sel.start,sel.end)*dur; selections.set(c.id,{start:a,end:b}); }
  });
  btn.addEventListener('click', async ()=>{ const buf=await audioPlayer.ensureBuffer(c.id); const a=Math.min(sel.start,sel.end)*dur, b=Math.max(sel.start,sel.end)*dur; const blob=bufferToWav(buf,a,b); const url=URL.createObjectURL(blob); const ael=document.createElement('a'); ael.href=url; ael.download=`${c.id}_${a.toFixed(2)}-${b.toFixed(2)}.wav`; document.body.appendChild(ael); ael.click(); ael.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000); });
}

function bufferToWav(buffer, start=0, end=null){const rate=buffer.sampleRate,ch=buffer.numberOfChannels;const s=Math.max(0,Math.floor(start*rate)),e=Math.min(buffer.length,Math.floor((end??(buffer.length/rate))*rate));const frames=Math.max(0,e-s);const inter=new Float32Array(frames*ch);for(let c=0;c<ch;c++){const data=buffer.getChannelData(c).subarray(s,e);for(let i=0;i<frames;i++) inter[i*ch+c]=data[i]||0;}const bytes=44+inter.length*2;const buf=new ArrayBuffer(bytes);const v=new DataView(buf);const w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};w(0,'RIFF');v.setUint32(4,bytes-8,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,ch,true);v.setUint32(24,rate,true);v.setUint32(28,rate*ch*2,true);v.setUint16(32,ch*2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,inter.length*2,true);let off=44;for(let i=0;i<inter.length;i++){let s=Math.max(-1,Math.min(1,inter[i]));v.setInt16(off,s<0?s*0x8000:s*0x7FFF,true);off+=2;}return new Blob([buf],{type:'audio/wav'});}

function drawWaveform(cv, buffer, sel, progress){const c=cv.getContext('2d');const w=cv.width=cv.clientWidth,h=cv.height=cv.clientHeight;c.clearRect(0,0,w,h);c.fillStyle='#eee';c.fillRect(0,0,w,h);const data=buffer.getChannelData(0);const step=Math.ceil(data.length/w);c.strokeStyle='#111';c.beginPath();for(let x=0;x<w;x++){let min=1,max=-1;for(let i=0;i<step;i++){const y=data[x*step+i]||0;min=Math.min(min,y);max=Math.max(max,y);}c.moveTo(x,(1-min)*.5*h);c.lineTo(x,(1-max)*.5*h);}c.stroke();if(sel){const sx=sel.start*w, ex=sel.end*w;c.fillStyle='rgba(0,0,0,0.12)';c.fillRect(Math.min(sx,ex),0,Math.abs(ex-sx),h);}if(progress!=null){const px=Math.max(0,Math.min(1,progress))*w;c.fillStyle='rgba(0,0,0,0.55)';c.fillRect(px|0,0,2,h);}}

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
      playWithSelection(shuffled[i].id, { onEnded: playNext });
      i++;
    }
  }
  playNext();
});
document.getElementById("btn-stop").addEventListener("click", () => audioPlayer.stop());

function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

window.addEventListener("keydown", (e) => {
  const hit = clips.find(c => c.key === e.key);
  if (hit) playWithSelection(hit.id);
});

render();
audioPlayer.load(clips);