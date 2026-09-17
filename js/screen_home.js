// Экран: Главная — «Aujourd'hui»
"use strict";
(() => {
  const A = window.App;

  function idiomOfDay() {
    const d = new Date();
    return DB.idioms[(d.getDate() * 7 + d.getMonth() * 31) % DB.idioms.length];
  }
  function wordOfDay() {
    const d = new Date();
    const pool = DB.vocab.filter(e => e.ip && e.ef && (e.l === "A1" || e.l === "A2" || e.l === "B1"));
    const src = pool.length ? pool : DB.vocab;
    return src[(d.getDate() * 13 + d.getMonth() * 57 + 5) % src.length];
  }

  A.screens.home = () => {
    const main = A.main;
    const s = A.settings;
    const sum = Activity.summary();
    const lvl = A.levelById(s.lastLevel) || DB.course[0];
    const unlocked = A.isUnlocked(lvl.lv);
    const lvlPct = A.levelProgress(lvl);
    const idiom = idiomOfDay();
    const word = wordOfDay();
    const now = new Date();

    // Основное действие
    let cta = { href: "#/course/lvl/" + lvl.lv, label: "Продолжить курс", sub: `Уровень ${lvl.lv} · ${lvl.cefr}`, ico: "path" };
    if (sum.due > 0) cta = { href: "#/cards/due", label: `Повторить ${sum.due} ${pluralRu(sum.due, "карточку", "карточки", "карточек")}`, sub: "Интервальное повторение", ico: "cards" };
    else if (sum.done < sum.goal) cta = { href: "#/cards/new", label: "Выучить новые слова", sub: `${s.newPerDay} карточек на сегодня`, ico: "sparkles" };

    const heroLead = sum.due > 0
      ? `Карточки ждут: ${sum.due}. Повтори сейчас — это займёт около ${Math.max(3, Math.round(sum.due * 0.22))} минут.`
      : sum.done >= sum.goal
        ? "Дневная цель выполнена. Можно идти дальше по курсу или закрепить материал чтением."
        : "Просроченного нет — самое время для нового материала или следующего уровня курса.";

    main.innerHTML = `<div class="screen">

      <div class="greeting">
        <div class="greeting__date">
          <span>${esc(frDate(now))}</span>
        </div>
        <div class="greeting__name">
          <h1 class="display display--hero">${esc(frGreeting(now))}, <em>Даня</em></h1>
        </div>
        <p class="greeting__lead">Votre chemin vers le français — A1 → C1</p>
      </div>

      <section class="card card--hero hero" aria-label="Сегодня">
        <div class="hero__glow" aria-hidden="true"></div>
        ${ICONS.arcade()}
        <div class="hero__top">
          ${ring(sum.goalPct, { size: 104, w: 7, cls: sum.goalPct >= 100 ? "ok" : "", num: sum.goalPct + "%", cap: "цель дня", delay: 1 })}
          <div class="hero__info">
            <span class="eyebrow eyebrow--gold">Aujourd'hui</span>
            <h2 class="hero__t">${sum.due > 0 ? `${sum.due} <em>карточек</em> ждут` : sum.done >= sum.goal ? `Цель <em>выполнена</em>` : `Продолжаем <em>путь</em>`}</h2>
            <p class="hero__s">${esc(heroLead)}</p>
          </div>
        </div>
        <div class="hero__cta">
          <div class="hero__cta-row">
            <a class="btn btn--primary btn--lg" href="${esc(cta.href)}">${icon(cta.ico)}<span>${esc(cta.label)}</span>${icon("arrowRight", { size: "sm", cls: "ico--arrow" })}</a>
            <a class="btn btn--ghost btn--lg" href="#/course/lvl/${lvl.lv}">${icon("path", "sm")}<span>Курс · ур. ${lvl.lv}</span></a>
          </div>
        </div>
        <div class="hero__meta">
          <div class="hero__meta-item">
            <span class="hero__meta-num" data-count="${sum.streak}">0</span>
            <span class="hero__meta-cap">${esc(pluralRu(sum.streak, "день", "дня", "дней"))} подряд</span>
          </div>
          <div class="hero__meta-item">
            <span class="hero__meta-num" data-count="${sum.done}">0</span>
            <span class="hero__meta-cap">из ${sum.goal} сегодня</span>
          </div>
          <div class="hero__meta-item">
            <span class="hero__meta-num" data-count="${sum.mat.pct}">0</span>
            <span class="hero__meta-cap">% зрелых карт</span>
          </div>
          <div class="hero__meta-item">
            <span class="hero__meta-num" data-count="${lvlPct}">0</span>
            <span class="hero__meta-cap">% уровня ${lvl.lv}</span>
          </div>
        </div>
      </section>

      <section class="sec" aria-label="Сегодня в числах">
        <div class="stats">
          <div class="stat stat--accent">
            <span class="stat__num" data-count="${sum.due}">0</span>
            <span class="stat__cap">к повтору</span>
          </div>
          <div class="stat">
            <span class="stat__num" data-count="${sum.rev}">0</span>
            <span class="stat__cap">повторено</span>
          </div>
          <div class="stat">
            <span class="stat__num" data-count="${sum.new}">0</span>
            <span class="stat__cap">новых</span>
          </div>
          <div class="stat stat--gold">
            <span class="stat__num" data-count="${sum.mat.total}">0</span>
            <span class="stat__cap">в системе</span>
          </div>
        </div>
      </section>

      <section class="sec" aria-label="Слово и выражение дня">
        ${A.secHead({ eyebrow: "Le mot et l'expression", title: "Слово <em>и</em> выражение дня", more: { href: "#/vocab", label: "Весь словарь" } })}
        <div class="grid-2" data-stagger=":scope > *">
          <article class="card card--gold" style="display:flex;flex-direction:column;gap:10px">
            <div class="row" style="align-items:flex-start;gap:10px">
              <div class="col" style="gap:4px;flex:1;min-width:0">
                <span class="eyebrow">Mot du jour</span>
                <div class="vcard__fr" style="padding-right:0">${esc(word.f)}</div>
                ${word.ip ? `<div class="vcard__ipa">/${esc(word.ip)}/</div>` : ""}
              </div>
              ${spkBtn(word.f, "lg")}
            </div>
            <div class="vcard__ru">«${esc(word.r)}»</div>
            ${word.ef ? `<div class="vcard__ex">${esc(word.ef)}${word.er ? `<div class="ctx" style="margin-top:4px">${esc(word.er)}</div>` : ""}</div>` : ""}
            <div class="row" style="gap:6px;margin-top:auto;padding-top:8px">
              ${cefrBadge(word.l)}${word.t ? pill(word.t) : ""}
              <span class="spacer"></span>
              <a class="sec__more" href="#/vocab/${encodeURIComponent(word.f)}">Открыть${icon("chevronRight", "xs")}</a>
            </div>
          </article>

          <article class="mot">
            <span class="mot__quote" aria-hidden="true">“</span>
            <div class="row" style="gap:8px">
              <span class="eyebrow eyebrow--gold">Expression du jour</span>
              <span class="spacer"></span>
              ${lvlBadge(idiom.lv)}
            </div>
            <div class="mot__fr">${spkBtn(idiom.fr)}<span>${esc(idiom.fr)}</span></div>
            <div class="mot__lit">буквально: ${esc(idiom.lit)}</div>
            <div class="mot__ru">${esc(idiom.ru)}</div>
            ${idiom.ex ? `<div class="mot__ex">
              <div class="mot__ex-fr">${spkBtn(idiom.ex)}<span>${esc(idiom.ex)}</span></div>
              ${idiom.t ? `<div class="mot__ex-ru">${esc(idiom.t)}</div>` : ""}
            </div>` : ""}
            <a class="btn btn--ghost btn--sm" href="#/idioms" style="align-self:flex-start">${icon("quote", "sm")}Все идиомы</a>
          </article>
        </div>
      </section>

      <section class="sec" aria-label="Курс">
        ${A.secHead({ eyebrow: "Le parcours", title: "Ваш <em>маршрут</em>", more: { href: "#/course", label: "Все уровни" } })}
        <div class="lstrip">
          ${DB.course.map(l => {
      const un = A.isUnlocked(l.lv);
      const p = A.levelProgress(l);
      const cur = l.lv === s.lastLevel;
      return `<a class="lstrip__item ${cur ? "is-current" : ""} ${un ? "" : "is-locked"}" href="#/course/lvl/${l.lv}" aria-label="Уровень ${l.lv}, ${esc(l.cefr)}, прогресс ${p}%">
                <div class="row" style="gap:6px;align-items:center">
                  <span class="lstrip__lv">${pad2(l.lv)}</span>
                  ${un ? "" : icon("lock", "xs")}
                </div>
                ${cefrBadge(l.cefr)}
                ${bar(p / 100, { cls: cur ? "" : "gold", size: "sm", aria: `Прогресс уровня ${l.lv}` })}
                <span class="lstrip__cap">${p}%${cur ? " · вы здесь" : ""}</span>
              </a>`;
    }).join("")}
        </div>
        ${!unlocked ? `<div class="notice" style="margin-top:12px">
          <span class="notice__ico">${icon("lock", "sm")}</span>
          <span>Уровень ${lvl.lv} откроется после теста уровня ${lvl.lv - 1} на ${A.levelById(lvl.lv - 1).pass}%+. Или включите свободную навигацию в <a href="#/profile">профиле</a>.</span>
        </div>` : ""}
      </section>

      <section class="sec" aria-label="База знаний">
        ${A.secHead({ eyebrow: "Les chiffres", title: "Что <em>внутри</em>" })}
        <div class="card card--flat" style="padding:6px 20px">
          <div class="kv"><span class="kv__k">${icon("bookOpen", "xs")}Спряжения</span><span class="kv__v">${fmtNum(DB.verbs.length)} глаголов × 15 времён</span></div>
          <div class="kv"><span class="kv__k">${icon("book", "xs")}Словарь</span><span class="kv__v">${fmtNum(DB.vocab.length)} слов и выражений</span></div>
          <div class="kv"><span class="kv__k">${icon("braces", "xs")}Грамматика</span><span class="kv__v">${DB.grammar.length} уроков · ${fmtNum(DB.grammar.reduce((n, g) => n + g.quiz.length, 0))} вопросов</span></div>
          <div class="kv"><span class="kv__k">${icon("quote", "xs")}Идиомы</span><span class="kv__v">${DB.idioms.length} пословиц и формул</span></div>
          <div class="kv"><span class="kv__k">${icon("page", "xs")}Чтение</span><span class="kv__v">${DB.reading.length} текстов · ${DB.dialogues.length} диалогов</span></div>
          <div class="kv"><span class="kv__k">${icon("wave", "xs")}Фонетика</span><span class="kv__v">${DB.phonetics.sounds.length} звуков · ${DB.phonetics.pairs.length} пар · ${DB.phonetics.twisters.length} скороговорок</span></div>
          <div class="kv"><span class="kv__k">${icon("layers", "xs")}В повторении</span><span class="kv__v">${fmtNum(sum.mat.total)} карт · ${sum.mat.pct}% зрелых</span></div>
        </div>
      </section>

      <section class="sec" aria-label="Разделы">
        ${A.secHead({ eyebrow: "Bibliothèque", title: "Разделы", more: { href: "#/library", label: "Всё" } })}
        <div class="tiles" data-stagger=":scope > *">
          ${[
      { r: "trainer", fr: "Révision", ru: "Тренажёр", ico: "cards", note: `${sum.due} к повтору`, tone: "" },
      { r: "vocab", fr: "Vocabulaire", ru: "Словарь", ico: "book", note: `${fmtNum(DB.vocab.length)} слов`, tone: "gold" },
      { r: "verbs", fr: "Conjugaison", ru: "Спряжения", ico: "bookOpen", note: `${DB.verbs.length} глаголов`, tone: "ok" },
      { r: "grammar", fr: "Grammaire", ru: "Грамматика", ico: "braces", note: `${DB.grammar.length} уроков`, tone: "lav" },
      { r: "reading", fr: "Lecture", ru: "Чтение", ico: "page", note: `${DB.reading.length} текстов`, tone: "" },
      { r: "dialogues", fr: "Dialogues", ru: "Диалоги", ico: "chat", note: `${DB.dialogues.length} диалогов`, tone: "bor" },
      { r: "idioms", fr: "Idiomes", ru: "Идиомы", ico: "quote", note: `${DB.idioms.length} выражений`, tone: "gold" },
      { r: "phon", fr: "Phonétique", ru: "Фонетика", ico: "wave", note: `${DB.phonetics.sounds.length} звуков`, tone: "ok" }
    ].map(t => `<a class="tile tile--${t.tone}" href="#/${t.r}">
                <span class="tile__ico">${icon(t.ico)}</span>
                <span class="tile__body">
                  <span class="tile__fr">${esc(t.fr)}</span>
                  <span class="tile__title">${esc(t.ru)}</span>
                  <span class="tile__sub">${esc(t.note)}</span>
                </span>
                <span class="tile__end">${icon("chevronRight", "sm")}</span>
              </a>`).join("")}
        </div>
      </section>

      <section class="sec" aria-label="Как заниматься">
        ${A.secHead({ eyebrow: "Le rituel", title: "Как заниматься <em>эффективно</em>", more: { href: "#/method", label: "Методика" } })}
        <div class="card">
          <div class="ritual">
            <div class="ritual__item"><span class="ritual__n"></span><span><b>Каждый день</b> — 30–60 минут сильнее марафона раз в неделю. Держите стрик: он виден в профиле и прогрессе.</span></div>
            <div class="ritual__item"><span class="ritual__n"></span><span>Сначала <b>карточки</b> — закрыть просроченное, потом новый материал и курс.</span></div>
            <div class="ritual__item"><span class="ritual__n"></span><span>Всё французское <b>проговаривайте вслух</b>: кнопка озвучки есть у каждого слова, примера и диалога.</span></div>
            <div class="ritual__item"><span class="ritual__n"></span><span>Уровень закрывается <b>тестом на ${lvl.pass}%+</b> — или включите свободную навигацию в профиле.</span></div>
            <div class="ritual__item"><span class="ritual__n"></span><span>Читайте тексты своего уровня: правило <b>95% понимания</b>. Не понимаете — берите текст проще.</span></div>
          </div>
        </div>
      </section>

      ${TTS.hasFrenchVoice() ? "" : `<div class="notice" style="margin-top:24px">
        <span class="notice__ico">${icon("volumeOff", "sm")}</span>
        <span>В системе не найден французский голос для озвучки. Добавьте французский язык в настройках устройства: <b>Windows</b> — Параметры → Время и язык → Речь; <b>macOS</b> — System Settings → Accessibility → Spoken Content → System Voice → French; <b>iOS/Android</b> — добавьте французскую клавиатуру и голос. Кнопки озвучки заработают автоматически.</span>
      </div>`}

    </div>`;

    // Оживление чисел
    $$("[data-count]", main).forEach(el => {
      UI.countUp(el, Number(el.dataset.count) || 0, { duration: 950 });
    });

    // Новые достижения
    const fresh = Activity.freshAchievements();
    fresh.slice(0, 2).forEach((a, i) => {
      setTimeout(() => UI.toast({ title: a.fr, sub: a.ru + " · " + a.desc, kind: "gold", icon: a.icon || "medal", ms: 4200 }), 700 + i * 900);
    });
  };
})();
