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
  { id: "jazz_scat", label: "Jazz DJ Smooth", key: "", file: "hey_jazz_scat.mp3" },
  { id: "surfer_dude", label: "Surfer Dude", key: "", file: "hey_surfer_dude.mp3" },
  { id: "goth_whisper", label: "Goth Whisper", key: "", file: "hey_goth_whisper.mp3" },
  { id: "french_rp", label: "French Accent", key: "", file: "hey_french_rp.mp3" },
  { id: "spanish_tv", label: "Spanish TV Style", key: "", file: "hey_spanish_tv.mp3" },
  { id: "anime_hype", label: "Anime Hype", key: "", file: "hey_anime_hype.mp3" },
  { id: "newscaster", label: "News Anchor", key: "", file: "hey_newscaster.mp3" },
  { id: "drill_sergeant", label: "Drill Sergeant", key: "", file: "hey_drill_sergeant.mp3" },
  { id: "pirate", label: "Pirate Voice", key: "", file: "hey_pirate.mp3" },
  { id: "beatbox_tag", label: "Beatbox Tag", key: "", file: "hey_beatbox_tag.mp3" },
  { id: "cowboy_quick", label: "Cowboy Quick", key: "", file: "hey_cowboy_quick.mp3" },
  { id: "medieval_towncrier", label: "Medieval Town Crier", key: "", file: "hey_medieval_towncrier.mp3" },
];
const defaultRegions = new Map([
  ["clean_bright_f",[0.32,1.43]],["clean_bright_m",[0.34,1.46]],
  ["retro_8bit",[0.11,1.20]],["robotic",[0.33,1.43]],
  ["cinematic",[0.04,1.80]],["country_drawl",[2.04,3.95]],
  ["tts_flat",[2.25,3.90]],["binaural_asmr",[2.40,3.75]],
  ["lofi_tape",[2.23,3.80]],["child_joy",[1.10,2.90]],["sports_announce",[1.39,3.80]],
]);

const grid = document.getElementById("grid");
const audioPlayer = createAudioPlayer();

const selections = new WeakMap();
const cardById = new Map();

function createAudioPlayer() {
  let audioContext;
  const audioBuffers = new Map();
  let source = null, currentId = null, startTime = 0, currentDur = 0, currentRegionNorm = null;

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

  const play = async (id, { gain = 1.0, onEnded = () => {}, regionSec = null } = {}) => {
    if (!audioContext) initContext(); if (!audioContext) return; stop();
    const gainNode = audioContext.createGain(); gainNode.gain.setValueAtTime(gain, audioContext.currentTime);
    gainNode.connect(audioContext.destination);
    try { const buf = await ensureBuffer(id); source = audioContext.createBufferSource();
      currentId = id; const offset = regionSec ? Math.max(0, regionSec.start) : 0;
      const dur = regionSec ? Math.max(0.001, regionSec.end - regionSec.start) : undefined;
      startTime = audioContext.currentTime; currentDur = dur ?? buf.duration; currentRegionNorm = regionSec ? {start: offset/buf.duration, end: regionSec.end/buf.duration} : null;
      source.buffer = buf; source.connect(gainNode); source.onended = () => { currentId=null; currentRegionNorm=null; onEnded(); }; source.start(0, offset, dur);
    } catch(e){ console.error(`Error decoding ${id}`, e); }
  };

  const stop = () => {
    if (source) { source.onended = null; source.stop(); source = null; }
    currentId = null;
  };

  return { load, play, stop, ensureBuffer, getProgress:(id)=> (id===currentId && currentDur>0)? Math.min(1,(audioContext.currentTime-startTime)/currentDur) : null,
           getProgressX:(id)=>{ const p=(id===currentId && currentDur>0)? Math.min(1,(audioContext.currentTime-startTime)/currentDur) : null; if(p==null) return null; if(currentRegionNorm) return currentRegionNorm.start + p*(currentRegionNorm.end-currentRegionNorm.start); return p; } };
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
  el.querySelector('[data-action="play"]').addEventListener("click", () => {
    const r = getSelectionSeconds(el, c);
    audioPlayer.play(c.id, { regionSec: r || null });
  });
  el.addEventListener("mouseenter", () => {
    const r = getSelectionSeconds(el, c);
    audioPlayer.play(c.id, { gain: 0.6, regionSec: r || null });
  });
  el.addEventListener("mouseleave", () => audioPlayer.stop());
  attachWaveInteractions(el, c, defaultRegions.get(c.id) || null);
  cardById.set(c.id, el);
  return el;
}

function getSelectionSeconds(el, c){ const s = selections.get(el); return s ? { start: s.a, end: s.b } : null; }

function attachWaveInteractions(el, c, defSec){
  const cv = el.querySelector('canvas'); const times = el.querySelector('.times'); const btn = el.querySelector('[data-action="dlsel"]');
  let sel=null, dragging=false, dur=0, bufRef=null, lastP=null, raf=0;
  const toTime = x => Math.max(0, Math.min(1, x / cv.clientWidth));
  const getX = (evt) => (evt.touches && evt.touches[0]) ? (evt.touches[0].clientX - cv.getBoundingClientRect().left) : evt.offsetX;
  audioPlayer.ensureBuffer(c.id).then(buf=>{ bufRef=buf; dur=buf.duration;
    if(defSec){ sel={start:defSec[0]/dur, end:defSec[1]/dur}; selections.set(el,{a:defSec[0],b:defSec[1]}); btn.disabled=false; times.textContent=`${defSec[0].toFixed(2)}s – ${defSec[1].toFixed(2)}s`; }
    drawWaveform(cv, bufRef, sel, audioPlayer.getProgress(c.id)); tick();
  });
  const tick = ()=>{ const p = audioPlayer.getProgressX(c.id); if(p!==lastP && bufRef){ drawWaveform(cv, bufRef, sel, p); lastP=p; } raf = requestAnimationFrame(tick); };
  cv.addEventListener('pointerdown', e=>{ dragging=true; sel={start:toTime(e.offsetX), end:toTime(e.offsetX)}; btn.disabled=true; });
  cv.addEventListener('pointermove', e=>{ if(!dragging) return; sel.end=toTime(e.offsetX); if(bufRef){ drawWaveform(cv, bufRef, sel, audioPlayer.getProgress(c.id)); const a=Math.min(sel.start,sel.end)*dur, b=Math.max(sel.start,sel.end)*dur; times.textContent=`${a.toFixed(2)}s – ${b.toFixed(2)}s`; }});
  window.addEventListener('pointerup', ()=>{ if(!dragging) return; dragging=false; if(Math.abs(sel.end-sel.start)<0.005){ sel=null; selections.delete(el); btn.disabled=true; times.textContent='Select a region'; if(bufRef) drawWaveform(cv,bufRef,sel,audioPlayer.getProgressX(c.id)); } else { btn.disabled=false; const a=Math.min(sel.start,sel.end)*dur, b=Math.max(sel.start,sel.end)*dur; selections.set(el,{a,b}); }});
  cv.addEventListener('touchstart', e=>{ e.preventDefault(); dragging=true; const x=getX(e); sel={start:toTime(x), end:toTime(x)}; btn.disabled=true; }, {passive:false});
  cv.addEventListener('touchmove', e=>{ if(!dragging) return; e.preventDefault(); const x=getX(e); sel.end=toTime(x); if(bufRef){ drawWaveform(cv, bufRef, sel, audioPlayer.getProgress(c.id)); const a=Math.min(sel.start,sel.end)*dur, b=Math.max(sel.start,sel.end)*dur; times.textContent=`${a.toFixed(2)}s – ${b.toFixed(2)}s`; }}, {passive:false});
  window.addEventListener('touchend', ()=>{ if(!dragging) return; dragging=false; if(Math.abs(sel.end-sel.start)<0.005){ sel=null; selections.delete(el); btn.disabled=true; times.textContent='Select a region'; if(bufRef) drawWaveform(cv,bufRef,sel,audioPlayer.getProgressX(c.id)); } else { btn.disabled=false; const a=Math.min(sel.start,sel.end)*dur, b=Math.max(sel.start,sel.end)*dur; selections.set(el,{a,b}); }});
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
      const c = shuffled[i]; const el = cardById.get(c.id); const r = el ? getSelectionSeconds(el, c) : null;
      audioPlayer.play(c.id, { onEnded: playNext, regionSec: r || null });
      i++;
    }
  }
  playNext();
});
document.getElementById("btn-stop").addEventListener("click", () => audioPlayer.stop());

function shuffle(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

window.addEventListener("keydown", (e) => {
  const hit = clips.find(c => c.key === e.key);
  if (hit) { const el = cardById.get(hit.id); const r = el ? getSelectionSeconds(el, hit) : null; audioPlayer.play(hit.id, { regionSec: r || null }); }
});

render();
audioPlayer.load(clips);
/* overlay: show then dismiss on click or after 5s */
const ov=document.getElementById('voices-overlay');
if(ov){ requestAnimationFrame(()=>ov.classList.add('show'));
  const hide=()=>{ ov.classList.remove('show'); ov.removeEventListener('click',hide); };
  ov.addEventListener('click',hide); setTimeout(hide,5000);
}