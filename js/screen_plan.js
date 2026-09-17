// Экран персонального плана на 80 учебных дней
"use strict";
(() => {
  const A = window.App;
  const formatDate = iso => iso ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso + "T12:00:00")) : "после старта";

  A.screens.plan = args => {
    const requested = args && args[0] ? clamp(parseInt(args[0], 10) || 1, 1, 80) : null;
    if (requested) return drawDay(requested);
    drawOverview();
  };

  function drawOverview() {
    const main = A.main;
    const state = StudyPlan.state();
    const pos = StudyPlan.position();
    const total = StudyPlan.totalProgress();
    const current = StudyPlan.materialsFor(pos.day);
    const p = StudyPlan.dayProgress(pos.day);

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
        eyebrow: "Parcours intensif",
        title: "80 учебных дней <em>A1 → C1</em>",
        lead: "Персональный маршрут только по материалам приложения: занятие через день, 100 минут сфокусированной работы и обязательный чек-лист.",
        actions: state ? `<a class="btn btn--primary" href="#/plan/${pos.rest ? Math.min(80, pos.day + 1) : pos.day}">${icon(pos.rest ? "calendar" : "play", "sm")}${pos.rest ? "Открыть ближайший день" : "Занятие сегодня"}</a>` : ""
      })}

      <section class="plan-hero card card--hero">
        <img class="plan-hero__art" src="images/snail-plan.png" alt="Карикатура: целеустремлённая улитка с учебниками идёт по маршруту">
        <div class="plan-hero__body">
          <span class="eyebrow eyebrow--gold">1 день учёбы · 1 день восстановления</span>
          <h2 class="display display--2">${state ? (pos.finished ? "Маршрут завершён" : pos.rest ? "Сегодня — день усвоения" : `Учебный день ${pos.day} из 80`) : "Начните маршрут сегодня"}</h2>
          <p class="lead">${state ? (pos.rest ? `Следующая сессия — ${formatDate(StudyPlan.dateFor(Math.min(80, pos.day + 1)))}. Отдых — часть интервального обучения; можно сделать только просроченные SRS-карточки.` : `${current.ph.lv} · ${current.ph.focus} · ${p.done}/${p.total} пунктов выполнено`) : "80 учебных сессий займут 159 календарных дней. Приложение распределит грамматику, лексику, чтение, речь и контрольные точки от A1 до C1."}</p>
          ${state ? `<div class="plan-hero__progress">${bar(total.pct / 100, { cls: "gold", size: "lg", aria: `План выполнен на ${total.pct}%` })}<span class="ctx">${total.complete} полных дней · ${total.checks} из ${total.totalChecks} пунктов · ${total.pct}%</span></div>` : `<button class="btn btn--gold btn--lg" type="button" id="startPlan">${icon("sparkles", "sm")}Начать сегодня</button>`}
        </div>
      </section>

      <div class="notice notice--info" style="margin-top:16px">
        <span class="notice__ico">${icon("info", "sm")}</span>
        <span><b>Честная цель.</b> План создаёт интенсивную траекторию до материалов C1, но уровень CEFR нельзя гарантировать одним таймером: он подтверждается устойчивыми навыками и внешним экзаменом. Не переходите дальше, пока контрольная точка ниже 85%.</span>
      </div>

      ${state && !pos.rest ? todayPreview(current, p) : ""}

      <section class="sec">
        ${A.secHead({ eyebrow: "Calendrier", title: "Все 80 учебных дней", action: state ? `<span class="hint">финал · ${formatDate(StudyPlan.dateFor(80))}</span>` : "" })}
        <div class="plan-phases">
          ${StudyPlan.phases.map(ph => {
            let completed = 0;
            for (let d = ph.from; d <= ph.to; d++) if (StudyPlan.dayProgress(d).complete) completed++;
            const count = ph.to - ph.from + 1;
            return `<section class="card plan-phase">
              <div class="plan-phase__head">${cefrBadge(ph.lv)}<div><h3 class="h2">${esc(ph.focus)}</h3><span class="ctx">дни ${ph.from}–${ph.to} · ${completed}/${count} завершено</span></div><span class="spacer"></span>${ring(Math.round(completed / count * 100), { size: 58, w: 6, num: `${completed}/${count}`, cap: ph.lv })}</div>
              <div class="plan-days">${Array.from({ length: count }, (_, i) => ph.from + i).map(day => {
                const dp = StudyPlan.dayProgress(day); const isCurrent = state && day === pos.day;
                return `<a class="plan-day ${dp.complete ? "is-done" : ""} ${isCurrent ? "is-current" : ""}" href="#/plan/${day}" aria-label="День ${day}, ${dp.pct}%">
                  <b>${day}</b><span>${state ? formatDate(StudyPlan.dateFor(day)).replace(/\s+\d{4}.*/, "") : ph.lv}</span>${dp.complete ? icon("check", "xs") : `<i style="--p:${dp.pct}%"></i>`}
                </a>`;
              }).join("")}</div>
            </section>`;
          }).join("")}
        </div>
      </section>
    </div>`;

    const startBtn = $("#startPlan", main);
    if (startBtn) startBtn.addEventListener("click", () => {
      StudyPlan.start();
      UI.haptic([12, 45, 18]);
      UI.toast({ title: "Маршрут начат", sub: "Первый обязательный чек-лист готов", kind: "gold", icon: "path" });
      A.router();
    });
  }

  function todayPreview(day, p) {
    return `<section class="sec">
      ${A.secHead({ eyebrow: "Aujourd'hui", title: `Обязательный чек-лист · день ${day.day}`, more: { href: `#/plan/${day.day}`, label: "Открыть полностью" } })}
      <div class="card plan-preview">
        ${day.tasks.map(t => `<div class="plan-preview__row ${StudyPlan.isDone(day.day, t.id) ? "is-done" : ""}"><span>${icon(StudyPlan.isDone(day.day, t.id) ? "check" : t.icon, "sm")}</span><b>${esc(t.title)}</b><span class="spacer"></span><span class="ctx">${t.minutes} мин</span></div>`).join("")}
        ${bar(p.pct / 100, { cls: p.complete ? "ok" : "", size: "sm", aria: `Чек-лист ${p.pct}%` })}
      </div>
    </section>`;
  }

  function drawDay(dayNum) {
    const main = A.main;
    const d = StudyPlan.materialsFor(dayNum);
    const state = StudyPlan.state();
    const p = StudyPlan.dayProgress(dayNum);
    const date = StudyPlan.dateFor(dayNum);
    main.innerHTML = `<div class="screen">
      ${A.screenHead({
        back: "#/plan", backLabel: "План 80",
        eyebrow: `Jour ${dayNum} · ${d.ph.lv}`,
        title: `Обязательный <em>чек-лист</em>`,
        lead: `${d.ph.focus} · ${d.minutes} минут${date ? ` · ${formatDate(date)}` : ""}`,
        badges: [cefrBadge(d.ph.lv), pill(`${p.done}/${p.total} выполнено`, p.complete ? "ok" : "gold", p.complete ? "check" : "target")]
      })}
      ${!state ? `<div class="notice"><span class="notice__ico">${icon("calendar", "sm")}</span><span>Маршрут ещё не запущен. Можно изучить состав дня, а дату приложение назначит после старта на <a href="#/plan">экране плана</a>.</span></div>` : ""}
      <div class="plan-checklist" id="planChecklist">
        ${d.tasks.map((t, i) => {
          const done = StudyPlan.isDone(dayNum, t.id);
          return `<article class="plan-task ${done ? "is-done" : ""}" data-task="${t.id}">
            <button class="plan-task__check" type="button" aria-label="${done ? "Отметить невыполненным" : "Отметить выполненным"}" aria-pressed="${done}">${icon(done ? "check" : t.icon)}</button>
            <div class="plan-task__body"><div class="row row--wrap"><span class="eyebrow">${pad2(i + 1)} · ${t.minutes} минут</span>${done ? pill("готово", "ok") : ""}</div><h2 class="plan-task__title">${esc(t.title)}</h2><p class="lead">${esc(t.note)}</p><a class="btn btn--ghost btn--sm" href="${t.href}">Открыть материал${icon("arrowRight", "xs")}</a></div>
          </article>`;
        }).join("")}
      </div>
      <div class="card card--gold plan-finish ${p.complete ? "is-complete" : ""}" id="planFinish">
        <span class="plan-finish__icon">${icon(p.complete ? "trophy" : "target", "lg")}</span><div><h2 class="h2">${p.complete ? "День закрыт — magnifique !" : `Осталось ${p.total - p.done} пунктов`}</h2><p class="ctx">${p.complete ? "Следующая учебная сессия через день. Отдых закрепляет материал." : "День засчитывается только после всех пяти обязательных блоков."}</p></div><span class="spacer"></span>${ring(p.pct, { size: 72, w: 7, cls: p.complete ? "ok" : "gold", num: p.pct + "%", cap: "день" })}
      </div>
      <div class="btn-row btn-row--stretch" style="margin-top:16px"><a class="btn btn--ghost" href="#/plan/${Math.max(1, dayNum - 1)}">${icon("chevronLeft", "sm")}День ${Math.max(1, dayNum - 1)}</a><a class="btn btn--primary" href="#/plan/${Math.min(80, dayNum + 1)}">День ${Math.min(80, dayNum + 1)}${icon("chevronRight", "sm")}</a></div>
    </div>`;

    $$(".plan-task__check", main).forEach(btn => btn.addEventListener("click", () => {
      const task = btn.closest(".plan-task");
      const on = StudyPlan.toggle(dayNum, task.dataset.task);
      UI.haptic(on ? 14 : 6);
      if (on) UI.toast({ title: "Пункт выполнен", kind: "ok", icon: "check", ms: 1200 });
      drawDay(dayNum);
    }));
  }
})();
