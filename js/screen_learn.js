// Экраны обучения: курс, уровни, грамматика, спряжения
"use strict";
(() => {
  const A = window.App;

  /* ================= КУРС ================= */

  A.screens.course = (args) => {
    if (args && args[0] === "lvl") return A.screens.courseLevel(args[1]);
    const main = A.main;
    const s = A.settings;
    const passed = s.passedLevels.length;
    const total = DB.course.length;

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Le parcours · A1 → C1",
      title: "Курс <em>французского</em>",
      lead: `${total} уровней от первого звука до свободной речи. Каждый уровень закрывается тестом — или включите свободный доступ в профиле.`,
      actions: `<a class="btn btn--ghost" href="#/profile">${icon("settings", "sm")}Свободная навигация</a>`
    })}

      <section class="card card--glass" aria-label="Общий прогресс курса">
        <div class="row" style="align-items:center;gap:16px;flex-wrap:wrap">
          ${ring(pctOf(passed, total), { size: 74, w: 6, cls: "gold", num: passed + "/" + total, cap: "" })}
          <div class="col" style="gap:5px;flex:1;min-width:180px">
            <span class="eyebrow">Progression du cours</span>
            <div class="h1">${passed ? `Пройдено ${passed} ${pluralRu(passed, "уровень", "уровня", "уровней")}` : "Путь только начинается"}</div>
            <div class="ctx">${s.freeNav ? "Свободная навигация включена — все уровни открыты" : `Следующий уровень откроется после теста на ${A.levelById(passed + 1).pass || 80}%+`}</div>
          </div>
          <a class="btn btn--primary" href="#/course/lvl/${Math.min(total, passed + 1)}">${icon("play", "sm")}Продолжить</a>
        </div>
      </section>

      <div class="levels" data-stagger=":scope > *">
        ${DB.course.map(l => {
      const un = A.isUnlocked(l.lv);
      const done = s.passedLevels.includes(l.lv);
      const p = A.levelProgress(l);
      const gCount = l.units.reduce((n, u) => n + (u.grammar || []).length, 0);
      const hours = A.levelEffort(l);
      const base = l.cefr.replace("+", "").toLowerCase();
      return `<a class="level level--${base} ${un ? "" : "level--locked"} ${done ? "level--passed" : ""}" href="#/course/lvl/${l.lv}" aria-label="Уровень ${l.lv}, ${esc(l.cefr)}: ${esc(l.title)}">
                <span class="level__tint" aria-hidden="true"></span>
                <span class="level__top">
                  <span class="level__num">${pad2(l.lv)}</span>
                  ${cefrBadge(l.cefr)}
                  <span class="level__top-r">
                    ${done ? pill("пройден", "ok", "check") : un ? "" : `<span class="level__lock">${icon("lock", "sm")}</span>`}
                  </span>
                </span>
                <h3 class="level__title">${esc(l.title)}</h3>
                <p class="level__desc">${esc(l.desc)}</p>
                <span class="level__foot">
                  <span class="level__meta">${l.units.length} ${pluralRu(l.units.length, "юнит", "юнита", "юнитов")} · ${gCount} ${pluralRu(gCount, "урок", "урока", "уроков")}<br>≈ ${hours} ч практики</span>
                  ${ring(p, { size: 46, w: 5, cls: done ? "ok" : "", num: p + "%", cap: "", aria: `Прогресс уровня ${l.lv}: ${p}%` })}
                </span>
              </a>`;
    }).join("")}
      </div>
    </div>`;
  };

  A.screens.courseLevel = (lvArg) => {
    const lv = parseInt(lvArg, 10);
    const l = DB.course.find(x => x.lv === lv);
    if (!l) return A.screens.course([]);
    A.settings.lastLevel = lv; A.saveSettings();
    const main = A.main;

    if (!A.isUnlocked(lv)) {
      const prev = A.levelById(lv - 1);
      main.innerHTML = `<div class="screen">
        ${A.screenHead({
        back: "#/course", backLabel: "Курс",
        eyebrow: `Niveau ${lv}`, title: `${esc(l.cefr)} — ${esc(l.title)}`, lead: esc(l.desc)
      })}
        <div class="notice">
          <span class="notice__ico">${icon("lock", "sm")}</span>
          <span>Уровень откроется после теста уровня ${lv - 1} на ${prev.pass}% и выше. Или включите свободную навигацию в <a href="#/profile">профиле</a> — тогда все уровни доступны сразу.</span>
        </div>
        <div class="btn-row">
          <a class="btn btn--primary" href="#/course/lvl/${lv - 1}">${icon("arrowLeft", "sm")}К уровню ${lv - 1}</a>
          <a class="btn btn--ghost" href="#/profile">${icon("settings", "sm")}Открыть все уровни</a>
        </div>
      </div>`;
      return;
    }

    const s = A.settings;
    const passed = s.passedLevels.includes(lv);
    const p = A.levelProgress(l);
    const gCount = l.units.reduce((n, u) => n + (u.grammar || []).length, 0);
    const themes = [...new Set(l.units.flatMap(u => u.themes || []))];
    const verbs = [...new Set(l.units.flatMap(u => u.verbs || []))];
    const words = DB.vocab.filter(e => themes.includes(e.t)).length;
    const readings = l.units.flatMap(u => u.readings || []);

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      back: "#/course", backLabel: "Курс",
      eyebrow: `Niveau ${lv} · ${l.cefr}`,
      title: esc(l.title),
      lead: esc(l.desc),
      badges: cefrBadge(l.cefr) + (passed ? pill("пройден", "ok", "check") : "")
    })}

      <section class="card card--hero" style="padding:20px">
        <div class="row" style="align-items:center;gap:18px;flex-wrap:wrap">
          ${ring(p, { size: 92, w: 7, cls: passed ? "ok" : "", num: p + "%", cap: "готово", delay: 1 })}
          <div class="col" style="gap:8px;flex:1;min-width:190px">
            <span class="eyebrow">Votre progression</span>
            <div class="stats" style="grid-template-columns:repeat(auto-fit,minmax(84px,1fr));gap:8px">
              <div class="stat stat--flat"><span class="stat__num" style="font-size:1.35rem">${l.units.length}</span><span class="stat__cap">юнитов</span></div>
              <div class="stat stat--flat"><span class="stat__num" style="font-size:1.35rem">${gCount}</span><span class="stat__cap">уроков</span></div>
              <div class="stat stat--flat"><span class="stat__num" style="font-size:1.35rem">${fmtNum(words)}</span><span class="stat__cap">слов</span></div>
              <div class="stat stat--flat"><span class="stat__num" style="font-size:1.35rem">${verbs.length}</span><span class="stat__cap">глаголов</span></div>
            </div>
          </div>
        </div>
      </section>

      <div class="units" data-stagger=":scope > *">
        ${l.units.map((u, ui) => `
          <article class="unit">
            <div class="unit__head">
              <span class="unit__n">${pad2(ui + 1)}</span>
              <div class="col" style="gap:6px;flex:1;min-width:0">
                <h3 class="unit__t">${esc(u.title)}</h3>
                <ul class="unit__goals">${u.goals.map(g => `<li>${esc(g)}</li>`).join("")}</ul>
              </div>
            </div>
            <div class="ublocks">
              <div class="ublock">
                <span class="ublock__t">${icon("braces", "xs")}Грамматика</span>
                <div class="chips">${(u.grammar || []).map(gid => {
          const g = DB.grammar.find(x => x.id === gid);
          if (!g) return "";
          const touched = Activity.grammarLessonsTouched().has(gid);
          return `<a class="chip ${touched ? "chip--done" : ""}" href="#/grammar/${encodeURIComponent(gid)}">${touched ? icon("check", "xs") : ""}${esc(g.title.split(":")[0])}</a>`;
        }).join("")}</div>
              </div>
              ${u.themes && u.themes.length ? `<div class="ublock">
                <span class="ublock__t">${icon("book", "xs")}Слова · ${esc(u.themes.join(", "))}</span>
                <div class="chips">
                  <button class="chip" type="button" data-train-vocab="${ui}">${icon("play", "xs")}Тренировать слова юнита</button>
                  <a class="chip chip--gold" href="#/vocab/lvl/${encodeURIComponent(l.cefr)}">${icon("search", "xs")}Открыть в словаре</a>
                </div>
              </div>` : ""}
              ${u.verbs && u.verbs.length ? `<div class="ublock">
                <span class="ublock__t">${icon("bookOpen", "xs")}Глаголы</span>
                <div class="chips">
                  ${u.verbs.map(v => `<a class="chip" href="#/verbs/${encodeURIComponent(v)}">${esc(v)}</a>`).join("")}
                  <button class="chip" type="button" data-train-verbs="${ui}">${icon("play", "xs")}Тренировать спряжения</button>
                </div>
              </div>` : ""}
              ${u.readings && u.readings.length ? `<div class="ublock">
                <span class="ublock__t">${icon("page", "xs")}Чтение</span>
                <div class="chips">${u.readings.map(r => {
          const t = DB.reading.find(x => String(x.id) === String(r));
          return `<a class="chip" href="#/reading/${encodeURIComponent(r)}">${t ? esc(t.title) : "текст"}</a>`;
        }).join("")}</div>
              </div>` : ""}
              ${u.phon && u.phon.length ? `<div class="ublock">
                <span class="ublock__t">${icon("wave", "xs")}Фонетика</span>
                <div class="chips"><a class="chip" href="#/phon">${icon("arrowRight", "xs")}Открыть раздел</a></div>
              </div>` : ""}
            </div>
          </article>`).join("")}
      </div>

      <section class="testcard">
        <div class="row" style="gap:12px;align-items:flex-start">
          <span class="tile__ico" style="background:var(--accent-wash);border-color:var(--accent-brd)">${icon("target")}</span>
          <div class="col" style="gap:5px;flex:1;min-width:0">
            <h3 class="testcard__t">Итоговый тест уровня ${lv}</h3>
            <p class="testcard__s">≈ 22 вопроса: грамматика, лексика, спряжения и идиомы. Порог — ${l.pass}%. ${passed ? "Уровень уже засчитан." : "После успешной сдачи откроется следующий уровень."}</p>
          </div>
        </div>
        <div class="btn-row btn-row--stretch">
          <button class="btn btn--primary btn--lg" type="button" id="startTest">${icon("pen", "sm")}Начать тест</button>
          <a class="btn btn--ghost btn--lg" href="#/cards/lvl/${encodeURIComponent(l.cefr)}">${icon("cards", "sm")}Карточки уровня</a>
        </div>
      </section>

      ${readings.length ? `<div class="ctx" style="text-align:center">${icon("page", "xs")} К уровню подобрано ${readings.length} ${pluralRu(readings.length, "текст", "текста", "текстов")} для чтения</div>` : ""}
      <div class="btn-row" style="justify-content:space-between">
        ${lv > 1 ? `<a class="btn btn--quiet" href="#/course/lvl/${lv - 1}">${icon("arrowLeft", "sm")}Уровень ${lv - 1}</a>` : `<span></span>`}
        ${lv < DB.course.length ? `<a class="btn btn--quiet" href="#/course/lvl/${lv + 1}">Уровень ${lv + 1}${icon("arrowRight", "sm")}</a>` : `<a class="btn btn--quiet" href="#/progress">${icon("chart", "sm")}Прогресс</a>`}
      </div>
    </div>`;

    $$("[data-train-vocab]", main).forEach(b => b.addEventListener("click", () => {
      const u = l.units[+b.dataset.trainVocab];
      const qs = EX.sessionVocab([l.cefr.replace("+", ""), l.cefr], u.themes, 15);
      const qs2 = qs.length ? qs : EX.sessionVocab(["A1", "A2", "B1", "B2", "C1"], u.themes, 15);
      A.openSession(qs2, `Слова · ${u.title}`);
    }));
    $$("[data-train-verbs]", main).forEach(b => b.addEventListener("click", () => {
      const u = l.units[+b.dataset.trainVerbs];
      const qs = EX.sessionVerbs(u.verbs, A.tensesForLevel(l.cefr), 12);
      A.openSession(qs, `Спряжения · ${u.title}`);
    }));
    $("#startTest", main).addEventListener("click", () => {
      const qs = EX.sessionLevelTest(l);
      A.openSession(qs, `Тест уровня ${lv} · ${l.cefr}`, l.pass, res => {
        if (res.pass === true && !A.settings.passedLevels.includes(lv)) {
          A.settings.passedLevels.push(lv);
          A.saveSettings();
          UI.toast({ title: `Niveau ${lv} validé`, sub: "Уровень засчитан — следующий открыт", kind: "gold", icon: "crown", ms: 4200 });
        }
      });
    });
  };

  /* ================= ГРАММАТИКА ================= */

  A.screens.grammar = (args) => {
    if (args && args[0]) return lessonView(args[0]);
    const main = A.main;
    const touched = Activity.grammarLessonsTouched();

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Grammaire",
      title: "Грамматика <em>A1 → C1</em>",
      lead: `${DB.grammar.length} уроков: от артиклей до subjonctif imparfait. В каждом — правила, примеры с озвучкой и квиз.`,
      actions: `<span class="pill pill--ok">${icon("check", "xs")}${touched.size} закреплено</span>`
    })}
      <div class="vtoolbar">
        <div class="search">
          <span class="search__ico">${icon("search", "sm")}</span>
          <input class="input input--search" id="gSearch" type="search" placeholder="Поиск урока: subjonctif, артикли, passé composé…" aria-label="Поиск урока грамматики">
        </div>
        <div class="chips chips--scroll" id="gLevels">
          ${["all", "A1", "A2", "B1", "B2", "C1"].map((lv, i) => `<button class="chip ${i === 0 ? "is-active" : ""}" type="button" data-lv="${lv}">${lv === "all" ? "Все уровни" : lv}</button>`).join("")}
        </div>
      </div>
      <div id="gList" class="stack"></div>
    </div>`;

    const listBox = $("#gList", main);
    let q = "", lv = "all";

    function draw() {
      const s = q.trim().toLowerCase();
      const lessons = DB.grammar.filter(g =>
        (lv === "all" || g.lv === lv) &&
        (!s || norm(g.title).includes(norm(s)) || norm(g.content || "").includes(norm(s)))
      );
      if (!lessons.length) {
        listBox.innerHTML = A.emptyState({ icon: "search", title: "Ничего не найдено", text: "Попробуйте другой запрос или снимите фильтр уровня." });
        return;
      }
      const byLv = {};
      lessons.forEach(g => (byLv[g.lv] = byLv[g.lv] || []).push(g));
      listBox.innerHTML = ["A1", "A2", "B1", "B2", "C1"].filter(k => byLv[k]).map(k => `
        <section class="card card--flat" style="padding:16px 18px">
          <div class="row" style="gap:10px;margin-bottom:12px">
            ${cefrBadge(k)}
            <span class="eyebrow">${byLv[k].length} ${pluralRu(byLv[k].length, "урок", "урока", "уроков")}</span>
            <span class="spacer"></span>
            <button class="btn btn--quiet btn--sm" type="button" data-quiz-lv="${k}">${icon("pen", "xs")}Квиз по уровню</button>
          </div>
          <div class="entries">
            ${byLv[k].sort((a, b) => (a.u - b.u) || (a.n - b.n)).map(g => {
        const done = touched.has(g.id);
        return `<a class="entry ${done ? "entry--done" : ""}" href="#/grammar/${encodeURIComponent(g.id)}">
                    <span class="entry__n">${pad2(g.n)}</span>
                    <span class="entry__body">
                      <span class="entry__t">${esc(g.title)}</span>
                      <span class="entry__s">${g.quiz.length} ${pluralRu(g.quiz.length, "вопрос", "вопроса", "вопросов")}${g.ex && g.ex.length ? ` · ${g.ex.length} примера` : ""}${done ? " · закреплено" : ""}</span>
                    </span>
                    <span class="entry__end">${done ? `<span style="color:var(--ok)">${icon("check", "sm")}</span>` : ""}${icon("chevronRight", "sm")}</span>
                  </a>`;
      }).join("")}
          </div>
        </section>`).join("");

      $$("[data-quiz-lv]", listBox).forEach(b => b.addEventListener("click", () => {
        const pool = DB.grammar.filter(g => g.lv === b.dataset.quizLv);
        const qs = pool.flatMap(g => shuffle(g.quiz.map(x => EX.qFromQuiz(x, g.id)).filter(Boolean)).slice(0, 2));
        A.openSession(shuffle(qs).slice(0, 20), `Квиз · уровень ${b.dataset.quizLv}`);
      }));
    }

    draw();
    $("#gSearch", main).addEventListener("input", e => { q = e.target.value; draw(); });
    $$("#gLevels .chip", main).forEach(b => b.addEventListener("click", () => {
      $$("#gLevels .chip", main).forEach(x => x.classList.remove("is-active"));
      b.classList.add("is-active"); lv = b.dataset.lv; draw();
    }));
  };

  function lessonView(id) {
    const g = DB.grammar.find(x => x.id === id);
    if (!g) return A.screens.grammar([]);
    const main = A.main;
    const order = DB.grammar.slice().sort((a, b) => (a.lv === b.lv ? (a.u - b.u) || (a.n - b.n) : ["A1", "A2", "B1", "B2", "C1"].indexOf(a.lv) - ["A1", "A2", "B1", "B2", "C1"].indexOf(b.lv)));
    const gi = order.findIndex(x => x.id === id);
    const prev = order[gi - 1], next = order[gi + 1];
    const done = Activity.grammarLessonsTouched().has(g.id);

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      back: "#/grammar", backLabel: "Грамматика",
      eyebrow: `Grammaire · ${g.lv}`,
      title: esc(g.title),
      badges: cefrBadge(g.lv) + (done ? pill("закреплено", "ok", "check") : "")
    })}

      <article class="lesson">${md(g.content)}</article>

      ${g.ex && g.ex.length ? `<section class="card">
        <div class="row" style="gap:10px;margin-bottom:14px">
          ${icon("volume", "sm")}
          <h2 class="h2">Примеры</h2>
          <span class="spacer"></span>
          <span class="hint">нажмите и повторите вслух</span>
        </div>
        <div class="stack stack--sm">${g.ex.map(e => `<div class="md-ex"><span class="fr-line">${spkBtn(e[0])}<span>${esc(e[0])}</span></span><span class="ru-line">${esc(e[1])}</span></div>`).join("")}</div>
      </section>` : ""}

      ${g.points && g.points.length ? `<section class="card">
        <div class="row" style="gap:10px;margin-bottom:6px">${icon("sparkles", "sm")}<h2 class="h2">Запомнить</h2></div>
        <ul class="points">${g.points.map(p => `<li>${icon("check", "xs")}<span>${esc(p)}</span></li>`).join("")}</ul>
      </section>` : ""}

      <div class="btn-row btn-row--stretch">
        <button class="btn btn--primary btn--lg" type="button" id="lessonQuiz">${icon("pen", "sm")}Пройти квиз · ${g.quiz.length}</button>
      </div>
      <div class="btn-row" style="justify-content:space-between">
        ${prev ? `<a class="btn btn--quiet btn--sm" href="#/grammar/${encodeURIComponent(prev.id)}">${icon("arrowLeft", "sm")}<span class="truncate" style="max-width:38vw">${esc(prev.title.split(":")[0])}</span></a>` : "<span></span>"}
        ${next ? `<a class="btn btn--quiet btn--sm" href="#/grammar/${encodeURIComponent(next.id)}"><span class="truncate" style="max-width:38vw">${esc(next.title.split(":")[0])}</span>${icon("arrowRight", "sm")}</a>` : ""}
      </div>
    </div>`;

    $("#lessonQuiz", main).addEventListener("click", () => A.openSession(EX.sessionLesson(g), `Квиз · ${g.title}`));
    Activity.bump("grammar_open");
  }

  /* ================= СПРЯЖЕНИЯ ================= */

  const TENSES15 = ["présent", "passé composé", "imparfait", "plus-que-parfait", "passé simple", "passé antérieur",
    "futur simple", "futur antérieur", "conditionnel présent", "conditionnel passé",
    "subjonctif présent", "subjonctif passé", "subjonctif imparfait", "subjonctif plus-que-parfait", "impératif"];
  const TENSE_RU = {
    "présent": "настоящее", "passé composé": "прошедшее сложное", "imparfait": "прошедшее несовершенное",
    "plus-que-parfait": "предпрошедшее", "passé simple": "простое прошедшее (книжное)", "passé antérieur": "предпрошедшее книжное",
    "futur simple": "будущее", "futur antérieur": "предбудущее", "conditionnel présent": "условное настоящее",
    "conditionnel passé": "условное прошедшее", "subjonctif présent": "сослагательное настоящее", "subjonctif passé": "сослагательное прошедшее",
    "subjonctif imparfait": "сослагательное несовершенное (книжное)", "subjonctif plus-que-parfait": "сослагательное предпрошедшее (книжное)",
    "impératif": "повелительное"
  };

  A.screens.verbs = (args) => {
    if (args && args[0]) return verbDetail(args[0]);
    const main = A.main;

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Conjugaison",
      title: "Спряжения <em>глаголов</em>",
      lead: `${DB.verbs.length} глаголов × 15 времён — включая passé simple, subjonctif imparfait и возвратные с согласованием. Каждая форма озвучивается.`
    })}
      <div class="vtoolbar">
        <div class="search">
          <span class="search__ico">${icon("search", "sm")}</span>
          <input class="input input--search" id="vSearch" type="search" placeholder="Поиск: parler, быть, se lever…" aria-label="Поиск глагола">
        </div>
        <div class="chips chips--scroll" id="vFilters">
          ${[["all", "Все"], ["топ-20", "Топ-20"], ["1", "1 группа"], ["2", "2 группа"], ["3", "3 группа"], ["возвр.", "Возвратные"], ["модальный", "Модальные"]]
      .map(([k, label], i) => `<button class="chip ${i === 0 ? "is-active" : ""}" type="button" data-f="${esc(k)}">${esc(label)}</button>`).join("")}
        </div>
      </div>
      <div class="row" style="gap:10px">
        <span class="vtoolbar__count" id="vCount"></span>
        <span class="spacer"></span>
        <button class="btn btn--quiet btn--sm" type="button" id="vTrain">${icon("dice", "sm")}Случайная тренировка</button>
      </div>
      <div id="vList" class="verbs" data-stagger=":scope > *"></div>
    </div>`;

    const list = $("#vList", main), countEl = $("#vCount", main);
    let filter = "all", q = "";

    function draw() {
      const s = q.trim().toLowerCase();
      let vs = DB.verbs.filter(v => {
        const okF = filter === "all"
          || (["1", "2", "3"].includes(filter) ? String(v.group) === filter : (v.tags || []).includes(filter));
        const okQ = !s || v.inf.toLowerCase().includes(s) || norm(v.inf).includes(norm(s)) || v.ru.toLowerCase().includes(s);
        return okF && okQ;
      });
      countEl.textContent = `${vs.length} ${pluralRu(vs.length, "глагол", "глагола", "глаголов")}`;
      if (!vs.length) {
        list.innerHTML = A.emptyState({ icon: "search", title: "Ничего не найдено", text: "Проверьте запрос или выберите другой фильтр." });
        return;
      }
      list.innerHTML = vs.slice(0, 400).map(v => `
        <a class="verb" href="#/verbs/${encodeURIComponent(v.inf)}">
          <span class="verb__inf">${esc(v.inf)}</span>
          ${grpBadge(v.group)}
          <span class="verb__ru">${esc(v.ru)}</span>
        </a>`).join("");
    }

    draw();
    $("#vSearch", main).addEventListener("input", e => { q = e.target.value; draw(); });
    $$("#vFilters .chip", main).forEach(b => b.addEventListener("click", () => {
      $$("#vFilters .chip", main).forEach(x => x.classList.remove("is-active"));
      b.classList.add("is-active"); filter = b.dataset.f; draw();
    }));
    $("#vTrain", main).addEventListener("click", () => {
      A.openSession(EX.sessionVerbs([], A.tensesForLevel("B1"), 12), "Случайные спряжения");
    });
  };

  function verbDetail(inf) {
    const v = DB.verbs.find(x => x.inf === inf);
    if (!v) return A.screens.verbs([]);
    const main = A.main;
    const ger = v.gerondif || v.gérondif;

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      back: "#/verbs", backLabel: "Спряжения",
      eyebrow: "Conjugaison · " + v.group + " группа",
      title: "",
      badges: grpBadge(v.group)
    })}
      <div class="verbhead">
        <div class="verbhead__t">
          <h1 class="verbhead__inf">${esc(v.inf)}</h1>
          ${spkBtn(v.inf, "lg")}
        </div>
        <div class="lead">${esc(v.ru)}</div>
        <div class="verbhead__facts">
          <span class="fact">auxiliaire <b>${esc(v.aux)}</b></span>
          <span class="fact">participe passé <b>${esc(v.pp)}</b></span>
          ${v.part_pres ? `<span class="fact">part. présent <b>${esc(v.part_pres)}</b></span>` : ""}
          ${ger ? `<span class="fact">gérondif <b>${esc(ger)}</b></span>` : ""}
          ${v.refl ? `<span class="fact">возвратный</span>` : ""}
        </div>
      </div>

      ${v.notes ? `<div class="notice notice--info"><span class="notice__ico">${icon("info", "sm")}</span><span>${esc(v.notes)}</span></div>` : ""}

      ${v.example ? `<div class="md-ex"><span class="fr-line">${spkBtn(v.example[0])}<span>${esc(v.example[0])}</span></span><span class="ru-line">${esc(v.example[1])}</span></div>` : ""}

      <div class="tabs" id="tenseTabs" role="tablist" aria-label="Времена">
        ${TENSES15.map((t, i) => `<button class="tab ${i === 0 ? "is-active" : ""}" type="button" role="tab" aria-selected="${i === 0}" data-t="${esc(t)}">${esc(t)}</button>`).join("")}
      </div>
      <div id="tenseBox"></div>

      <div class="btn-row btn-row--stretch">
        <button class="btn btn--primary btn--lg" type="button" id="trainVerb">${icon("target", "sm")}Тренировать глагол</button>
        <button class="btn btn--ghost btn--lg" type="button" id="trainVerbAll">${icon("dice", "sm")}Это время · случайные глаголы</button>
      </div>
    </div>`;

    function drawTense(t) {
      const box = $("#tenseBox", main);
      const forms = v.forms[t];
      const isImp = t === "impératif";
      const empty = !forms || forms.every(f => !f || f === "—");
      if (empty) {
        box.innerHTML = `<div class="card">
          <h2 class="tense-title">${esc(t)} <span class="ctx">${esc(TENSE_RU[t] || "")}</span></h2>
          <p class="ctx">Для этого глагола форма не употребляется.</p>
        </div>`;
        return;
      }
      const rows = isImp
        ? [["tu", forms[0] || (v.imper && v.imper[0])], ["nous", forms[1] || (v.imper && v.imper[1])], ["vous", forms[2] || (v.imper && v.imper[2])]].filter(r => r[1])
        : EX.PRON6.map((p, i) => [p, forms[i]]);
      box.innerHTML = `<div class="card" style="padding:18px">
        <div class="row" style="gap:10px;margin-bottom:14px;flex-wrap:wrap">
          <h2 class="tense-title" style="margin:0">${esc(t)}</h2>
          ${tenseBadge(TENSE_RU[t] || "")}
          <span class="spacer"></span>
          ${spkWide(rows.map(r => r[1]).filter(Boolean).join(". "), "Прослушать всё")}
        </div>
        <div class="conj-wrap"><table class="conj">
          ${rows.map((r, i) => `<tr>
            <td class="conj__pron">${esc(r[0])}</td>
            <td class="conj__form">${esc(r[1] || "—")}${r[1] && r[1] !== "—" ? spkBtn(r[1]) : ""}</td>
          </tr>`).join("")}
        </table></div>
      </div>`;
      box.style.animation = "none";
      void box.offsetWidth;
      box.style.animation = "";
    }

    drawTense("présent");
    $$("#tenseTabs .tab", main).forEach(b => b.addEventListener("click", () => {
      $$("#tenseTabs .tab", main).forEach(x => { x.classList.remove("is-active"); x.setAttribute("aria-selected", "false"); });
      b.classList.add("is-active"); b.setAttribute("aria-selected", "true");
      drawTense(b.dataset.t);
      if (b.scrollIntoView) { try { b.scrollIntoView({ inline: "center", block: "nearest", behavior: UI.prefersReduced() ? "auto" : "smooth" }); } catch (e) { } }
    }));
    const currentTense = () => $("#tenseTabs .tab.is-active", main).dataset.t;
    $("#trainVerb", main).addEventListener("click", () => {
      const t = currentTense();
      A.openSession(EX.sessionVerbs([v.inf], [t], 10), `${v.inf} · ${t}`);
    });
    $("#trainVerbAll", main).addEventListener("click", () => {
      const t = currentTense();
      A.openSession(EX.sessionVerbs([], [t], 10), `Случайные глаголы · ${t}`);
    });
  }

  A.TENSES15 = TENSES15;
  A.TENSE_RU = TENSE_RU;
})();
