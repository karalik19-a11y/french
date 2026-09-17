// Утилиты и помощники разметки — Le Français
"use strict";
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const pad2 = n => String(n).padStart(2, "0");

// Пиктограммы-эмодзи вычищаются из любого выводимого текста
const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{203C}\u{2049}]/gu;
const EMOJI_TEST = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{203C}\u{2049}]/u;
function stripEmoji(s) {
  const str = String(s == null ? "" : s);
  return EMOJI_TEST.test(str) ? str.replace(EMOJI_RE, "").replace(/ {2,}/g, " ").trim() : str;
}

const esc = s => stripEmoji(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rnd = a => a[Math.floor(Math.random() * a.length)];
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const pctOf = (a, b) => (b > 0 ? clamp(Math.round((a / b) * 100), 0, 100) : 0);
const fmtNum = n => String(n == null ? 0 : n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Нормализация для сравнения ответов: без акцентов/регистра/лишних пробелов
function norm(s) {
  return String(s || "").toLowerCase().trim()
    .replace(/œ/g, "oe").replace(/æ/g, "ae")
    .replace(/[áàâäãå]/g, "a").replace(/[éèêë]/g, "e").replace(/[íìîï]/g, "i")
    .replace(/[óòôöõ]/g, "o").replace(/[úùûü]/g, "u").replace(/[ýÿ]/g, "y")
    .replace(/ñ/g, "n").replace(/ç/g, "c")
    .replace(/\s+/g, " ").replace(/['ʼ’]/g, "'").replace(/^-|-$|[,.;!?:]/g, "");
}
function normSpaces(s) { return String(s || "").replace(/\s+/g, " ").trim(); }

// localStorage-хранилище
// Безопасный closest: событие может прийти не от элемента (document, text node)
function closestOf(target, sel) {
  return target && typeof target.closest === "function" ? target.closest(sel) : null;
}

const store = {
  get(key, dflt) {
    try { const v = localStorage.getItem("fd_" + key); return v == null ? dflt : JSON.parse(v); }
    catch (e) { return dflt; }
  },
  set(key, val) { try { localStorage.setItem("fd_" + key, JSON.stringify(val)); } catch (e) { console.warn("store full?", e); } },
  del(key) { try { localStorage.removeItem("fd_" + key); } catch (e) { } }
};

const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };

// ---------- Французские даты (без зависимости от локали) ----------
const FR_DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const FR_MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const RU_DAYS = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
const RU_MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const RU_MONTHS_NOM = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];

function frDate(d = new Date()) {
  return `${FR_DAYS[d.getDay()]} ${d.getDate()} ${FR_MONTHS[d.getMonth()]}`;
}
function ruDate(d = new Date()) {
  return `${d.getDate()} ${RU_MONTHS[d.getMonth()]}`;
}
function ruDateFull(d = new Date()) {
  return `${RU_DAYS[d.getDay()]}, ${d.getDate()} ${RU_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
function frGreeting(d = new Date()) {
  const h = d.getHours();
  if (h < 5) return "Bonne nuit";
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}
function frDateShort(iso) {
  // "2026-09-17" -> "17 sept."
  const p = String(iso || "").split("-");
  if (p.length < 3) return iso;
  return `${+p[2]} ${FR_MONTHS[+p[1] - 1].slice(0, 4)}.`;
}
function dayNameShort(iso) {
  const p = String(iso || "").split("-");
  if (p.length < 3) return "";
  const d = new Date(+p[0], +p[1] - 1, +p[2]);
  return FR_DAYS[d.getDay()].slice(0, 2);
}

// ---------- Мини-разметка текстов уроков ----------
// ## h3, ### h4, | таблицы, > примеры (fr — ru), - списки, 1. нум.списки, **bold**, *it*, `code`
function md(text) {
  const inline = s => esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<i>$1</i>")
    .replace(/`([^`]+?)`/g, "<code>$1</code>");
  const lines = String(text == null ? "" : text).split("\n");
  let out = "", i = 0;
  while (i < lines.length) {
    const L = lines[i];
    if (/^\s*$/.test(L)) { i++; continue; }
    if (L.startsWith("## ")) { out += `<h3 class="md-h">${inline(L.slice(3))}</h3>`; i++; continue; }
    if (L.startsWith("### ")) { out += `<h4 class="md-h2">${inline(L.slice(4))}</h4>`; i++; continue; }
    if (L.trimStart().startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].trimStart().startsWith("|")) { rows.push(lines[i].trim()); i++; }
      let html = '<div class="tbl-wrap"><table class="md-tbl">';
      rows.forEach((r, ri) => {
        const cells = r.replace(/^\||\|$/g, "").split("|").map(c => inline(c.trim()));
        html += "<tr>" + cells.map(c => ri === 0 ? `<th>${c}</th>` : `<td>${c}</td>`).join("") + "</tr>";
      });
      out += html + "</table></div>";
      continue;
    }
    if (L.trimStart().startsWith("> ")) {
      const parts = L.trim().slice(2).split(" — ");
      const fr = parts.shift(), ru = parts.join(" — ");
      out += `<div class="md-ex"><span class="fr-line">${spkBtn(fr)}<span>${inline(fr)}</span></span>${ru ? `<span class="ru-line">${inline(ru)}</span>` : ""}</div>`;
      i++; continue;
    }
    if (/^\s*[-•] /.test(L)) {
      out += "<ul class='md-ul'>";
      while (i < lines.length && /^\s*[-•] /.test(lines[i])) { out += `<li>${inline(lines[i].replace(/^\s*[-•] /, ""))}</li>`; i++; }
      out += "</ul>"; continue;
    }
    if (/^\s*\d+\. /.test(L)) {
      out += "<ol class='md-ol'>";
      while (i < lines.length && /^\s*\d+\. /.test(lines[i])) { out += `<li>${inline(lines[i].replace(/^\s*\d+\. /, ""))}</li>`; i++; }
      out += "</ol>"; continue;
    }
    out += `<p>${inline(L)}</p>`; i++;
  }
  return out;
}

// ---------- Кнопки озвучки ----------
const spkBtn = (text, extra = "") => {
  const mod = extra ? " spk--" + String(extra).replace(/\s+/g, " spk--") : "";
  return `<button class="spk${mod}" data-say="${esc(text)}" type="button" aria-label="Прослушать" title="Прослушать">${icon("volume", "sm")}</button>`;
};
const spkWide = (text, label = "Прослушать", extra = "") =>
  `<button class="spk spk--wide ${extra}" data-say="${esc(text)}" type="button">${icon("volume", "sm")}<span>${esc(label)}</span></button>`;

// Глобальная обработка кликов по кнопкам озвучки
document.addEventListener("click", e => {
  const b = closestOf(e.target, "[data-say]");
  if (!b) return;
  e.preventDefault(); e.stopPropagation();
  const rate = b.dataset.rate ? parseFloat(b.dataset.rate) : undefined;
  b.classList.add("is-playing");
  const clear = () => b.classList.remove("is-playing");
  const t = setTimeout(clear, 6000);
  window.TTS.speak(b.dataset.say, { rate })
    .then(() => { clearTimeout(t); clear(); })
    .catch(() => { clearTimeout(t); clear(); });
});

// ---------- Кольцо прогресса ----------
function ring(pctVal, opts = {}) {
  const p = clamp(Math.round(pctVal || 0), 0, 100);
  const size = opts.size || 88;
  const w = opts.w || 7;
  const cls = opts.cls ? " ring--" + opts.cls : "";
  const delay = opts.delay != null ? opts.delay : 0;
  const inner = opts.label === false ? "" : `<div class="ring__label">${opts.num != null ? `<span class="ring__num">${esc(opts.num)}</span>` : ""}${opts.cap ? `<span class="ring__cap">${esc(opts.cap)}</span>` : ""}</div>`;
  return `<div class="ring${cls}" style="--size:${size}px;--w:${w};--pct:${p};--i:${delay}" role="img" aria-label="${esc(opts.aria || `Прогресс ${p}%`)}">
    <svg viewBox="0 0 100 100"><circle class="ring__trail" cx="50" cy="50" r="44"/><circle class="ring__val" cx="50" cy="50" r="44"/></svg>
    ${inner}
  </div>`;
}

// ---------- Полоса прогресса ----------
function bar(val01, opts = {}) {
  const v = clamp(Number(val01) || 0, 0, 1);
  const cls = (opts.cls ? " bar__fill--" + opts.cls : "") + (opts.instant ? " bar__fill--instant" : "");
  return `<div class="bar${opts.size ? " bar--" + opts.size : ""}" style="--h:${opts.h || 7}px" role="img" aria-label="${esc(opts.aria || `Прогресс ${Math.round(v * 100)}%`)}">
    <div class="bar__fill${cls}" style="--val:${v};--i:${opts.delay || 0}"></div>
  </div>`;
}

function meter(name, val01, valText, opts = {}) {
  return `<div class="meter">
    <div class="meter__top"><span class="meter__name">${esc(name)}</span><span class="meter__val">${esc(valText)}</span></div>
    ${bar(val01, opts)}
  </div>`;
}

// ---------- Бейджи ----------
function cefrBadge(cefr, extra = "") {
  const c = String(cefr || "").trim();
  const base = c.replace("+", "").toLowerCase();
  const plus = c.endsWith("+") ? " cefr-plus" : "";
  return `<span class="cefr cefr-${esc(base)}${plus} ${extra}">${esc(c)}</span>`;
}
function pill(text, kind = "", ico = "") {
  return `<span class="pill${kind ? " pill--" + kind : ""}">${ico ? icon(ico, "xs") : ""}${esc(text)}</span>`;
}
function lvlBadge(text) { return `<span class="lvl-badge">${esc(text)}</span>`; }
function tenseBadge(text) { return `<span class="tense-badge">${esc(text)}</span>`; }
function grpBadge(g) { return `<span class="grp grp--${g}">${esc(g)} гр.</span>`; }

// Дедупликация словаря (по f)
function dedupeVocab() {
  const seen = new Set();
  DB.vocab = DB.vocab.filter(e => {
    const k = (e.f || "").toLowerCase();
    if (!k || seen.has(k)) return false;
    seen.add(k); return true;
  });
}

// Поиск перевода слова для текстов (простая лемматизация)
function lookupWord(w) {
  w = String(w || "").toLowerCase().replace(/^[ldjmtscn]'|^qu'|^s'/, "").replace(/[^a-zàâäéèêëîïôöùûüçœæ' -]/g, "").trim();
  if (!w) return null;
  const V = DB.vocab;
  const exact = V.find(e => e.f.toLowerCase() === w);
  if (exact) return exact;
  const cands = [w, w + "e", w + "s", w + "es", w.replace(/s$/, ""), w.replace(/x$/, ""), w.replace(/e$/, ""),
    w.replace(/ée?$/, "er"), w.replace(/i$/, "ir"), w.replace(/u$/, "ir"), w.replace(/^se /, "s'")];
  for (const c of cands) {
    const hit = V.find(e => { const f = e.f.toLowerCase(); return f === c || f === "le " + c || f === "la " + c || f === c.replace(/ /g, ""); });
    if (hit) return hit;
  }
  const verb = DB.verbs.find(v => v.inf.toLowerCase() === w || v.inf.toLowerCase().replace(/^s'|se /, "") === w.replace(/^se |s'/, ""));
  if (verb) return { f: verb.inf, r: verb.ru, t: "Глагол", verb: true };
  return null;
}

// Форматирование числа дней
function pluralRu(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
  return many;
}
// «N дней / слова / карточки»
function daysRu(n) { return `${n} ${pluralRu(n, "день", "дня", "дней")}`; }
function cardsRu(n) { return `${n} ${pluralRu(n, "карточка", "карточки", "карточек")}`; }
function wordsRu(n) { return `${n} ${pluralRu(n, "слово", "слова", "слов")}`; }
function lessonsRu(n) { return `${n} ${pluralRu(n, "урок", "урока", "уроков")}`; }
function minutesRu(n) { return `${n} ${pluralRu(n, "минута", "минуты", "минут")}`; }

Object.assign(window, {
  $, $$, closestOf, esc, stripEmoji, shuffle, rnd, pad2, clamp, pctOf, fmtNum, norm, normSpaces, store, todayISO,
  md, spkBtn, spkWide, dedupeVocab, lookupWord, pluralRu,
  ring, bar, meter, cefrBadge, pill, lvlBadge, tenseBadge, grpBadge,
  frDate, ruDate, ruDateFull, frGreeting, frDateShort, dayNameShort,
  daysRu, cardsRu, wordsRu, lessonsRu, minutesRu,
  FR_DAYS, FR_MONTHS, RU_DAYS, RU_MONTHS, RU_MONTHS_NOM
});
