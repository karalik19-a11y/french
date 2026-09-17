// Утилиты — Французский для Дани
"use strict";
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rnd = a => a[Math.floor(Math.random() * a.length)];
const pad2 = n => String(n).padStart(2, "0");

// Нормализация для сравнения ответов: без акцентов/регистра/лишних пробелов
function norm(s) {
  return String(s || "").toLowerCase().trim()
    .replace(/œ/g, "oe").replace(/æ/g, "ae")
    .replace(/[áàâäãå]/g, "a").replace(/[éèêë]/g, "e").replace(/[íìîï]/g, "i")
    .replace(/[óòôöõ]/g, "o").replace(/[úùûü]/g, "u").replace(/[ýÿ]/g, "y")
    .replace(/ñ/g, "n").replace(/ç/g, "c")
    .replace(/\s+/g, " ").replace(/['ʼ’]/g, "'").replace(/^-|-$|[,.;!?:]/g, "");
}
// Строгая нормализация (с акцентами) — для отображения
function normSpaces(s) { return String(s || "").replace(/\s+/g, " ").trim(); }

// localStorage-хранилище
const store = {
  get(key, dflt) {
    try { const v = localStorage.getItem("fd_" + key); return v == null ? dflt : JSON.parse(v); }
    catch (e) { return dflt; }
  },
  set(key, val) { try { localStorage.setItem("fd_" + key, JSON.stringify(val)); } catch (e) { console.warn("store full?", e); } },
  del(key) { localStorage.removeItem("fd_" + key); }
};

const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };

// Мини-разметка для текстов уроков и методологии
// ## h3, ### h4, | таблицы, > примеры (fr — ru), - списки, 1. нум.списки, **bold**, *it*, `code`
function md(text, opts = {}) {
  const inline = s => esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<i>$1</i>")
    .replace(/`([^`]+?)`/g, '<code>$1</code>');
  const lines = String(text).split("\n");
  let out = "", i = 0;
  while (i < lines.length) {
    let L = lines[i];
    if (/^\s*$/.test(L)) { i++; continue; }
    if (L.startsWith("## ")) { out += `<h3 class="md-h">${inline(L.slice(3))}</h3>`; i++; continue; }
    if (L.startsWith("### ")) { out += `<h4 class="md-h2">${inline(L.slice(4))}</h4>`; i++; continue; }
    if (L.trimStart().startsWith("|")) { // таблица
      const rows = [];
      while (i < lines.length && lines[i].trimStart().startsWith("|")) { rows.push(lines[i].trim()); i++; }
      let html = '<div class="tbl-wrap"><table class="md-tbl">';
      rows.forEach((r, ri) => {
        const cells = r.replace(/^\||\|$/g, "").split("|").map(c => inline(c.trim()));
        html += "<tr>" + cells.map(c => ri === 0 ? `<th>${c}</th>` : `<td>${c}</td>`).join("") + "</tr>";
      });
      html += "</table></div>";
      out += html; continue;
    }
    if (L.trimStart().startsWith("> ")) { // пример FR — RU
      const parts = L.trim().slice(2).split(" — ");
      const fr = parts.shift(), ru = parts.join(" — ");
      out += `<div class="md-ex"><span class="fr-line"><button class="spk" data-say="${esc(fr)}" title="Прослушать">🔊</button><b>${inline(fr)}</b></span>${ru ? `<span class="ru-line">${inline(ru)}</span>` : ""}</div>`;
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

// Иконка динамика (SVG, красится в currentColor)
const SPK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4.8 6.2 8.8H3.6a1 1 0 0 0-1 1v4.4a1 1 0 0 0 1 1h2.6l4.8 4V4.8z" fill="currentColor"/><path d="M15.2 8.6a4.8 4.8 0 0 1 0 6.8M18 5.9a8.6 8.6 0 0 1 0 12.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';

// Кнопка озвучки
const spkBtn = (text, extra = "") => `<button class="spk ${extra}" data-say="${esc(text)}" title="Прослушать">${SPK_ICON}</button>`;

// Глобальная обработка кликов по 🔊
document.addEventListener("click", e => {
  const b = e.target.closest("[data-say]");
  if (b) {
    e.preventDefault(); e.stopPropagation();
    const rate = b.dataset.rate ? parseFloat(b.dataset.rate) : undefined;
    window.TTS.speak(b.dataset.say, { rate }).catch(() => { });
  }
});

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
  w = w.toLowerCase().replace(/^[ldjmtscn]'|^qu'|^s'/, "").replace(/[^a-zàâäéèêëîïôöùûüçœæ' -]/g, "").trim();
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
  // глаголы: поиск по инфинитиву/основе
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

// Экспорт утилит в глобальную область (для надёжности между скриптами)
Object.assign(window, { $, $$, esc, shuffle, rnd, pad2, norm, normSpaces, store, todayISO, md, spkBtn, dedupeVocab, lookupWord, pluralRu });
