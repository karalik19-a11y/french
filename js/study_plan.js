// Персональный интенсив A1 → C1: 80 учебных дней через день
"use strict";
window.StudyPlan = (() => {
  const STATE_KEY = "plan80_state";
  const DONE_KEY = "plan80_done";
  const phases = [
    { from: 1, to: 12, lv: "A1", course: [1, 2], focus: "Фундамент и произношение" },
    { from: 13, to: 28, lv: "A2", course: [3, 4], focus: "Свободный бытовой рассказ" },
    { from: 29, to: 48, lv: "B1", course: [5, 6], focus: "Аргументация и сложная фраза" },
    { from: 49, to: 66, lv: "B2", course: [7], focus: "Аутентичная речь и литература" },
    { from: 67, to: 80, lv: "C1", course: [8], focus: "Нюансы, стиль и свободное чтение" }
  ];

  const isoDate = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  const fromISO = iso => { const p = String(iso).split("-").map(Number); return new Date(p[0], p[1] - 1, p[2]); };
  const addDays = (iso, n) => { const d = fromISO(iso); d.setDate(d.getDate() + n); return isoDate(d); };
  const dayDiff = (a, b) => Math.floor((fromISO(b) - fromISO(a)) / 86400000);
  const phaseFor = day => phases.find(p => day >= p.from && day <= p.to) || phases[phases.length - 1];
  const baseLv = lv => String(lv).slice(0, 2);

  function state() { return store.get(STATE_KEY, null); }
  function start(iso = todayISO()) {
    const s = { start: iso, rhythm: "1/1", created: new Date().toISOString() };
    store.set(STATE_KEY, s);
    return s;
  }
  function reset() { store.del(STATE_KEY); store.del(DONE_KEY); }

  function position(now = todayISO()) {
    const s = state();
    if (!s) return { started: false, day: 1, rest: false, finished: false };
    const elapsed = Math.max(0, dayDiff(s.start, now));
    const day = Math.min(80, Math.floor(elapsed / 2) + 1);
    return { started: true, day, rest: elapsed % 2 === 1, finished: elapsed > 158, elapsed, start: s.start, nextDate: addDays(s.start, Math.min(158, (day - 1 + (elapsed % 2)) * 2)) };
  }

  function materialsFor(day) {
    const ph = phaseFor(day);
    const phaseIndex = day - ph.from;
    const phaseLength = ph.to - ph.from + 1;
    const grammars = DB.grammar.filter(g => baseLv(g.lv) === ph.lv);
    const gIndex = Math.min(grammars.length - 1, Math.floor(phaseIndex * grammars.length / phaseLength));
    const grammar = grammars[gIndex] || DB.grammar[(day - 1) % DB.grammar.length];

    const courseLevels = DB.course.filter(l => ph.course.includes(l.lv));
    const themes = [...new Set(courseLevels.flatMap(l => l.units.flatMap(u => u.themes || [])))];
    const theme = themes[phaseIndex % Math.max(1, themes.length)] || "Основы";
    let reads = DB.reading.filter(r => r.lv === ph.lv);
    if (!reads.length) reads = DB.reading;
    let dialogues = DB.dialogues.filter(d => d.lv === ph.lv);
    if (!dialogues.length) dialogues = DB.dialogues;
    const reading = reads[phaseIndex % reads.length];
    const dialogue = dialogues[phaseIndex % dialogues.length];
    const courseLv = ph.course[Math.min(ph.course.length - 1, Math.floor(phaseIndex * ph.course.length / phaseLength))];
    const isCheckpoint = day === ph.to;

    const tasks = [
      { id: "srs", icon: "cards", minutes: 20, title: "Закрыть очередь повторения", note: "Все карточки на сегодня + 15 новых слов. Не подсматривайте до ответа.", href: "#/cards/due" },
      { id: "grammar", icon: "braces", minutes: 25, title: grammar ? grammar.title : "Смешанное повторение грамматики", note: "Прочитайте правило, произнесите примеры и пройдите квиз. Затем составьте 3 свои фразы.", href: grammar ? `#/grammar/${encodeURIComponent(grammar.id)}` : `#/course/lvl/${courseLv}` },
      { id: "vocab", icon: "book", minutes: 20, title: `Лексика: ${theme}`, note: "Выберите 15–20 слов темы, прослушайте и добавьте трудные в повторение.", href: `#/vocab/theme/${encodeURIComponent(theme)}` },
      day % 2
        ? { id: "input", icon: "page", minutes: 20, title: `Чтение: ${reading.title}`, note: "Первый проход без перевода; второй — в двуязычном режиме. Выпишите 5 выражений.", href: `#/reading/${encodeURIComponent(reading.id)}` }
        : { id: "input", icon: "chat", minutes: 20, title: `Диалог: ${dialogue.title}`, note: "Прослушайте дважды, включите перевод и выполните shadowing вслух.", href: `#/dialogues/${encodeURIComponent(dialogue.id)}` },
      isCheckpoint
        ? { id: "output", icon: "trophy", minutes: 25, title: `Контрольная точка ${ph.lv}`, note: `Пройдите итоговый тест уровня ${courseLv}. Цель — не менее 85%. Ошибки перенесите в следующий день.`, href: `#/course/lvl/${courseLv}` }
        : { id: "output", icon: "pen", minutes: 15, title: day % 3 === 0 ? "Устный пересказ" : "Микро-текст дня", note: day % 3 === 0 ? "Перескажите материал 2 минуты без опоры, затем запишите второй дубль." : "Напишите 8–10 фраз с грамматикой и словами дня; прочитайте текст вслух.", href: `#/course/lvl/${courseLv}` }
    ];
    return { day, ph, grammar, theme, reading, dialogue, courseLv, tasks, minutes: tasks.reduce((s, t) => s + t.minutes, 0), isCheckpoint };
  }

  function doneMap() { return store.get(DONE_KEY, {}) || {}; }
  function isDone(day, id) { return !!doneMap()[`${day}:${id}`]; }
  function toggle(day, id) {
    const all = doneMap();
    const key = `${day}:${id}`;
    all[key] = !all[key];
    if (!all[key]) delete all[key];
    store.set(DONE_KEY, all);
    return !!all[key];
  }
  function dayProgress(day) {
    const tasks = materialsFor(day).tasks;
    const done = tasks.filter(t => isDone(day, t.id)).length;
    return { done, total: tasks.length, pct: Math.round(done / tasks.length * 100), complete: done === tasks.length };
  }
  function totalProgress() {
    let complete = 0, checks = 0;
    for (let d = 1; d <= 80; d++) { const p = dayProgress(d); checks += p.done; if (p.complete) complete++; }
    return { complete, checks, totalChecks: 400, pct: Math.round(checks / 400 * 100) };
  }
  function dateFor(day) { const s = state(); return s ? addDays(s.start, (day - 1) * 2) : null; }

  return { phases, state, start, reset, position, phaseFor, materialsFor, isDone, toggle, dayProgress, totalProgress, dateFor, addDays };
})();
