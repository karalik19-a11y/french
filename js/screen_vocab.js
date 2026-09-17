// Экран: словарь — премиальный словарь + карточки + избранное
"use strict";
(() => {
  const A = window.App;
  const PAGE = 48;

  function srsState(key) {
    if (SRS.isNew(key)) return { id: "new", ru: "новое", cls: "vcard--new" };
    const c = SRS.cards[key];
    if (c && c.i >= 21) return { id: "mature", ru: "закреплено", cls: "vcard--mature" };
    return { id: "learn", ru: "в работе", cls: "vcard--learn" };
  }

  function matches(e, q) {
    if (!q) return true;
    const s = norm(q);
    return norm(e.f).includes(s) || norm(e.r).includes(s) || norm(e.t || "").includes(s)
      || norm(e.ef || "").includes(s) || norm(e.er || "").includes(s) || norm(e.ip || "").includes(q.trim());
  }

  function wordCardHTML(e, i) {
    const key = "v:" + e.f.toLowerCase();
    const st = srsState(key);
    const fav = Activity.isFav("v", e.f.toLowerCase());
    return `<article class="vcard ${st.cls} ${fav ? "vcard--fav" : ""}" data-w="${esc(e.f)}" tabindex="0" role="button" aria-label="${esc(e.f)} — ${esc(e.r)}">
      <div class="vcard__acts">
        ${spkBtn(e.f)}
        <button class="fav ${fav ? "is-on" : ""}" type="button" data-fav="${esc(e.f.toLowerCase())}" aria-pressed="${fav}" aria-label="В избранное">${icon("heart", "sm")}</button>
      </div>
      <div class="vcard__fr">${esc(e.f)}</div>
      ${e.ip ? `<div class="vcard__ipa">/${esc(e.ip)}/</div>` : ""}
      <div class="vcard__ru">«${esc(e.r)}»</div>
      ${e.ef ? `<div class="vcard__ex">${esc(e.ef)}</div>` : ""}
      <div class="vcard__foot">
        ${cefrBadge(e.l)}
        ${e.t ? pill(e.t) : ""}
        <span class="spacer"></span>
        <span class="hint" style="text-transform:none;letter-spacing:0;font-family:var(--font-display);font-style:italic;font-size:13px">${esc(st.ru)}</span>
      </div>
    </article>`;
  }

  A.screens.vocab = (args) => {
    const main = A.main;
    let preset = null, openWord = null;
    if (args && args[0] === "lvl") preset = { lv: String(args[1] || "").replace("+", "") };
    else if (args && args[0] === "theme") preset = { theme: String(args[1] || "") };
    else if (args && args[0] === "fav") preset = { fav: true };
    else if (args && args[0]) openWord = String(args[0]);

    const themes = [...new Set(DB.vocab.map(e => e.t).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ru"));

    main.innerHTML = `<div class="screen">
      ${A.screenHead({
      eyebrow: "Vocabulaire",
      title: "Словарь <em>A1 → C1</em>",
      lead: `${fmtNum(DB.vocab.length)} слов и выражений с транскрипцией, родом, примером и переводом. Нажмите на карточку — откроется статья со звуком и тренировкой.`,
      actions: `<a class="btn btn--ghost" href="#/vocab/fav">${icon("heart", "sm")}Избранные · ${Activity.favList("v").length}</a>`
    })}

      <div class="vtoolbar">
        <div class="search">
          <span class="search__ico">${icon("search", "sm")}</span>
          <input class="input input--search" id="vq" type="search" placeholder="Поиск: maison, дом, [mɛzɔ̃]…" aria-label="Поиск по словарю" autocomplete="off">
          <button class="search__clear hidden" id="vqClear" type="button" aria-label="Очистить">${icon("x", "xs")}</button>
        </div>
        <div class="chips chips--scroll" id="vLevels">
          ${["all", "A1", "A2", "B1", "B2", "C1"].map(lv => `<button class="chip" type="button" data-lv="${lv}">${lv === "all" ? "Все уровни" : lv}</button>`).join("")}
        </div>
        <div class="chips chips--scroll" id="vStates">
          <button class="chip" type="button" data-st="all">Любой статус</button>
          <button class="chip" type="button" data-st="new">Новые</button>
          <button class="chip" type="button" data-st="learn">В работе</button>
          <button class="chip" type="button" data-st="mature">Закреплённые</button>
          <button class="chip" type="button" data-st="fav">Избранные</button>
        </div>
        <div class="chips chips--scroll" id="vThemes">
          <button class="chip" type="button" data-th="">Все темы</button>
          ${themes.map(t => `<button class="chip" type="button" data-th="${esc(t)}">${esc(t)}</button>`).join("")}
        </div>
      </div>

      <div class="row" style="gap:10px">
        <span class="vtoolbar__count" id="vCount"></span>
        <span class="spacer"></span>
        <button class="btn btn--quiet btn--sm" type="button" id="vTrainSel">${icon("target", "sm")}Тренировать выборку</button>
      </div>

      <div class="vcards" id="vList" data-stagger=":scope > *"></div>
      <div class="btn-row" style="justify-content:center;margin-top:16px">
        <button class="btn btn--ghost hidden" type="button" id="vMore">${icon("plus", "sm")}Показать ещё</button>
      </div>
      <div id="vSentinel" style="height:8px"></div>
    </div>`;

    const state = {
      q: "", lv: preset && preset.lv ? preset.lv : "all",
      st: preset && preset.fav ? "fav" : "all",
      th: preset && preset.theme ? preset.theme : "",
      shown: PAGE
    };

    const list = $("#vList", main);
    const countEl = $("#vCount", main);
    const moreBtn = $("#vMore", main);
    let filtered = [];

    function markActive(container, attr, val) {
      $$(`[${attr}]`, container).forEach(b => b.classList.toggle("is-active", b.getAttribute(attr) === String(val)));
    }

    function apply() {
      filtered = DB.vocab.filter(e => {
        if (state.lv !== "all" && e.l !== state.lv) return false;
        if (state.th && e.t !== state.th) return false;
        if (state.st === "fav" && !Activity.isFav("v", e.f.toLowerCase())) return false;
        if (["new", "learn", "mature"].includes(state.st) && srsState("v:" + e.f.toLowerCase()).id !== state.st) return false;
        return matches(e, state.q);
      });
      state.shown = PAGE;
      draw();
    }

    function draw() {
      countEl.textContent = `${fmtNum(filtered.length)} ${pluralRu(filtered.length, "слово", "слова", "слов")}`;
      if (!filtered.length) {
        list.innerHTML = A.emptyState({
          icon: "search", title: "Ничего не найдено",
          text: "Измените запрос или снимите фильтры — в словаре около трёх тысяч записей."
        });
        moreBtn.classList.add("hidden");
        return;
      }
      const slice = filtered.slice(0, state.shown);
      list.innerHTML = slice.map((e, i) => wordCardHTML(e, i)).join("");
      moreBtn.classList.toggle("hidden", state.shown >= filtered.length);
      moreBtn.innerHTML = `${icon("plus", "sm")}Показать ещё · ${Math.min(PAGE, filtered.length - state.shown)}`;
      bindCards();
      UI.stagger(list, ":scope > *", 26);
    }

    function bindCards() {
      $$(".vcard", list).forEach(card => {
        const open = () => wordSheet(card.dataset.w);
        card.addEventListener("click", ev => {
          if (closestOf(ev.target, "[data-fav], [data-say]")) return;
          open();
        });
        card.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); open(); } });
      });
      $$("[data-fav]", list).forEach(b => b.addEventListener("click", ev => {
        ev.stopPropagation();
        const on = Activity.favToggle("v", b.dataset.fav);
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", String(on));
        b.closest(".vcard").classList.toggle("vcard--fav", on);
        UI.haptic(on ? 14 : 6);
        if (state.st === "fav" && !on) apply();
      }));
    }

    /* ---- Статья слова ---- */
    function wordSheet(word) {
      const e = DB.vocab.find(x => x.f === word) || DB.vocab.find(x => norm(x.f) === norm(word));
      if (!e) return;
      const key = "v:" + e.f.toLowerCase();
      const st = srsState(key);
      const c = SRS.cards[key];
      const fav = Activity.isFav("v", e.f.toLowerCase());

      UI.sheet({
        eyebrow: `Article${e.t ? " · " + e.t : ""}`,
        title: e.f,
        sub: `${e.ip ? "/" + e.ip + "/  ·  " : ""}«${e.r}»`,
        body: `
          <div class="col" style="gap:12px">
            <div class="wdetail__row">
              ${cefrBadge(e.l)}
              ${e.t ? pill(e.t) : ""}
              ${e.g ? pill(e.g, "gold") : ""}
              <span class="pill ${st.id === "mature" ? "pill--ok" : st.id === "learn" ? "pill--accent" : ""}">${st.ru}${c && c.i ? ` · ${c.i} ${pluralRu(c.i, "день", "дня", "дней")}` : ""}</span>
            </div>
            <div class="wdetail__ru">«${esc(e.r)}»</div>
            <div class="row" style="gap:8px;flex-wrap:wrap">
              <button class="spk" type="button" data-say="${esc(e.f)}" aria-label="Прослушать слово">${icon("volume", "sm")}Слово</button>
              <button class="fav ${fav ? "is-on" : ""}" type="button" id="shFav" aria-pressed="${fav}">${icon("heart", "sm")}${fav ? "В избранном" : "В избранное"}</button>
            </div>
            ${e.ef ? `<div class="wdetail__ex">
              <div class="wdetail__ex-fr">${spkBtn(e.ef)}<span>${esc(e.ef)}</span></div>
              ${e.er ? `<div class="wdetail__ex-ru">${esc(e.er)}</div>` : ""}
            </div>` : ""}
            ${e.ef ? `<div class="ctx">Повторяйте пример вслух целиком — так запоминается не слово, а конструкция.</div>` : ""}
          </div>
        `,
        footer: `
          <button class="btn btn--primary btn--lg" type="button" id="shTrain">${icon("target", "sm")}Тренировать слово</button>
          <button class="btn btn--ghost btn--lg" type="button" id="shMore">${icon("search", "sm")}Ещё из темы</button>
        `,
        onMount: (panel, close) => {
          $("#shFav", panel).addEventListener("click", () => {
            const on = Activity.favToggle("v", e.f.toLowerCase());
            const b = $("#shFav", panel);
            b.classList.toggle("is-on", on);
            b.setAttribute("aria-pressed", String(on));
            b.innerHTML = `${icon("heart", "sm")}${on ? "В избранном" : "В избранное"}`;
            UI.haptic(on ? 14 : 6);
            apply();
          });
          $("#shTrain", panel).addEventListener("click", () => {
            close();
            const qs = [EX.qVocabChoiceFR(e), EX.qVocabChoiceRU(e), EX.qVocabInput(e), EX.qVocabListen(e), e.ef ? EX.qOrderWords(e.ef, e.er) : null].filter(Boolean);
            A.openSession(shuffle(qs), `Слово · ${e.f}`);
          });
          $("#shMore", panel).addEventListener("click", () => {
            close();
            const inp = $("#vq", main);
            const term = e.t || e.f;
            if (inp) {
              inp.value = term; state.q = term;
              $("#vqClear", main).classList.remove("hidden");
              apply();
            }
          });
        }
      });
    }

    /* ---- Фильтры ---- */
    const qInput = $("#vq", main), qClear = $("#vqClear", main);
    let deb = 0;
    qInput.addEventListener("input", e => {
      state.q = e.target.value;
      qClear.classList.toggle("hidden", !state.q);
      clearTimeout(deb);
      deb = setTimeout(apply, 130);
    });
    qClear.addEventListener("click", () => { qInput.value = ""; state.q = ""; qClear.classList.add("hidden"); apply(); qInput.focus(); });

    $$("#vLevels .chip", main).forEach(b => b.addEventListener("click", () => { state.lv = b.dataset.lv; markActive($("#vLevels", main), "data-lv", state.lv); apply(); }));
    $$("#vStates .chip", main).forEach(b => b.addEventListener("click", () => { state.st = b.dataset.st; markActive($("#vStates", main), "data-st", state.st); apply(); }));
    $$("#vThemes .chip", main).forEach(b => b.addEventListener("click", () => { state.th = b.dataset.th; markActive($("#vThemes", main), "data-th", state.th); apply(); }));

    markActive($("#vLevels", main), "data-lv", state.lv);
    markActive($("#vStates", main), "data-st", state.st);
    markActive($("#vThemes", main), "data-th", state.th);
    if (state.th) {
      const sel = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(state.th) : state.th;
      const active = $(`#vThemes [data-th="${sel}"]`, main);
      if (active && active.scrollIntoView) { try { active.scrollIntoView({ inline: "center", block: "nearest" }); } catch (e) { } }
    }

    moreBtn.addEventListener("click", () => { state.shown += PAGE; draw(); });

    // Автоподгрузка при прокрутке
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(entries => {
        if (entries.some(x => x.isIntersecting) && state.shown < filtered.length) {
          state.shown += PAGE;
          draw();
        }
      }, { rootMargin: "600px 0px" });
      io.observe($("#vSentinel", main));
    }

    $("#vTrainSel", main).addEventListener("click", () => {
      const pool = (filtered.length ? filtered : DB.vocab.slice(0, 400)).slice();
      const picks = shuffle(pool).slice(0, Math.min(12, pool.length));
      const qs = picks.flatMap(e => shuffle([
        EX.qVocabChoiceFR(e), EX.qVocabChoiceRU(e), EX.qVocabInput(e)
      ]).slice(0, 1));
      A.openSession(qs, pool === filtered && state.th ? `Слова · ${state.th}` : "Слова · выборка из словаря");
    });

    apply();

    if (openWord) setTimeout(() => wordSheet(openWord), 340);
  };
})();
