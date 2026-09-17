// Активность, избранное, навыки и достижения — производные от реальных данных
"use strict";
window.Activity = (() => {

  const KEY = "activity";
  const FAV_KEY = "favorites";
  const SEEN_KEY = "achv_seen";

  let data = store.get(KEY, null) || { c: {}, first: null };
  let favs = store.get(FAV_KEY, null) || { v: [], i: [] };

  function save() { store.set(KEY, data); }
  function saveFavs() { store.set(FAV_KEY, favs); }

  function bump(kind, n = 1) {
    data.c[kind] = (data.c[kind] || 0) + n;
    if (!data.first) data.first = todayISO();
    save();
  }
  const count = kind => data.c[kind] || 0;

  // ---------- Избранное ----------
  function isFav(type, id) { return (favs[type] || []).includes(id); }
  function favToggle(type, id) {
    favs[type] = favs[type] || [];
    const i = favs[type].indexOf(id);
    if (i >= 0) favs[type].splice(i, 1); else favs[type].push(id);
    saveFavs();
    return i < 0;
  }
  function favList(type) { return (favs[type] || []).slice(); }
  function favCount() { return (favs.v || []).length + (favs.i || []).length; }

  // ---------- Ключи SRS по типам ----------
  function srsKeys() { return Object.keys(SRS.cards || {}); }
  function keysOf(prefix) { return srsKeys().filter(k => k.startsWith(prefix)); }

  function matureCount() {
    const c = SRS.cards || {};
    return Object.keys(c).filter(k => c[k].i >= 21).length;
  }

  //Grammar-уроки, по которым есть закреплённые карточки
  function grammarLessonsTouched() {
    const set = new Set();
    for (const k of keysOf("g:")) set.add(k.split(":")[1]);
    return set;
  }

  // Любимые темы — по словам в SRS и в избранном
  function topThemes(limit = 8) {
    const tally = new Map();
    const add = (theme, w) => { if (!theme) return; tally.set(theme, (tally.get(theme) || 0) + w); };
    for (const k of keysOf("v:")) {
      const w = k.slice(2);
      const e = DB.vocab.find(x => x.f.toLowerCase() === w);
      if (e) add(e.t, 1);
    }
    for (const f of favs.v || []) {
      const e = DB.vocab.find(x => x.f.toLowerCase() === String(f).toLowerCase());
      if (e) add(e.t, 3);
    }
    return [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([t, n]) => ({ t, n }));
  }

  // Первая активность (для «учится с …»)
  function startedAt() {
    if (data.first) return data.first;
    const daily = store.get("srs_daily", {}) || {};
    const keys = Object.keys(daily).sort();
    if (keys.length) return keys[0];
    const cards = SRS.cards || {};
    const created = Object.keys(cards).map(k => cards[k].t).filter(Boolean).sort((a, b) => a - b);
    if (created.length) {
      const d = new Date(created[0]);
      return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    }
    return todayISO();
  }

  // ---------- Навыки (производные) ----------
  function skills() {
    const vocabTotal = DB.vocab.length;
    const grammarTotal = DB.grammar.length;
    const idiomTotal = DB.idioms.length;
    const readingTotal = DB.reading.length;

    const vCards = keysOf("v:").length;
    const iCards = keysOf("i:").length;
    const gTouched = grammarLessonsTouched().size;
    const verbOk = count("verbs_ok");
    const verbAll = count("verbs_all");
    const shadow = count("shadow");
    const listen = count("listen");
    const phon = count("phon");
    const read = count("read_texts");

    const s = [];
    s.push({
      id: "lexique", fr: "Lexique", ru: "Словарный запас", icon: "book",
      cur: vCards, max: Math.min(vocabTotal, 1200), val: `${fmtNum(vCards)} ${pluralRu(vCards, "слово", "слова", "слов")} в памяти`,
      pct: pctOf(vCards, Math.min(vocabTotal, 1200)), cls: ""
    });
    s.push({
      id: "grammaire", fr: "Grammaire", ru: "Грамматика", icon: "braces",
      cur: gTouched, max: grammarTotal, val: `${gTouched} из ${grammarTotal} уроков закреплено`,
      pct: pctOf(gTouched, grammarTotal), cls: "gold"
    });
    s.push({
      id: "conjugaison", fr: "Conjugaison", ru: "Спряжения", icon: "bookOpen",
      cur: verbOk, max: Math.max(200, verbAll), val: verbAll ? `${verbOk} из ${verbAll} верных ответов` : "пока без практики",
      pct: pctOf(verbOk, Math.max(200, verbAll)), cls: "ok"
    });
    s.push({
      id: "phonetique", fr: "Phonétique", ru: "Произношение", icon: "wave",
      cur: shadow + phon, max: Math.max(120, shadow + phon), val: `${shadow} повторов за диктором · ${phon} упражнений на звуки`,
      pct: pctOf(shadow + phon, Math.max(120, shadow + phon)), cls: "gold"
    });
    s.push({
      id: "idiomes", fr: "Idiomes", ru: "Идиомы", icon: "quote",
      cur: iCards, max: idiomTotal, val: `${iCards} из ${idiomTotal} выражений`,
      pct: pctOf(iCards, idiomTotal), cls: ""
    });
    s.push({
      id: "lecture", fr: "Lecture", ru: "Чтение и аудирование", icon: "page",
      cur: read, max: readingTotal, val: `${read} из ${readingTotal} текстов · ${listen} аудирований`,
      pct: pctOf(read, readingTotal), cls: "ok"
    });
    return s;
  }

  // ---------- Достижения ----------
  function achievementDefs() {
    const st = SRS.todayStats();
    const settings = store.get("settings", {}) || {};
    const passed = settings.passedLevels || [];
    const vCards = keysOf("v:").length;
    const iCards = keysOf("i:").length;
    const gTouched = grammarLessonsTouched().size;
    const mature = matureCount();
    const totalCards = srsKeys().length;

    return [
      { id: "first", fr: "Premier pas", ru: "Первый шаг", icon: "sparkles", desc: "Первая карточка в системе повторения", cur: totalCards, max: 1 },
      { id: "goal", fr: "Objectif du jour", ru: "Цель дня", icon: "target", desc: "Дневная цель по карточкам выполнена", cur: st.rev + st.new, max: Math.max(1, settings.dailyGoal || 20) },
      { id: "s3", fr: "Trois jours", ru: "Три дня подряд", icon: "flame", desc: "Стрик из трёх дней", cur: st.streak, max: 3 },
      { id: "s7", fr: "Une semaine", ru: "Неделя", icon: "flame", desc: "Семь дней подряд", cur: st.streak, max: 7 },
      { id: "s30", fr: "Un mois", ru: "Месяц", icon: "flame", desc: "Тридцать дней подряд", cur: st.streak, max: 30 },
      { id: "c50", fr: "Cinquate mots", ru: "Пятьдесят слов", icon: "layers", desc: "50 карточек в памяти", cur: totalCards, max: 50 },
      { id: "c200", fr: "Deux cents", ru: "Двести слов", icon: "layers", desc: "200 карточек в памяти", cur: totalCards, max: 200 },
      { id: "c500", fr: "Cinq cents", ru: "Пятьсот слов", icon: "trophy", desc: "500 карточек в памяти", cur: totalCards, max: 500 },
      { id: "m25", fr: "Mémoire longue", ru: "Долгая память", icon: "medal", desc: "25 карточек с интервалом 21 день и больше", cur: mature, max: 25 },
      { id: "lv1", fr: "Niveau un", ru: "Первый уровень", icon: "crown", desc: "Тест уровня 1 сдан", cur: passed.length, max: 1 },
      { id: "lv4", fr: "À mi-chemin", ru: "Половина пути", icon: "crown", desc: "Четыре уровня курса сданы", cur: passed.length, max: 4 },
      { id: "lv8", fr: "Maîtrise", ru: "Мастерство", icon: "crown", desc: "Все восемь уровней курса сданы", cur: passed.length, max: 8 },
      { id: "v100", fr: "Conjugueur", ru: "Спрягатель", icon: "bookOpen", desc: "100 верных ответов на спряжения", cur: count("verbs_ok"), max: 100 },
      { id: "sh50", fr: "Shadowing", ru: "Теневой повтор", icon: "mic", desc: "50 фраз повторено за диктором", cur: count("shadow"), max: 50 },
      { id: "g10", fr: "Grammairien", ru: "Грамматик", icon: "braces", desc: "10 уроков грамматики закреплено", cur: gTouched, max: 10 },
      { id: "i20", fr: "Esprit français", ru: "Французский дух", icon: "quote", desc: "20 идиом и пословиц в памяти", cur: iCards, max: 20 },
      { id: "f10", fr: "Collection", ru: "Коллекция", icon: "heart", desc: "10 слов в избранном", cur: favCount(), max: 10 },
      { id: "r5", fr: "Lecteur", ru: "Читатель", icon: "page", desc: "5 текстов открыто в чтении", cur: count("read_texts"), max: 5 },
      { id: "p10", fr: "Sans faute", ru: "Без ошибок", icon: "medal", desc: "10 сессий без единой ошибки", cur: count("perfect"), max: 10 }
    ].map(a => ({ ...a, earned: a.cur >= a.max, p: clamp(Math.round(a.cur / a.max * 100), 0, 100) }));
  }

  // Какие достижения открылись впервые (для тоста и анимации)
  function freshAchievements() {
    const seen = store.get(SEEN_KEY, []) || [];
    const earned = achievementDefs().filter(a => a.earned);
    const fresh = earned.filter(a => !seen.includes(a.id));
    if (fresh.length) store.set(SEEN_KEY, [...seen, ...fresh.map(a => a.id)]);
    return fresh;
  }
  function markAllSeen() {
    store.set(SEEN_KEY, achievementDefs().filter(a => a.earned).map(a => a.id));
  }
  function earnedCount() { return achievementDefs().filter(a => a.earned).length; }

  // ---------- Сводка для экранов ----------
  function summary() {
    const st = SRS.todayStats();
    const mat = SRS.maturity();
    const hist = SRS.history(14);
    const settings = store.get("settings", {}) || {};
    const goal = Math.max(1, settings.dailyGoal || 20);
    const done = st.rev + st.new;
    const total7 = SRS.history(7).reduce((s, d) => s + d.rev + d.new, 0);
    const ok7 = SRS.history(7).reduce((s, d) => s + (d.ok || 0), 0);
    return {
      ...st, mat, hist, goal, done,
      goalPct: pctOf(done, goal),
      weekTotal: total7,
      weekAccuracy: total7 ? Math.round(ok7 / Math.max(1, st.rev || 1) * 100) : 0,
      accuracy: pctOf(ok7, total7),
      totalCards: mat.total,
      vocabCards: keysOf("v:").length,
      idiomCards: keysOf("i:").length,
      grammarLessons: grammarLessonsTouched().size,
      levelsPassed: (settings.passedLevels || []).length,
      achievements: earnedCount(),
      achievementsTotal: achievementDefs().length,
      startedAt: startedAt()
    };
  }

  // Счётчик озвучиваний — для статистики аудирования
  document.addEventListener("click", e => {
    if (closestOf(e.target, "[data-say]")) bump("listen");
  }, true);

  return {
    bump, count, save,
    isFav, favToggle, favList, favCount,
    skills, topThemes, achievementDefs, freshAchievements, markAllSeen, earnedCount,
    summary, matureCount, grammarLessonsTouched, startedAt,
    get data() { return data; }
  };
})();
