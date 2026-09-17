// Экраны «Вы»: прогресс и профиль
"use strict";
(() => {
  const A = window.App;

  const isoToDate = iso => {
    const p = String(iso || "").split("-");
    return new Date(+p[0] || 1970, (+p[1] || 1) - 1, +p[2] || 1);
  };
  const ruDayShort = iso => RU_DAYS[isoToDate(iso).getDay()].slice(0, 2).toUpperCase();

  /* ==================================================================
   *  ПРОГРЕСС
   * ================================================================== */
  A.screens.progress = () => {
    const main = A.main;
    const sum = Activity.summary();
    const mat = SRS.maturity();
    const hist14 = SRS.history(14);
    const hist7 = SRS.history(7);
    const maxDay = Math.max(1, ...hist14.map(d => d.rev + d.new));
    const meta = store.get("srs_meta", {}) || {};
    const skills = Activity.skills();
    const achv = Activity.achievementDefs();
    const fresh = Activity.freshAchievements();
    const themes = Activity.topThemes(10);
    const settings = A.settings;
    const goalDone = sum.done >= sum.goal;

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Progression",
      title: "Ваш <em>прогресс</em>",
      lead: "Живая статистика: стрик, цель дня, динамика за две недели, навыки и достижения. Всё считается из реальных повторений.",
      actions: `<a class="btn btn--ghost" href="#/profile">${icon("settings", "sm")}Настройки</a>`
    })}

      <div class="prog">
        <section class="card card--hero prog__streak" ${goalDone ? 'data-glow="gold"' : ""}>
          <div class="hero__top">
            <span class="eyebrow eyebrow--gold">Régularité · регулярность</span>
            <span class="spacer"></span>
            <span class="streak-pill ${sum.streak >= 3 ? "is-hot" : ""}">${icon("flame", "sm")}<b>${sum.streak}</b></span>
          </div>
          <div class="prog__streak-main">
            <div class="col" style="gap:4px">
              <span class="display display--1 prog__big" data-count="${sum.streak}">${sum.streak}</span>
              <span class="lead" style="font-size:var(--fs-sm)">${sum.streak ? `${pluralRu(sum.streak, "день", "дня", "дней")} подряд` : "Стрик начнётся сегодня"}</span>
            </div>
            ${ring(sum.goalPct, { size: 104, w: 8, cls: goalDone ? "gold" : "", num: `${sum.done}/${sum.goal}`, cap: "цель дня", aria: `Цель дня выполнена на ${sum.goalPct}%` })}
          </div>
          <div class="week" aria-label="Последние 7 дней">
            ${hist7.map((d, i) => {
      const on = d.rev + d.new > 0;
      return `<div class="week__d ${on ? "is-on" : ""} ${i === hist7.length - 1 ? "is-today" : ""}">
                      <span class="week__dot">${on ? icon("check", "xs") : "+"}</span>
                      <span class="week__cap">${ruDayShort(d.date)}</span>
                    </div>`;
    }).join("")}
          </div>
          <div class="hero__meta">
            <div class="hero__meta-item"><span class="hero__meta-num">${fmtNum(meta.totalReviews || 0)}</span><span class="hero__meta-cap">всего повторов</span></div>
            <div class="hero__meta-item"><span class="hero__meta-num">${fmtNum(sum.weekTotal)}</span><span class="hero__meta-cap">за 7 дней</span></div>
            <div class="hero__meta-item"><span class="hero__meta-num">${meta.lastDay ? frDateShort(meta.lastDay) : "—"}</span><span class="hero__meta-cap">последняя тренировка</span></div>
          </div>
        </section>

        <section class="card card--pad prog__today">
          <div class="card__head">
            <h2 class="card__title">Сегодня</h2>
            ${goalDone ? pill("цель закрыта", "ok", "check") : pill(`ещё ${Math.max(0, sum.goal - sum.done)}`, "gold", "target")}
          </div>
          <div class="stats">
            <div class="stat"><span class="stat__num" data-count="${sum.new}">${sum.new}</span><span class="stat__cap">новых</span></div>
            <div class="stat"><span class="stat__num" data-count="${sum.rev}">${sum.rev}</span><span class="stat__cap">повторено</span></div>
            <div class="stat ${sum.due ? "stat--accent" : "stat--gold"}"><span class="stat__num" data-count="${sum.due}">${sum.due}</span><span class="stat__cap">${sum.due ? "к повтору" : "всё повторено"}</span></div>
          </div>
          <div class="col" style="gap:9px;margin-top:14px">
            ${meter("Точность ответов за неделю", sum.accuracy / 100, sum.accuracy + "%", { cls: "ok", delay: 1 })}
            ${meter("Долгая память (21 день и больше)", mat.pct / 100, `${mat.mature} из ${mat.total}`, { cls: "gold", delay: 2 })}
          </div>
          <div class="btn-row" style="margin-top:16px">
            <a class="btn btn--primary" href="#/cards">${icon("cards", "sm")}${sum.due ? `Повторить ${sum.due}` : "Тренировать новые"}</a>
            <a class="btn btn--ghost" href="#/trainer">${icon("target", "sm")}Все тренировки</a>
          </div>
        </section>
      </div>

      <section class="sec">
        ${A.secHead({ eyebrow: "Deux semaines", title: "Динамика за 14 дней", action: `<span class="hint">${fmtNum(hist14.reduce((s, d) => s + d.rev + d.new, 0))} повторов</span>` })}
        <div class="sec__body">
          <div class="card card--pad">
            <div class="chart" role="img" aria-label="Повторения по дням за две недели">
              <div class="chart__grid"><i></i><i></i><i></i><i></i></div>
              ${hist14.map((d, i) => {
      const v = d.rev + d.new;
      return `<div class="chart__col" tabindex="0" aria-label="${ruDate(isoToDate(d.date))}: ${cardsRu(v)}">
                    <span class="chart__tip">${ruDate(isoToDate(d.date))} · ${v} ${v ? `· ${d.new ? "+" + d.new : "повторы"}` : ""}</span>
                    <div class="chart__bar ${i === hist14.length - 1 ? "is-today" : ""} ${v ? "" : "is-empty"}" style="--h:${v ? Math.max(0.07, v / maxDay) : 0.02};--i:${i}"></div>
                    <span class="chart__day">${ruDayShort(d.date)}</span>
                  </div>`;
    }).join("")}
            </div>
            <div class="row" style="gap:14px;margin-top:6px;flex-wrap:wrap">
              <span class="hint"><span style="display:inline-block;width:9px;height:9px;border-radius:3px;background:var(--grad-accent);margin-right:6px"></span>карточки за день</span>
              <span class="hint"><span style="display:inline-block;width:9px;height:9px;border-radius:3px;background:var(--grad-gold);margin-right:6px"></span>сегодня</span>
              <span class="spacer"></span>
              <span class="ctx">Пик: ${maxDay} ${pluralRu(maxDay, "карточка", "карточки", "карточек")} за день</span>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        ${A.secHead({ eyebrow: "Compétences", title: "Навыки" })}
        <div class="sec__body">
          <div class="skills">
            ${skills.map((s, i) => `
              <div class="skill">
                <div class="skill__top">
                  <span class="skill__ico">${icon(s.icon, "sm")}</span>
                  <span class="skill__t">${esc(s.ru)}</span>
                  <span class="skill__fr">${esc(s.fr)}</span>
                </div>
                ${bar(s.pct / 100, { cls: s.cls, delay: i, size: "sm", aria: `${s.ru}: ${s.pct}%` })}
                <span class="skill__val">${esc(s.val)} · ${s.pct}%</span>
              </div>`).join("")}
          </div>
        </div>
      </section>

      <section class="sec">
        ${A.secHead({ eyebrow: "Le parcours", title: "Уровни курса", more: { href: "#/course", label: "К курсу" } })}
        <div class="sec__body">
          <div class="list">
            ${DB.course.map(l => {
      const p = A.levelProgress(l);
      const passed = settings.passedLevels.includes(l.lv);
      const unlocked = A.isUnlocked(l.lv);
      return `<a class="list__row list__row--link" href="#/course/lvl/${l.lv}">
                  <span class="list__ico">${icon(passed ? "trophy" : unlocked ? "path" : "lock", "sm")}</span>
                  <span class="list__main">
                    <span class="list__t">${esc(l.title)}</span>
                    <span style="width:100%">${bar(p / 100, { cls: passed ? "ok" : "", size: "sm", instant: true, delay: l.lv, aria: `Уровень ${l.lv}: ${p}%` })}</span>
                    <span class="list__s">${cefrBadge(l.cefr)} ${esc(`${l.units.length} ${pluralRu(l.units.length, "юнит", "юнита", "юнитов")}`)} · ${p}%${passed ? " · сдан" : unlocked ? "" : " · закрыт"}</span>
                  </span>
                  <span class="list__end">${icon("chevronRight", "sm")}</span>
                </a>`;
    }).join("")}
          </div>
        </div>
      </section>

      <section class="sec">
        ${A.secHead({
      eyebrow: "Récompenses", title: "Достижения",
      action: `<span class="hint">${sum.achievements} из ${sum.achievementsTotal}</span>`
    })}
        <div class="sec__body">
          <div class="achv" data-stagger=":scope > *">
            ${achv.map(a => `
              <div class="achv__item ${a.earned ? "is-on" : ""} ${fresh.some(f => f.id === a.id) ? "is-new" : ""}">
                <span class="achv__ico">${icon(a.icon, "sm")}</span>
                <span class="achv__t">${esc(a.ru)}</span>
                <span class="achv__s">${esc(a.desc)}</span>
                <span class="achv__prog">${bar(a.p / 100, { cls: a.earned ? "gold" : "", size: "sm", delay: 1, aria: `${a.ru}: ${a.p}%` })}</span>
                <span class="hint">${a.earned ? "получено" : `${Math.min(a.cur, a.max)}/${a.max}`}</span>
              </div>`).join("")}
          </div>
        </div>
      </section>

      ${themes.length ? `<section class="sec">
        ${A.secHead({ eyebrow: "Lexique", title: "Ваши темы", more: { href: "#/vocab", label: "Словарь" } })}
        <div class="sec__body">
          <div class="topics">
            ${themes.map(t => `<a class="topic" href="#/vocab/theme/${encodeURIComponent(t.t)}">${esc(t.t)} <b>${t.n}</b></a>`).join("")}
          </div>
        </div>
      </section>` : ""}
    </div>`;

    $$(".prog [data-count]", main).forEach((el, i) => UI.countUp(el, +el.dataset.count || 0, { duration: 760 + i * 60 }));
    $$(".stats [data-count]", main).forEach((el, i) => UI.countUp(el, +el.dataset.count || 0, { duration: 620 + i * 70 }));

    if (fresh.length) {
      setTimeout(() => {
        UI.toast({
          title: `Новое достижение · ${fresh[0].ru}`,
          sub: fresh.length > 1 ? `и ещё ${fresh.length - 1}` : fresh[0].desc,
          kind: "gold", icon: "trophy", ms: 4200
        });
        UI.haptic([12, 60, 18]);
      }, 700);
    }
  };

  /* ==================================================================
   *  ПРОФИЛЬ
   * ================================================================== */
  A.screens.profile = () => {
    const main = A.main;
    const s = A.settings;
    const sum = Activity.summary();
    const started = Activity.startedAt();
    const voices = TTS.listVoices();
    const ratePct = Math.round(s.ttsRate * 100);

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Vous",
      title: "Профиль и <em>настройки</em>",
      lead: "Цель дня, темп речи, оформление и резервная копия прогресса. Всё хранится только в этом браузере."
    })}

      <section class="ident">
        <span class="ident__avatar">Д</span>
        <div class="ident__body">
          <h2 class="ident__name">Даня</h2>
          <span class="ident__sub">Apprenant · A1 → C1${started ? ` · с ${ruDate(isoToDate(started))}` : ""}</span>
          <div class="ident__tags">
            ${pill(`${sum.streak} ${pluralRu(sum.streak, "день", "дня", "дней")}`, "gold", "flame")}
            ${pill(`${fmtNum(sum.totalCards)} ${pluralRu(sum.totalCards, "карточка", "карточки", "карточек")}`, "", "layers")}
            ${pill(`${sum.levelsPassed} из ${DB.course.length} уровней`, "", "crown")}
            ${pill(`${sum.achievements} достижений`, "", "trophy")}
          </div>
        </div>
        <div class="row" style="gap:8px;margin-left:auto">
          <a class="btn btn--ghost btn--sm" href="#/progress">${icon("chart", "sm")}Прогресс</a>
        </div>
      </section>

      <div class="stats" style="margin-top:16px">
        <div class="stat stat--gold"><span class="stat__num stat__num--display">${sum.goalPct}%</span><span class="stat__cap">цель дня</span></div>
        <div class="stat"><span class="stat__num stat__num--display">${fmtNum(sum.vocabCards)}</span><span class="stat__cap">слов в памяти</span></div>
        <div class="stat"><span class="stat__num stat__num--display">${sum.accuracy}%</span><span class="stat__cap">точность за неделю</span></div>
        <div class="stat"><span class="stat__num stat__num--display">${sum.due}</span><span class="stat__cap">к повтору</span></div>
      </div>

      <div class="notice notice--info hidden" id="installRow" style="margin-top:16px">
        <span class="notice__ico">${icon("download", "sm")}</span>
        <div style="flex:1;min-width:0">
          <b>Установить на главный экран</b>
          <div class="ctx">Запуск в один тап, полноэкранный режим и работа без интернета.</div>
        </div>
        <button class="btn btn--ghost btn--sm" type="button" id="installBtn">${icon("plus", "sm")}Установить</button>
      </div>

      <section class="sec">
        ${A.secHead({ eyebrow: "Étude", title: "Учёба" })}
        <div class="sec__body">
          <div class="list">
            <div class="list__row" style="flex-wrap:wrap;gap:12px">
              <span class="list__ico">${icon("target", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Цель дня · <b id="goalVal">${s.dailyGoal}</b> ${cardsRu(s.dailyGoal)}</span>
                <span class="list__s">Сколько карточек проходить за день, чтобы держать стрик</span>
                <input class="range" id="goalRange" type="range" min="5" max="80" step="5" value="${s.dailyGoal}" aria-label="Цель дня">
              </span>
            </div>
            <div class="list__row" style="flex-wrap:wrap;gap:12px">
              <span class="list__ico">${icon("sparkles", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Новых слов в день · <b id="newVal">${s.newPerDay}</b></span>
                <span class="list__s">Лимит свежих карточек в колоде — остальное подождёт</span>
                <input class="range" id="newRange" type="range" min="0" max="50" step="5" value="${s.newPerDay}" aria-label="Новых слов в день">
              </span>
            </div>
            <div class="list__row" style="flex-wrap:wrap;gap:12px">
              <span class="list__ico">${icon("path", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Текущий уровень курса</span>
                <span class="list__s">Куда ведёт кнопка «Продолжить» на главной</span>
                <div class="seg" id="lvSeg" style="margin-top:8px">
                  ${DB.course.map(l => `<button class="seg__item ${s.lastLevel === l.lv ? "is-active" : ""}" type="button" data-lv="${l.lv}">${l.lv} · ${esc(l.cefr)}</button>`).join("")}
                </div>
              </span>
            </div>
            <div class="list__row">
              <span class="list__ico">${icon("unlock", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Свободная навигация</span>
                <span class="list__s">Открыть все уровни курса без сдачи тестов</span>
              </span>
              <button class="switch ${s.freeNav ? "is-on" : ""}" id="freeNav" type="button" role="switch" aria-checked="${!!s.freeNav}" aria-label="Свободная навигация"></button>
            </div>
            <div class="list__row">
              <span class="list__ico">${icon("layers", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Слова для новых карточек</span>
                <span class="list__s">Какой уровень брать, когда колода просит новые слова</span>
              </span>
              <span class="list__end">
                <select class="select" id="newLevels" aria-label="Уровни новых слов">
                  ${["all", "A1", "A2", "B1", "B2", "C1"].map(l => `<option value="${l}" ${store.get("newLevels", "all") === l ? "selected" : ""}>${l === "all" ? "Все уровни" : l}</option>`).join("")}
                </select>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        ${A.secHead({ eyebrow: "Son", title: "Звук и речь" })}
        <div class="sec__body">
          <div class="list">
            <div class="list__row" style="flex-wrap:wrap;gap:12px">
              <span class="list__ico">${icon("volume", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Темп озвучивания · <b id="rateVal">${(s.ttsRate).toFixed(2).replace(".", ",")}×</b></span>
                <span class="list__s">Медленнее — для диктанта и теневой практики, быстрее — для беглости</span>
                <input class="range" id="rateRange" type="range" min="0.5" max="1.4" step="0.05" value="${s.ttsRate}" aria-label="Темп озвучивания">
              </span>
            </div>
            <div class="list__row">
              <span class="list__ico">${icon("mic", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Проверить голос</span>
                <span class="list__s">${voices.length ? `Доступно французских голосов: ${voices.length}` : "Французский голос не найден — браузер озвучит запасным"}</span>
              </span>
              <span class="list__end">
                <button class="btn btn--ghost btn--sm" type="button" id="testTts">${icon("play", "sm")}Прослушать</button>
                <button class="btn btn--quiet btn--icon btn--sm" type="button" id="showVoices" aria-label="Список голосов">${icon("info", "sm")}</button>
              </span>
            </div>
          </div>
          ${!TTS.supported ? `<div class="notice"><span class="notice__ico">${icon("alert", "sm")}</span><div>Этот браузер не поддерживает синтез речи. Остальные функции работают полностью.</div></div>`
      : !voices.length ? `<div class="notice"><span class="notice__ico">${icon("info", "sm")}</span><div>Французский голос не установлен в системе. В Safari он появляется автоматически; в Chrome и Android — через системные настройки языка.</div></div>`
        : `<div class="notice notice--ok"><span class="notice__ico">${icon("check", "sm")}</span><div>Голос готов: <b>${esc(voices[0])}</b>. Темп — ${(s.ttsRate).toFixed(2).replace(".", ",")}×.</div></div>`}
        </div>
      </section>

      <section class="sec">
        ${A.secHead({ eyebrow: "Apparence", title: "Оформление" })}
        <div class="sec__body">
          <div class="list">
            <div class="list__row" style="flex-wrap:wrap;gap:12px">
              <span class="list__ico">${icon(UI.resolvedDark() ? "moon" : "sun", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Тема</span>
                <span class="list__s">Nuit parisienne, Ivoire или как в системе</span>
                <div class="seg seg--full" id="themeSeg" style="margin-top:8px">
                  <button class="seg__item" type="button" data-theme-pref="dark">${icon("moon", "sm")}Тёмная</button>
                  <button class="seg__item" type="button" data-theme-pref="light">${icon("sun", "sm")}Светлая</button>
                  <button class="seg__item" type="button" data-theme-pref="auto">${icon("monitor", "sm")}Авто</button>
                </div>
              </span>
            </div>
            <div class="list__row">
              <span class="list__ico">${icon("sparkles", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Анимации и переходы</span>
                <span class="list__s">Отключите, если хочется спокойнее или бережёте батарею</span>
              </span>
              <button class="switch ${UI.motionOn() ? "is-on" : ""}" id="motionSw" type="button" role="switch" aria-checked="${UI.motionOn()}" aria-label="Анимации"></button>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        ${A.secHead({ eyebrow: "Données", title: "Данные" })}
        <div class="sec__body">
          <div class="list">
            <div class="list__row">
              <span class="list__ico">${icon("download", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Резервная копия</span>
                <span class="list__s">Карточки, стрик, настройки и избранное — одним файлом</span>
              </span>
              <span class="list__end"><button class="btn btn--ghost btn--sm" type="button" id="exportBtn">${icon("download", "sm")}Скачать</button></span>
            </div>
            <div class="list__row">
              <span class="list__ico">${icon("upload", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Восстановить из копии</span>
                <span class="list__s">Текущие данные будут заменены содержимым файла</span>
              </span>
              <span class="list__end">
                <input type="file" id="importFile" accept="application/json,.json" class="hidden" aria-label="Файл резервной копии">
                <button class="btn btn--ghost btn--sm" type="button" id="importBtn">${icon("upload", "sm")}Выбрать файл</button>
              </span>
            </div>
            <div class="list__row">
              <span class="list__ico" style="color:var(--warn)">${icon("refresh", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Сбросить повторения</span>
                <span class="list__s">Удалить карточки, историю и стрик. Настройки и избранное останутся</span>
              </span>
              <span class="list__end"><button class="btn btn--danger btn--sm" type="button" id="resetSrs">${icon("refresh", "sm")}Сбросить</button></span>
            </div>
            <div class="list__row">
              <span class="list__ico" style="color:var(--bad)">${icon("trash", "sm")}</span>
              <span class="list__main">
                <span class="list__t">Начать с чистого листа</span>
                <span class="list__s">Полный сброс: прогресс, настройки, тема, избранное</span>
              </span>
              <span class="list__end"><button class="btn btn--danger btn--sm" type="button" id="resetAll">${icon("trash", "sm")}Очистить</button></span>
            </div>
          </div>
        </div>
      </section>

      <section class="sec">
        ${A.secHead({ eyebrow: "À propos", title: "О приложении" })}
        <div class="sec__body">
          <div class="card card--pad col" style="gap:10px">
            <div class="kv"><span class="kv__k">${icon("compass", "xs")}Версия</span><span class="kv__v">Le Français 2.0</span></div>
            <div class="kv"><span class="kv__k">${icon("book", "xs")}Словарь</span><span class="kv__v">${fmtNum(DB.vocab.length)} записей · A1–C1</span></div>
            <div class="kv"><span class="kv__k">${icon("bookOpen", "xs")}Спряжения</span><span class="kv__v">${DB.verbs.length} глаголов · 15 времён</span></div>
            <div class="kv"><span class="kv__k">${icon("braces", "xs")}Грамматика</span><span class="kv__v">${DB.grammar.length} уроков</span></div>
            <div class="kv"><span class="kv__k">${icon("page", "xs")}Чтение и диалоги</span><span class="kv__v">${DB.reading.length} текстов · ${DB.dialogues.length} диалогов</span></div>
            <div class="kv"><span class="kv__k">${icon("quote", "xs")}Идиомы</span><span class="kv__v">${DB.idioms.length} выражений</span></div>
            <p class="ctx">Прогресс хранится локально в браузере и никуда не отправляется. Работает офлайн: добавьте приложение на главный экран, чтобы запускать как обычное.</p>
            <div class="btn-row">
              <a class="btn btn--ghost btn--sm" href="#/method">${icon("compass", "sm")}Методика</a>
              <a class="btn btn--ghost btn--sm" href="#/library">${icon("library", "sm")}Библиотека</a>
            </div>
          </div>
        </div>
      </section>
    </div>`;

    /* ---------- Ползунки ---------- */
    const goalRange = $("#goalRange", main), goalVal = $("#goalVal", main);
    UI.bindRange(goalRange);
    goalRange.addEventListener("input", e => {
      const v = +e.target.value;
      s.dailyGoal = v;
      goalVal.textContent = v;
      goalVal.nextSibling.textContent = " " + cardsRu(v);
      A.saveSettings();
    });
    goalRange.addEventListener("change", () => { UI.haptic(10); A.refresh(); });

    const newRange = $("#newRange", main), newVal = $("#newVal", main);
    UI.bindRange(newRange);
    newRange.addEventListener("input", e => { s.newPerDay = +e.target.value; newVal.textContent = s.newPerDay; A.saveSettings(); });
    newRange.addEventListener("change", () => UI.haptic(10));

    const rateRange = $("#rateRange", main), rateVal = $("#rateVal", main);
    UI.bindRange(rateRange);
    rateRange.addEventListener("input", e => {
      const v = +e.target.value;
      s.ttsRate = v;
      store.set("ttsRate", v);
      rateVal.textContent = v.toFixed(2).replace(".", ",") + "×";
      A.saveSettings();
    });

    /* ---------- Уровень курса ---------- */
    $$("#lvSeg .seg__item", main).forEach(b => b.addEventListener("click", () => {
      s.lastLevel = +b.dataset.lv;
      A.saveSettings();
      $$("#lvSeg .seg__item", main).forEach(x => x.classList.toggle("is-active", x === b));
      UI.haptic(8);
    }));

    /* ---------- Переключатели ---------- */
    $("#freeNav", main).addEventListener("click", e => {
      s.freeNav = !s.freeNav;
      A.saveSettings();
      e.currentTarget.classList.toggle("is-on", s.freeNav);
      e.currentTarget.setAttribute("aria-checked", String(s.freeNav));
      UI.haptic(12);
      UI.toast({ title: s.freeNav ? "Свободная навигация включена" : "Уровни снова открываются по порядку", kind: "info", icon: s.freeNav ? "unlock" : "lock", ms: 2200 });
    });

    $("#newLevels", main).addEventListener("change", e => {
      store.set("newLevels", e.target.value);
      UI.haptic(8);
      UI.toast({ title: "Новые слова: " + (e.target.value === "all" ? "все уровни" : e.target.value), kind: "ok", icon: "check", ms: 1800 });
    });

    const motionSw = $("#motionSw", main);
    motionSw.addEventListener("click", () => {
      const on = !UI.motionOn();
      UI.setMotion(on);
      motionSw.classList.toggle("is-on", on);
      motionSw.setAttribute("aria-checked", String(on));
      UI.haptic(10);
    });

    function paintThemeSeg() {
      const pref = UI.themePref();
      $$("#themeSeg .seg__item", main).forEach(b => b.classList.toggle("is-active", b.dataset.themePref === pref));
    }
    $$("#themeSeg .seg__item", main).forEach(b => b.addEventListener("click", () => {
      UI.setTheme(b.dataset.themePref);
      paintThemeSeg();
      UI.haptic(10);
      A.refresh();
    }));
    paintThemeSeg();

    /* ---------- Звук ---------- */
    $("#testTts", main).addEventListener("click", () => {
      TTS.speak("Bonjour ! Aujourd'hui, nous révisons ensemble. Bonne journée.", { rate: s.ttsRate });
      UI.haptic(8);
    });
    $("#showVoices", main).addEventListener("click", () => {
      const list = TTS.listVoices();
      UI.sheet({
        eyebrow: "Voix",
        title: "Голоса системы",
        sub: "Используется Web Speech API — озвучивает браузер",
        body: list.length
          ? `<div class="entries">${list.map((v, i) => `<div class="entry"><span class="entry__n">${i + 1}</span><span class="entry__body"><span class="entry__t">${esc(v)}</span></span></div>`).join("")}</div>`
          : A.emptyState({ icon: "mic", title: "Французских голосов нет", text: "Установите французский язык в настройках системы — голоса появятся автоматически." }),
        footer: `<button class="btn btn--primary btn--lg" type="button" data-close>${icon("check", "sm")}Понятно</button>`
      });
    });

    /* ---------- Данные ---------- */
    $("#exportBtn", main).addEventListener("click", () => {
      const backup = {
        app: "le-francais", v: 2, exported: new Date().toISOString(),
        srs: JSON.parse(SRS.exportAll()),
        settings: A.settings,
        activity: store.get("activity", null),
        favorites: store.get("favorites", null),
        achievementsSeen: store.get("achv_seen", []),
        newLevels: store.get("newLevels", "all"),
        ttsRate: store.get("ttsRate", A.settings.ttsRate)
      };
      const name = `le-francais-${todayISO()}.json`;
      try {
        const blob = new Blob([JSON.stringify(backup, null, 1)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        UI.toast({ title: "Копия сохранена", sub: name, kind: "ok", icon: "download" });
        UI.haptic([10, 40, 10]);
      } catch (err) {
        UI.alert("Не удалось сохранить файл. Попробуйте другой браузер.", { title: "Ошибка экспорта", ok: "Закрыть" });
      }
    });

    $("#importBtn", main).addEventListener("click", () => $("#importFile", main).click());
    $("#importFile", main).addEventListener("change", e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const raw = String(reader.result || "");
        let data;
        try { data = JSON.parse(raw); } catch (err) { UI.alert("Файл повреждён или это не резервная копия.", { title: "Не удалось прочитать" }); return; }
        const ok = await UI.confirm({
          title: "Восстановить прогресс?",
          text: "Текущие карточки, стрик и настройки будут заменены данными из файла.",
          ok: "Восстановить", cancel: "Отмена", danger: true
        });
        if (!ok) { e.target.value = ""; return; }
        try {
          const srs = data.v === 2 ? data.srs : data;
          SRS.importAll(JSON.stringify(srs));
          if (data.settings) { A.settings = { ...A.defaultSettings, ...data.settings }; A.saveSettings(); }
          if (data.activity) store.set("activity", data.activity);
          if (data.favorites) store.set("favorites", data.favorites);
          if (data.achievementsSeen) store.set("achv_seen", data.achievementsSeen);
          if (data.newLevels) store.set("newLevels", data.newLevels);
          if (data.ttsRate) store.set("ttsRate", data.ttsRate);
          UI.toast({ title: "Прогресс восстановлен", sub: "Перезагружаем экран…", kind: "ok", icon: "check" });
          UI.haptic([12, 50, 16]);
          setTimeout(() => location.reload(), 700);
        } catch (err) {
          UI.alert("Формат копии не подошёл: " + ((err && err.message) || "неизвестная ошибка"), { title: "Ошибка импорта" });
        }
      };
      reader.onerror = () => UI.alert("Файл не читается.", { title: "Ошибка" });
      reader.readAsText(file);
    });

    $("#resetSrs", main).addEventListener("click", async () => {
      const ok = await UI.confirm({
        title: "Сбросить повторения?",
        text: "Удалятся все карточки, история дней и стрик. Избранное и настройки останутся. Действие необратимо — лучше сначала скачать копию.",
        ok: "Сбросить", cancel: "Отмена", danger: true
      });
      if (!ok) return;
      SRS.resetAll();
      A.refresh();
      UI.toast({ title: "Повторения сброшены", sub: "Колода снова пуста", kind: "gold", icon: "refresh" });
      setTimeout(() => A.router(), 320);
    });

    $("#resetAll", main).addEventListener("click", async () => {
      const ok = await UI.confirm({
        title: "Очистить всё?",
        text: "Будут удалены прогресс, карточки, настройки, тема и избранное. Приложение вернётся к первому запуску.",
        ok: "Очистить", cancel: "Отмена", danger: true
      });
      if (!ok) return;
      ["settings", "srs_cards", "srs_daily", "srs_meta", "activity", "favorites", "achv_seen", "newLevels", "theme", "motion"]
        .forEach(k => store.del(k));
      UI.toast({ title: "Всё очищено", sub: "Перезагружаем…", kind: "bad", icon: "trash" });
      setTimeout(() => location.reload(), 700);
    });

    $$("[data-count]", main).forEach((el, i) => UI.countUp(el, +el.dataset.count || 0, { duration: 700 + i * 60 }));
  };
})();
