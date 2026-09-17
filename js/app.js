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

  // ---------- Иконки (SVG, в стиле SF Symbols) ----------
  const ic = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const IC = {
    home: ic('<path d="M3.8 10.7 12 3.8l8.2 6.9"/><path d="M6 9.5V19a1.2 1.2 0 0 0 1.2 1.2h2.9v-5.2a1.9 1.9 0 0 1 3.8 0v5.2h2.9A1.2 1.2 0 0 0 18 19V9.5"/>'),
    grad: ic('<path d="M12 3.9 2.6 8.2l9.4 4.3 9.4-4.3L12 3.9z"/><path d="M6.4 10.6v4.5c0 1.7 2.5 3.1 5.6 3.1s5.6-1.4 5.6-3.1v-4.5"/><path d="M21.4 8.2v5.3"/>'),
    cards: ic('<rect x="3.7" y="7" width="12.6" height="14.1" rx="2.5"/><path d="M8.4 4.6l10.1 2.1a2 2 0 0 1 1.6 2.4l-1.5 6.9"/>'),
    lib: ic('<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>'),
    chart: ic('<path d="M5 20v-6.3M10 20V5.6M15 20v-9.2M20 20V9.3"/>'),
    back: ic('<path d="M14.8 5.6 8.4 12l6.4 6.4"/>'),
    flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.7 2.2c.2 2.6-.9 4.2-2.2 5.7C9.1 9.5 7.6 11 7.6 13.6c0 3.7 3 6.2 6.4 6.2 3.2 0 5.6-2.4 5.6-5.4 0-2.4-1.2-3.9-2.3-5.3.1 1.7-.6 2.9-1.6 3.4.5-2.4-.3-5-1.5-6.7-.7-1-1.2-2.3-1.5-3.6z" fill="currentColor"/></svg>',
    verb: ic('<rect x="3.6" y="4.2" width="16.8" height="15.6" rx="2.4"/><path d="M3.6 9.8h16.8M9.6 9.8v10"/>'),
    grammar: ic('<path d="M12 4v16M5 8l14 8M19 8 5 16"/>'),
    read: ic('<path d="M12 6.5C10.2 5 7.6 4.3 4 4.3v13.2c3.6 0 6.2.7 8 2.1 1.8-1.4 4.4-2.1 8-2.1V4.3c-3.6 0-6.2.7-8 2.2z"/><path d="M12 6.5v13.1"/>'),
    chat: ic('<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.6 0-3-.4-4.3-1.1L3 20l1.1-5.2A8.5 8.5 0 1 1 21 11.5z"/>'),
    spark: ic('<path d="M12 4l1.8 5.2L19 11l-5.2 1.8L12 18l-1.8-5.2L5 11l5.2-1.8L12 4z"/>'),
    wave: ic('<path d="M4 10v4M8 7v10M12 4.5v15M16 7v10M20 10v4"/>'),
    compass: ic('<circle cx="12" cy="12" r="8.5"/><path d="M15.2 8.8l-1.8 4.6-4.6 1.8 1.8-4.6 4.6-1.8z"/>')
  };

  const TABS = [
    { id: "home", label: "Главная", href: "#/home", icon: IC.home },
    { id: "course", label: "Курс", href: "#/course", icon: IC.grad },
    { id: "trainer", label: "Тренажёр", href: "#/trainer", icon: IC.cards, badge: true },
    { id: "library", label: "Ещё", href: "#/library", icon: IC.lib },
    { id: "progress", label: "Прогресс", href: "#/progress", icon: IC.chart }
  ];

  const ROUTE_TITLES = {
    home: "Главная", course: "Курс", trainer: "Тренажёр", library: "Ещё", progress: "Прогресс",
    verbs: "Спряжения", grammar: "Грамматика", reading: "Чтение", dialogues: "Диалоги",
    idioms: "Идиомы", phon: "Фонетика", method: "Методика"
  };
  const LIB_ROUTES = ["verbs", "grammar", "reading", "dialogues", "idioms", "phon", "method"];
  let backTarget = null;

  // ---------- Оболочка ----------
  function renderShell() {
    document.body.innerHTML = `
      <div class="app">
        <header class="topbar">
          <button class="tb-back" id="tbBack" aria-label="Назад">${IC.back}<span id="tbBackLabel">Ещё</span></button>
          <div class="tb-brand"><span class="flagmark"></span><span class="tb-brand-name">Le français</span></div>
          <div class="tb-title" id="tbTitle">Главная</div>
          <div class="tb-right">
            <div class="streak-chip" title="Дней подряд">${IC.flame}<b id="streakNum">0</b></div>
          </div>
        </header>
        <main class="main" id="main"><div class="loading">Загрузка базы…</div></main>
        <nav class="tabbar" id="tabbar" aria-label="Разделы">
          ${TABS.map(t => `<a class="tab" data-tab="${t.id}" href="${t.href}"><span class="tab-ico">${t.icon}</span><span class="tab-label">${t.label}</span>${t.badge ? '<em class="badge" id="dueBadge"></em>' : ""}</a>`).join("")}
        </nav>
      </div>`;
    main = $("#main");
    $("#tbBack").addEventListener("click", () => { if (backTarget) navigate(backTarget); });
    updateBadges();
  }

  function updateBadges() {
    const st = SRS.todayStats();
    const b = $("#dueBadge"); if (b) { b.textContent = st.due || ""; b.style.display = st.due ? "flex" : "none"; }
    const s = $("#streakNum"); if (s) s.textContent = st.streak;
  }

  // ---------- Роутер ----------
  function router() {
    const h = location.hash || "#/home";
    const parts = h.slice(2).split("/");
    const route = parts[0] || "home";
    const tab = LIB_ROUTES.includes(route) ? "library" : route;
    $$(".tabbar .tab").forEach(a => a.classList.toggle("active", a.dataset.tab === tab));
    // кнопка «назад» для вложенных экранов
    const isChild = parts.length > 1;
    backTarget = isChild ? (route === "course" ? "#/course" : "#/library") : null;
    const tb = $("#tbBack");
    if (tb) {
      document.body.classList.toggle("has-back", !!backTarget);
      if (backTarget) $("#tbBackLabel").textContent = route === "course" ? "Курс" : "Ещё";
    }
    const t = $("#tbTitle"); if (t) t.textContent = ROUTE_TITLES[route] || "Главная";
    document.body.classList.remove("in-session");
    TTS.stop();
    const fn = screens[route] || screens.home;
    main.innerHTML = "";
    window.scrollTo(0, 0);
    fn(parts.slice(1));
    updateBadges();
    // мягкое появление экрана
    main.classList.remove("anim");
    void main.offsetWidth;
    main.classList.add("anim");
    document.body.classList.remove("scrolled");
  }
  window.addEventListener("hashchange", router);

  // компактный заголовок в шапке при прокрутке
  window.addEventListener("scroll", () => {
    document.body.classList.toggle("scrolled", window.scrollY > 44);
  }, { passive: true });

  const h1 = (t, sub = "") => `<div class="page-head"><h1>${t}</h1>${sub ? `<p class="sub">${sub}</p>` : ""}</div>`;

  // ---------- Главная ----------
  function ringSVG(pct) {
    const R = 26, C = 2 * Math.PI * R;
    return `<svg class="ring" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="${R}" class="ring-bg"/>
      <circle cx="32" cy="32" r="${R}" class="ring-fill" style="stroke-dasharray:${C.toFixed(1)};stroke-dashoffset:${(C * (1 - pct / 100)).toFixed(1)}"/>
    </svg>`;
  }

  screens.home = () => {
    const st = SRS.todayStats();
    const mat = SRS.maturity();
    const done = st.rev + st.new;
    const goalPct = Math.min(100, Math.round(done / Math.max(1, settings.dailyGoal) * 100));
    const lvl = DB.course.find(l => l.lv === settings.lastLevel) || DB.course[0];
    const unlocked = isUnlocked(lvl.lv);
    const idiom = DB.idioms[(new Date().getDate() * 7 + new Date().getMonth() * 31) % DB.idioms.length];
    const hr = new Date().getHours();
    const greet = hr < 5 ? "Bonne nuit" : hr < 18 ? "Bonjour" : "Bonsoir";
    const dateStr = new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });
    main.innerHTML = `
      <div class="page-head home-head">
        <p class="date-cap">${dateStr}</p>
        <h1>${greet}, <span class="serif-it">Даня</span></h1>
        <p class="sub">Путь к свободному французскому — A1 → C1</p>
      </div>

      <section class="hero">
        <div class="hero-top">
          <div class="hero-ring">${ringSVG(goalPct)}<span class="hero-ring-label"><b>${goalPct}%</b>цели</span></div>
          <div class="hero-stats">
            <div class="hero-stat"><b>${st.due}</b><span>карт к повтору</span></div>
            <div class="hero-stat"><b>${done}</b><span>из ${settings.dailyGoal} на сегодня</span></div>
            <div class="hero-stat"><b>${st.streak}</b><span>${pluralRu(st.streak, "день", "дня", "дней")} подряд</span></div>
          </div>
        </div>
        <div class="hero-btns">
          <a class="btn hero-primary" href="#/trainer">${st.due ? `Повторить ${st.due}` : "Тренироваться"}</a>
          <a class="btn hero-ghost" href="#/course/lvl/${lvl.lv}">Ур. ${lvl.lv} · ${lvl.cefr}</a>
        </div>
      </section>

      <div class="qa-grid">
        <a class="qa-tile" href="#/course"><span class="qa-ico c-blue">${IC.grad}</span><span class="qa-t">Курс</span><span class="qa-s">${unlocked ? `Уровень ${lvl.lv} · ${lvl.cefr}` : "Открой уровень " + lvl.lv}</span></a>
        <a class="qa-tile" href="#/verbs"><span class="qa-ico c-violet">${IC.verb}</span><span class="qa-t">Спряжения</span><span class="qa-s">${DB.verbs.length} глаголов</span></a>
        <a class="qa-tile" href="#/grammar"><span class="qa-ico c-teal">${IC.grammar}</span><span class="qa-t">Грамматика</span><span class="qa-s">${DB.grammar.length} уроков</span></a>
        <a class="qa-tile" href="#/dialogues"><span class="qa-ico c-green">${IC.chat}</span><span class="qa-t">Диалоги</span><span class="qa-s">${DB.dialogues.length} с озвучкой</span></a>
      </div>

      <section class="card idiom-card">
        <div class="card-cap">Выражение дня</div>
        <div class="idiom-fr">${spkBtn(idiom.fr)}<b>${esc(idiom.fr)}</b></div>
        <div class="idiom-lit">буквально: ${esc(idiom.lit)}</div>
        <div class="idiom-ru">${esc(idiom.ru)}</div>
        ${idiom.ex ? `<div class="idiom-ex">${spkBtn(idiom.ex)}${esc(idiom.ex)}</div>` : ""}
        <a class="link-more" href="#/idioms">Все выражения</a>
      </section>

      <section class="card">
        <div class="card-cap">База знаний</div>
        <div class="kb-grid">
          <div><b>${DB.vocab.length}</b><span>слов</span></div>
          <div><b>${DB.verbs.length}</b><span>глаголов</span></div>
          <div><b>${DB.grammar.length}</b><span>уроков</span></div>
          <div><b>${DB.reading.length}</b><span>текстов</span></div>
          <div><b>${DB.idioms.length}</b><span>идиом</span></div>
          <div><b>${mat.total}</b><span>карт в SRS</span></div>
        </div>
      </section>

      ${!TTS.hasFrenchVoice() ? `<div class="warn-box">В системе не найден французский голос для озвучки. Установите французский язык/голос в настройках системы (Windows: Параметры → Время и язык → Речь; macOS: System Settings → Accessibility → Spoken Content → System Voice → French; Android/iOS: добавьте французскую клавиатуру/голос). Кнопки озвучки заработают автоматически.</div>` : ""}

      <section class="card">
        <div class="card-cap">Как заниматься эффективно</div>
        <ol class="md-ol">
          <li><b>Каждый день</b> — 30–60 минут лучше марафонов раз в неделю.</li>
          <li>Сначала <b>повторение</b> просроченного, потом новый материал.</li>
          <li>Всё французское <b>проговаривай вслух</b> — кнопки озвучки помогут.</li>
          <li>Уровень закрывается <b>тестом на ${lvl.pass}%+</b> — или включи свободную навигацию в <a href="#/progress">Прогрессе</a>.</li>
          <li>Читай тексты своего уровня: правило <b>95% понимания</b>.</li>
        </ol>
        <a class="link-more" href="#/method">Полная методика</a>
      </section>`;
  };

  // ---------- Ещё (библиотека разделов) ----------
  screens.library = () => {
    const items = [
      { href: "#/verbs", title: "Спряжения", sub: `${DB.verbs.length} глаголов · 15 времён · озвучка`, icon: IC.verb, cls: "c-blue" },
      { href: "#/grammar", title: "Грамматика", sub: `${DB.grammar.length} уроков A1 → C1 · квизы`, icon: IC.grammar, cls: "c-violet" },
      { href: "#/reading", title: "Чтение", sub: `${DB.reading.length} текстов + классика в оригинале`, icon: IC.read, cls: "c-green" },
      { href: "#/dialogues", title: "Диалоги", sub: `${DB.dialogues.length} диалогов · shadowing`, icon: IC.chat, cls: "c-teal" },
      { href: "#/idioms", title: "Идиомы", sub: `${DB.idioms.length} выражений · викторина`, icon: IC.spark, cls: "c-orange" },
      { href: "#/phon", title: "Фонетика", sub: "Звуки, правила чтения, скороговорки", icon: IC.wave, cls: "c-red" },
      { href: "#/method", title: "Методика", sub: "Техники, планы занятий, ресурсы", icon: IC.compass, cls: "c-ink" }
    ];
    main.innerHTML = `
      ${h1("Ещё", "Весь материал курса — от спряжений до классики")}
      <div class="lib-grid">
        ${items.map(i => `<a class="lib-tile" href="${i.href}"><span class="qa-ico ${i.cls}">${i.icon}</span><span class="lib-txt"><b>${i.title}</b><span>${i.sub}</span></span></a>`).join("")}
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
    document.body.classList.add("in-session");
    main.innerHTML = `<div class="session-wrap"><div id="sessionBox"></div></div>`;
    window.scrollTo(0, 0);
    EX.runSession(questions, {
      container: $("#sessionBox"), title, pass,
      onFinish: (res) => {
        updateBadges();
        if (onFinish) onFinish(res);
        if (!res.finished) router(); // «Готово» — вернуться на экран раздела
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
            <button class="btn primary" id="btnDue">Повторить просроченные${st.due ? ` · ${st.due}` : ""}</button>
            <button class="btn" id="btnNew">Новые слова · ${settings.newPerDay}</button>
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
        <button class="btn primary" id="lessonQuiz">Пройти квиз · ${g.quiz.length}</button>
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
        <button class="btn" id="readQuiz">Вопросы · ${r.questions.length}</button>
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
