// Ядро: состояние, оболочка, роутер, навигация, общие помощники
"use strict";
window.App = (() => {

  // ---------- Состояние ----------
  const defaultSettings = { dailyGoal: 20, freeNav: false, ttsRate: 0.9, passedLevels: [], lastLevel: 1, newPerDay: 15 };
  let settings = { ...defaultSettings, ...(store.get("settings", {}) || {}) };
  // Защита от повреждённых данных в localStorage
  if (!Array.isArray(settings.passedLevels)) settings.passedLevels = [];
  settings.dailyGoal = Number(settings.dailyGoal) || defaultSettings.dailyGoal;
  settings.newPerDay = Number(settings.newPerDay) || defaultSettings.newPerDay;
  settings.ttsRate = Number(settings.ttsRate) || defaultSettings.ttsRate;
  const saveSettings = () => store.set("settings", settings);

  dedupeVocab();

  const screens = {};
  let main = null;
  let currentRoute = "home";

  // ---------- Разделы ----------
  const SECTIONS = {
    home: { ru: "Главная", fr: "Accueil", icon: "home" },
    course: { ru: "Курс", fr: "Le parcours", icon: "path" },
    trainer: { ru: "Тренажёр", fr: "Révision", icon: "cards" },
    cards: { ru: "Карточки", fr: "Cartes", icon: "cards" },
    vocab: { ru: "Словарь", fr: "Vocabulaire", icon: "book" },
    verbs: { ru: "Спряжения", fr: "Conjugaison", icon: "bookOpen" },
    grammar: { ru: "Грамматика", fr: "Grammaire", icon: "braces" },
    reading: { ru: "Чтение", fr: "Lecture", icon: "page" },
    dialogues: { ru: "Диалоги", fr: "Dialogues", icon: "chat" },
    idioms: { ru: "Идиомы", fr: "Idiomes", icon: "quote" },
    phon: { ru: "Фонетика", fr: "Phonétique", icon: "wave" },
    method: { ru: "Методика", fr: "Méthode", icon: "compass" },
    progress: { ru: "Прогресс", fr: "Progression", icon: "chart" },
    profile: { ru: "Профиль", fr: "Profil", icon: "user" },
    library: { ru: "Библиотека", fr: "Bibliothèque", icon: "library" }
  };
  const TABS = ["home", "course", "trainer", "library", "profile"];
  const RAIL_GROUPS = [
    { label: "Aujourd'hui", items: ["home", "trainer", "progress"] },
    { label: "Apprendre", items: ["course", "vocab", "verbs", "grammar"] },
    { label: "Lire & écouter", items: ["reading", "dialogues", "idioms", "phon"] },
    { label: "Vous", items: ["profile", "library", "method"] }
  ];

  const sectionOf = r => SECTIONS[r] || SECTIONS.home;
  const scrollTop = () => { try { window.scrollTo(0, 0); } catch (e) { /* окружение без прокрутки */ } };
  const navigate = hash => { if (location.hash === hash) router(); else location.hash = hash; };

  // ---------- Оболочка ----------
  function renderShell() {
    const app = document.getElementById("app");
    app.innerHTML = `
      ${ICONS.defs()}
      <aside class="rail" id="rail">
        <a class="rail__brand" href="#/home" aria-label="На главную">
          <span class="rail__mark">F</span>
          <span class="col">
            <span class="rail__name">Le <i>Français</i></span>
            <span class="rail__sub">pour Дани · A1 → C1</span>
          </span>
        </a>
        <nav class="rail__nav" id="railNav" aria-label="Разделы приложения">
          ${RAIL_GROUPS.map(g => `
            <div class="rail__group">
              <div class="rail__label">${esc(g.label)}</div>
              ${g.items.map(k => {
      const s = sectionOf(k);
      return `<a class="rail__link" href="#/${k}" data-r="${k}">
                    ${icon(s.icon)}<span>${esc(s.ru)}</span>
                    ${k === "trainer" ? '<span class="badge" data-due></span>' : ""}
                    <span class="rail__fr">${esc(s.fr)}</span>
                  </a>`;
    }).join("")}
            </div>`).join("")}
        </nav>
        <div class="rail__foot">
          <a class="rail__streak" href="#/progress" aria-label="Прогресс и стрик">
            ${icon("flame")}
            <span class="col">
              <b data-streak>0</b>
              <span>дней подряд</span>
            </span>
            <span class="spacer"></span>
            <span class="col" style="align-items:flex-end;gap:3px;min-width:78px">
              <span class="hint" style="letter-spacing:.06em">цель <b data-goalpct>0%</b></span>
              <span style="width:78px">${bar(0, { size: "sm", cls: "gold", aria: "Дневная цель" })}</span>
            </span>
          </a>
          <div class="row" style="gap:6px">
            <button class="btn btn--quiet btn--sm" type="button" data-theme-toggle title="Оформление">
              ${icon("moon", "sm")}<span data-theme-label>Тёмная</span>
            </button>
            <button class="btn btn--quiet btn--icon btn--sm" type="button" data-motion-toggle title="Анимации" aria-label="Анимации">
              ${icon("sparkles", "sm")}
            </button>
            <span class="spacer"></span>
            <span class="hint" style="font-family:var(--font-display);font-style:italic;text-transform:none;letter-spacing:0;font-size:13px">Bonne journée</span>
          </div>
        </div>
      </aside>

      <div class="content">
        <header class="topbar" id="topbar">
          <a class="topbar__brand" href="#/home" aria-label="На главную">
            <span class="topbar__mark">F</span>
            <span class="topbar__name">Le <i>Français</i></span>
          </a>
          <span class="topbar__crumb" id="crumb"></span>
          <span class="topbar__actions">
            <a class="streak-pill" href="#/progress" id="streakPill" aria-label="Стрик и прогресс">
              ${icon("flame", "sm")}<b data-streak>0</b>
            </a>
            <button class="btn btn--quiet btn--icon btn--sm" type="button" data-theme-toggle aria-label="Сменить оформление"></button>
          </span>
        </header>
        <main class="main" id="main" tabindex="-1"><div class="loading">Загрузка базы…</div></main>
      </div>

      <nav class="tabbar" id="tabbar" aria-label="Основная навигация">
        ${TABS.map(k => {
      const s = sectionOf(k);
      return `<a class="tabbar__item" href="#/${k}" data-r="${k}" aria-label="${esc(s.ru)}">
                ${icon(s.icon)}
                <span class="tabbar__label">${esc(s.ru)}</span>
                ${k === "trainer" ? '<span class="badge" data-due></span>' : ""}
              </a>`;
    }).join("")}
      </nav>`;

    main = $("#main");

    // Оформление и движение
    $$("[data-theme-toggle]").forEach(b => b.addEventListener("click", () => { UI.cycleTheme(); paintThemeButtons(); updateBadges(); }));
    $$("[data-motion-toggle]").forEach(b => b.addEventListener("click", () => {
      const on = !UI.motionOn();
      UI.setMotion(on);
      UI.toast({ title: on ? "Анимации включены" : "Анимации приглушены", kind: "info", icon: "sparkles", ms: 1800 });
    }));
    UI.setMotion(UI.motionOn());
    UI.applyTheme(UI.themePref());
    paintThemeButtons();
  }

  function paintThemeButtons() {
    const pref = UI.themePref();
    const dark = UI.resolvedDark();
    const label = pref === "auto" ? "Авто" : dark ? "Тёмная" : "Светлая";
    $$("[data-theme-toggle]").forEach(b => {
      const hasLabel = $("[data-theme-label]", b);
      b.innerHTML = `${icon(pref === "auto" ? "monitor" : dark ? "moon" : "sun", "sm")}${hasLabel ? `<span data-theme-label>${esc(label)}</span>` : ""}`;
      b.setAttribute("title", `Оформление: ${label}`);
    });
  }

  function updateBadges() {
    const st = SRS.todayStats();
    const goalPct = pctOf(st.rev + st.new, Math.max(1, settings.dailyGoal));
    $$("[data-due]").forEach(b => { b.textContent = st.due || ""; b.style.display = st.due ? "inline-flex" : "none"; });
    $$("[data-streak]").forEach(b => { b.textContent = st.streak; });
    $$("[data-goalpct]").forEach(b => { b.textContent = goalPct + "%"; });
    const pill = $("#streakPill");
    if (pill) pill.classList.toggle("is-hot", st.streak >= 3);
    const railBar = $(".rail__streak .bar__fill");
    if (railBar) { railBar.style.setProperty("--val", goalPct / 100); railBar.style.animation = "none"; }
  }

  function setActive(route) {
    const parent = route === "cards" ? "trainer" : route;
    $$(".rail__link, .tabbar__item").forEach(a => {
      const on = a.dataset.r === parent;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    const crumb = $("#crumb");
    if (crumb) crumb.textContent = sectionOf(route).fr;
  }

  // ---------- Роутер ----------
  function router() {
    const h = location.hash || "#/home";
    const parts = h.replace(/^#\/?/, "").split("/").map(decodeURIComponentSafe).filter(x => x !== "");
    const route = parts[0] || "home";
    const args = parts.slice(1);
    const prevRoute = currentRoute;
    currentRoute = route;

    TTS.stop();
    UI.focusMode(false);
    setActive(route);

    const fn = screens[route] || screens.home;
    // Экраны, которые вешают слушатели «на уход», подписываются на это событие
    document.dispatchEvent(new CustomEvent("app:route:leave", { detail: { from: prevRoute, to: route } }));
    main.innerHTML = "";
    scrollTop();
    try {
      fn(args);
    } catch (err) {
      console.error("[Le Français] Ошибка экрана «" + route + "»:", err);
      main.innerHTML = errorScreen(route, err);
      bindErrorScreen();
    }
    UI.revealAll(main);
    updateBadges();
    document.dispatchEvent(new CustomEvent("app:route", { detail: { route, args } }));
  }
  function decodeURIComponentSafe(s) { try { return decodeURIComponent(s); } catch (e) { return s; } }

  function errorScreen(route, err) {
    return `<div class="screen">
      <div class="empty" style="margin-top:12vh">
        <span class="empty__ico">${icon("alert", "xl")}</span>
        <div class="empty__t">Что-то пошло не так</div>
        <div class="empty__s">Экран «${esc(route)}» не удалось отобразить. Данные и прогресс в безопасности.</div>
        <div class="btn-row" style="margin-top:8px">
          <a class="btn btn--primary" href="#/home">${icon("home", "sm")}На главную</a>
          <button class="btn btn--ghost" type="button" data-retry>${icon("refresh", "sm")}Повторить</button>
        </div>
        <div class="ctx" style="margin-top:10px;font-family:var(--font-ipa)">${esc((err && err.message) || String(err))}</div>
      </div>
    </div>`;
  }
  function bindErrorScreen() {
    const b = $("[data-retry]", main);
    if (b) b.addEventListener("click", () => router());
  }

  window.addEventListener("hashchange", router);

  // ---------- Доступ к уровням ----------
  function isUnlocked(lv) {
    if (settings.freeNav) return true;
    if (lv === 1) return true;
    return settings.passedLevels.includes(lv - 1);
  }
  function levelById(lv) { return DB.course.find(x => x.lv === Number(lv)) || DB.course[0]; }

  // Прогресс уровня — производный от реальных данных (грамматика + лексика юнитов)
  function levelProgress(l) {
    if (settings.passedLevels.includes(l.lv)) return 100;
    const touched = Activity.grammarLessonsTouched();
    const gids = new Set();
    const themes = new Set();
    for (const u of l.units) {
      (u.grammar || []).forEach(g => gids.add(g));
      (u.themes || []).forEach(t => themes.add(t));
    }
    let gDone = 0;
    gids.forEach(id => { if (touched.has(id)) gDone++; });
    let vDone = 0, vTotal = 0;
    for (const e of DB.vocab) {
      if (themes.has(e.t)) { vTotal++; if (!SRS.isNew("v:" + e.f.toLowerCase())) vDone++; }
    }
    const g = gids.size ? gDone / gids.size : 0;
    const v = vTotal ? vDone / vTotal : 0;
    return clamp(Math.round((g * 0.55 + v * 0.45) * 100), 0, 99);
  }

  // Оценка трудоёмкости уровня
  function levelEffort(l) {
    const g = l.units.reduce((s, u) => s + (u.grammar || []).length, 0);
    const themes = new Set();
    l.units.forEach(u => (u.themes || []).forEach(t => themes.add(t)));
    let words = 0;
    for (const e of DB.vocab) if (themes.has(e.t)) words++;
    const verbs = new Set();
    l.units.forEach(u => (u.verbs || []).forEach(v => verbs.add(v)));
    const hours = g * 0.35 + words * 0.012 + verbs.size * 0.18;
    return Math.max(1, Math.round(hours * 2) / 2);
  }

  function tensesForLevel(cefr) {
    return cefr === "A1" || cefr === "A1+" ? ["présent", "impératif"] :
      cefr === "A2" || cefr === "A2+" ? ["présent", "passé composé", "imparfait", "futur simple", "conditionnel présent"] :
        cefr === "B1" || cefr === "B1+" ? ["présent", "passé composé", "imparfait", "futur simple", "conditionnel présent", "subjonctif présent", "conditionnel passé", "gérondif"] :
          cefr === "B2" ? ["présent", "passé composé", "imparfait", "plus-que-parfait", "passé simple", "futur antérieur", "subjonctif présent", "subjonctif passé", "conditionnel passé"] :
            ["passé simple", "subjonctif imparfait", "subjonctif passé", "subjonctif plus-que-parfait", "passé antérieur", "conditionnel passé", "futur antérieur"];
  }

  // ---------- Помощники разметки ----------
  function screenHead(o = {}) {
    const back = o.back ? `<a class="back" href="${esc(o.back)}">${icon("chevronLeft", "sm")}${esc(o.backLabel || "Назад")}</a>` : "";
    const eyebrow = o.eyebrow ? `<span class="eyebrow ${o.eyebrowTone ? "eyebrow--" + o.eyebrowTone : ""}">${esc(o.eyebrow)}</span>` : "";
    const badges = o.badges ? [].concat(o.badges).join("") : "";
    return `<header class="screen-head ${o.row ? "screen-head--row" : ""}">
      <div class="col" style="gap:6px;min-width:0;flex:1">
        <div class="screen-head__top">${back}${eyebrow}${badges}</div>
        ${o.title ? `<h1 class="display display--1 screen-head__title">${o.title}</h1>` : ""}
        ${o.lead ? `<p class="lead screen-head__lead">${o.lead}</p>` : ""}
      </div>
      ${o.actions ? `<div class="screen-head__actions">${o.actions}</div>` : ""}
    </header>`;
  }

  function secHead(o = {}) {
    return `<div class="sec__head">
      <div class="sec__label">
        ${o.eyebrow ? `<span class="eyebrow">${esc(o.eyebrow)}</span>` : ""}
        <h2 class="sec__title">${o.title || ""}</h2>
      </div>
      ${o.more ? `<a class="sec__more" href="${esc(o.more.href)}">${esc(o.more.label)}${icon("chevronRight", "xs")}</a>` : ""}
      ${o.action || ""}
    </div>`;
  }

  function emptyState(o = {}) {
    return `<div class="empty">
      <span class="empty__ico">${icon(o.icon || "search", "xl")}</span>
      <div class="empty__t">${esc(o.title || "Пусто")}</div>
      ${o.text ? `<div class="empty__s">${esc(o.text)}</div>` : ""}
      ${o.action || ""}
    </div>`;
  }

  // ---------- Сессия упражнений ----------
  function openSession(questions, title, pass, onFinish, opts = {}) {
    if (!questions || !questions.length) {
      UI.toast({ title: "Недостаточно материала", sub: "Попробуйте другую тренировку или расширьте уровень слов", kind: "bad", icon: "alert" });
      return false;
    }
    UI.focusMode(true);
    main.innerHTML = `<div class="screen"><div class="session" id="sessionWrap"></div></div>`;
    scrollTop();
    const exit = () => {
      UI.focusMode(false);
      if (opts.onExit) opts.onExit();
      else router();
    };
    EX.runSession(questions, {
      container: $("#sessionWrap"),
      title,
      pass,
      onExit: async () => {
        const yes = await UI.confirm({
          title: "Завершить сессию?",
          text: "Прогресс уже отвеченных карточек сохранён. Сессию можно начать заново в любое время.",
          ok: "Завершить", cancel: "Продолжить"
        });
        if (yes) exit();
      },
      onFinish: res => {
        updateBadges();
        if (onFinish) onFinish(res);
        if (opts.exitOnFinish !== false && res && res.closed) exit();
      }
    });
    return true;
  }

  // Обновить «живые» счётчики без перерисовки экрана
  function refresh() { updateBadges(); }

  function start() {
    renderShell();
    UI.initScrollState();
    UI.initParallax();
    router();
    SRS.touchDay(0, 0, 0);
    const boot = document.getElementById("boot");
    if (boot) {
      setTimeout(() => {
        boot.classList.add("is-out");
        setTimeout(() => boot.remove(), 620);
      }, 420);
    }
  }

  return {
    screens, start, router, navigate, refresh,
    get main() { return main; },
    get settings() { return settings; },
    set settings(v) { settings = v; },
    saveSettings,
    defaultSettings,
    get route() { return currentRoute; },
    SECTIONS, TABS, sectionOf,
    isUnlocked, levelById, levelProgress, levelEffort, tensesForLevel,
    screenHead, secHead, emptyState, openSession, updateBadges, setActive
  };
})();
