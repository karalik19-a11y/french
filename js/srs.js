// SRS (SM-2 lite) — интервальное повторение. Французский для Дани
"use strict";
window.SRS = (() => {
  const DAY = 86400000;
  let cards = {};    // key -> {r:reps, i:intervalDays, e:ease, d:dueTs, l:lapses, t:createdTs}
  let daily = {};    // ISO date -> {rev:число повторов, new:новых, ok:верных}
  let meta = { streak: 0, lastDay: null, totalReviews: 0 };

  function load() {
    cards = store.get("srs_cards", {});
    daily = store.get("srs_daily", {});
    meta = store.get("srs_meta", meta);
  }
  function save() {
    store.set("srs_cards", cards);
    store.set("srs_daily", daily);
    store.set("srs_meta", meta);
  }

  // Отметить активность сегодня (для стрика)
  function touchDay(newCards = 0, reviews = 0, correct = 0) {
    const t = todayISO();
    const d = daily[t] || (daily[t] = { rev: 0, new: 0, ok: 0 });
    d.rev += reviews; d.new += newCards; d.ok += correct;
    meta.totalReviews += reviews;
    if (meta.lastDay !== t) {
      const y = new Date(Date.now() - DAY);
      const yISO = `${y.getFullYear()}-${pad2(y.getMonth() + 1)}-${pad2(y.getDate())}`;
      meta.streak = (meta.lastDay === yISO) ? meta.streak + 1 : 1;
      meta.lastDay = t;
    }
    save();
  }

  // Новые карточки для тренировки
  function isNew(key) { return !cards[key]; }
  function isDue(key) { const c = cards[key]; return c && c.d <= Date.now(); }

  function dueKeys() {
    const now = Date.now();
    return Object.keys(cards).filter(k => cards[k].d <= now);
  }

  function dueCount() { return dueKeys().length; }

  function todayStats() {
    const d = daily[todayISO()] || { rev: 0, new: 0, ok: 0 };
    return { ...d, due: dueCount(), streak: meta.streak, total: Object.keys(cards).length };
  }

  // Оценить карточку: rating 0=забыл, 1=трудно, 2=хорошо, 3=легко
  function grade(key, rating, isNewCard = false) {
    let c = cards[key];
    if (!c) { c = cards[key] = { r: 0, i: 0, e: 2.5, d: Date.now(), l: 0, t: Date.now() }; }
    const now = Date.now();
    if (rating === 0) { // забыл
      c.l++; c.r = 0; c.i = 0;
      c.e = Math.max(1.3, c.e - 0.2);
      c.d = now + 10 * 60000; // снова через 10 минут
    } else if (rating === 1) { // трудно
      c.i = c.r === 0 ? 1 : Math.max(1, Math.round(c.i * 1.2));
      c.e = Math.max(1.3, c.e - 0.15);
      c.r++;
      c.d = now + c.i * DAY;
    } else if (rating === 2) { // хорошо
      c.r++;
      c.i = c.r === 1 ? 1 : c.r === 2 ? 3 : Math.round(c.i * c.e);
      c.i = Math.min(c.i, 365 * 2);
      c.d = now + c.i * DAY;
    } else { // легко
      c.r++;
      c.e = Math.min(3.0, c.e + 0.15);
      c.i = c.r === 1 ? 3 : Math.round((c.r === 2 ? 6 : c.i * c.e) * 1.3);
      c.i = Math.min(c.i, 365 * 2);
      c.d = now + c.i * DAY;
    }
    touchDay(isNewCard ? 1 : 0, isNewCard ? 0 : 1, rating >= 2 ? 1 : 0);
    save();
    return c;
  }

  // Ввести новую карточку в систему (без оценки — due сейчас)
  function add(key) {
    if (!cards[key]) { cards[key] = { r: 0, i: 0, e: 2.5, d: Date.now(), l: 0, t: Date.now() }; save(); }
  }

  // Прогноз интервалов для кнопок оценки
  function preview(key, rating) {
    const c = cards[key] || { r: 0, i: 0, e: 2.5 };
    if (rating === 0) return "10 мин";
    if (rating === 1) return c.r === 0 ? "1 дн" : Math.max(1, Math.round(c.i * 1.2)) + " дн";
    if (rating === 2) { const i = c.r + 1 === 1 ? 1 : c.r + 1 === 2 ? 3 : Math.round(c.i * c.e); return i + " " + pluralRu(i, "день", "дня", "дней"); }
    const i = c.r + 1 === 1 ? 3 : Math.round((c.r + 1 === 2 ? 6 : c.i * c.e) * 1.3);
    return i + " " + pluralRu(i, "день", "дня", "дней");
  }

  // Статистика зрелости
  function maturity() {
    const ks = Object.keys(cards);
    let young = 0, mature = 0;
    for (const k of ks) { if (cards[k].i < 21) young++; else mature++; }
    return { total: ks.length, young, mature, pct: ks.length ? Math.round(mature / ks.length * 100) : 0 };
  }

  // История за N дней
  function history(n = 14) {
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * DAY);
      const iso = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
      out.push({ date: iso, ...(daily[iso] || { rev: 0, new: 0, ok: 0 }) });
    }
    return out;
  }

  function exportAll() {
    return JSON.stringify({ v: 1, exported: new Date().toISOString(), cards, daily, meta }, null, 1);
  }
  function importAll(json) {
    const data = JSON.parse(json);
    if (!data.cards) throw new Error("bad format");
    cards = data.cards; daily = data.daily || {}; meta = data.meta || meta;
    save();
  }
  function resetAll() {
    cards = {}; daily = {}; meta = { streak: 0, lastDay: null, totalReviews: 0 };
    save();
  }

  load();
  return { isNew, isDue, dueKeys, dueCount, todayStats, grade, add, preview, maturity, history, touchDay, exportAll, importAll, resetAll, get cards() { return cards; } };
})();
