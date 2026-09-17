// Генераторы упражнений и раннер сессий — Французский для Дани
"use strict";
window.EX = (() => {

  const PRON6 = ["je", "tu", "il/elle/on", "nous", "vous", "ils/elles"];
  const PRON6_SHORT = ["je", "tu", "il", "nous", "vous", "ils"];

  // ---------- ГЕНЕРАТОРЫ ВОПРОСОВ ----------

  function wrongOptions(pool, correct, n, pick) {
    const out = new Set();
    const tries = shuffle(pool);
    for (const p of tries) {
      const v = pick(p);
      if (v && norm(v) !== norm(correct)) out.add(v);
      if (out.size >= n) break;
    }
    return shuffle([...out]).slice(0, n);
  }

  // FR -> RU (выбор)
  function qVocabChoiceFR(e) {
    const opts = wrongOptions(DB.vocab.filter(x => x.l === e.l), e.r, 3, x => x.r);
    if (opts.length < 3) return null;
    return {
      type: "c", srsKey: "v:" + e.f.toLowerCase(),
      prompt: `Что означает: <b class="fr-big">${esc(e.f)}</b>${e.ip ? `<span class="ipa">[${esc(e.ip)}]</span>` : ""}`,
      hint: e.ef ? `<div class="ctx">${esc(e.ef)}</div>` : "",
      options: shuffle([e.r, ...opts]), answer: e.r,
      explain: `${e.f} — ${e.r}${e.er ? " · «" + e.er + "»" : ""}`
    };
  }
  // RU -> FR (выбор)
  function qVocabChoiceRU(e) {
    const opts = wrongOptions(DB.vocab.filter(x => x.l === e.l), e.f, 3, x => x.f);
    if (opts.length < 3) return null;
    return {
      type: "c", srsKey: "v:" + e.f.toLowerCase(),
      prompt: `Как по-французски: <b class="fr-big">${esc(e.r)}</b>${e.g ? ` <span class="hint-g">(${esc(e.g)})</span>` : ""}`,
      options: shuffle([e.f, ...opts]), answer: e.f,
      explain: `${e.f} — ${e.r}${e.ef ? " · " + e.ef : ""}`
    };
  }
  // RU -> FR (ввод)
  function qVocabInput(e) {
    return {
      type: "i", srsKey: "v:" + e.f.toLowerCase(),
      prompt: `Напиши по-французски: <b class="fr-big">${esc(e.r)}</b>${e.g ? ` <span class="hint-g">(${esc(e.g)})</span>` : ""}`,
      hint: e.ef ? `<div class="ctx">Подсказка: ${esc(e.ef).replace(new RegExp(esc(e.f.split(" ")[e.f.split(" ").length - 1]), "gi"), "___")}</div>` : "",
      answers: [e.f], answerShow: e.f,
      explain: `${e.f} — ${e.r}`
    };
  }
  // Аудирование: озвучить слово -> выбрать значение
  function qVocabListen(e) {
    const opts = wrongOptions(DB.vocab.filter(x => x.l === e.l), e.r, 3, x => x.r);
    if (opts.length < 3) return null;
    return {
      type: "c", srsKey: "v:" + e.f.toLowerCase(), tts: e.f,
      prompt: `Прослушай и выбери перевод: <button class="spk big" data-say="${esc(e.f)}">Прослушать</button>`,
      options: shuffle([e.r, ...opts]), answer: e.r,
      explain: `${e.f} — ${e.r}`, revealAnswer: true
    };
  }
  // Нормализация субъекта: "il/elle/on ..." -> "il ...", "ils/elles ..." -> "ils ..."
  function normForm(f) {
    return String(f).replace(/^il\/elle\/on /, "il ").replace(/^ils\/elles /, "ils ");
  }
  const REFL_MAP = { "j'": ["me ", "m'"], "je": ["me ", "m'"], "tu": ["te ", "t'"], "il": ["se ", "s'"], "nous": ["nous "], "vous": ["vous "], "ils": ["se ", "s'"] };

  // Спряжение (ввод)
  function qVerbFill(v, tense) {
    const forms = v.forms[tense];
    if (!forms) return null;
    if (tense === "impératif") {
      const idxs = [0, 1, 2].filter(i => forms[i] && forms[i] !== "—");
      if (!idxs.length) return null;
      const i = rnd(idxs);
      const f = forms[i];
      const who = ["(ты)", "(мы)", "(вы)"][i];
      return {
        type: "i", srsKey: null,
        prompt: `Повелительное наклонение <b class="fr-big">${esc(v.inf)}</b> · <span class="tense-badge">impératif</span><br><span class="pron-big">${who}</span> ______`,
        answers: [f.replace(/ !$/, "").replace(/!$/, "")], answerShow: f, tts: f.replace(/!/g, ""),
        explain: `${v.inf} · impératif → ${f}`
      };
    }
    const idxs = [0, 1, 2, 3, 4, 5].filter(i => forms[i] && forms[i] !== "—" && !forms[i].includes("|"));
    if (!idxs.length) return null;
    const i = rnd(idxs);
    const f = normForm(forms[i]);
    const pron = PRON6[i];
    let shown = f, ans = f;
    const m = f.match(/^(j'|je |tu |il |nous |vous |ils )(.*)$/);
    if (m) {
      shown = m[1].trim(); ans = m[2];
      for (const pfx of (REFL_MAP[shown] || [])) {
        if (ans.startsWith(pfx)) { shown = shown + " " + pfx.trim(); ans = ans.slice(pfx.length); break; }
      }
    } else {
      shown = PRON6_SHORT[i];
    }
    return {
      type: "i", srsKey: null,
      prompt: `Проспрягай <b class="fr-big">${esc(v.inf)}</b> · <span class="tense-badge">${esc(tense)}</span><br><span class="pron-big">${esc(shown || pron)}</span> ______`,
      answers: [ans], answerShow: f, tts: f,
      explain: `${v.inf} · ${tense} → ${f}${v.ru ? " · " + v.ru : ""}`
    };
  }
  // Спряжение (выбор)
  function qVerbChoice(v, tense) {
    const forms = v.forms[tense];
    if (!forms) return null;
    const idxs = [0, 1, 2, 3, 4, 5].filter(i => forms[i] && forms[i] !== "—");
    if (!idxs.length) return null;
    const i = rnd(idxs);
    const correct = normForm(forms[i]);
    // дистракторы: другие формы того же глагола + формы другого глагола той же группы
    let pool = idxs.filter(j => j !== i).map(j => normForm(forms[j]));
    const others = shuffle(DB.verbs.filter(x => x.inf !== v.inf && x.group === v.group && x.forms[tense]));
    for (const o of others) { const f = o.forms[tense][i] ? normForm(o.forms[tense][i]) : null; if (f && f !== "—" && !pool.includes(f)) pool.push(f); if (pool.length >= 6) break; }
    const opts = shuffle(pool).slice(0, 3);
    if (opts.length < 2) return null;
    const STRIP = /^(j'|je |tu |il |nous |vous |ils |me |te |se |m'|t'|s')/i;
    const mC = correct.match(/^(j'|je|tu|il|nous|vous|ils) /i);
    let clean = correct.replace(STRIP, "");
    for (const pfx of (REFL_MAP[(mC ? mC[1] : "").toLowerCase()] || [])) { if (clean.startsWith(pfx)) { clean = clean.slice(pfx.length); break; } }
    const cleanOpts = opts.map(o => { let c = o.replace(STRIP, ""); for (const pfx of (REFL_MAP[(mC ? mC[1] : "").toLowerCase()] || [])) { if (c.startsWith(pfx)) { c = c.slice(pfx.length); break; } } return c; });
    const pron = tense === "impératif" ? ["(ты)", "(мы)", "(вы)"][i] : (mC ? mC[1] : PRON6_SHORT[i]);
    return {
      type: "c", srsKey: null,
      prompt: `<b class="fr-big">${esc(v.inf)}</b> · <span class="tense-badge">${esc(tense)}</span><br><span class="pron-big">${esc(pron)}</span> ...`,
      options: shuffle([clean, ...cleanOpts.filter(o => norm(o) !== norm(clean))]).slice(0, 4), answer: clean,
      explain: `${v.inf} · ${tense}: ${correct}`
    };
  }
  // Грамматический квиз (из урока)
  function qFromQuiz(q, lessonId) {
    if (q.t === "c") return { type: "c", srsKey: "g:" + lessonId + ":" + norm(q.q).slice(0, 20), prompt: esc(q.q), options: q.o, answer: q.o[q.a], explain: q.e || "" };
    if (q.t === "i" || q.t === "f") return {
      type: "i", srsKey: null,
      prompt: esc(q.q), answers: q.a, answerShow: q.a[0], explain: q.e || ""
    };
    return null;
  }
  // Идиома: FR -> RU
  function qIdiomChoice(it) {
    const opts = wrongOptions(DB.idioms, it.ru, 3, x => x.ru);
    if (opts.length < 3) return null;
    return {
      type: "c", srsKey: "i:" + it.id,
      prompt: `Что означает: <b class="fr-big">${esc(it.fr)}</b><div class="ctx">${esc(it.lit)}</div>`,
      hint: it.ex ? `<div class="ctx">Пример: ${esc(it.ex)}</div>` : "",
      options: shuffle([it.ru, ...opts]), answer: it.ru,
      explain: `${it.fr} — ${it.ru} (букв.: ${it.lit})`
    };
  }
  // Порядок слов (из примера)
  function qOrderWords(fr, ru) {
    const words = fr.replace(/[.!?;:]$/g, "").replace(/[«»"]/g, "").split(/\s+/).filter(Boolean);
    if (words.length < 4 || words.length > 14) return null;
    const distr = words.filter((w, i, a) => a.indexOf(w) === i);
    if (distr.length < 2) return null;
    return {
      type: "o", srsKey: null,
      prompt: `Составь фразу: <div class="ctx">${esc(ru || "")}</div>`,
      tiles: shuffle(words), answerTiles: words,
      explain: fr
    };
  }

  // ---------- СБОРЩИКИ СЕССИЙ ----------

  function vocabPool(levels, themes) {
    let pool = DB.vocab.filter(e => levels.includes(e.l));
    if (themes && themes.length) pool = pool.filter(e => themes.includes(e.t));
    return pool;
  }

  // Тренировка слов уровня (с приоритетом новых и просроченных)
  function sessionVocab(levels, themes, count = 15, mixInput = true) {
    const pool = vocabPool(levels, themes);
    if (!pool.length) return [];
    const due = [], fresh = [], known = [];
    for (const e of pool) {
      const k = "v:" + e.f.toLowerCase();
      if (SRS.isNew(k)) fresh.push(e);
      else if (SRS.isDue(k)) due.push(e);
      else known.push(e);
    }
    const picked = shuffle([...due, ...fresh]).slice(0, count);
    while (picked.length < Math.min(count, pool.length)) {
      const e = rnd(known); if (e && !picked.includes(e)) picked.push(e); else break;
    }
    const qs = [];
    for (const e of picked) {
      const gens = [() => qVocabChoiceFR(e), () => qVocabChoiceRU(e)];
      if (mixInput) gens.push(() => qVocabInput(e));
      gens.push(() => qVocabListen(e));
      let q = null;
      for (const g of shuffle(gens)) { q = g(); if (q) break; }
      if (q) { if (e.ef && Math.random() < 0.35) { const o = qOrderWords(e.ef, e.er); if (o) qs.push(o); } qs.push(q); }
    }
    return shuffle(qs).slice(0, count + 5);
  }

  // Тренировка спряжений
  function sessionVerbs(verbList, tenses, count = 12) {
    const vs = verbList.length ? verbList.map(x => DB.verbs.find(v => v.inf === x)).filter(Boolean) : DB.verbs;
    const qs = [];
    for (let n = 0; n < count; n++) {
      const v = rnd(vs), t = rnd(tenses);
      const q = Math.random() < 0.5 ? qVerbFill(v, t) : qVerbChoice(v, t);
      if (q) qs.push(q);
    }
    return qs;
  }

  // Квиз по уроку грамматики
  function sessionLesson(lesson) {
    const qs = lesson.quiz.map(q => qFromQuiz(q, lesson.id)).filter(Boolean);
    // добавить пару примеров на порядок слов
    for (const ex of (lesson.ex || []).slice(0, 2)) {
      const o = qOrderWords(ex[0], ex[1]); if (o) qs.push(o);
    }
    return shuffle(qs);
  }

  // Тест уровня: грамматика + слова + глаголы уровня
  function sessionLevelTest(levelDef) {
    const qs = [];
    const lessons = DB.grammar.filter(g => g.lv === levelDef.cefr);
    for (const l of lessons) {
      const lq = shuffle(l.quiz.map(q => qFromQuiz(q, l.id)).filter(Boolean)).slice(0, 2);
      qs.push(...lq);
    }
    const levels = [levelDef.cefr];
    if (levelDef.cefr === "A1") levels.push("A1");
    const vocab = sessionVocab(levels, null, 8, false);
    qs.push(...vocab);
    const tenses = levelDef.cefr === "A1" ? ["présent"] :
      levelDef.cefr === "A2" ? ["présent", "passé composé", "imparfait", "futur simple"] :
        levelDef.cefr === "B1" ? ["présent", "passé composé", "imparfait", "futur simple", "conditionnel présent", "subjonctif présent"] :
          levelDef.cefr === "B2" ? ["présent", "passé composé", "passé simple", "subjonctif présent", "conditionnel passé", "futur antérieur"] :
            ["passé simple", "subjonctif imparfait", "subjonctif passé", "conditionnel passé"];
    qs.push(...sessionVerbs([], tenses, 6));
    const idioms = shuffle(DB.idioms.filter(i => ["A1", "A2", "B1"].includes(levelDef.cefr) ? ["A1", "A2"].includes(i.lv) : ["B1", "B2", "C1"].includes(i.lv)))
      .slice(0, 3).map(qIdiomChoice).filter(Boolean);
    qs.push(...idioms);
    return shuffle(qs).slice(0, 22);
  }

  // ---------- РАННЕР СЕССИИ ----------
  // opts: {container, onFinish({total, correct, pct, wrong}), title, pass (0-100 или null), ttsSpeak (bool)}
  function runSession(questions, opts) {
    const C = opts.container;
    let idx = 0, correct = 0, total = questions.length;
    const wrong = [];

    function render() {
      if (idx >= total) return finish();
      const q = questions[idx];
      const pct = Math.round(idx / total * 100);
      C.innerHTML = `
        <div class="ex-head">
          <div class="ex-progress"><div class="ex-progress-fill" style="width:${pct}%"></div></div>
          <div class="ex-count">Вопрос ${idx + 1} / ${total} · ✓ ${correct}</div>
        </div>
        <div class="ex-body" id="exBody"></div>`;
      const body = $("#exBody", C);
      if (q.type === "c") renderChoice(body, q);
      else if (q.type === "i") renderInput(body, q);
      else if (q.type === "o") renderOrder(body, q);
      if (q.tts && opts.ttsSpeak !== false) setTimeout(() => TTS.speak(q.tts).catch(() => { }), 250);
    }

    function renderChoice(body, q) {
      body.innerHTML = `
        <div class="ex-prompt">${q.prompt}${q.hint || ""}</div>
        <div class="ex-options">
          ${q.options.map((o, i) => `<button class="ex-opt" data-i="${i}">${esc(o)}</button>`).join("")}
        </div>
        <div class="ex-feedback"></div>`;
      $$(".ex-opt", body).forEach(b => b.addEventListener("click", () => {
        const chosen = q.options[+b.dataset.i];
        const ok = norm(chosen) === norm(q.answer);
        $$(".ex-opt", body).forEach(x => {
          x.disabled = true;
          if (norm(q.options[+x.dataset.i]) === norm(q.answer)) x.classList.add("right");
        });
        if (!ok) b.classList.add("wrong");
        feedback(body, ok, q, chosen);
      }));
    }

    function renderInput(body, q) {
      body.innerHTML = `
        <div class="ex-prompt">${q.prompt}${q.hint || ""}</div>
        <div class="ex-input-row">
          <input type="text" class="ex-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Твой ответ...">
          <button class="btn primary ex-check">Проверить</button>
        </div>
        ${accentPad()}
        <div class="ex-feedback"></div>`;
      const inp = $(".ex-input", body);
      wireAccentPad(body, inp);
      const check = () => {
        const val = inp.value;
        if (!val.trim()) { inp.focus(); return; }
        const ok = q.answers.some(a => norm(a) === norm(val)) || norm(q.answerShow || "") === norm(val);
        inp.disabled = true; $(".ex-check", body).disabled = true;
        if (!ok) inp.classList.add("wrong-input"); else inp.classList.add("right-input");
        feedback(body, ok, q, val);
      };
      $(".ex-check", body).addEventListener("click", check);
      inp.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
      setTimeout(() => inp.focus(), 50);
    }

    function renderOrder(body, q) {
      body.innerHTML = `
        <div class="ex-prompt">${q.prompt}</div>
        <div class="ex-answer-line" id="answerLine"></div>
        <div class="ex-tiles" id="tileBank">${q.tiles.map((w, i) => `<button class="tile" data-w="${esc(w)}" data-i="${i}">${esc(w)}</button>`).join("")}</div>
        <div class="ex-row-gap"><button class="btn primary ex-check" disabled>Проверить</button></div>
        <div class="ex-feedback"></div>`;
      const bank = $("#tileBank", body), line = $("#answerLine", body), chosen = [];
      bank.addEventListener("click", e => {
        const t = e.target.closest(".tile"); if (!t || t.disabled) return;
        t.disabled = true; chosen.push(t);
        const b = document.createElement("button");
        b.className = "tile placed"; b.textContent = t.dataset.w;
        b.addEventListener("click", () => {
          const ci = chosen.indexOf(t); if (ci >= 0) chosen.splice(ci, 1);
          t.disabled = false; b.remove();
          $(".ex-check", body).disabled = chosen.length !== q.tiles.length;
        });
        line.appendChild(b);
        $(".ex-check", body).disabled = chosen.length !== q.tiles.length;
      });
      $(".ex-check", body).addEventListener("click", () => {
        const got = chosen.map(t => t.dataset.w).join(" ");
        const want = q.answerTiles.join(" ");
        const ok = norm(got) === norm(want);
        $$(".tile", body).forEach(t => t.disabled = true);
        $(".ex-check", body).disabled = true;
        feedback(body, ok, q, got);
      });
    }

    function feedback(body, ok, q, given) {
      const fb = $(".ex-feedback", body);
      if (ok) correct++;
      else wrong.push(q);
      // SRS-оценка для карточек
      if (q.srsKey) SRS.grade(q.srsKey, ok ? 2 : 0, SRS.isNew(q.srsKey));
      fb.innerHTML = `
        <div class="fb ${ok ? "fb-ok" : "fb-bad"}">
          <div class="fb-icon">${ok ? "✓ Верно!" : "✗ Неверно"}</div>
          ${!ok && q.answerShow ? `<div class="fb-answer">Правильный ответ: <b>${esc(q.answerShow)}</b> ${q.tts ? spkBtn(q.tts) : ""}</div>` : ""}
          ${!ok && q.type === "c" && q.answer ? `<div class="fb-answer">Правильный ответ: <b>${esc(q.answer)}</b> ${q.tts ? spkBtn(q.tts) : ""}</div>` : ""}
          ${!ok && q.type === "o" ? `<div class="fb-answer">Правильно: <b>${esc(q.answerTiles.join(" "))}</b> ${spkBtn(q.answerTiles.join(" "))}</div>` : ""}
          ${q.explain ? `<div class="fb-exp">${esc(q.explain)}</div>` : ""}
          ${ok && q.tts ? `<div class="fb-say">${spkBtn(q.tts)} Повтори вслух!</div>` : ""}
          <button class="btn primary fb-next">${idx + 1 >= total ? "Завершить" : "Далее →"}</button>
        </div>`;
      if (ok && q.tts && opts.ttsSpeak !== false) TTS.speak(q.tts).catch(() => { });
      $(".fb-next", fb).focus();
      $(".fb-next", fb).addEventListener("click", () => { idx++; render(); });
      if (ok) {
        let advanced = false;
        const h = e => { if (advanced) return; if (e.key === "Enter" || e.key === " ") { advanced = true; document.removeEventListener("keydown", h); idx++; render(); } };
        document.addEventListener("keydown", h);
        $(".fb-next", fb).addEventListener("click", () => { advanced = true; document.removeEventListener("keydown", h); });
      }
    }

    function finish() {
      const pct = total ? Math.round(correct / total * 100) : 0;
      const passed = opts.pass == null ? null : pct >= opts.pass;
      C.innerHTML = `
        <div class="ex-result">
          <div class="ex-result-icon">${pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "📚"}</div>
          <h2>${opts.title || "Сессия завершена"}</h2>
          <div class="ex-score ${passed === true ? "pass" : passed === false ? "fail" : ""}">${correct} / ${total} · ${pct}%</div>
          ${passed === false ? `<div class="ex-pass-note">Нужно ${opts.pass}%+, чтобы открыть следующий уровень. Ошибки — в повтор!</div>` : ""}
          ${passed === true ? `<div class="ex-pass-note ok">Тест пройден! Уровень засчитан 🎉</div>` : ""}
          ${wrong.length ? `<div class="ex-wrong"><b>Повтори (${wrong.length}):</b> ${wrong.slice(0, 8).map(w => esc(w.answerShow || w.answer || w.explain || "")).filter(Boolean).slice(0, 8).join(" · ")}</div>` : ""}
          <div class="ex-result-btns">
            ${wrong.length ? `<button class="btn primary" id="retryWrong">Повторить ошибки (${wrong.length})</button>` : ""}
            <button class="btn" id="closeSession">Готово</button>
          </div>
        </div>`;
      $("#closeSession", C).addEventListener("click", () => opts.onFinish && opts.onFinish({ total, correct, pct, wrong }));
      const rb = $("#retryWrong", C);
      if (rb) rb.addEventListener("click", () => { questions = shuffle(wrong.slice()); total = questions.length; idx = 0; correct = 0; wrong.length = 0; opts.pass = null; render(); });
      if (opts.onFinish) opts.onFinish({ total, correct, pct, wrong, finished: true, pass: passed });
    }

    render();
  }

  // ---------- Клавиатура акцентов ----------
  const ACCENTS = ["é", "è", "ê", "à", "â", "ç", "î", "ï", "ô", "ù", "û", "ü", "œ", "æ", "É", "È", "À", "Ç"];
  function accentPad() {
    return `<div class="accent-pad">${ACCENTS.map(a => `<button class="acc" data-a="${a}" type="button">${a}</button>`).join("")}<button class="acc acc-tip" type="button" title="Клик вставляет символ в поле">?</button></div>`;
  }
  function wireAccentPad(root, input) {
    $$(".acc[data-a]", root).forEach(b => b.addEventListener("click", () => {
      const s = input.selectionStart ?? input.value.length;
      input.value = input.value.slice(0, s) + b.dataset.a + input.value.slice(input.selectionEnd ?? s);
      input.focus();
      input.selectionStart = input.selectionEnd = s + b.dataset.a.length;
    }));
    const tip = $(".acc-tip", root);
    if (tip) tip.addEventListener("click", () => alert("Кнопки вставляют французские символы (é, è, ç...) в поле ввода. При проверке акценты учитываются, но ответы без акцентов тоже принимаются, если слово однозначно."));
  }

  return {
    qVocabChoiceFR, qVocabChoiceRU, qVocabInput, qVocabListen, qVerbFill, qVerbChoice,
    qFromQuiz, qIdiomChoice, qOrderWords,
    sessionVocab, sessionVerbs, sessionLesson, sessionLevelTest,
    runSession, vocabPool, PRON6
  };
})();
