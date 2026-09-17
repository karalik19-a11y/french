// Озвучка через Web Speech API — Французский для Дани
"use strict";
window.TTS = (() => {
  let voices = [];
  let frVoice = null;
  let ready = false;

  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    voices = speechSynthesis.getVoices() || [];
    if (!voices.length) return;
    // приоритет: fr-FR, затем любой fr
    frVoice = voices.find(v => /^fr[-_]FR/i.test(v.lang) && /google|microsoft|amelie|thomas|audrey/i.test(v.name))
      || voices.find(v => /^fr[-_]FR/i.test(v.lang))
      || voices.find(v => /^fr/i.test(v.lang))
      || null;
    ready = !!frVoice;
  }
  if ("speechSynthesis" in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  function supported() { return "speechSynthesis" in window; }
  function hasFrenchVoice() { loadVoices(); return ready; }

  function speak(text, opts = {}) {
    return new Promise((resolve, reject) => {
      if (!supported()) return reject(new Error("no TTS"));
      text = String(text || "").replace(/🔊/g, "").trim();
      if (!text) return resolve();
      try { speechSynthesis.cancel(); } catch (e) { }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "fr-FR";
      if (frVoice) u.voice = frVoice;
      u.rate = opts.rate || store.get("ttsRate", 0.9);
      u.pitch = 1;
      u.onend = resolve;
      u.onerror = ev => (ev.error === "interrupted" || ev.error === "canceled") ? resolve() : reject(ev.error);
      // Chrome-баг: длинные тексты обрываются — пингуем resume
      speechSynthesis.speak(u);
      if (text.length > 200) {
        const t = setInterval(() => {
          if (!speechSynthesis.speaking) { clearInterval(t); return; }
          speechSynthesis.pause(); speechSynthesis.resume();
        }, 8000);
        u.onend = () => { clearInterval(t); resolve(); };
      }
    });
  }

  // Последовательная озвучка строк (диалоги) с паузами
  async function speakLines(lines, opts = {}) {
    const gap = opts.gap != null ? opts.gap : 550;
    for (const ln of lines) {
      if (window.TTS._stop) break;
      if (opts.onLine) opts.onLine(ln);
      await speak(ln.text, { rate: opts.rate });
      await new Promise(r => setTimeout(r, gap));
    }
    if (opts.onDone) opts.onDone();
  }

  function stop() {
    window.TTS._stop = true;
    try { speechSynthesis.cancel(); } catch (e) { }
    setTimeout(() => { window.TTS._stop = false; }, 300);
  }

  function listVoices() {
    loadVoices();
    return voices.filter(v => /^fr/i.test(v.lang)).map(v => `${v.name} (${v.lang})`);
  }

  return { speak, speakLines, stop, supported, hasFrenchVoice, listVoices, _stop: false };
})();
