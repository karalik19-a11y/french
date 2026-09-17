// Экраны практики: тренажёр и колода карточек (свайп-физика)
"use strict";
(() => {
  const A = window.App;

  /* ---------- Очереди карточек (логика из прежней версии) ---------- */

  function dueQueue(limit) {
    const keys = shuffle(SRS.dueKeys()).slice(0, limit);
    const qs = [];
    for (const k of keys) {
      if (k.startsWith("v:")) {
        const w = k.slice(2);
        const e = DB.vocab.find(x => norm(x.f) === w) || DB.vocab.find(x => x.f.toLowerCase() === w);
        if (!e) continue;
        const gens = [() => EX.qVocabChoiceFR(e), () => EX.qVocabChoiceRU(e), () => EX.qVocabInput(e), () => EX.qVocabListen(e)];
        for (const g of shuffle(gens)) { const q = g(); if (q) { qs.push(q); break; } }
      } else if (k.startsWith("i:")) {
        const it = DB.idioms.find(x => x.id === k.slice(2));
        const q = it && EX.qIdiomChoice(it); if (q) qs.push(q);
      } else if (k.startsWith("g:")) {
        const [, lid, qp] = k.split(":");
        const les = DB.grammar.find(x => x.id === lid);
        if (!les) continue;
        const gq = les.quiz.find(q => q.t === "c" && norm(q.q).slice(0, 20) === qp);
        const q = gq && EX.qFromQuiz(gq, lid); if (q) qs.push(q);
      }
    }
    return qs;
  }

  function newQueue(n) {
    const lvSel = store.get("newLevels", "all");
    const levels = lvSel === "all" ? ["A1", "A2", "B1", "B2", "C1"] : [lvSel];
    const fresh = DB.vocab.filter(e => levels.includes(e.l) && SRS.isNew("v:" + e.f.toLowerCase()));
    const picked = shuffle(fresh).slice(0, n);
    const qs = [];
    for (const e of picked) {
      const q1 = EX.qVocabChoiceFR(e); if (q1) qs.push(q1);
      const q2 = Math.random() < 0.5 ? EX.qVocabChoiceRU(e) : EX.qVocabInput(e);
      if (q2) qs.push(q2);
    }
    return qs;
  }

  /* ================= ТРЕНАЖЁР ================= */

  A.screens.trainer = (args) => {
    if (args && args[0]) return A.screens.cards(args);
    const main = A.main;
    const s = A.settings;
    const st = SRS.todayStats();
    const mat = SRS.maturity();
    const goalPct = pctOf(st.rev + st.new, Math.max(1, s.dailyGoal));
    const newLevels = store.get("newLevels", "all");
    const freshCount = DB.vocab.filter(e => (newLevels === "all" || e.l === newLevels) && SRS.isNew("v:" + e.f.toLowerCase())).length;

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Révision · SM-2",
      title: "Тренажёр <em>памяти</em>",
      lead: "Интервальное повторение: карточка возвращается прямо перед забыванием. Оценки «забыл / трудно / хорошо / легко» меняют интервал."
    })}

      <section class="card card--hero hero" style="gap:18px">
        <div class="hero__glow" aria-hidden="true"></div>
        <div class="hero__top">
          ${ring(goalPct, { size: 96, w: 7, cls: goalPct >= 100 ? "ok" : "", num: st.due || st.rev + st.new, cap: st.due ? "к повтору" : "сегодня", delay: 1 })}
          <div class="hero__info">
            <span class="eyebrow eyebrow--gold">Ваша сессия</span>
            <h2 class="hero__t">${st.due > 0 ? `${st.due} <em>карточек</em> ждут` : goalPct >= 100 ? `Цель дня <em>выполнена</em>` : `Просроченного <em>нет</em>`}</h2>
            <p class="hero__s">${st.due > 0
        ? `Повторение займёт примерно ${Math.max(3, Math.round(st.due * 0.22))} минут.`
        : freshCount ? `Доступно ${fmtNum(freshCount)} новых слов — можно двигаться вперёд.` : "Новых слов по выбранному уровню не осталось."}</p>
          </div>
        </div>
        <div class="btn-row btn-row--stretch">
          <button class="btn btn--primary btn--lg" type="button" id="btnCards">${icon("cards", "sm")}Карточки${st.due ? ` · ${st.due}` : ""}</button>
          <button class="btn btn--ghost btn--lg" type="button" id="btnDue">${icon("pen", "sm")}Упражнениями</button>
        </div>
        <div class="btn-row btn-row--stretch">
          <button class="btn btn--gold btn--lg" type="button" id="btnNew">${icon("sparkles", "sm")}Новые слова · ${s.newPerDay}</button>
          <a class="btn btn--ghost btn--lg" href="#/vocab">${icon("book", "sm")}Словарь</a>
        </div>
        <div class="hero__meta">
          <div class="hero__meta-item"><span class="hero__meta-num" data-count="${st.rev}">0</span><span class="hero__meta-cap">повторено</span></div>
          <div class="hero__meta-item"><span class="hero__meta-num" data-count="${st.new}">0</span><span class="hero__meta-cap">новых</span></div>
          <div class="hero__meta-item"><span class="hero__meta-num" data-count="${mat.total}">0</span><span class="hero__meta-cap">в системе</span></div>
          <div class="hero__meta-item"><span class="hero__meta-num" data-count="${mat.pct}">0</span><span class="hero__meta-cap">% зрелых</span></div>
        </div>
      </section>

      <section class="sec">
        ${A.secHead({ eyebrow: "Entraînements rapides", title: "Быстрые <em>тренировки</em>" })}
        <div class="tiles" data-stagger=":scope > *">
          ${[
      { k: "vocab-all", fr: "Mots mêlés", ru: "Слова вперемешку", ico: "shuffle", note: "15 карточек всех уровней" },
      { k: "verbs-pres", fr: "Présent", ru: "Глаголы: présent", ico: "bookOpen", note: "12 вопросов" },
      { k: "verbs-pc", fr: "Passé composé", ru: "Глаголы: passé composé", ico: "bookOpen", note: "12 вопросов" },
      { k: "verbs-mix", fr: "Temps mêlés", ru: "Глаголы: микс времён", ico: "dice", note: "уровень B2" },
      { k: "idioms", fr: "Idiomes", ru: "Идиомы", ico: "quote", note: "12 выражений" },
      { k: "listen", fr: "Écoute", ru: "Аудирование слов", ico: "headphones", note: "на слух, A1–A2" }
    ].map(t => `<button class="tile" type="button" data-quick="${t.k}">
              <span class="tile__ico">${icon(t.ico)}</span>
              <span class="tile__body">
                <span class="tile__fr">${esc(t.fr)}</span>
                <span class="tile__title">${esc(t.ru)}</span>
                <span class="tile__sub">${esc(t.note)}</span>
              </span>
              <span class="tile__end">${icon("play", "sm")}</span>
            </button>`).join("")}
        </div>
      </section>

      <section class="sec">
        ${A.secHead({ eyebrow: "Réglages", title: "Новые слова" })}
        <div class="list">
          <div class="list__row">
            <span class="list__ico">${icon("sparkles", "sm")}</span>
            <span class="list__main">
              <span class="list__t">Новых карточек в день</span>
              <span class="list__s">Больше 20 — накапливается «снежный ком» повторов</span>
            </span>
            <span class="list__end">
              <select class="select" id="newPerDay" aria-label="Новых карточек в день">
                ${[5, 10, 15, 20, 30].map(n => `<option ${s.newPerDay === n ? "selected" : ""}>${n}</option>`).join("")}
              </select>
            </span>
          </div>
          <div class="list__row">
            <span class="list__ico">${icon("filter", "sm")}</span>
            <span class="list__main">
              <span class="list__t">Какой уровень учить</span>
              <span class="list__s">Доступно новых: ${fmtNum(freshCount)}</span>
            </span>
            <span class="list__end">
              <select class="select" id="newLevels" aria-label="Уровень новых слов">
                ${["A1", "A2", "B1", "B2", "C1", "all"].map(l => `<option value="${l}" ${newLevels === l ? "selected" : ""}>${l === "all" ? "Все" : l}</option>`).join("")}
              </select>
            </span>
          </div>
          <div class="list__row">
            <span class="list__ico">${icon("target", "sm")}</span>
            <span class="list__main">
              <span class="list__t">Дневная цель</span>
              <span class="list__s">Карточек в день: повторения + новые</span>
            </span>
            <span class="list__end">
              <select class="select" id="setGoal" aria-label="Дневная цель">
                ${[10, 15, 20, 30, 50].map(n => `<option ${s.dailyGoal === n ? "selected" : ""}>${n}</option>`).join("")}
              </select>
            </span>
          </div>
        </div>
      </section>

      <div class="notice notice--info">
        <span class="notice__ico">${icon("info", "sm")}</span>
        <span><b>Как оценивать.</b> «Забыл» вернёт карточку через 10 минут, «Трудно» — примерно через день, «Хорошо» удлинит интервал по алгоритму SM-2, «Легко» — сильнее. В колоде оценки можно ставить свайпом: влево — забыл, вправо — хорошо, вверх — легко.</span>
      </div>
    </div>`;

    $$("[data-count]", main).forEach(el => UI.countUp(el, Number(el.dataset.count) || 0));

    $("#btnCards", main).addEventListener("click", () => {
      if (st.due > 0) A.navigate("#/cards/due");
      else A.navigate("#/cards/new");
    });
    $("#btnDue", main).addEventListener("click", () => {
      const qs = dueQueue(40);
      if (!qs.length) {
        UI.toast({ title: "Просроченных карточек нет", sub: "Выучите новые слова или пройдите тренировку", kind: "ok", icon: "check" });
        return;
      }
      A.openSession(qs, "Повторение");
    });
    $("#btnNew", main).addEventListener("click", () => {
      if (!freshCount) {
        UI.toast({ title: "Новых слов не осталось", sub: "Повторите старые или расширьте уровень в настройках ниже", kind: "bad", icon: "alert" });
        return;
      }
      A.navigate("#/cards/new");
    });
    $$("[data-quick]", main).forEach(b => b.addEventListener("click", () => {
      const k = b.dataset.quick;
      let qs = [];
      let title = $(".tile__title", b).textContent;
      if (k === "vocab-all") qs = EX.sessionVocab(["A1", "A2", "B1", "B2", "C1"], null, 15);
      if (k === "verbs-pres") qs = EX.sessionVerbs([], ["présent"], 12);
      if (k === "verbs-pc") qs = EX.sessionVerbs([], ["passé composé"], 12);
      if (k === "verbs-mix") qs = EX.sessionVerbs([], A.tensesForLevel("B2"), 12);
      if (k === "idioms") qs = shuffle(DB.idioms).slice(0, 12).map(EX.qIdiomChoice).filter(Boolean);
      if (k === "listen") qs = shuffle(DB.vocab.filter(e => e.l === "A1" || e.l === "A2")).slice(0, 12).map(EX.qVocabListen).filter(Boolean);
      A.openSession(qs, title);
    }));

    $("#newPerDay", main).addEventListener("change", e => { A.settings.newPerDay = +e.target.value; A.saveSettings(); A.refresh(); A.router(); });
    $("#newLevels", main).addEventListener("change", e => { store.set("newLevels", e.target.value); A.router(); });
    $("#setGoal", main).addEventListener("change", e => { A.settings.dailyGoal = +e.target.value; A.saveSettings(); A.router(); });
  };

  /* ================= КОЛОДА КАРТОЧЕК ================= */

  function vocabByKey(key) {
    const w = key.slice(2);
    return DB.vocab.find(x => x.f.toLowerCase() === w) || DB.vocab.find(x => norm(x.f) === w);
  }

  // Модель карточки из SRS-ключа или словарной статьи
  function modelFromVocab(e, isNew) {
    return {
      key: "v:" + e.f.toLowerCase(), isNew: !!isNew, tts: e.f,
      front: { word: e.f, ipa: e.ip ? "/" + e.ip + "/" : "", tags: [e.l, e.t].filter(Boolean), g: e.g },
      back: { main: e.r, ex: e.ef || "", exRu: e.er || "", tags: [e.g ? "род: " + e.g : ""].filter(Boolean) },
      ref: e, type: "vocab"
    };
  }
  function modelFromKey(k) {
    if (k.startsWith("v:")) {
      const e = vocabByKey(k);
      return e ? modelFromVocab(e, false) : null;
    }
    if (k.startsWith("i:")) {
      const it = DB.idioms.find(x => x.id === k.slice(2));
      if (!it) return null;
      return {
        key: k, isNew: false, tts: it.fr, type: "idiom", ref: it,
        front: { word: it.fr, ipa: "", tags: [it.lv, it.t === "proverbe" ? "пословица" : it.t === "idiome" ? "идиома" : "формула"], small: true },
        back: { main: it.ru, ex: it.ex || "", exRu: "", tags: ["буквально: " + it.lit] }
      };
    }
    if (k.startsWith("g:")) {
      const [, lid, qp] = k.split(":");
      const les = DB.grammar.find(x => x.id === lid);
      if (!les) return null;
      const gq = les.quiz.find(q => q.t === "c" && norm(q.q).slice(0, 20) === qp);
      if (!gq) return null;
      return {
        key: k, isNew: false, tts: "", type: "grammar", ref: gq,
        front: { word: gq.q, ipa: "", tags: [les.lv, "грамматика"], small: true },
        back: { main: gq.o[gq.a], ex: "", exRu: "", tags: gq.e ? [gq.e] : [] }
      };
    }
    return null;
  }

  function buildDeck(mode, arg, limit) {
    if (mode === "new") {
      const lvSel = store.get("newLevels", "all");
      const levels = lvSel === "all" ? ["A1", "A2", "B1", "B2", "C1"] : [lvSel];
      const fresh = DB.vocab.filter(e => levels.includes(e.l) && SRS.isNew("v:" + e.f.toLowerCase()));
      return shuffle(fresh).slice(0, limit).map(e => modelFromVocab(e, true)).filter(Boolean);
    }
    if (mode === "fav") {
      const ids = Activity.favList("v");
      const cards = ids.map(f => {
        const e = DB.vocab.find(x => x.f.toLowerCase() === String(f).toLowerCase());
        return e ? modelFromVocab(e, SRS.isNew("v:" + e.f.toLowerCase())) : null;
      }).filter(Boolean);
      const idioms = Activity.favList("i").map(id => modelFromKey("i:" + id)).filter(Boolean);
      return shuffle([...cards, ...idioms]).slice(0, limit);
    }
    if (mode === "lvl") {
      const lv = String(arg || "A1").replace("+", "");
      const pool = DB.vocab.filter(e => e.l === lv);
      const due = pool.filter(e => SRS.isDue("v:" + e.f.toLowerCase()));
      const fresh = pool.filter(e => SRS.isNew("v:" + e.f.toLowerCase()));
      const rest = pool.filter(e => !due.includes(e) && !fresh.includes(e));
      return shuffle([...due, ...fresh]).concat(shuffle(rest)).slice(0, limit)
        .map(e => modelFromVocab(e, SRS.isNew("v:" + e.f.toLowerCase())));
    }
    if (mode === "theme") {
      const pool = DB.vocab.filter(e => e.t === String(arg || ""));
      return shuffle(pool).slice(0, limit).map(e => modelFromVocab(e, SRS.isNew("v:" + e.f.toLowerCase())));
    }
    // due — по умолчанию
    const keys = shuffle(SRS.dueKeys()).slice(0, limit);
    return keys.map(modelFromKey).filter(Boolean);
  }

  const GRADES = [
    { r: 0, cls: "bad", fr: "Encore", ru: "Забыл", dir: "left", ico: "refresh" },
    { r: 1, cls: "hard", fr: "Difficile", ru: "Трудно", dir: "left", ico: "minus" },
    { r: 2, cls: "good", fr: "Bien", ru: "Хорошо", dir: "right", ico: "check" },
    { r: 3, cls: "easy", fr: "Facile", ru: "Легко", dir: "up", ico: "bolt" }
  ];

  A.screens.cards = (args) => {
    let mode = args && args[0] ? args[0] : "due";
    const arg = args && args[1] ? args[1] : null;
    const main = A.main;
    const limit = mode === "new" ? Math.max(4, A.settings.newPerDay) : 40;
    let deck = buildDeck(mode, arg, limit);

    const titles = {
      due: ["Cartes à réviser", "Повторение"],
      new: ["Nouveaux mots", "Новые слова"],
      fav: ["Favoris", "Избранные карточки"],
      lvl: [`Niveau ${arg || ""}`, `Слова уровня ${arg || ""}`],
      theme: [arg || "", "Тематическая колода"]
    };
    let [frTitle, ruTitle] = titles[mode] || titles.due;

    // Повторять нечего — мягко переключаемся на новые слова, чтобы колода не была пустой
    let fellBack = false;
    if (!deck.length && mode === "due") {
      const fresh = buildDeck("new", null, Math.max(4, A.settings.newPerDay));
      if (fresh.length) {
        deck = fresh;
        mode = "new";
        [frTitle, ruTitle] = titles.new;
        fellBack = true;
      }
    }

    if (!deck.length) {
      main.innerHTML = `<div class="screen">
        ${A.screenHead({ back: "#/trainer", backLabel: "Тренажёр", eyebrow: "Révision", title: ruTitle })}
        ${A.emptyState({
        icon: mode === "fav" ? "heart" : "check",
        title: mode === "due" ? "Повторять нечего" : mode === "fav" ? "В избранном пусто" : "Карточки закончились",
        text: mode === "due" ? "Все карточки в порядке — следующие вернутся позже. Можно выучить новые слова."
          : mode === "fav" ? "Добавляйте слова и идиомы в избранное нажатием на сердечко — они соберутся в отдельную колоду."
            : "Для этого фильтра нет карточек. Выберите другой уровень или выучите новые слова.",
        action: `<div class="btn-row" style="margin-top:10px">
            <a class="btn btn--primary" href="#/cards/new">${icon("sparkles", "sm")}Новые слова</a>
            <a class="btn btn--ghost" href="#/trainer">${icon("cards", "sm")}В тренажёр</a>
          </div>`
      })}
      </div>`;
      return;
    }

    UI.focusMode(true);
    main.innerHTML = `<div class="screen">
      <div class="session" style="max-width:520px">
        <div class="ex__top">
          <button class="btn btn--quiet btn--icon btn--sm" type="button" id="deckExit" aria-label="Завершить">${icon("x", "sm")}</button>
          <div class="ex__bar">${bar(0, { instant: true, cls: "gold", aria: "Прогресс колоды" })}</div>
          <div class="ex__count" id="deckCount">1/${deck.length}</div>
        </div>
        <div class="ex__title">${esc(frTitle)}</div>
        ${fellBack ? `<div class="ctx" style="text-align:center;margin:-6px 0 2px">Повторять нечего — берём новые слова</div>` : ""}
        <div class="deck">
          <div class="deck__stage" id="stage"></div>
          <div class="deck__actions" id="grades"></div>
          <div class="ctx center" id="deckHint">Тап — перевернуть · свайп влево — забыл, вправо — хорошо, вверх — легко</div>
        </div>
      </div>
    </div>`;

    const stage = $("#stage", main);
    const gradesBox = $("#grades", main);
    const countEl = $("#deckCount", main);
    const barFill = $(".ex__bar .bar__fill", main);
    let pos = 0;
    const tally = { 0: 0, 1: 0, 2: 0, 3: 0 };

    function cardHTML(m, i) {
      const f = m.front, b = m.back;
      const fav = m.type === "vocab" ? Activity.isFav("v", f.word.toLowerCase()) : m.type === "idiom" ? Activity.isFav("i", m.ref.id) : false;
      return `<div class="fc" data-idx="${i}" style="z-index:${30 - i}">
        <div class="fc__flip">
          <div class="fc__face fc__face--front">
            <span class="fc__verdict fc__verdict--left">encore</span>
            <span class="fc__verdict fc__verdict--right">je sais</span>
            <span class="fc__verdict fc__verdict--up">facile</span>
            <div class="fc__top">
              ${f.tags.map(t => lvlBadge(t)).join("")}
              <span class="spacer"></span>
              ${fav ? `<span style="color:var(--gold)">${icon("heart", "sm")}</span>` : ""}
              ${m.tts ? spkBtn(m.tts) : ""}
            </div>
            <div class="fc__mid">
              <div class="fc__word ${f.small || f.word.length > 26 ? "fc__word--sm" : ""}">${esc(f.word)}</div>
              ${f.ipa ? `<div class="fc__ipa">${esc(f.ipa)}</div>` : ""}
            </div>
            <div class="fc__foot">
              <span class="fc__hint">${m.isNew ? "nouveau mot" : "à réviser"}</span>
              <span class="fc__hint">нажмите, чтобы перевернуть</span>
            </div>
            ${ICONS.ornament()}
          </div>
          <div class="fc__face fc__face--back">
            <div class="fc__top">
              ${lvlBadge("ответ")}
              <span class="spacer"></span>
              ${m.tts ? spkBtn(m.tts) : ""}
            </div>
            <div class="fc__mid">
              <div class="fc__ru">${esc(b.main)}</div>
              ${b.tags && b.tags.length ? `<div class="ctx" style="max-width:34ch">${esc(b.tags.join(" · "))}</div>` : ""}
              ${b.ex ? `<div class="fc__ex">«${esc(b.ex)}»${b.exRu ? `<div class="fc__ex-ru">${esc(b.exRu)}</div>` : ""}</div>` : ""}
            </div>
            <div class="fc__foot">
              <span class="fc__hint">оцените карточку</span>
              <a class="fc__hint" href="${m.type === "vocab" ? "#/vocab/" + encodeURIComponent(f.word) : m.type === "idiom" ? "#/idioms" : "#/grammar"}" style="text-decoration:underline">подробнее</a>
            </div>
          </div>
        </div>
      </div>`;
    }

    function renderStack() {
      const slice = deck.slice(pos, pos + 3);
      stage.innerHTML = slice.map((m, i) => cardHTML(m, i)).join("");
      const cards = $$(".fc", stage);
      cards.forEach((c, i) => {
        c.dataset.pos = String(i);
        if (i === 1) {
          c.style.transform = "translate3d(0,14px,0) scale(.955)";
          c.style.opacity = ".72";
          c.style.filter = "blur(1.2px)";
          c.style.pointerEvents = "none";
        } else if (i === 2) {
          c.style.transform = "translate3d(0,26px,0) scale(.915)";
          c.style.opacity = ".42";
          c.style.filter = "blur(2.4px)";
          c.style.pointerEvents = "none";
        }
      });
      if (cards[0]) {
        bindCard(cards[0]);
        cards[0].classList.add("is-promoted");
        setTimeout(() => cards[0].classList.remove("is-promoted"), 380);
      }
      countEl.textContent = `${Math.min(pos + 1, deck.length)}/${deck.length}`;
      barFill.style.setProperty("--val", String(deck.length ? pos / deck.length : 0));
      renderGrades();
      if (!slice.length) finish();
    }

    function renderGrades() {
      const m = deck[pos];
      if (!m) { gradesBox.innerHTML = ""; return; }
      gradesBox.innerHTML = GRADES.map(g => `
        <button class="grade grade--${g.cls}" type="button" data-r="${g.r}" aria-label="${esc(g.ru)}">
          <span class="grade__t">${esc(g.ru)}</span>
          <span class="grade__iv">${esc(SRS.preview(m.key, g.r))}</span>
        </button>`).join("");
      $$("[data-r]", gradesBox).forEach(b => b.addEventListener("click", () => gradeCard(+b.dataset.r)));
    }

    function gradeCard(r, dir) {
      const m = deck[pos];
      if (!m) return;
      const g = GRADES.find(x => x.r === r) || GRADES[2];
      tally[r] = (tally[r] || 0) + 1;
      SRS.grade(m.key, r, m.isNew);
      if (r === 0) {
        // «Забыл» — карточка вернётся в конец этой колоды
        deck.push({ ...m, isNew: false });
      }
      UI.haptic(r === 0 ? [12, 34, 12] : r === 3 ? 16 : 10);
      flyOut(g.dir || dir || (r >= 2 ? "right" : "left"), () => {
        pos++;
        renderStack();
        A.updateBadges();
      });
    }

    function flyOut(dir, done) {
      const card = $(".fc[data-pos='0']", stage);
      if (!card) { done(); return; }
      card.classList.add("is-out");
      const dx = dir === "left" ? -window.innerWidth * 0.8 : dir === "right" ? window.innerWidth * 0.8 : 0;
      const dy = dir === "up" ? -window.innerHeight * 0.85 : 24;
      const rot = dir === "left" ? -22 : dir === "right" ? 22 : -6;
      card.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${rot}deg) scale(.94)`;
      card.style.opacity = "0";
      card.style.filter = "blur(6px)";
      // Остальные карты подъезжают ближе
      const next1 = $(".fc[data-pos='1']", stage);
      const next2 = $(".fc[data-pos='2']", stage);
      if (next1) { next1.style.transform = ""; next1.style.opacity = ""; next1.style.filter = ""; }
      if (next2) { next2.style.transform = "translateY(14px) scale(.955)"; next2.style.opacity = ".72"; next2.style.filter = "blur(1.2px)"; }
      setTimeout(done, UI.prefersReduced() ? 40 : 300);
    }

    function bindCard(card) {
      const flip = $(".fc__flip", card);
      let sx = 0, sy = 0, dx = 0, dy = 0, dragging = false, t0 = 0, flipped = false, moved = false;
      const TH = 96;

      const setVerdicts = () => {
        const left = clamp(-dx / TH, 0, 1);
        const right = clamp(dx / TH, 0, 1);
        const up = clamp(-dy / TH, 0, 1);
        card.classList.toggle("is-verdict", left > .35 || right > .35 || up > .5);
        const vl = $(".fc__verdict--left", card), vr = $(".fc__verdict--right", card), vu = $(".fc__verdict--up", card);
        if (vl) vl.style.opacity = String(left);
        if (vr) vr.style.opacity = String(right);
        if (vu) vu.style.opacity = String(up);
        if (vl) vl.style.transform = `scale(${0.82 + left * 0.18})`;
        if (vr) vr.style.transform = `scale(${0.82 + right * 0.18})`;
        if (vu) vu.style.transform = `scale(${0.82 + up * 0.18})`;
      };

      const onDown = ev => {
        if (ev.button != null && ev.button !== 0) return;
        if (closestOf(ev.target, "[data-say], a, button")) return;
        dragging = true; moved = false;
        sx = ev.clientX; sy = ev.clientY; dx = 0; dy = 0; t0 = performance.now();
        card.classList.remove("is-promoted");
        card.classList.add("is-drag");
        try { card.setPointerCapture(ev.pointerId); } catch (e) { }
      };
      const onMove = ev => {
        if (!dragging) return;
        dx = ev.clientX - sx; dy = ev.clientY - sy;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
        const rot = clamp(dx * 0.045, -18, 18);
        card.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${rot}deg)`;
        setVerdicts();
      };
      const onUp = () => {
        if (!dragging) return;
        dragging = false;
        card.classList.remove("is-drag");
        const dt = Math.max(1, performance.now() - t0);
        const vx = dx / dt;
        const decided = Math.abs(dx) > TH || Math.abs(vx) > 0.62 || (dy < -TH && Math.abs(dy) > Math.abs(dx));
        if (decided) {
          if (dy < -TH && Math.abs(dy) > Math.abs(dx)) { gradeCard(3, "up"); return; }
          gradeCard(dx > 0 ? 2 : 0, dx > 0 ? "right" : "left");
          return;
        }
        // Тап — переворот
        if (!moved && performance.now() - t0 < 420) {
          flipped = !flipped;
          card.classList.toggle("is-flipped", flipped);
          UI.haptic(5);
          return;
        }
        card.style.transform = "";
        setVerdicts();
        card.classList.remove("is-verdict");
      };

      card.addEventListener("pointerdown", onDown);
      // Движение и отпускание слушаем на окне: палец/курсор может уйти за пределы карты
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      card.dataset.bound = "1";
    }

    // Клавиатура
    const onKey = e => {
      if (!stage.isConnected) { document.removeEventListener("keydown", onKey); return; }
      const card = $(".fc[data-pos='0']", stage);
      if (!card) return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); card.classList.toggle("is-flipped"); return; }
      if (e.key === "1") gradeCard(0);
      if (e.key === "2") gradeCard(1);
      if (e.key === "3") gradeCard(2);
      if (e.key === "4") gradeCard(3);
      if (e.key === "ArrowLeft") gradeCard(0, "left");
      if (e.key === "ArrowRight") gradeCard(2, "right");
      if (e.key === "ArrowUp") gradeCard(3, "up");
      if (e.key === "Escape") exit();
    };
    document.addEventListener("keydown", onKey);

    function exit() {
      document.removeEventListener("keydown", onKey);
      UI.focusMode(false);
      A.router();
    }

    async function askExit() {
      const yes = await UI.confirm({
        title: "Завершить колоду?",
        text: `Оценено карточек: ${Object.values(tally).reduce((a, b) => a + b, 0)}. Прогресс уже сохранён.`,
        ok: "Завершить", cancel: "Продолжить"
      });
      if (yes) exit();
    }
    $("#deckExit", main).addEventListener("click", askExit);

    function finish() {
      document.removeEventListener("keydown", onKey);
      UI.focusMode(false);
      const done = Object.values(tally).reduce((a, b) => a + b, 0);
      const goodPct = done ? Math.round((tally[2] + tally[3]) / done * 100) : 0;
      main.innerHTML = `<div class="screen">
        <div class="session" style="max-width:520px">
          <div class="ex-result">
            ${ring(goodPct, { size: 128, w: 8, cls: goodPct >= 80 ? "gold" : "", num: goodPct + "%", cap: "вспомнено", delay: 1 })}
            <h2 class="ex-result__t">${esc(ruTitle)}</h2>
            <div class="ex-result__score" data-score>${done}<small> карточек</small></div>
            <div class="ex-result__note">${goodPct >= 80 ? "Отличное припоминание — интервалы выросли." : goodPct >= 50 ? "Часть карточек вернётся раньше — это нормально." : "Материал свежий: повторите его завтра и послезавтра."}</div>
            <div class="stats" style="width:100%;grid-template-columns:repeat(4,minmax(0,1fr))">
              <div class="stat stat--flat"><span class="stat__num" style="font-size:1.3rem;color:var(--bad)">${tally[0]}</span><span class="stat__cap">забыл</span></div>
              <div class="stat stat--flat"><span class="stat__num" style="font-size:1.3rem;color:var(--warn)">${tally[1]}</span><span class="stat__cap">трудно</span></div>
              <div class="stat stat--flat"><span class="stat__num" style="font-size:1.3rem;color:var(--ok)">${tally[2]}</span><span class="stat__cap">хорошо</span></div>
              <div class="stat stat--flat"><span class="stat__num" style="font-size:1.3rem;color:var(--accent)">${tally[3]}</span><span class="stat__cap">легко</span></div>
            </div>
            <div class="ex-result__btns">
              <button class="btn btn--primary btn--lg" type="button" id="again">${icon("refresh", "sm")}Ещё подход</button>
              <a class="btn btn--ghost btn--lg" href="#/trainer">${icon("cards", "sm")}В тренажёр</a>
            </div>
            <a class="sec__more" href="#/progress">Посмотреть прогресс${icon("chevronRight", "xs")}</a>
          </div>
        </div>
      </div>`;
      const sc = $("[data-score]", main);
      if (sc) UI.countUp(sc, done, { format: n => `${Math.round(n)} карточек` });
      $("#again", main).addEventListener("click", () => A.router());
      A.updateBadges();
    }

    renderStack();
  };

  A.dueQueue = dueQueue;
  A.newQueue = newQueue;
})();
