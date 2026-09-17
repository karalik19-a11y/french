// Генераторы упражнений и раннер сессий — логика сохранена полностью
"use strict";
window.EX = (() => {

  const PRON6 = ["je", "tu", "il/elle/on", "nous", "vous", "ils/elles"];
  const PRON6_SHORT = ["je", "tu", "il", "nous", "vous", "ils"];
  const KEYS = ["A", "B", "C", "D", "E"];

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
      type: "c", kind: "vocab", srsKey: "v:" + e.f.toLowerCase(),
      prompt: `Что означает${e.ip ? ` <span class="ipa">[${esc(e.ip)}]</span>` : ""}<b class="fr-big">${esc(e.f)}</b>`,
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
      type: "c", kind: "vocab", srsKey: "v:" + e.f.toLowerCase(),
      prompt: `Как по-французски${e.g ? ` <span class="hint-g">(${esc(e.g)})</span>` : ""}<b class="fr-big">${esc(e.r)}</b>`,
      options: shuffle([e.f, ...opts]), answer: e.f,
      explain: `${e.f} — ${e.r}${e.ef ? " · " + e.ef : ""}`
    };
  }
  // RU -> FR (ввод)
  function qVocabInput(e) {
    return {
      type: "i", kind: "vocab", srsKey: "v:" + e.f.toLowerCase(),
      prompt: `Напиши по-французски${e.g ? ` <span class="hint-g">(${esc(e.g)})</span>` : ""}<b class="fr-big">${esc(e.r)}</b>`,
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
      type: "c", kind: "listen", srsKey: "v:" + e.f.toLowerCase(), tts: e.f,
      prompt: `Прослушай и выбери перевод<div style="margin-top:14px">${spkWide(e.f, "Прослушать ещё", "lg")}</div>`,
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
        type: "i", kind: "verb", srsKey: null,
        prompt: `Повелительное наклонение ${tenseBadge("impératif")}<b class="fr-big">${esc(v.inf)}</b><span class="pron-big">${who} ______</span>`,
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
      type: "i", kind: "verb", srsKey: null,
      prompt: `Проспрягай ${tenseBadge(tense)}<b class="fr-big">${esc(v.inf)}</b><span class="pron-big">${esc(shown || pron)} ______</span>`,
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
      type: "c", kind: "verb", srsKey: null,
      prompt: `${tenseBadge(tense)}<b class="fr-big">${esc(v.inf)}</b><span class="pron-big">${esc(pron)} …</span>`,
      options: shuffle([clean, ...cleanOpts.filter(o => norm(o) !== norm(clean))]).slice(0, 4), answer: clean,
      explain: `${v.inf} · ${tense}: ${correct}`
    };
  }
  // Грамматический квиз (из урока)
  function qFromQuiz(q, lessonId) {
    if (q.t === "c") return { type: "c", kind: "grammar", srsKey: "g:" + lessonId + ":" + norm(q.q).slice(0, 20), prompt: `<b class="fr-big" style="font-family:var(--font-ui);font-size:var(--fs-t1);font-weight:700;line-height:1.4">${esc(q.q)}</b>`, options: q.o, answer: q.o[q.a], explain: q.e || "" };
    if (q.t === "i" || q.t === "f") return {
      type: "i", kind: "grammar", srsKey: null,
      prompt: `<b class="fr-big" style="font-family:var(--font-ui);font-size:var(--fs-t1);font-weight:700;line-height:1.4">${esc(q.q)}</b>`, answers: q.a, answerShow: q.a[0], explain: q.e || ""
    };
    return null;
  }
  // Идиома: FR -> RU
  function qIdiomChoice(it) {
    const opts = wrongOptions(DB.idioms, it.ru, 3, x => x.ru);
    if (opts.length < 3) return null;
    return {
      type: "c", kind: "idiom", srsKey: "i:" + it.id,
      prompt: `Что означает<b class="fr-big">${esc(it.fr)}</b><div class="ctx">${esc(it.lit)}</div>`,
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
      type: "o", kind: "order", srsKey: null,
      prompt: `Составь фразу${ru ? `<div class="ctx" style="margin-top:6px">${esc(ru)}</div>` : ""}`,
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

  function sessionLesson(lesson) {
    const qs = lesson.quiz.map(q => qFromQuiz(q, lesson.id)).filter(Boolean);
    for (const ex of (lesson.ex || []).slice(0, 2)) {
      const o = qOrderWords(ex[0], ex[1]); if (o) qs.push(o);
    }
    return shuffle(qs);
  }

  function sessionLevelTest(levelDef) {
    const qs = [];
    const lessons = DB.grammar.filter(g => g.lv === levelDef.cefr);
    for (const l of lessons) {
      const lq = shuffle(l.quiz.map(q => qFromQuiz(q, l.id)).filter(Boolean)).slice(0, 2);
      qs.push(...lq);
    }
    const levels = [levelDef.cefr];
    if (levelDef.cefr === "A1") levels.push("A1");
    qs.push(...sessionVocab(levels, null, 8, false));
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
  // opts: {container, onFinish({total, correct, pct, wrong}), onExit(), title, pass, ttsSpeak}
  function runSession(questions, opts) {
    const C = opts.container;
    let idx = 0, correct = 0, total = questions.length;
    const wrong = [];
    let keyHandler = null;

    function clearKeys() {
      if (keyHandler) { document.removeEventListener("keydown", keyHandler); keyHandler = null; }
    }

    function topBar() {
      return `<div class="ex__top">
        <button class="btn btn--quiet btn--icon btn--sm ex__close" type="button" data-exit aria-label="Завершить сессию">${icon("x", "sm")}</button>
        <div class="ex__bar">${bar(total ? idx / total : 0, { instant: true, aria: "Прогресс сессии" })}</div>
        <div class="ex__count">${icon("check", "xs")}&nbsp;${correct}&nbsp;·&nbsp;${idx + 1}/${total}</div>
      </div>
      <div class="ex__title">${esc(opts.title || "Сессия")}</div>`;
    }

    function bindExit() {
      const b = $("[data-exit]", C);
      if (b) b.addEventListener("click", () => { clearKeys(); if (opts.onExit) opts.onExit(); });
    }

    function render() {
      if (idx >= total) return finish();
      clearKeys();
      const q = questions[idx];
      C.innerHTML = `${topBar()}<div class="ex" id="exBody"></div>`;
      bindExit();
      const body = $("#exBody", C);
      if (q.type === "c") renderChoice(body, q);
      else if (q.type === "i") renderInput(body, q);
      else if (q.type === "o") renderOrder(body, q);
      if (q.tts && opts.ttsSpeak !== false) setTimeout(() => TTS.speak(q.tts).catch(() => { }), 260);
      UI.scrollIntoSoft(C);
    }

    function renderChoice(body, q) {
      body.innerHTML = `
        <div class="ex__prompt">${q.prompt}${q.hint || ""}</div>
        <div class="ex__opts">
          ${q.options.map((o, i) => `<button class="ex-opt" type="button" data-i="${i}">
              <span class="ex-opt__key">${KEYS[i] || i + 1}</span>
              <span class="ex-opt__t">${esc(o)}</span>
              <span class="ex-opt__mark">${icon("check", "sm")}</span>
            </button>`).join("")}
        </div>
        <div class="ex-feedback"></div>`;
      const btns = $$(".ex-opt", body);
      const pick = b => {
        const chosen = q.options[+b.dataset.i];
        const ok = norm(chosen) === norm(q.answer);
        btns.forEach(x => {
          x.disabled = true;
          if (norm(q.options[+x.dataset.i]) === norm(q.answer)) {
            x.classList.add("right");
            $(".ex-opt__mark", x).innerHTML = icon("check", "sm");
          } else if (x !== b) {
            x.classList.add("dim");
          }
        });
        if (!ok) {
          b.classList.remove("dim");
          b.classList.add("wrong");
          $(".ex-opt__mark", b).innerHTML = icon("x", "sm");
        }
        clearKeys();
        feedback(body, ok, q, chosen);
      };
      btns.forEach(b => b.addEventListener("click", () => pick(b)));
      // Выбор цифрами/буквами с клавиатуры
      keyHandler = e => {
        const n = parseInt(e.key, 10);
        if (n >= 1 && n <= btns.length) { pick(btns[n - 1]); return; }
        const li = KEYS.indexOf(String(e.key).toUpperCase());
        if (li >= 0 && li < btns.length) pick(btns[li]);
      };
      document.addEventListener("keydown", keyHandler);
    }

    function renderInput(body, q) {
      body.innerHTML = `
        <div class="ex__prompt">${q.prompt}${q.hint || ""}</div>
        <div class="ex-input-row">
          <input type="text" class="input" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Твой ответ…" aria-label="Твой ответ">
          <button class="btn btn--primary ex-check" type="button">Проверить</button>
        </div>
        ${accentPad()}
        <div class="ex-feedback"></div>`;
      const inp = $(".input", body);
      wireAccentPad(body, inp);
      let answered = false;
      const check = () => {
        if (answered) return;
        const val = inp.value;
        if (!val.trim()) { inp.focus(); UI.haptic(6); inp.classList.add("is-bad"); setTimeout(() => inp.classList.remove("is-bad"), 420); return; }
        answered = true;
        const ok = q.answers.some(a => norm(a) === norm(val)) || norm(q.answerShow || "") === norm(val);
        inp.disabled = true; $(".ex-check", body).disabled = true;
        inp.classList.add(ok ? "is-good" : "is-bad");
        if (!ok) inp.parentElement.classList.add("shake-once");
        clearKeys();
        feedback(body, ok, q, val);
      };
      $(".ex-check", body).addEventListener("click", check);
      inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); check(); } });
      keyHandler = e => { if (e.key === "Enter" && document.activeElement !== inp) check(); };
      document.addEventListener("keydown", keyHandler);
      setTimeout(() => { try { inp.focus({ preventScroll: true }); } catch (err) { inp.focus(); } }, 120);
      UI.scrollIntoSoft(body);
    }

    function renderOrder(body, q) {
      body.innerHTML = `
        <div class="ex__prompt">${q.prompt}</div>
        <div class="ex-answer-line" id="answerLine"><span class="ctx">Нажимай на слова в нужном порядке</span></div>
        <div class="ex-tiles" id="tileBank">${q.tiles.map((w, i) => `<button class="wtile" type="button" data-w="${esc(w)}" data-i="${i}">${esc(w)}</button>`).join("")}</div>
        <div class="btn-row" style="margin-top:16px"><button class="btn btn--primary btn--lg ex-check" type="button" disabled>Проверить</button></div>
        <div class="ex-feedback"></div>`;
      const bank = $("#tileBank", body), line = $("#answerLine", body), chosen = [];
      const syncLine = () => {
        $(".ex-check", body).disabled = chosen.length !== q.tiles.length;
        line.classList.toggle("is-ready", chosen.length === q.tiles.length);
      };
      bank.addEventListener("click", e => {
        const t = closestOf(e.target, ".wtile"); if (!t || t.disabled) return;
        t.disabled = true; chosen.push(t);
        UI.haptic(5);
        const hint = $(".ctx", line); if (hint && chosen.length === 1) hint.remove();
        const b = document.createElement("button");
        b.type = "button";
        b.className = "wtile placed"; b.textContent = t.dataset.w;
        b.addEventListener("click", () => {
          const ci = chosen.indexOf(t); if (ci >= 0) chosen.splice(ci, 1);
          t.disabled = false; b.remove();
          if (!chosen.length) line.innerHTML = `<span class="ctx">Нажимай на слова в нужном порядке</span>`;
          syncLine();
        });
        line.appendChild(b);
        syncLine();
      });
      $(".ex-check", body).addEventListener("click", () => {
        const got = chosen.map(t => t.dataset.w).join(" ");
        const want = q.answerTiles.join(" ");
        const ok = norm(got) === norm(want);
        $$(".wtile", body).forEach(t => t.disabled = true);
        $(".ex-check", body).disabled = true;
        clearKeys();
        feedback(body, ok, q, got);
      });
    }

    function feedback(body, ok, q, given) {
      const fb = $(".ex-feedback", body);
      if (ok) correct++; else wrong.push(q);
      if (q.srsKey) SRS.grade(q.srsKey, ok ? 2 : 0, SRS.isNew(q.srsKey));
      // Статистика по типам
      if (q.kind === "verb") { Activity.bump("verbs_all"); if (ok) Activity.bump("verbs_ok"); }
      if (q.kind === "listen") Activity.bump("listen_q", 1);
      UI.haptic(ok ? 12 : [14, 42, 14]);

      const answerLine = !ok && q.answerShow
        ? `<div class="fb__answer">Правильный ответ: <b>${esc(q.answerShow)}</b>${q.tts ? spkBtn(q.tts) : ""}</div>`
        : !ok && q.type === "c" && q.answer
          ? `<div class="fb__answer">Правильный ответ: <b>${esc(q.answer)}</b>${q.tts ? spkBtn(q.tts) : ""}</div>`
          : !ok && q.type === "o"
            ? `<div class="fb__answer">Правильно: <b>${esc(q.answerTiles.join(" "))}</b>${spkBtn(q.answerTiles.join(" "))}</div>`
            : "";

      fb.innerHTML = `
        <div class="fb ${ok ? "fb-ok" : "fb-bad"}">
          <div class="fb__head">
            <span class="fb__ico">${icon(ok ? "check" : "x", "sm")}</span>
            <span class="fb__t">${ok ? "Верно" : "Неверно"}</span>
            ${ok && q.tts ? `<span class="spacer"></span>${spkBtn(q.tts)}` : ""}
          </div>
          ${answerLine}
          ${q.explain ? `<div class="fb__exp">${esc(q.explain)}</div>` : ""}
          ${ok && q.tts ? `<div class="fb__say">${icon("mic", "xs")}<span>Повтори вслух, копируя интонацию</span></div>` : ""}
          <button class="btn btn--primary btn--lg fb-next" type="button">${idx + 1 >= total ? "Завершить" : "Далее"}${idx + 1 >= total ? "" : icon("arrowRight", { size: "sm", cls: "ico--arrow" })}</button>
        </div>`;

      if (ok && q.tts && opts.ttsSpeak !== false) TTS.speak(q.tts).catch(() => { });

      const next = $(".fb-next", fb);
      const advance = () => { clearKeys(); idx++; render(); };
      next.addEventListener("click", advance);
      try { next.focus({ preventScroll: true }); } catch (e) { }
      keyHandler = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); advance(); } };
      document.addEventListener("keydown", keyHandler);
      UI.scrollIntoSoft(fb);
    }

    function finish() {
      clearKeys();
      const pct = total ? Math.round(correct / total * 100) : 0;
      const passed = opts.pass == null ? null : pct >= opts.pass;
      if (total && !wrong.length) Activity.bump("perfect");
      const verdict = pct >= 80 ? { t: "Отличная работа", i: "trophy", s: "Материал усваивается — держи темп" }
        : pct >= 50 ? { t: "Неплохо", i: "trendUp", s: "Ошибки уйдут в повторение и вернутся вовремя" }
          : { t: "Стоит повторить", i: "refresh", s: "Не хватает практики: пройди урок и вернись к сессии" };

      C.innerHTML = `
        <div class="ex-result">
          ${ring(pct, { size: 128, w: 8, cls: passed === false ? "" : pct >= 80 ? "gold" : "", num: pct + "%", cap: "результат", delay: 1 })}
          <h2 class="ex-result__t">${esc(opts.title || "Сессия завершена")}</h2>
          <div class="ex-result__score ${passed === true ? "pass" : passed === false ? "fail" : ""}" data-score>${correct}<small> / ${total}</small></div>
          <div class="ex-result__note">${esc(verdict.s)}</div>
          ${passed === false ? `<div class="ex-result__note">Нужно ${opts.pass}% и выше, чтобы открыть следующий уровень.</div>` : ""}
          ${passed === true ? `<div class="ex-result__note ok">Тест пройден — уровень засчитан</div>` : ""}
          ${wrong.length ? `<div class="ex-result__wrong"><b>Повтори (${wrong.length})</b>${wrong.slice(0, 8).map(w => esc(w.answerShow || w.answer || w.explain || "")).filter(Boolean).join(" · ")}</div>` : ""}
          <div class="ex-result__btns">
            ${wrong.length ? `<button class="btn btn--primary btn--lg" type="button" id="retryWrong">${icon("refresh", "sm")}Повторить ошибки (${wrong.length})</button>` : ""}
            <button class="btn ${wrong.length ? "btn--ghost" : "btn--primary"} btn--lg" type="button" id="closeSession">${icon("check", "sm")}Готово</button>
          </div>
        </div>`;

      const scoreEl = $("[data-score]", C);
      if (scoreEl) UI.countUp(scoreEl, correct, { format: n => `${Math.round(n)} / ${total}` });

      $("#closeSession", C).addEventListener("click", () => {
        if (opts.onFinish) opts.onFinish({ total, correct, pct, wrong, closed: true });
      });
      const rb = $("#retryWrong", C);
      if (rb) rb.addEventListener("click", () => {
        questions = shuffle(wrong.slice()); total = questions.length; idx = 0; correct = 0; wrong.length = 0; opts.pass = null; render();
      });
      if (opts.onFinish) opts.onFinish({ total, correct, pct, wrong, finished: true, pass: passed });
    }

    render();
  }

  // ---------- Клавиатура акцентов ----------
  const ACCENTS = ["é", "è", "ê", "à", "â", "ç", "î", "ï", "ô", "ù", "û", "ü", "œ", "æ", "É", "È", "À", "Ç"];
  function accentPad() {
    return `<div class="accent-pad">${ACCENTS.map(a => `<button class="acc" data-a="${a}" type="button" aria-label="${a}">${a}</button>`).join("")}<button class="acc acc--tip" type="button" data-acc-tip aria-label="Подсказка">?</button></div>`;
  }
  function wireAccentPad(root, input) {
    $$(".acc[data-a]", root).forEach(b => b.addEventListener("click", () => {
      const s = input.selectionStart ?? input.value.length;
      input.value = input.value.slice(0, s) + b.dataset.a + input.value.slice(input.selectionEnd ?? s);
      UI.haptic(4);
      input.focus();
      input.selectionStart = input.selectionEnd = s + b.dataset.a.length;
    }));
    const tip = $("[data-acc-tip]", root);
    if (tip) tip.addEventListener("click", () => UI.alert(
      "Кнопки вставляют французские символы (é, è, ç…) в поле ввода. При проверке акценты учитываются, но ответы без акцентов тоже принимаются, если слово однозначно.",
      { title: "Французские символы", ok: "Ясно" }
    ));
  }

  return {
    qVocabChoiceFR, qVocabChoiceRU, qVocabInput, qVocabListen, qVerbFill, qVerbChoice,
    qFromQuiz, qIdiomChoice, qOrderWords,
    sessionVocab, sessionVerbs, sessionLesson, sessionLevelTest,
    runSession, vocabPool, PRON6
  };
})();
