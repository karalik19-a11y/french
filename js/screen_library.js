// Экраны: библиотека, чтение, диалоги, идиомы, фонетика, методика
"use strict";
(() => {
  const A = window.App;
  const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

  /* ================= БИБЛИОТЕКА (хаб) ================= */
  A.screens.library = () => {
    const main = A.main;
    const items = [
      { r: "vocab", fr: "Vocabulaire", ru: "Словарь", ico: "book", n: `${fmtNum(DB.vocab.length)} слов`, tone: "", note: "Поиск, IPA, примеры, избранное" },
      { r: "verbs", fr: "Conjugaison", ru: "Спряжения", ico: "bookOpen", n: `${DB.verbs.length} глаголов`, tone: "ok", note: "15 времён, озвучка каждой формы" },
      { r: "grammar", fr: "Grammaire", ru: "Грамматика", ico: "braces", n: `${DB.grammar.length} уроков`, tone: "lav", note: "Правила, примеры, квизы" },
      { r: "reading", fr: "Lecture", ru: "Чтение", ico: "page", n: `${DB.reading.length} текстов`, tone: "gold", note: "Градуированные тексты и классика" },
      { r: "dialogues", fr: "Dialogues", ru: "Диалоги", ico: "chat", n: `${DB.dialogues.length} диалогов`, tone: "bor", note: "Озвучка и shadowing" },
      { r: "idioms", fr: "Idiomes", ru: "Идиомы и пословицы", ico: "quote", n: `${DB.idioms.length} выражений`, tone: "gold", note: "Дословный перевод и викторина" },
      { r: "phon", fr: "Phonétique", ru: "Фонетика", ico: "wave", n: `${DB.phonetics.sounds.length} звуков`, tone: "ok", note: "Правила чтения, пары, скороговорки" },
      { r: "method", fr: "Méthode", ru: "Методика", ico: "compass", n: `${DB.methodology.techniques.length} техник`, tone: "lav", note: "Планы занятий и ресурсы" }
    ];

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Bibliothèque",
      title: "Всё, что <em>внутри</em>",
      lead: "Полная база приложения: лексика, грамматика, тексты, диалоги, фонетика и методика — всё с озвучкой."
    })}
      <div class="card card--flat" style="padding:8px 10px">
        <div class="lib" data-stagger=":scope > *">
          ${items.map(t => `<a class="lib__item lib__item--${t.tone}" href="#/${t.r}">
            <span class="lib__ico">${icon(t.ico)}</span>
            <span class="lib__body">
              <span class="lib__fr">${esc(t.fr)}</span>
              <span class="lib__ru">${esc(t.ru)} · ${esc(t.note)}</span>
            </span>
            <span class="lib__n">${esc(t.n)}</span>
            <span class="lib__end">${icon("chevronRight", "sm")}</span>
          </a>`).join("")}
        </div>
      </div>
      <div class="card card--glass" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        ${icon("compass", "xl")}
        <div class="col" style="gap:4px;flex:1;min-width:200px">
          <span class="eyebrow">Conseil</span>
          <p class="lead">Правило 95%: берите текст, где понимаете почти всё. Незнакомые 5% усваиваются из контекста — так язык растёт быстрее, чем через зубрёжку.</p>
        </div>
        <a class="btn btn--ghost" href="#/method">${icon("arrowRight", "sm")}Методика</a>
      </div>
    </div>`;
  };

  /* ================= ЧТЕНИЕ ================= */

  A.screens.reading = (args) => {
    if (args && args[0]) return readingView(args[0]);
    const main = A.main;
    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Lecture",
      title: "Чтение <em>по уровням</em>",
      lead: "Градуированные тексты A1 → C1 и классика в оригинале: Лафонтен, Мопассан, Гюго, Вольтер. Клик по слову — перевод и озвучка."
    })}
      <div class="stack" data-stagger=":scope > *">
        ${LEVELS.map(lv => {
      const rs = DB.reading.filter(r => r.lv === lv);
      if (!rs.length) return "";
      return `<section class="card card--flat" style="padding:16px 18px">
            <div class="row" style="gap:10px;margin-bottom:12px">${cefrBadge(lv)}<span class="eyebrow">${rs.length} ${pluralRu(rs.length, "текст", "текста", "текстов")}</span></div>
            <div class="entries">
              ${rs.map(r => {
        const words = r.text.split(/\s+/).length;
        const opened = Activity.count("read:" + r.id) > 0;
        return `<a class="entry ${opened ? "entry--done" : ""}" href="#/reading/${encodeURIComponent(r.id)}">
                    <span class="entry__body">
                      <span class="entry__t fr" style="font-size:1.06rem">${esc(r.title)}</span>
                      <span class="entry__s">${esc(r.titleRu)}${r.author ? ` · ${esc(r.author)}` : ""} · ${fmtNum(words)} слов</span>
                    </span>
                    <span class="entry__end">${opened ? `<span style="color:var(--ok)">${icon("check", "sm")}</span>` : ""}${icon("chevronRight", "sm")}</span>
                  </a>`;
      }).join("")}
            </div>
          </section>`;
    }).join("")}
      </div>
    </div>`;
  };

  function readingView(id) {
    const r = DB.reading.find(x => x.id === id);
    if (!r) return A.screens.reading([]);
    const main = A.main;
    Activity.bump("read:" + r.id);
    Activity.bump("read_texts", Activity.count("read:" + r.id) === 1 ? 1 : 0);

    const paras = r.text.split("\n").filter(p => p.trim());
    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      back: "#/reading", backLabel: "Чтение",
      eyebrow: "Lecture · " + r.lv,
      title: `<span class="fr" style="font-family:var(--font-display)">${esc(r.title)}</span>`,
      lead: `${esc(r.titleRu)}${r.author ? ` · ${esc(r.author)}` : ""} · ${fmtNum(r.text.split(/\s+/).length)} слов · примерно ${Math.max(2, Math.round(r.text.split(/\s+/).length / 130))} мин чтения`,
      badges: cefrBadge(r.lv)
    })}

      <div class="card card--tight reader__tools">
        <button class="btn btn--primary" type="button" id="readAll">${icon("play", "sm")}Прослушать текст</button>
        <button class="btn btn--ghost" type="button" id="toggleTr">${icon("eye", "sm")}Перевод</button>
        <button class="btn btn--ghost" type="button" id="readQuiz">${icon("pen", "sm")}Вопросы · ${r.questions.length}</button>
      </div>

      <article class="reader">
        ${paras.map(p => `<p class="rt-p">${p.split(/(\s+)/).map(w => {
      const clean = w.replace(/[^\p{L}\p{M}'’-]/gu, "");
      return clean ? `<span class="rt-w" data-w="${esc(clean)}">${esc(w)}</span>` : esc(w);
    }).join("")}</p>`).join("")}
      </article>

      <div class="card hidden" id="trBox">
        <div class="row" style="gap:10px;margin-bottom:10px">${icon("globe", "sm")}<h2 class="h2">Перевод</h2></div>
        <div class="tr-box">${r.translation.split("\n").filter(p => p.trim()).map(p => `<p>${esc(p)}</p>`).join("")}</div>
      </div>

      <section class="card">
        <div class="row" style="gap:10px;margin-bottom:14px">
          ${icon("book", "sm")}<h2 class="h2">Слова текста</h2>
          <span class="spacer"></span><span class="hint">${r.words.length}</span>
        </div>
        <div class="words" data-stagger=":scope > *">
          ${r.words.map(w => `<div class="wordchip">
            ${spkBtn(w[0])}
            <span class="col" style="gap:1px;min-width:0">
              <span class="wordchip__b">${esc(w[0])}</span>
              <span class="wordchip__s">${esc(w[1])}</span>
            </span>
          </div>`).join("")}
        </div>
      </section>

      <div class="btn-row btn-row--stretch">
        <a class="btn btn--ghost" href="#/vocab">${icon("book", "sm")}Открыть словарь</a>
        <button class="btn btn--primary" type="button" id="readQuiz2">${icon("pen", "sm")}Пройти вопросы</button>
      </div>
    </div>`;

    // Перевод
    const trBox = $("#trBox", main);
    const toggleTr = () => {
      const show = trBox.classList.contains("hidden");
      trBox.classList.toggle("hidden", !show);
      $("#toggleTr", main).innerHTML = `${icon(show ? "eyeOff" : "eye", "sm")}${show ? "Скрыть перевод" : "Перевод"}`;
      if (show) UI.scrollIntoSoft(trBox);
    };
    $("#toggleTr", main).addEventListener("click", toggleTr);

    // Озвучка всего текста
    const readBtn = $("#readAll", main);
    let reading = false;
    readBtn.addEventListener("click", async () => {
      if (reading) { TTS.stop(); return; }
      reading = true;
      readBtn.innerHTML = `${icon("stop", "sm")}Остановить`;
      readBtn.classList.add("btn--danger"); readBtn.classList.remove("btn--primary");
      await TTS.speak(r.text).catch(() => { });
      reading = false;
      if (readBtn.isConnected) {
        readBtn.innerHTML = `${icon("play", "sm")}Прослушать текст`;
        readBtn.classList.remove("btn--danger"); readBtn.classList.add("btn--primary");
      }
    });

    const startQuiz = () => {
      const qs = r.questions.map(q => ({ type: "c", kind: "reading", srsKey: null, prompt: `<b class="fr-big" style="font-family:var(--font-ui);font-size:var(--fs-t1);font-weight:700;line-height:1.4">${esc(q.q)}</b>`, options: q.o, answer: q.o[q.a], explain: q.e || "" }));
      A.openSession(qs, `Вопросы · ${r.title}`);
    };
    $("#readQuiz", main).addEventListener("click", startQuiz);
    $("#readQuiz2", main).addEventListener("click", startQuiz);

    // Клик по слову — всплывающая карточка
    const pop = document.createElement("div");
    pop.className = "popover hidden";
    document.body.appendChild(pop);
    const cleanup = () => { pop.remove(); document.removeEventListener("app:route:leave", cleanup); document.removeEventListener("click", onDocClick); };
    document.addEventListener("app:route:leave", cleanup);

    function onDocClick() { pop.classList.add("hidden"); $$(".rt-w.is-active", main).forEach(w => w.classList.remove("is-active")); }

    $$(".rt-w", main).forEach(w => w.addEventListener("click", ev => {
      ev.stopPropagation();
      const raw = w.dataset.w;
      const hit = lookupWord(raw);
      $$(".rt-w.is-active", main).forEach(x => x.classList.remove("is-active"));
      w.classList.add("is-active");
      pop.classList.remove("hidden");
      pop.innerHTML = hit
        ? `<div class="popover__w">${esc(hit.f)}${spkBtn(hit.f)}</div>
           <div class="popover__r">${esc(hit.r)}</div>
           ${hit.ef ? `<div class="popover__r" style="font-family:var(--font-display);font-style:italic;color:var(--text-3)">${esc(hit.ef)}</div>` : ""}
           <div class="popover__m">${esc([hit.t, hit.l].filter(Boolean).join(" · ") || (hit.verb ? "глагол" : ""))}</div>`
        : `<div class="popover__w">${esc(raw)}${spkBtn(raw)}</div>
           <div class="popover__r">В нашей базе этого слова нет.</div>
           <a class="btn btn--sm btn--ghost" style="margin-top:10px" target="_blank" rel="noopener" href="https://www.wordreference.com/frru/${encodeURIComponent(raw)}">${icon("external", "xs")}WordReference</a>`;
      document.removeEventListener("click", onDocClick);
      setTimeout(() => document.addEventListener("click", onDocClick), 0);

      const rect = w.getBoundingClientRect();
      const w320 = Math.min(300, window.innerWidth - 24);
      const left = clamp(rect.left + window.scrollX, 12, window.scrollX + window.innerWidth - w320 - 12);
      const top = rect.bottom + window.scrollY + 10;
      pop.style.width = w320 + "px";
      pop.style.left = left + "px";
      pop.style.top = top + "px";
    }));
  }

  /* ================= ДИАЛОГИ ================= */

  A.screens.dialogues = (args) => {
    if (args && args[0]) return dialogueView(args[0]);
    const main = A.main;
    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Dialogues",
      title: "Живые <em>диалоги</em>",
      lead: `${DB.dialogues.length} ситуативных диалогов A1 → C1: пословная озвучка и режим shadowing — повтор за диктором с паузой на ваш ответ.`
    })}
      <div class="stack" data-stagger=":scope > *">
        ${LEVELS.map(lv => {
      const ds = DB.dialogues.filter(d => d.lv === lv);
      if (!ds.length) return "";
      return `<section class="card card--flat" style="padding:16px 18px">
            <div class="row" style="gap:10px;margin-bottom:12px">${cefrBadge(lv)}<span class="eyebrow">${ds.length} ${pluralRu(ds.length, "диалог", "диалога", "диалогов")}</span></div>
            <div class="entries">
              ${ds.map(d => `<a class="entry" href="#/dialogues/${encodeURIComponent(d.id)}">
                  <span class="entry__n">${icon("chat", "sm")}</span>
                  <span class="entry__body">
                    <span class="entry__t fr" style="font-size:1.06rem">${esc(d.title)}</span>
                    <span class="entry__s">${esc(d.titleRu)} · ${esc(d.situation)} · ${d.lines.length} реплик</span>
                  </span>
                  <span class="entry__end">${icon("play", "sm")}</span>
                </a>`).join("")}
            </div>
          </section>`;
    }).join("")}
      </div>
    </div>`;
  };

  function dialogueView(id) {
    const d = DB.dialogues.find(x => x.id === id);
    if (!d) return A.screens.dialogues([]);
    const main = A.main;
    let alive = true;
    const bye = () => { alive = false; };
    document.addEventListener("app:route:leave", bye, { once: true });

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      back: "#/dialogues", backLabel: "Диалоги",
      eyebrow: "Dialogue · " + d.lv,
      title: `<span style="font-family:var(--font-display)">${esc(d.title)}</span>`,
      lead: `${esc(d.titleRu)} · ${esc(d.situation)}`,
      badges: cefrBadge(d.lv) + pill(d.lines.length + " реплик")
    })}

      <div class="card card--tight reader__tools">
        <button class="btn btn--primary" type="button" id="playAll">${icon("play", "sm")}Прослушать</button>
        <button class="btn btn--gold" type="button" id="shadowBtn">${icon("mic", "sm")}Shadowing</button>
        <button class="btn btn--ghost btn--icon" type="button" id="stopBtn" aria-label="Стоп">${icon("stop", "sm")}</button>
        <button class="btn btn--ghost" type="button" id="trDlg">${icon("eye", "sm")}Перевод</button>
        <label class="dlg__rate">
          <span>темп</span>
          <input class="range" type="range" id="rateSlider" min="0.5" max="1.1" step="0.05" value="${A.settings.ttsRate}" aria-label="Скорость озвучки">
          <b id="rateVal" style="font-size:12px;min-width:34px;text-align:right">${A.settings.ttsRate}</b>
        </label>
      </div>

      <div class="dlg" id="dlgLines" data-stagger=":scope > *">
        ${d.lines.map((l, i) => `
          <div class="dlg-line" data-i="${i}">
            <span class="dlg-sp">${esc(l.s)}</span>
            <span class="dlg-body">
              <span class="dlg-fr">${spkBtn(l.fr)}<span>${esc(l.fr)}</span></span>
              <span class="dlg-ru hidden">${esc(l.ru)}</span>
            </span>
          </div>`).join("")}
      </div>

      <div class="notice notice--info" style="margin-top:8px">
        <span class="notice__ico">${icon("mic", "sm")}</span>
        <span><b>Shadowing.</b> Реплика звучит, затем пауза «à vous» — повторяйте вслух одновременно с диктором, копируя ритм и связывания. После паузы фраза звучит ещё раз для проверки.</span>
      </div>
    </div>`;

    const rateSlider = $("#rateSlider", main);
    UI.bindRange(rateSlider);
    rateSlider.addEventListener("input", e => {
      $("#rateVal", main).textContent = e.target.value;
      store.set("ttsRate", +e.target.value);
      A.settings.ttsRate = +e.target.value; A.saveSettings();
    });

    let showTr = false;
    $("#trDlg", main).addEventListener("click", () => {
      showTr = !showTr;
      $$(".dlg-ru", main).forEach(x => x.classList.toggle("hidden", !showTr));
      $("#trDlg", main).innerHTML = `${icon(showTr ? "eyeOff" : "eye", "sm")}${showTr ? "Скрыть перевод" : "Перевод"}`;
    });

    const highlight = el => { $$(".dlg-line", main).forEach(x => x.classList.remove("playing")); if (el) el.classList.add("playing"); };
    const highlightReset = () => $$(".dlg-line", main).forEach(x => x.classList.remove("playing", "repeat-now"));
    const lineEl = i => $(`.dlg-line[data-i="${i}"]`, main);

    $("#playAll", main).addEventListener("click", () => {
      TTS.stop();
      highlightReset();
      const lines = d.lines.map((l, i) => ({ text: l.fr, i }));
      TTS.speakLines(lines, {
        rate: +rateSlider.value,
        onLine: ln => { if (!alive) return; highlight(lineEl(lines.indexOf(ln))); },
        onDone: () => { if (alive) highlightReset(); }
      });
      Activity.bump("dialogue_play");
    });

    $("#shadowBtn", main).addEventListener("click", async () => {
      TTS.stop();
      const rate = +rateSlider.value;
      for (let i = 0; i < d.lines.length; i++) {
        if (!alive) return;
        const line = d.lines[i];
        const el = lineEl(i);
        if (!el) return;
        highlight(el);
        await TTS.speak(line.fr, { rate }).catch(() => { });
        if (!alive) return;
        el.classList.add("repeat-now");
        Activity.bump("shadow");
        await new Promise(res => setTimeout(res, Math.max(1600, line.fr.length * 55)));
        if (!alive) return;
        el.classList.remove("repeat-now");
        await TTS.speak(line.fr, { rate }).catch(() => { });
        await new Promise(res => setTimeout(res, 400));
      }
      if (alive) highlightReset();
    });

    $("#stopBtn", main).addEventListener("click", () => { TTS.stop(); highlightReset(); });
  }

  /* ================= ИДИОМЫ ================= */

  A.screens.idioms = () => {
    const main = A.main;
    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Idiomes & proverbes",
      title: "Идиомы и <em>пословицы</em>",
      lead: `${DB.idioms.length} выражений с дословным переводом: так французский язык думает и шутит.`,
      actions: `<button class="btn btn--primary" type="button" id="idiomQuiz">${icon("target", "sm")}Викторина</button>`
    })}
      <div class="vtoolbar">
        <div class="search">
          <span class="search__ico">${icon("search", "sm")}</span>
          <input class="input input--search" id="idSearch" type="search" placeholder="Поиск: chat, peur, камень…" aria-label="Поиск идиомы">
        </div>
        <div class="chips chips--scroll" id="idFilters">
          ${[["all", "Все"], ["proverbe", "Пословицы"], ["idiome", "Идиомы"], ["expression", "Разговорные"], ["fav", "Избранные"]]
      .map(([k, label], i) => `<button class="chip ${i === 0 ? "is-active" : ""}" type="button" data-f="${k}">${esc(label)}</button>`).join("")}
        </div>
      </div>
      <div class="row"><span class="vtoolbar__count" id="idCount"></span></div>
      <div id="idList" class="idioms" data-stagger=":scope > *"></div>
    </div>`;

    let filter = "all", q = "";
    const listBox = $("#idList", main);

    function draw() {
      const s = q.trim().toLowerCase();
      let its = DB.idioms;
      if (filter === "fav") its = its.filter(i => Activity.isFav("i", i.id));
      else if (filter !== "all") its = its.filter(i => i.t === filter);
      if (s) its = its.filter(i => i.fr.toLowerCase().includes(s) || i.ru.toLowerCase().includes(s) || i.lit.toLowerCase().includes(s));

      $("#idCount", main).textContent = `${its.length} ${pluralRu(its.length, "выражение", "выражения", "выражений")}`;
      if (!its.length) {
        listBox.innerHTML = A.emptyState({
          icon: filter === "fav" ? "heart" : "search",
          title: filter === "fav" ? "В избранном пока пусто" : "Ничего не найдено",
          text: filter === "fav" ? "Нажмите на сердечко на карточке идиомы — она появится здесь." : "Попробуйте другой запрос или снимите фильтр."
        });
        return;
      }
      listBox.innerHTML = its.map(i => {
        const kind = i.t === "proverbe" ? "пословица" : i.t === "idiome" ? "идиома" : "формула";
        const fav = Activity.isFav("i", i.id);
        return `<article class="idiom">
          <div class="idiom__top">
            ${lvlBadge(i.lv)}<span class="ctx">${esc(kind)}</span>
            <span class="spacer"></span>
            <button class="fav ${fav ? "is-on" : ""}" type="button" data-fav="${esc(i.id)}" aria-label="В избранное" aria-pressed="${fav}">${icon("heart", "sm")}</button>
          </div>
          <div class="idiom__fr">${spkBtn(i.fr)}<span>${esc(i.fr)}</span></div>
          <div class="idiom__lit">буквально: ${esc(i.lit)}</div>
          <div class="idiom__ru">${esc(i.ru)}</div>
          ${i.ex ? `<div class="idiom__ex">${spkBtn(i.ex)}<span>${esc(i.ex)}</span></div>` : ""}
        </article>`;
      }).join("");

      $$("[data-fav]", listBox).forEach(b => b.addEventListener("click", () => {
        const on = Activity.favToggle("i", b.dataset.fav);
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", String(on));
        UI.haptic(on ? 12 : 6);
        if (filter === "fav" && !on) draw();
      }));
    }

    draw();
    $("#idSearch", main).addEventListener("input", e => { q = e.target.value; draw(); });
    $$("#idFilters .chip", main).forEach(b => b.addEventListener("click", () => {
      $$("#idFilters .chip", main).forEach(x => x.classList.remove("is-active"));
      b.classList.add("is-active"); filter = b.dataset.f; draw();
    }));
    $("#idiomQuiz", main).addEventListener("click", () => {
      const pool = filter === "all" || filter === "fav" ? DB.idioms : DB.idioms.filter(i => i.t === filter);
      A.openSession(shuffle(pool).slice(0, 12).map(EX.qIdiomChoice).filter(Boolean), "Викторина идиом");
    });
  };

  /* ================= ФОНЕТИКА ================= */

  A.screens.phon = () => {
    const main = A.main;
    const ph = DB.phonetics;

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Phonétique",
      title: "Звуки и <em>ритм</em> речи",
      lead: "Звуки с подсказками для русскоязычных, правила чтения и связывания, минимальные пары и скороговорки на три скорости.",
      actions: `<span class="pill">${icon("wave", "xs")}${ph.sounds.length} звуков</span>`
    })}
      <div class="tabs" id="phTabs" role="tablist">
        <button class="tab is-active" type="button" role="tab" data-p="sounds">Звуки</button>
        <button class="tab" type="button" role="tab" data-p="rules">Правила чтения</button>
        <button class="tab" type="button" role="tab" data-p="pairs">Минимальные пары</button>
        <button class="tab" type="button" role="tab" data-p="twisters">Скороговорки</button>
      </div>
      <div id="phBox"></div>
    </div>`;

    const box = $("#phBox", main);
    function draw(p) {
      Activity.bump("phon");
      if (p === "sounds") {
        box.innerHTML = `<p class="ctx" style="margin-bottom:14px">Нажмите на звук, затем на примеры и повторяйте вслух, сравнивая звучание.</p>
          <div class="sounds" data-stagger=":scope > *">${ph.sounds.map(s => `
            <article class="sound">
              <div class="sound__top">
                <div class="sound__sym">${esc(s.sym)}</div>
                <div class="col" style="gap:4px;flex:1;min-width:0">
                  <div class="sound__ru">${esc(s.ru)}</div>
                  ${spkBtn(s.ex[0][0])}
                </div>
              </div>
              <div class="sound__tip">${esc(s.tip)}</div>
              <div class="chips">${s.ex.map(e => `<button class="chip" type="button" data-say="${esc(e[0])}" data-rate="0.8">${esc(e[0])} <span class="ctx">[${esc(e[1])}] ${esc(e[2])}</span></button>`).join("")}</div>
            </article>`).join("")}</div>`;
      } else if (p === "rules") {
        box.innerHTML = `<div class="stack" data-stagger=":scope > *">${ph.rules.map(r => `
          <article class="card">
            <div class="row" style="gap:10px;margin-bottom:8px">${icon("braces", "sm")}<h2 class="h2">${esc(r.title)}</h2></div>
            <p class="lead" style="margin-bottom:12px">${esc(r.text)}</p>
            <div class="chips">${r.ex.map(e => `<button class="chip" type="button" data-say="${esc(e.replace(/\s*\[[^\]]*\]\s*/g, ""))}" data-rate="0.8">${esc(e)}</button>`).join("")}</div>
          </article>`).join("")}</div>`;
      } else if (p === "pairs") {
        box.innerHTML = `<p class="ctx" style="margin-bottom:14px">Пары слов, различающиеся одним звуком. Слушайте обе и повторяйте — это тренировка слуха.</p>
          <div class="pairs" data-stagger=":scope > *">${ph.pairs.map(p2 => `
            <article class="pair">
              <div class="pair__side">
                <button class="btn btn--sm btn--ghost" type="button" data-say="${esc(p2[0])}" data-rate="0.8">${icon("volume", "xs")}${esc(p2[0])}</button>
                <span class="pair__r">${esc(p2[2])}</span>
              </div>
              <span class="pair__vs">или</span>
              <div class="pair__side">
                <button class="btn btn--sm btn--ghost" type="button" data-say="${esc(p2[1])}" data-rate="0.8">${icon("volume", "xs")}${esc(p2[1])}</button>
                <span class="pair__r">${esc(p2[3])}</span>
              </div>
            </article>`).join("")}</div>`;
      } else {
        box.innerHTML = `<p class="ctx" style="margin-bottom:14px">Сначала медленно, затем в нормальном темпе. Записывайте себя и сравнивайте с диктором.</p>
          <div class="stack" data-stagger=":scope > *">${ph.twisters.map(t => `
            <article class="card">
              <div class="idiom__fr" style="font-size:clamp(1.2rem,5vw,1.6rem)">${spkBtn(t.fr)}<span>${esc(t.fr)}</span></div>
              <div class="idiom__ru">${esc(t.ru)}</div>
              <div class="chips" style="margin-top:12px">
                <button class="chip" type="button" data-say="${esc(t.fr)}" data-rate="0.55">${icon("clock", "xs")}медленно</button>
                <button class="chip" type="button" data-say="${esc(t.fr)}" data-rate="0.8">${icon("wave", "xs")}средне</button>
                <button class="chip" type="button" data-say="${esc(t.fr)}" data-rate="1.05">${icon("bolt", "xs")}быстро</button>
                <span class="ctx" style="align-self:center">фокус: ${esc(t.focus)} · ${esc(t.lv)}</span>
              </div>
            </article>`).join("")}</div>`;
      }
      UI.revealAll(box);
    }

    draw("sounds");
    $$("#phTabs .tab", main).forEach(b => b.addEventListener("click", () => {
      $$("#phTabs .tab", main).forEach(x => x.classList.remove("is-active"));
      b.classList.add("is-active");
      draw(b.dataset.p);
    }));
  };

  /* ================= МЕТОДИКА ================= */

  A.screens.method = () => {
    const main = A.main;
    const m = DB.methodology;

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Méthode",
      title: "На чём построено <em>обучение</em>",
      lead: "Техники с доказанной эффективностью, готовые планы занятий и библиотека проверенных ресурсов."
    })}
      <article class="lesson">${md(m.intro)}</article>
      <div class="tabs" id="mTabs" role="tablist">
        <button class="tab is-active" type="button" role="tab" data-m="tech">Техники · ${m.techniques.length}</button>
        <button class="tab" type="button" role="tab" data-m="plans">Планы занятий</button>
        <button class="tab" type="button" role="tab" data-m="res">Учебники и ресурсы</button>
      </div>
      <div id="mBox"></div>
    </div>`;

    const box = $("#mBox", main);
    function draw(p) {
      if (p === "tech") {
        box.innerHTML = `<div class="stack" data-stagger=":scope > *">${m.techniques.map((t, i) => `
          <article class="card tech">
            <div class="tech__head">
              <span class="unit__n">${pad2(i + 1)}</span>
              <div class="col" style="gap:3px;flex:1;min-width:0">
                <h2 class="tech__t">${esc(t.title)}</h2>
                <span class="tech__ru">${esc(t.ru)} · ${esc(t.level)}</span>
              </div>
            </div>
            <div class="tech__text">${md(t.text)}</div>
            <ul class="tech__tips">${t.tips.map(x => `<li>${icon("check", "xs")}<span>${esc(x)}</span></li>`).join("")}</ul>
          </article>`).join("")}</div>`;
      } else if (p === "plans") {
        box.innerHTML = `<div class="stack" data-stagger=":scope > *">${m.plans.map(pl => `
          <article class="card">
            <div class="row" style="gap:10px;margin-bottom:6px;flex-wrap:wrap">
              <h2 class="h2">${esc(pl.title)}</h2>
              ${pl.minutes ? pill(pl.minutes + " мин/день", "accent", "clock") : ""}
            </div>
            <div class="ctx" style="margin-bottom:12px">${esc(pl.forWhom)}</div>
            <div class="tbl-wrap"><table class="md-tbl">
              <tr><th>Блок</th><th>Мин.</th><th>Что делать</th></tr>
              ${pl.schedule.map(s => `<tr><td><b>${esc(s.block)}</b></td><td>${esc(s.minutes || "—")}</td><td>${esc(s.what)}</td></tr>`).join("")}
            </table></div>
          </article>`).join("")}</div>`;
      } else {
        box.innerHTML = `<div class="stack" data-stagger=":scope > *">${m.resources.map(c => `
          <article class="card">
            <div class="row" style="gap:10px;margin-bottom:10px">${icon("library", "sm")}<h2 class="h2">${esc(c.cat)}</h2></div>
            ${c.items.map(i => `<div class="res__item">
              <div class="res__t"><span class="res__n">${esc(i.name)}</span>${lvlBadge(i.level)}</div>
              <div class="ctx">${esc(i.type)}${i.note ? " · " + esc(i.note) : ""}</div>
            </div>`).join("")}
          </article>`).join("")}</div>`;
      }
      UI.revealAll(box);
    }
    draw("tech");
    $$("#mTabs .tab", main).forEach(b => b.addEventListener("click", () => {
      $$("#mTabs .tab", main).forEach(x => x.classList.remove("is-active"));
      b.classList.add("is-active");
      draw(b.dataset.m);
    }));
  };
})();
