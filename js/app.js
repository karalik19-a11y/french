// Приложение — Французский для Дани
"use strict";
(() => {

  // ---------- Состояние ----------
  const defaultSettings = { dailyGoal: 20, freeNav: false, ttsRate: 0.9, passedLevels: [], lastLevel: 1, newPerDay: 15 };
  let settings = { ...defaultSettings, ...store.get("settings", {}) };
  const saveSettings = () => store.set("settings", settings);

  dedupeVocab();

  let main = null;
  const screens = {};

  function navigate(hash) { location.hash = hash; }

  // ---------- Оболочка ----------
  function renderShell() {
    document.body.innerHTML = `
      <div class="app">
        <aside class="sidebar" id="sidebar">
          <div class="logo">
            <div class="logo-flag"><span></span><span></span><span></span></div>
            <div class="logo-text">Французский<br><b>для Дани</b></div>
          </div>
          <nav class="nav" id="nav">
            <a href="#/home" data-r="home"><span class="nav-ico">🏠</span> Главная</a>
            <a href="#/course" data-r="course"><span class="nav-ico">🎓</span> Курс</a>
            <a href="#/trainer" data-r="trainer"><span class="nav-ico">🃏</span> Тренажёр <span class="badge" id="dueBadge"></span></a>
            <a href="#/verbs" data-r="verbs"><span class="nav-ico">📖</span> Спряжения</a>
            <a href="#/grammar" data-r="grammar"><span class="nav-ico">🧩</span> Грамматика</a>
            <a href="#/reading" data-r="reading"><span class="nav-ico">📚</span> Чтение</a>
            <a href="#/dialogues" data-r="dialogues"><span class="nav-ico">💬</span> Диалоги</a>
            <a href="#/idioms" data-r="idioms"><span class="nav-ico">🗣️</span> Идиомы</a>
            <a href="#/phon" data-r="phon"><span class="nav-ico">🔉</span> Фонетика</a>
            <a href="#/method" data-r="method"><span class="nav-ico">🧭</span> Методика</a>
            <a href="#/progress" data-r="progress"><span class="nav-ico">📈</span> Прогресс</a>
          </nav>
          <div class="sidebar-foot">
            <div class="streak-box">🔥 <b id="streakNum">0</b> ${"дн."}</div>
            <div class="goal-box">Цель: <b id="goalNum">0</b>/%</div>
          </div>
        </aside>
        <main class="main" id="main"><div class="loading">Загрузка базы...</div></main>
      </div>`;
    main = $("#main");
    updateBadges();
  }

  function updateBadges() {
    const st = SRS.todayStats();
    const b = $("#dueBadge"); if (b) { b.textContent = st.due || ""; b.style.display = st.due ? "inline-block" : "none"; }
    const s = $("#streakNum"); if (s) s.textContent = st.streak;
    const g = $("#goalNum"); if (g) g.textContent = Math.min(100, Math.round((st.rev + st.new) / Math.max(1, settings.dailyGoal) * 100));
  }

  // ---------- Роутер ----------
  function router() {
    const h = location.hash || "#/home";
    const parts = h.slice(2).split("/");
    const route = parts[0] || "home";
    $$("#nav a").forEach(a => a.classList.toggle("active", a.dataset.r === route));
    TTS.stop();
    const fn = screens[route] || screens.home;
    main.innerHTML = "";
    main.scrollTop = 0;
    fn(parts.slice(1));
    updateBadges();
  }
  window.addEventListener("hashchange", router);

  const h1 = (t, sub = "") => `<div class="page-head"><h1>${t}</h1>${sub ? `<p class="sub">${sub}</p>` : ""}</div>`;

  // ---------- Главная ----------
  screens.home = () => {
    const st = SRS.todayStats();
    const mat = SRS.maturity();
    const lvl = DB.course.find(l => l.lv === settings.lastLevel) || DB.course[0];
    const unlocked = isUnlocked(lvl.lv);
    const nextUnit = unlocked ? lvl.units[0] : null;
    const idiom = DB.idioms[(new Date().getDate() * 7 + new Date().getMonth() * 31) % DB.idioms.length];
    main.innerHTML = `
      ${h1("Bonjour, Даня! 👋", "Твой личный путь к свободному французскому")}
      <div class="dash-grid">
        <div class="card stat-card big">
          <div class="stat-title">Сегодня</div>
          <div class="stat-row">
            <div class="stat"><b>${st.due}</b><span>карт к повтору</span></div>
            <div class="stat"><b>${st.rev + st.new}</b><span>из ${settings.dailyGoal} цели</span></div>
            <div class="stat"><b>${st.streak}</b><span>дней подряд 🔥</span></div>
          </div>
          <div class="goalbar"><div class="goalbar-fill" style="width:${Math.min(100, (st.rev + st.new) / settings.dailyGoal * 100)}%"></div></div>
          <div class="dash-btns">
            <a class="btn primary" href="#/trainer">🃏 Тренажёр${st.due ? ` (${st.due})` : ""}</a>
            <a class="btn" href="#/course/lvl/${lvl.lv}">🎓 Продолжить курс · Ур. ${lvl.lv} (${lvl.cefr})</a>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-title">База знаний</div>
          <div class="stat-mini">📖 ${DB.verbs.length} глаголов × 15 времён</div>
          <div class="stat-mini">🗂 ${DB.vocab.length} слов и выражений</div>
          <div class="stat-mini">🧩 ${DB.grammar.length} уроков грамматики</div>
          <div class="stat-mini">🗣 ${DB.idioms.length} идиом и пословиц</div>
          <div class="stat-mini">📚 ${DB.reading.length} текстов + ${DB.dialogues.length} диалогов</div>
          <div class="stat-mini">🧠 В SRS: ${mat.total} (${mat.pct}% зрелых)</div>
        </div>
        <div class="card stat-card idiom-card">
          <div class="stat-title">Выражение дня</div>
          <div class="idiom-fr">${spkBtn(idiom.fr)} <b>${esc(idiom.fr)}</b></div>
          <div class="idiom-lit">${esc(idiom.lit)}</div>
          <div class="idiom-ru">${esc(idiom.ru)}</div>
          ${idiom.ex ? `<div class="idiom-ex">${spkBtn(idiom.ex)}${esc(idiom.ex)}</div>` : ""}
          <a class="btn small" href="#/idioms">Все идиомы →</a>
        </div>
      </div>
      ${!TTS.hasFrenchVoice() ? `<div class="warn-box">⚠️ В системе не найден французский голос для озвучки. Установите французский язык/голос в настройках системы (Windows: Параметры → Время и язык → Речь; macOS: System Settings → Accessibility → Spoken Content → System Voice → French; Android/iOS: добавьте французскую клавиатуру/голос). Кнопки 🔊 заработают автоматически.</div>` : ""}
      <div class="card">
        <div class="stat-title">Как заниматься эффективно (кратко)</div>
        <ol class="md-ol">
          <li><b>Каждый день</b> — 30–60 минут лучше марафонов раз в неделю. Держи стрик 🔥</li>
          <li>Сначала <b>карточки</b> (повторить просроченное), потом новый материал.</li>
          <li>Всё французское <b>проговаривай вслух</b> — кнопки 🔊 помогут с произношением.</li>
          <li>Уровень закрывается <b>тестом на ${lvl.pass}%+</b> — или включи свободную навигацию в <a href="#/progress">Прогрессе</a>.</li>
          <li>Читай тексты своего уровня: правило <b>95% понимания</b>.</li>
        </ol>
        <a class="btn small" href="#/method">Полная методика →</a>
      </div>`;
  };

  function isUnlocked(lv) {
    if (settings.freeNav) return true;
    if (lv === 1) return true;
    return settings.passedLevels.includes(lv - 1);
  }

  // ---------- Курс ----------
  screens.course = (args) => {
    if (args[0] === "lvl") return screens.courseLevel(args[1]);
    main.innerHTML = h1("Курс A1 → C1", "8 уровней. Каждый закрывается тестом — или включи свободный доступ в разделе «Прогресс».");
    const wrap = document.createElement("div");
    wrap.className = "levels-grid";
    for (const l of DB.course) {
      const un = isUnlocked(l.lv);
      const passed = settings.passedLevels.includes(l.lv);
      wrap.insertAdjacentHTML("beforeend", `
        <a class="card level-card ${un ? "" : "locked"} ${passed ? "passed" : ""}" href="#/course/lvl/${l.lv}">
          <div class="lc-top"><span class="lc-num">Уровень ${l.lv}</span><span class="cefr-badge ${l.cefr.toLowerCase()}">${l.cefr}</span>${passed ? '<span class="lc-pass">✓ пройден</span>' : ""}${!un ? '<span class="lc-lock">🔒</span>' : ""}</div>
          <div class="lc-title">${esc(l.title)}</div>
          <div class="lc-desc">${esc(l.desc)}</div>
          <div class="lc-meta">${l.units.length} юнита · ${l.units.reduce((s, u) => s + u.grammar.length, 0)} уроков грамматики</div>
        </a>`);
    }
    main.appendChild(wrap);
  };

  screens.courseLevel = (lvArg) => {
    const lv = parseInt(lvArg, 10);
    const l = DB.course.find(x => x.lv === lv);
    if (!l) return screens.course([]);
    settings.lastLevel = lv; saveSettings();
    if (!isUnlocked(lv)) {
      main.innerHTML = h1(`Уровень ${lv} · ${l.cefr}`, l.title) + `<div class="warn-box">🔒 Уровень откроется после теста уровня ${lv - 1} на ${DB.course[lv - 2].pass}%+. Или включи свободную навигацию в <a href="#/progress">Прогрессе</a>.</div>`;
      return;
    }
    const passed = settings.passedLevels.includes(lv);
    main.innerHTML = `
      ${h1(`Уровень ${lv} · ${l.cefr} — ${esc(l.title)}`, esc(l.desc))}
      <div class="unit-list">
      ${l.units.map((u, ui) => `
        <div class="card unit-card">
          <div class="unit-head"><b>Юнит ${ui + 1}. ${esc(u.title)}</b></div>
          <div class="unit-goals">${u.goals.map(g => "🎯 " + esc(g)).join("<br>")}</div>
          <div class="unit-blocks">
            <div class="ub"><span class="ub-t">🧩 Грамматика</span>
              <div class="chips">${u.grammar.map(gid => { const g = DB.grammar.find(x => x.id === gid); return g ? `<a class="chip" href="#/grammar/${gid}">${esc(g.title.split(":")[0])}</a>` : ""; }).join("")}</div></div>
            ${u.themes && u.themes.length ? `<div class="ub"><span class="ub-t">🗂 Слова (${u.themes.join(", ")})</span>
              <div class="chips"><button class="chip act" data-train-vocab="${ui}">▶ Тренировать слова юнита</button></div></div>` : ""}
            ${u.verbs && u.verbs.length ? `<div class="ub"><span class="ub-t">📖 Глаголы</span>
              <div class="chips">${u.verbs.map(v => `<a class="chip" href="#/verbs/${encodeURIComponent(v)}">${esc(v)}</a>`).join("")}
              <button class="chip act" data-train-verbs="${ui}">▶ Тренировать спряжения</button></div></div>` : ""}
            ${u.readings && u.readings.length ? `<div class="ub"><span class="ub-t">📚 Чтение</span><div class="chips">${u.readings.map(r => `<a class="chip" href="#/reading/${r}">текст</a>`).join("")}</div></div>` : ""}
          </div>
        </div>`).join("")}
      </div>
      <div class="card test-card">
        <b>Итоговый тест уровня ${lv}</b> · ~22 вопроса (грамматика + слова + спряжения + идиомы) · порог ${l.pass}%
        <div class="dash-btns">
          <button class="btn primary" id="startTest">📝 Начать тест</button>
          ${passed ? '<span class="lc-pass big">✓ Уровень уже пройден</span>' : ""}
          <a class="btn" href="#/trainer">🃏 Тренировать слова уровня</a>
        </div>
      </div>`;
    // кнопки тренировки юнитов
    $$("[data-train-vocab]", main).forEach(b => b.addEventListener("click", () => {
      const u = l.units[+b.dataset.trainVocab];
      const qs = EX.sessionVocab([l.cefr], u.themes, 15);
      if (!qs.length) return alert("Для этих тем пока нет слов — попробуй тренировку всего уровня.");
      openSession(qs, `Слова · ${u.title}`, null);
    }));
    $$("[data-train-verbs]", main).forEach(b => b.addEventListener("click", () => {
      const u = l.units[+b.dataset.trainVerbs];
      const tenses = tensesForLevel(l.cefr);
      const qs = EX.sessionVerbs(u.verbs, tenses, 12);
      openSession(qs, `Спряжения · ${u.title}`, null);
    }));
    $("#startTest", main).addEventListener("click", () => {
      const qs = EX.sessionLevelTest(l);
      openSession(qs, `Тест уровня ${lv} (${l.cefr})`, l.pass, (res) => {
        if (res.pass === true && !settings.passedLevels.includes(lv)) {
          settings.passedLevels.push(lv); saveSettings();
        }
      });
    });
  };

  function tensesForLevel(cefr) {
    return cefr === "A1" ? ["présent", "impératif"] :
      cefr === "A2" ? ["présent", "passé composé", "imparfait", "futur simple", "conditionnel présent"] :
        cefr === "B1" ? ["présent", "passé composé", "imparfait", "futur simple", "conditionnel présent", "subjonctif présent", "conditionnel passé", "gérondif"] :
          cefr === "B2" ? ["présent", "passé composé", "imparfait", "plus-que-parfait", "passé simple", "futur antérieur", "subjonctif présent", "subjonctif passé", "conditionnel passé"] :
            ["passé simple", "subjonctif imparfait", "subjonctif passé", "subjonctif plus-que-parfait", "passé antérieur", "conditionnel passé", "futur antérieur"];
  }

  // Общий запуск сессии упражнений поверх экрана
  function openSession(questions, title, pass, onFinish) {
    if (!questions.length) { alert("Не удалось составить упражнения — мало данных."); return; }
    main.innerHTML = `<div class="session-wrap"><div id="sessionBox"></div></div>`;
    EX.runSession(questions, {
      container: $("#sessionBox"), title, pass,
      onFinish: (res) => {
        updateBadges();
        if (onFinish) onFinish(res);
      }
    });
  }

  // ---------- Тренажёр ----------
  screens.trainer = (args) => {
    const st = SRS.todayStats();
    main.innerHTML = `
      ${h1("Тренажёр 🃏", "Интервальное повторение (SM-2): карточки возвращаются прямо перед забыванием")}
      <div class="dash-grid">
        <div class="card stat-card">
          <div class="stat-row">
            <div class="stat"><b>${st.due}</b><span>к повтору сейчас</span></div>
            <div class="stat"><b>${st.rev}</b><span>повторено сегодня</span></div>
            <div class="stat"><b>${st.new}</b><span>новых сегодня</span></div>
          </div>
          <div class="dash-btns">
            <button class="btn primary" id="btnDue">▶ Повторить просроченные${st.due ? ` (${st.due})` : ""}</button>
            <button class="btn" id="btnNew">✚ Выучить новые слова (${settings.newPerDay})</button>
          </div>
          <div class="ctx">Оценки после ответа: «Забыл» вернёт карточку через 10 минут, «Хорошо» удлинит интервал, «Легко» — сильнее.</div>
        </div>
        <div class="card">
          <div class="stat-title">Быстрые тренировки</div>
          <div class="chips">
            <button class="chip act" data-quick="vocab-all">Слова вперемешку</button>
            <button class="chip act" data-quick="verbs-pres">Глаголы: présent</button>
            <button class="chip act" data-quick="verbs-pc">Глаголы: passé composé</button>
            <button class="chip act" data-quick="verbs-mix">Глаголы: микс времён</button>
            <button class="chip act" data-quick="idioms">Идиомы</button>
            <button class="chip act" data-quick="listen">Аудирование слов</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="stat-title">Настройка новых слов</div>
        <label class="set-row">Новых карточек в день: <select id="newPerDay">${[5, 10, 15, 20, 30].map(n => `<option ${settings.newPerDay === n ? "selected" : ""}>${n}</option>`).join("")}</select></label>
        <label class="set-row">Слова какого уровня учить: <select id="newLevels">
          ${["A1", "A2", "B1", "B2", "C1", "all"].map(l => `<option value="${l}" ${store.get("newLevels", "all") === l ? "selected" : ""}>${l === "all" ? "Все" : l}</option>`).join("")}
        </select></label>
      </div>`;

    $("#btnDue").addEventListener("click", () => {
      const qs = dueQueue(40);
      if (!qs.length) return alert("Просроченных карточек нет. Выучи новые! 🌱");
      openSession(qs, "Повторение", null);
    });
    $("#btnNew").addEventListener("click", () => {
      const qs = newQueue(settings.newPerDay);
      if (!qs.length) return alert("Новых слов не осталось для выбранного уровня — повтори старые или расширь уровень.");
      openSession(qs, "Новые слова", null);
    });
    $$("[data-quick]", main).forEach(b => b.addEventListener("click", () => {
      const k = b.dataset.quick;
      let qs = [];
      if (k === "vocab-all") qs = EX.sessionVocab(["A1", "A2", "B1", "B2", "C1"], null, 15);
      if (k === "verbs-pres") qs = EX.sessionVerbs([], ["présent"], 12);
      if (k === "verbs-pc") qs = EX.sessionVerbs([], ["passé composé"], 12);
      if (k === "verbs-mix") qs = EX.sessionVerbs([], tensesForLevel("B2"), 12);
      if (k === "idioms") qs = shuffle(DB.idioms).slice(0, 12).map(EX.qIdiomChoice).filter(Boolean);
      if (k === "listen") qs = shuffle(DB.vocab.filter(e => e.l === "A1" || e.l === "A2")).slice(0, 12).map(EX.qVocabListen).filter(Boolean);
      openSession(qs, b.textContent, null);
    }));
    $("#newPerDay").addEventListener("change", e => { settings.newPerDay = +e.target.value; saveSettings(); });
    $("#newLevels").addEventListener("change", e => store.set("newLevels", e.target.value));
  };

  function dueQueue(limit) {
    const keys = shuffle(SRS.dueKeys()).slice(0, limit);
    const qs = [];
    for (const k of keys) {
      if (k.startsWith("v:")) {
        const w = k.slice(2);
        const e = DB.vocab.find(x => norm(x.f) === w);
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

  // ---------- Спряжения ----------
  screens.verbs = (args) => {
    if (args[0]) return verbDetail(decodeURIComponent(args[0]));
    main.innerHTML = `
      ${h1("Спряжения 📖", `${DB.verbs.length} глаголов × 15 времён: все формы, озвучка, тренировки`)}
      <div class="card">
        <input type="text" id="verbSearch" class="ex-input big" placeholder="Поиск: parler, быть, se lever...">
        <div class="chips" style="margin-top:8px">
          ${["топ-20", "A1"].map(t => `<button class="chip act" data-vfilter="${t}">${t}</button>`).join("")}
        </div>
      </div>
      <div id="verbList" class="verb-list"></div>`;
    const list = $("#verbList");
    function draw(filter) {
      let vs = DB.verbs;
      if (filter) {
        const f = filter.toLowerCase();
        vs = vs.filter(v => v.inf.toLowerCase().includes(f) || v.ru.toLowerCase().includes(f) || (v.tags || []).includes(f));
      }
      list.innerHTML = vs.slice(0, 300).map(v => `
        <a class="verb-item" href="#/verbs/${encodeURIComponent(v.inf)}">
          <b>${esc(v.inf)}</b> <span class="grp g${v.group}">${v.group} гр.</span>
          <span class="v-ru">${esc(v.ru)}</span>
        </a>`).join("") || `<div class="ctx">Ничего не найдено.</div>`;
    }
    draw("");
    $("#verbSearch").addEventListener("input", e => draw(e.target.value));
    $$("[data-vfilter]", main).forEach(b => b.addEventListener("click", () => draw(b.dataset.vfilter)));
  };

  const TENSES15 = ["présent", "passé composé", "imparfait", "plus-que-parfait", "passé simple", "passé antérieur",
    "futur simple", "futur antérieur", "conditionnel présent", "conditionnel passé",
    "subjonctif présent", "subjonctif passé", "subjonctif imparfait", "subjonctif plus-que-parfait", "impératif"];
  const TENSE_RU = { "présent": "настоящее", "passé composé": "прошедшее сложное", "imparfait": "прошедшее несовершенное", "plus-que-parfait": "предпрошедшее", "passé simple": "простое прошедшее (книжн.)", "passé antérieur": "предпрошедшее книжное", "futur simple": "будущее", "futur antérieur": "предбудущее", "conditionnel présent": "условное настоящее", "conditionnel passé": "условное прошедшее", "subjonctif présent": "сослагательное настоящее", "subjonctif passé": "сослагательное прошедшее", "subjonctif imparfait": "сослагательное несовершенное (книжн.)", "subjonctif plus-que-parfait": "сослагательное предпрошедшее (книжн.)", "impératif": "повелительное" };

  function verbDetail(inf) {
    const v = DB.verbs.find(x => x.inf === inf);
    if (!v) return screens.verbs([]);
    main.innerHTML = `
      <div class="page-head"><a class="back" href="#/verbs">← все глаголы</a>
      <h1>${esc(v.inf)} <span class="grp g${v.group}">${v.group} группа</span></h1>
      <p class="sub">${esc(v.ru)} · вспомогательный: <b>${v.aux}</b> · причастие: <b>${v.pp}</b>${v.part_pres ? ` · part. présent: <b>${v.part_pres}</b>` : ""}${v.gérondif ? ` · gérondif: <b>${v.gérondif}</b>` : ""}</p></div>
      ${v.notes ? `<div class="card note-card">💡 ${esc(v.notes)}</div>` : ""}
      ${v.example ? `<div class="card"><div class="md-ex"><span class="fr-line">${spkBtn(v.example[0])}<b>${esc(v.example[0])}</b></span><span class="ru-line">${esc(v.example[1])}</span></div></div>` : ""}
      <div class="tense-tabs" id="tenseTabs">
        ${TENSES15.map((t, i) => `<button class="ttab ${i === 0 ? "active" : ""}" data-t="${esc(t)}">${esc(t)}</button>`).join("")}
      </div>
      <div id="tenseBox"></div>
      <div class="dash-btns" style="margin-top:12px">
        <button class="btn primary" id="trainVerb">🎯 Тренировать этот глагол</button>
        <button class="btn" id="trainVerbAll">🎲 Тренировать: случайные глаголы, это время</button>
      </div>`;
    function drawTense(t) {
      const box = $("#tenseBox");
      const forms = v.forms[t];
      const isImp = t === "impératif";
      if (!forms || forms.every(f => !f || f === "—")) {
        box.innerHTML = `<div class="card"><div class="tense-title">${esc(t)} <span class="ctx">${esc(TENSE_RU[t] || "")}</span></div><div class="ctx">Для этого глагола форма не употребляется.</div></div>`;
        return;
      }
      const rows = isImp
        ? [["tu", forms[0] || v.imper?.[0]], ["nous", forms[1] || v.imper?.[1]], ["vous", forms[2] || v.imper?.[2]]].filter(r => r[1])
        : EX.PRON6.map((p, i) => [p, forms[i]]);
      box.innerHTML = `<div class="card">
        <div class="tense-title">${esc(t)} <span class="ctx">${esc(TENSE_RU[t] || "")}</span></div>
        <table class="conj-tbl">
          ${rows.map(r => `<tr><td class="conj-pron">${esc(r[0])}</td><td class="conj-form">${esc(r[1] || "—")}${r[1] && r[1] !== "—" ? spkBtn(r[1]) : ""}</td></tr>`).join("")}
        </table>
        ${v.pp && t.startsWith("passé composé") ? "" : ""}
      </div>`;
    }
    drawTense("présent");
    $$("#tenseTabs .ttab").forEach(b => b.addEventListener("click", () => {
      $$("#tenseTabs .ttab").forEach(x => x.classList.remove("active"));
      b.classList.add("active");
      drawTense(b.dataset.t);
    }));
    $("#trainVerb").addEventListener("click", () => {
      const t = $("#tenseTabs .ttab.active").dataset.t;
      const qs = EX.sessionVerbs([v.inf], [t], 10);
      openSession(qs, `${v.inf} · ${t}`, null);
    });
    $("#trainVerbAll").addEventListener("click", () => {
      const t = $("#tenseTabs .ttab.active").dataset.t;
      const qs = EX.sessionVerbs([], [t], 10);
      openSession(qs, `Случайные глаголы · ${t}`, null);
    });
  }

  // ---------- Грамматика ----------
  screens.grammar = (args) => {
    if (args[0]) return lessonView(decodeURIComponent(args[0]));
    main.innerHTML = h1("Грамматика 🧩", `${DB.grammar.length} уроков от артиклей до subjonctif imparfait — с примерами, озвучкой и квизами`);
    const byLv = {};
    DB.grammar.forEach(g => (byLv[g.lv] = byLv[g.lv] || []).push(g));
    for (const lv of ["A1", "A2", "B1", "B2", "C1"]) {
      if (!byLv[lv]) continue;
      main.insertAdjacentHTML("beforeend", `
        <div class="card"><div class="stat-title">Уровень ${lv}</div>
        <div class="lesson-list">
        ${byLv[lv].sort((a, b) => a.n - b.n).map(g => `<a class="lesson-item" href="#/grammar/${g.id}"><b>${esc(g.title)}</b><span class="ctx">${g.quiz.length} вопр.</span></a>`).join("")}
        </div></div>`);
    }
  };

  function lessonView(id) {
    const g = DB.grammar.find(x => x.id === id);
    if (!g) return screens.grammar([]);
    const order = DB.grammar.slice().sort((a, b) => (a.u - b.u) || (a.n - b.n));
    const gi = order.findIndex(x => x.id === id);
    const prev = order[gi - 1], next = order[gi + 1];
    main.innerHTML = `
      <div class="page-head"><a class="back" href="#/grammar">← все уроки</a>
      <h1>${esc(g.title)} <span class="cefr-badge ${g.lv.toLowerCase()}">${g.lv}</span></h1></div>
      <div class="lesson-body">${md(g.content)}</div>
      ${g.ex && g.ex.length ? `<div class="card"><div class="stat-title">Примеры (нажми 🔊 и повтори вслух)</div>
        ${g.ex.map(e => `<div class="md-ex"><span class="fr-line">${spkBtn(e[0])}<b>${esc(e[0])}</b></span><span class="ru-line">${esc(e[1])}</span></div>`).join("")}
      </div>` : ""}
      ${g.points && g.points.length ? `<div class="card"><div class="stat-title">Запомнить</div><ul class="md-ul">${g.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul></div>` : ""}
      <div class="dash-btns">
        <button class="btn primary" id="lessonQuiz">📝 Пройти квиз (${g.quiz.length})</button>
        ${prev ? `<a class="btn" href="#/grammar/${prev.id}">← ${esc(prev.title.split(":")[0])}</a>` : ""}
        ${next ? `<a class="btn" href="#/grammar/${next.id}">${esc(next.title.split(":")[0])} →</a>` : ""}
      </div>`;
    $("#lessonQuiz").addEventListener("click", () => openSession(EX.sessionLesson(g), `Квиз: ${g.title}`, null));
  }

  // ---------- Чтение ----------
  screens.reading = (args) => {
    if (args[0]) return readingView(args[0]);
    main.innerHTML = h1("Чтение 📚", "Градуированные тексты A1→C1 + классика в оригинале. Правило: понимай 95%+ — иначе смени текст.");
    for (const lv of ["A1", "A2", "B1", "B2", "C1"]) {
      const rs = DB.reading.filter(r => r.lv === lv);
      if (!rs.length) continue;
      main.insertAdjacentHTML("beforeend", `<div class="card"><div class="stat-title">${lv}</div><div class="lesson-list">
        ${rs.map(r => `<a class="lesson-item" href="#/reading/${r.id}"><b>${esc(r.title)}</b>${r.author ? `<span class="ctx">${esc(r.author)}</span>` : ""}<span class="ctx">${r.text.split(/\s+/).length} слов</span></a>`).join("")}
      </div></div>`);
    }
  };

  function readingView(id) {
    const r = DB.reading.find(x => x.id === id);
    if (!r) return screens.reading([]);
    const paras = r.text.split("\n").filter(p => p.trim());
    main.innerHTML = `
      <div class="page-head"><a class="back" href="#/reading">← все тексты</a>
      <h1>${esc(r.title)} <span class="cefr-badge ${r.lv.toLowerCase()}">${r.lv}</span></h1>
      <p class="sub">${esc(r.titleRu)}${r.author ? ` · ${esc(r.author)}` : ""}</p></div>
      <div class="dash-btns reader-tools">
        <button class="btn" id="readAll">🔊 Прослушать весь текст</button>
        <button class="btn" id="toggleTr">👁 Показать перевод</button>
        <button class="btn" id="readQuiz">📝 Вопросы к тексту (${r.questions.length})</button>
      </div>
      <div class="card reader-text">
        ${paras.map(p => `<p class="rt-p">${p.split(/(\s+)/).map(w => {
      const clean = w.replace(/[^\p{L}\p{M}'’-]/gu, "");
      return clean ? `<span class="rt-w" data-w="${esc(clean)}">${esc(w)}</span>` : esc(w);
    }).join("")}</p>`).join("")}
      </div>
      <div class="card hidden" id="trBox"><div class="stat-title">Перевод</div><div class="tr-text">${r.translation.split("\n").filter(p => p.trim()).map(p => `<p>${esc(p)}</p>`).join("")}</div></div>
      <div class="card"><div class="stat-title">Слова текста (${r.words.length}) — нажми 🔊</div>
        <div class="words-grid">${r.words.map(w => `<div class="word-card">${spkBtn(w[0])}<b>${esc(w[0])}</b><span>${esc(w[1])}</span></div>`).join("")}</div>
      </div>
      <div id="wordPopup" class="word-popup hidden"></div>`;

    const trBox = $("#trBox");
    $("#toggleTr").addEventListener("click", () => trBox.classList.toggle("hidden"));
    $("#readAll").addEventListener("click", async (e) => {
      e.target.disabled = true;
      await TTS.speak(r.text).catch(() => { });
      e.target.disabled = false;
    });
    $("#readQuiz").addEventListener("click", () => {
      const qs = r.questions.map(q => ({ type: "c", srsKey: null, prompt: esc(q.q), options: q.o, answer: q.o[q.a], explain: q.e || "" }));
      openSession(qs, `Вопросы: ${r.title}`, null);
    });
    // клик по слову
    const popup = $("#wordPopup");
    $$(".rt-w", main).forEach(w => w.addEventListener("click", ev => {
      ev.stopPropagation();
      const raw = w.dataset.w;
      const hit = lookupWord(raw);
      popup.classList.remove("hidden");
      popup.innerHTML = hit
        ? `<b>${esc(hit.f)}</b> ${spkBtn(hit.f)}<div>${esc(hit.r)}</div>${hit.ef ? `<div class="ctx">${esc(hit.ef)}</div>` : ""}<div class="ctx">${hit.t || ""} ${hit.l || ""}</div>`
        : `<b>${esc(raw)}</b> ${spkBtn(raw)}<div class="ctx">В нашей базе нет — ищи в словаре:</div><a class="btn small" target="_blank" href="https://www.wordreference.com/frru/${encodeURIComponent(raw)}">WordReference ↗</a>`;
      const rect = w.getBoundingClientRect();
      popup.style.top = (rect.bottom + window.scrollY + 8) + "px";
      popup.style.left = Math.min(rect.left, window.innerWidth - 300) + "px";
    }));
    document.addEventListener("click", () => popup.classList.add("hidden"), { once: true });
  }

  // ---------- Диалоги ----------
  screens.dialogues = (args) => {
    if (args[0]) return dialogueView(args[0]);
    main.innerHTML = h1("Диалоги 💬", "12 ситуативных диалогов A1→C1. Слушай, читай вслух, используй shadowing (повтор за диктором).");
    for (const lv of ["A1", "A2", "B1", "B2", "C1"]) {
      const ds = DB.dialogues.filter(d => d.lv === lv);
      if (!ds.length) continue;
      main.insertAdjacentHTML("beforeend", `<div class="card"><div class="stat-title">${lv}</div><div class="lesson-list">
        ${ds.map(d => `<a class="lesson-item" href="#/dialogues/${d.id}"><b>${esc(d.title)}</b><span class="ctx">${esc(d.titleRu)} · ${esc(d.situation)}</span></a>`).join("")}
      </div></div>`);
    }
  };

  function dialogueView(id) {
    const d = DB.dialogues.find(x => x.id === id);
    if (!d) return screens.dialogues([]);
    main.innerHTML = `
      <div class="page-head"><a class="back" href="#/dialogues">← все диалоги</a>
      <h1>${esc(d.title)} <span class="cefr-badge ${d.lv.toLowerCase()}">${d.lv}</span></h1>
      <p class="sub">${esc(d.titleRu)} · ${esc(d.situation)}</p></div>
      <div class="dash-btns reader-tools">
        <button class="btn primary" id="playAll">▶ Прослушать весь диалог</button>
        <button class="btn" id="shadowBtn">🎭 Shadowing (повтор за диктором)</button>
        <button class="btn" id="stopBtn">⏹ Стоп</button>
        <label class="set-row inline">Скорость <input type="range" id="rateSlider" min="0.5" max="1.1" step="0.05" value="${store.get("ttsRate", 0.9)}"></label>
        <button class="btn" id="trDlg">👁 Перевод</button>
      </div>
      <div class="dlg-lines" id="dlgLines">
        ${d.lines.map((l, i) => `
          <div class="dlg-line" data-i="${i}">
            <div class="dlg-sp">${esc(l.s)}</div>
            <div class="dlg-body">
              <div class="dlg-fr">${spkBtn(l.fr)} ${esc(l.fr)}</div>
              <div class="dlg-ru hidden">${esc(l.ru)}</div>
            </div>
          </div>`).join("")}
      </div>`;
    let showTr = false;
    $("#trDlg").addEventListener("click", () => { showTr = !showTr; $$(".dlg-ru", main).forEach(x => x.classList.toggle("hidden", !showTr)); });
    $("#rateSlider").addEventListener("input", e => { store.set("ttsRate", +e.target.value); });
    $("#playAll").addEventListener("click", () => {
      TTS.stop();
      const lines = d.lines.map(l => ({ text: l.fr, i: l.i }));
      highlightReset();
      TTS.speakLines(lines, {
        rate: +$("#rateSlider").value,
        onLine: ln => highlight($(`.dlg-line[data-i="${lines.indexOf(ln)}"]`)),
        onDone: highlightReset
      });
    });
    $("#shadowBtn").addEventListener("click", async () => {
      TTS.stop();
      const rate = +$("#rateSlider").value;
      (async () => {
        for (let i = 0; i < d.lines.length; i++) {
          const line = d.lines[i];
          const el = $(`.dlg-line[data-i="${i}"]`, main);
          highlight(el);
          await TTS.speak(line.fr, { rate }).catch(() => { });
          el.classList.add("repeat-now");
          await new Promise(r2 => setTimeout(r2, Math.max(1600, line.fr.length * 55)));
          el.classList.remove("repeat-now");
          await TTS.speak(line.fr, { rate }).catch(() => { });
          await new Promise(r2 => setTimeout(r2, 400));
        }
        highlightReset();
      })();
    });
    $("#stopBtn").addEventListener("click", () => { TTS.stop(); highlightReset(); });
    function highlight(el) { $$(".dlg-line", main).forEach(x => x.classList.remove("playing")); if (el) el.classList.add("playing"); }
    function highlightReset() { $$(".dlg-line", main).forEach(x => x.classList.remove("playing", "repeat-now")); }
  }

  // ---------- Идиомы ----------
  screens.idioms = (args) => {
    main.innerHTML = `
      ${h1("Идиомы и пословицы 🗣️", `${DB.idioms.length} выражений: пословицы, идиомы, разговорные формулы — с дословным переводом`)}
      <div class="card">
        <input type="text" id="idSearch" class="ex-input big" placeholder="Поиск: chat, peur, камень...">
        <div class="chips" style="margin-top:8px">
          <button class="chip act" data-if="all">Все</button>
          <button class="chip act" data-if="proverbe">Пословицы</button>
          <button class="chip act" data-if="idiome">Идиомы</button>
          <button class="chip act" data-if="expression">Разговорные</button>
          <button class="chip act" id="idiomQuiz">🎯 Викторина</button>
        </div>
      </div>
      <div id="idList" class="idiom-list"></div>`;
    let filter = "all", search = "";
    function draw() {
      let its = DB.idioms;
      if (filter !== "all") its = its.filter(i => i.t === filter);
      if (search) { const s = search.toLowerCase(); its = its.filter(i => i.fr.toLowerCase().includes(s) || i.ru.toLowerCase().includes(s) || i.lit.toLowerCase().includes(s)); }
      $("#idList").innerHTML = its.map(i => `
        <div class="card idiom-item">
          <div class="ii-top"><span class="lvl-badge">${i.lv}</span><span class="ctx">${i.t === "proverbe" ? "пословица" : i.t === "idiome" ? "идиома" : "формула"}</span></div>
          <div class="ii-fr">${spkBtn(i.fr)}<b>${esc(i.fr)}</b></div>
          <div class="ii-lit">букв.: ${esc(i.lit)}</div>
          <div class="ii-ru">${esc(i.ru)}</div>
          ${i.ex ? `<div class="ii-ex">${spkBtn(i.ex)}${esc(i.ex)}</div>` : ""}
        </div>`).join("") || `<div class="ctx">Ничего не найдено.</div>`;
    }
    draw();
    $("#idSearch").addEventListener("input", e => { search = e.target.value; draw(); });
    $$("[data-if]", main).forEach(b => b.addEventListener("click", () => { filter = b.dataset.if; draw(); }));
    $("#idiomQuiz").addEventListener("click", () => {
      let pool = filter === "all" ? DB.idioms : DB.idioms.filter(i => i.t === filter);
      const qs = shuffle(pool).slice(0, 12).map(EX.qIdiomChoice).filter(Boolean);
      openSession(qs, "Викторина идиом", null);
    });
  };

  // ---------- Фонетика ----------
  screens.phon = () => {
    main.innerHTML = `
      ${h1("Фонетика 🔉", "Звуки, правила чтения, минимальные пары и скороговорки. Всё озвучивается — повторяй вслух!")}
      <div class="tense-tabs" id="phTabs">
        <button class="ttab active" data-p="sounds">Звуки</button>
        <button class="ttab" data-p="rules">Правила чтения</button>
        <button class="ttab" data-p="pairs">Мин. пары</button>
        <button class="ttab" data-p="twisters">Скороговорки</button>
      </div>
      <div id="phBox"></div>`;
    const box = $("#phBox");
    function draw(p) {
      const ph = DB.phonetics;
      if (p === "sounds") {
        box.innerHTML = `<div class="ctx" style="margin-bottom:10px">Нажми на звук, потом на примеры — и повторяй вслух, сравнивая.</div>` + ph.sounds.map(s => `
          <div class="card sound-card">
            <div class="sc-sym">[${esc(s.sym)}] ${spkBtn(s.ex[0][0])}</div>
            <div class="sc-ru">${esc(s.ru)}</div>
            <div class="sc-tip">💡 ${esc(s.tip)}</div>
            <div class="chips">${s.ex.map(e => `<button class="chip act" data-say="${esc(e[0])}" data-rate="0.8">${esc(e[0])} <span class="ctx">[${esc(e[1])}] ${esc(e[2])}</span></button>`).join("")}</div>
          </div>`).join("");
      } else if (p === "rules") {
        box.innerHTML = ph.rules.map(r => `
          <div class="card"><div class="stat-title">${esc(r.title)}</div>
          <p>${esc(r.text)}</p>
          <div class="chips">${r.ex.map(e => `<button class="chip act" data-say="${esc(e)}" data-rate="0.8">${esc(e)}</button>`).join("")}</div></div>`).join("");
      } else if (p === "pairs") {
        box.innerHTML = `<div class="ctx" style="margin-bottom:10px">Пары слов, различающиеся одним звуком. Слушай обе и повторяй — тренировка слуха.</div><div class="pairs-grid">` + ph.pairs.map(p2 => `
          <div class="card pair-card">
            <div class="pair-a"><button class="btn small" data-say="${esc(p2[0])}" data-rate="0.8">🔊 ${esc(p2[0])}</button><span>${esc(p2[2])}</span></div>
            <div class="pair-vs">vs</div>
            <div class="pair-b"><button class="btn small" data-say="${esc(p2[1])}" data-rate="0.8">🔊 ${esc(p2[1])}</button><span>${esc(p2[3])}</span></div>
          </div>`).join("") + `</div>`;
      } else {
        box.innerHTML = `<div class="ctx" style="margin-bottom:10px">Скороговорки: сначала медленно (0.6), потом нормально. Записывай себя и сравнивай.</div>` + ph.twisters.map(t => `
          <div class="card">
            <div class="ii-fr">${spkBtn(t.fr)}<b>${esc(t.fr)}</b></div>
            <div class="ii-ru">${esc(t.ru)}</div>
            <div class="chips">
              <button class="chip act" data-say="${esc(t.fr)}" data-rate="0.55">🐢 медленно</button>
              <button class="chip act" data-say="${esc(t.fr)}" data-rate="0.8">🚶 средне</button>
              <button class="chip act" data-say="${esc(t.fr)}" data-rate="1.05">🏃 быстро</button>
              <span class="ctx">фокус: ${esc(t.focus)} · ${t.lv}</span>
            </div>
          </div>`).join("");
      }
    }
    draw("sounds");
    $$("#phTabs .ttab").forEach(b => b.addEventListener("click", () => {
      $$("#phTabs .ttab").forEach(x => x.classList.remove("active"));
      b.classList.add("active"); draw(b.dataset.p);
    }));
  };

  // ---------- Методика ----------
  screens.method = () => {
    const m = DB.methodology;
    main.innerHTML = `
      ${h1("Методика 🧭", "На чём построено обучение: техники с доказанной эффективностью, планы занятий, учебники и ресурсы")}
      <div class="card">${md(m.intro)}</div>
      <div class="tense-tabs" id="mTabs">
        <button class="ttab active" data-m="tech">Техники (${m.techniques.length})</button>
        <button class="ttab" data-m="plans">Планы занятий</button>
        <button class="ttab" data-m="res">Учебники и ресурсы</button>
      </div>
      <div id="mBox"></div>`;
    const box = $("#mBox");
    function draw(p) {
      if (p === "tech") {
        box.innerHTML = m.techniques.map(t => `
          <div class="card tech-card">
            <div class="tech-head"><b>${esc(t.title)}</b> <span class="lvl-badge">${esc(t.level)}</span></div>
            <div class="tech-ru">${esc(t.ru)}</div>
            <div class="tech-text">${md(t.text)}</div>
            <ul class="md-ul">${t.tips.map(x => `<li>✅ ${esc(x)}</li>`).join("")}</ul>
          </div>`).join("");
      } else if (p === "plans") {
        box.innerHTML = m.plans.map(pl => `
          <div class="card">
            <div class="stat-title">${esc(pl.title)} ${pl.minutes ? `<span class="lvl-badge">${pl.minutes} мин/день</span>` : ""}</div>
            <div class="ctx">${esc(pl.forWhom)}</div>
            <div class="tbl-wrap"><table class="md-tbl">
              <tr><th>Блок</th><th>Мин.</th><th>Что делать</th></tr>
              ${pl.schedule.map(s => `<tr><td><b>${esc(s.block)}</b></td><td>${esc(s.minutes || "—")}</td><td>${esc(s.what)}</td></tr>`).join("")}
            </table></div>
          </div>`).join("");
      } else {
        box.innerHTML = m.resources.map(c => `
          <div class="card">
            <div class="stat-title">${esc(c.cat)}</div>
            ${c.items.map(i => `<div class="res-item"><b>${esc(i.name)}</b> <span class="lvl-badge">${esc(i.level)}</span><div class="ctx">${esc(i.type)}${i.note ? " · " + esc(i.note) : ""}</div></div>`).join("")}
          </div>`).join("");
      }
    }
    draw("tech");
    $$("#mTabs .ttab").forEach(b => b.addEventListener("click", () => {
      $$("#mTabs .ttab").forEach(x => x.classList.remove("active"));
      b.classList.add("active"); draw(b.dataset.m);
    }));
  };

  // ---------- Прогресс ----------
  screens.progress = () => {
    const st = SRS.todayStats();
    const mat = SRS.maturity();
    const hist = SRS.history(14);
    const maxBar = Math.max(10, ...hist.map(h => h.rev + h.new));
    main.innerHTML = `
      ${h1("Прогресс и настройки 📈", "")}
      <div class="dash-grid">
        <div class="card stat-card">
          <div class="stat-title">Статистика</div>
          <div class="stat-row">
            <div class="stat"><b>${st.streak}</b><span>стрик 🔥</span></div>
            <div class="stat"><b>${mat.total}</b><span>карточек в SRS</span></div>
            <div class="stat"><b>${mat.pct}%</b><span>зрелых (21+ дн.)</span></div>
          </div>
          <div class="stat-row">
            <div class="stat"><b>${st.rev}</b><span>повторов сегодня</span></div>
            <div class="stat"><b>${st.new}</b><span>новых сегодня</span></div>
            <div class="stat"><b>${settings.passedLevels.length}/8</b><span>уровней пройдено</span></div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-title">Активность за 14 дней</div>
          <div class="hist-chart">
            ${hist.map(h => `<div class="hist-col" title="${h.date}: ${h.rev} повторов, ${h.new} новых"><div class="hist-bar" style="height:${Math.round((h.rev + h.new) / maxBar * 100)}%"></div><span>${h.date.slice(8)}</span></div>`).join("")}
          </div>
          <div class="stat-title" style="margin-top:10px">Уровни курса</div>
          <div class="chips">${DB.course.map(l => `<span class="chip ${settings.passedLevels.includes(l.lv) ? "done" : ""}">${l.lv}·${l.cefr} ${settings.passedLevels.includes(l.lv) ? "✓" : isUnlocked(l.lv) ? "" : "🔒"}</span>`).join("")}</div>
        </div>
      </div>
      <div class="card">
        <div class="stat-title">Настройки</div>
        <label class="set-row">Дневная цель (карточек): <select id="setGoal">${[10, 15, 20, 30, 50].map(n => `<option ${settings.dailyGoal === n ? "selected" : ""}>${n}</option>`).join("")}</select></label>
        <label class="set-row">Новых слов в день: <select id="setNew">${[5, 10, 15, 20, 30].map(n => `<option ${settings.newPerDay === n ? "selected" : ""}>${n}</option>`).join("")}</select></label>
        <label class="set-row">Скорость озвучки: <input type="range" id="setRate" min="0.5" max="1.2" step="0.05" value="${settings.ttsRate}"> <span id="rateVal">${settings.ttsRate}</span></label>
        <label class="set-row"><input type="checkbox" id="setFree" ${settings.freeNav ? "checked" : ""}> Свободная навигация по уровням (без тестов-замков)</label>
        <div class="ctx">Голоса TTS в системе: ${TTS.listVoices().join(", ") || "французских не найдено — см. предупреждение на главной"}</div>
      </div>
      <div class="card">
        <div class="stat-title">Данные</div>
        <div class="dash-btns">
          <button class="btn" id="expBtn">💾 Экспорт прогресса (JSON)</button>
          <button class="btn" id="impBtn">📂 Импорт прогресса</button>
          <button class="btn danger" id="resetBtn">🗑 Сбросить весь прогресс</button>
        </div>
        <input type="file" id="impFile" accept=".json" class="hidden">
        <div class="ctx">Прогресс хранится в этом браузере (localStorage). Экспортируй JSON раз в неделю как резервную копию.</div>
      </div>`;
    $("#setGoal").addEventListener("change", e => { settings.dailyGoal = +e.target.value; saveSettings(); });
    $("#setNew").addEventListener("change", e => { settings.newPerDay = +e.target.value; saveSettings(); });
    $("#setRate").addEventListener("input", e => { settings.ttsRate = +e.target.value; store.set("ttsRate", settings.ttsRate); $("#rateVal").textContent = e.target.value; saveSettings(); });
    $("#setFree").addEventListener("change", e => { settings.freeNav = e.target.checked; saveSettings(); });
    $("#expBtn").addEventListener("click", () => {
      const blob = new Blob([SRS.exportAll()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `french-dani-progress-${todayISO()}.json`;
      a.click();
    });
    $("#impBtn").addEventListener("click", () => $("#impFile").click());
    $("#impFile").addEventListener("change", e => {
      const f = e.target.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { try { SRS.importAll(rd.result); alert("Прогресс импортирован!"); router(); } catch (err) { alert("Ошибка импорта: " + err.message); } };
      rd.readAsText(f);
    });
    $("#resetBtn").addEventListener("click", () => {
      if (confirm("Удалить ВЕСЬ прогресс (карточки, стрик, пройденные уровни)? Это необратимо.")) {
        SRS.resetAll(); settings = { ...defaultSettings }; saveSettings(); router();
      }
    });
  };

  // ---------- Старт ----------
  renderShell();
  router();
  SRS.touchDay(0, 0, 0);
})();
