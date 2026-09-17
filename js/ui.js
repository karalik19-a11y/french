// UI-слой: тосты, листы, отклик на нажатие, движение, тема
"use strict";
window.UI = (() => {

  const root = document.documentElement;
  const reducedQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  let reduced = !!(reducedQuery && reducedQuery.matches);

  const prefersReduced = () => reduced || root.getAttribute("data-motion") === "off";

  /* ---------- Тактильный отклик ---------- */
  function haptic(pattern = 8) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { }
  }

  /* ---------- Отклик на нажатие (press states) ---------- */
  const PRESSABLE = ".btn, .chip, .tab, .tile, .card--press, .level, .vcard, .entry, .verb, .grade, .fav, .spk, .acc, .wtile, .ex-opt, .lib__item, .tabbar__item, .seg__item, .lstrip__item, .streak-pill, .back, .switch";
  let pressTimer = null;
  document.addEventListener("pointerdown", e => {
    const el = closestOf(e.target, PRESSABLE);
    if (!el || el.disabled) return;
    el.classList.add("is-press");
    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => el.classList.remove("is-press"), 700);
  }, { passive: true });
  const releaseAll = () => $$(".is-press").forEach(el => el.classList.remove("is-press"));
  document.addEventListener("pointerup", releaseAll, { passive: true });
  document.addEventListener("pointercancel", releaseAll, { passive: true });
  document.addEventListener("pointerleave", releaseAll, { passive: true });
  // iOS Safari: включает :active для touch
  document.addEventListener("touchstart", () => { }, { passive: true });

  /* ---------- Тосты ---------- */
  const TOAST_ICON = { ok: "check", bad: "alert", info: "info", gold: "sparkles" };
  function toast(opts) {
    const o = typeof opts === "string" ? { title: opts } : (opts || {});
    const layer = document.getElementById("toastLayer");
    if (!layer) return;
    const kind = o.kind || "info";
    const el = document.createElement("div");
    el.className = `toast toast--${kind}`;
    el.innerHTML = `
      <span class="toast__ico">${icon(o.icon || TOAST_ICON[kind] || "info", "sm")}</span>
      <span class="toast__body">
        <span class="toast__t">${esc(o.title || "")}</span>
        ${o.sub ? `<span class="toast__s">${esc(o.sub)}</span>` : ""}
      </span>`;
    layer.appendChild(el);
    haptic(10);
    const ms = o.ms || 3200;
    const kill = () => {
      if (!el.isConnected) return;
      el.classList.add("is-out");
      setTimeout(() => el.remove(), 320);
    };
    const t = setTimeout(kill, ms);
    el.addEventListener("click", () => { clearTimeout(t); kill(); });
    while (layer.children.length > 3) layer.firstElementChild.remove();
  }

  /* ---------- Лист (bottom sheet / модалка) ---------- */
  let openSheets = 0;
  let savedScroll = 0;

  function lockScroll(on) {
    if (on) {
      savedScroll = window.scrollY || 0;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${savedScroll}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      try { window.scrollTo(0, savedScroll); } catch (e) { }
    }
  }

  function sheet(opts) {
    const o = opts || {};
    const layer = document.getElementById("sheetLayer");
    const el = document.createElement("div");
    el.className = "sheet";
    el.innerHTML = `
      <div class="sheet__bd" data-close></div>
      <div class="sheet__panel" role="dialog" aria-modal="true" ${o.title ? `aria-label="${esc(o.title)}"` : ""}>
        <div class="sheet__grab" data-drag></div>
        ${o.title === false ? "" : `<div class="sheet__head">
          <div class="col" style="gap:4px;flex:1;min-width:0">
            ${o.eyebrow ? `<span class="eyebrow">${esc(o.eyebrow)}</span>` : ""}
            ${o.title ? `<h2 class="display display--3">${esc(o.title)}</h2>` : ""}
            ${o.sub ? `<p class="lead">${esc(o.sub)}</p>` : ""}
          </div>
          <button class="sheet__close" type="button" data-close aria-label="Закрыть">${icon("x", "sm")}</button>
        </div>`}
        <div class="sheet__body">${o.body || ""}</div>
        ${o.footer ? `<div class="sheet__foot">${o.footer}</div>` : ""}
      </div>`;
    layer.appendChild(el);
    openSheets++;
    lockScroll(true);

    const panel = $(".sheet__panel", el);
    let closed = false;
    function close(result) {
      if (closed) return;
      closed = true;
      el.classList.remove("is-open");
      openSheets = Math.max(0, openSheets - 1);
      if (!openSheets) lockScroll(false);
      setTimeout(() => { el.remove(); if (o.onClose) o.onClose(result); }, 320);
    }

    requestAnimationFrame(() => el.classList.add("is-open"));
    $$("[data-close]", el).forEach(b => b.addEventListener("click", () => close(null)));
    document.addEventListener("keydown", function esc_(e) {
      if (e.key === "Escape" && el.isConnected) { close(null); document.removeEventListener("keydown", esc_); }
    });

    // Смахивание вниз (мобильный жест)
    const drag = () => {
      if (window.innerWidth >= 760) return;
      let startY = 0, dy = 0, dragging = false;
      const onDown = ev => {
        const handle = closestOf(ev.target, "[data-drag], .sheet__head");
        if (!handle) return;
        if (panel.scrollTop > 2) return;
        dragging = true; startY = ev.clientY; dy = 0;
        el.classList.add("is-drag");
        panel.setPointerCapture && panel.setPointerCapture(ev.pointerId);
      };
      const onMove = ev => {
        if (!dragging) return;
        dy = Math.max(0, ev.clientY - startY);
        panel.style.transform = `translateY(${dy}px)`;
        const bd = $(".sheet__bd", el);
        if (bd) bd.style.opacity = String(clamp(1 - dy / 320, 0, 1));
      };
      const onUp = () => {
        if (!dragging) return;
        dragging = false;
        el.classList.remove("is-drag");
        panel.style.transform = "";
        const bd = $(".sheet__bd", el);
        if (bd) bd.style.opacity = "";
        if (dy > 96) close(null);
      };
      panel.addEventListener("pointerdown", onDown);
      panel.addEventListener("pointermove", onMove);
      panel.addEventListener("pointerup", onUp);
      panel.addEventListener("pointercancel", onUp);
    };
    drag();

    // Фокус внутрь листа
    setTimeout(() => {
      const f = $("input, select, textarea, button.btn--primary, .sheet__close", panel);
      if (f && window.innerWidth >= 760) f.focus({ preventScroll: true });
    }, 340);

    if (o.onMount) o.onMount(panel, close);
    return { el, panel, close };
  }

  function alertBox(text, opts = {}) {
    return new Promise(res => {
      sheet({
        title: opts.title || "",
        body: `<p class="lead" style="font-size:var(--fs-t2);color:var(--text-2)">${esc(text)}</p>`,
        footer: `<button class="btn btn--primary btn--lg" data-ok type="button">${esc(opts.ok || "Понятно")}</button>`,
        onClose: () => res(true),
        onMount: (panel, close) => {
          $("[data-ok]", panel).addEventListener("click", () => close(true));
        }
      });
    });
  }

  function confirmBox(opts) {
    const o = typeof opts === "string" ? { text: opts } : (opts || {});
    return new Promise(res => {
      let done = false;
      const finish = v => { if (!done) { done = true; res(v); } };
      sheet({
        title: o.title || "Вы уверены?",
        body: `<p class="lead" style="font-size:var(--fs-t2);color:var(--text-2)">${esc(o.text || "")}</p>`,
        footer: `
          <button class="btn btn--lg" data-no type="button">${esc(o.cancel || "Отмена")}</button>
          <button class="btn btn--lg ${o.danger ? "btn--danger" : "btn--primary"}" data-yes type="button">${esc(o.ok || "Да")}</button>`,
        onClose: () => finish(false),
        onMount: (panel, close) => {
          $("[data-yes]", panel).addEventListener("click", () => { finish(true); close(true); });
          $("[data-no]", panel).addEventListener("click", () => { finish(false); close(false); });
        }
      });
    });
  }

  /* ---------- Каскадное появление ---------- */
  function stagger(container, selector = ":scope > *", step = 46, from = 0) {
    if (!container) return;
    let els;
    try { els = $$(selector, container); } catch (e) { els = $$("*", container); }
    els.forEach((el, i) => el.style.setProperty("--i", String(from + i * (step / 46))));
  }
  function revealAll(scope = document) {
    $$("[data-stagger]", scope).forEach(box => {
      const sel = box.dataset.stagger || ":scope > *";
      stagger(box, sel);
    });
  }

  /* ---------- Счётчик чисел ---------- */
  function countUp(el, to, opts = {}) {
    if (!el) return;
    const dur = opts.duration || 900;
    const from = opts.from || 0;
    const fmt = opts.format || (n => String(Math.round(n)));
    if (prefersReduced()) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const tick = now => {
      const p = clamp((now - t0) / dur, 0, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(to);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- Тема и движение ---------- */
  function resolvedDark() { return root.getAttribute("data-theme") !== "light"; }
  function applyTheme(pref) {
    const dark = pref === "dark" || (pref === "auto" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.setAttribute("data-theme", dark ? "dark" : "light");
    store.set("theme", pref);
    $$('meta[name="theme-color"]').forEach(m => {
      const want = m.getAttribute("media") || "";
      if (/dark/.test(want)) m.setAttribute("content", dark ? "#070A12" : "#F4F0E8");
      else if (/light/.test(want)) m.setAttribute("content", dark ? "#070A12" : "#F4F0E8");
    });
  }
  function themePref() { return store.get("theme", "dark"); }
  function setTheme(pref) { applyTheme(pref); }
  function cycleTheme() {
    const order = ["dark", "light", "auto"];
    const next = order[(order.indexOf(themePref()) + 1) % order.length];
    setTheme(next);
    const label = next === "dark" ? "Тёмная тема" : next === "light" ? "Светлая тема" : "Как в системе";
    toast({ title: label, sub: next === "auto" ? "Оформление следует настройкам устройства" : "", kind: "gold", icon: next === "light" ? "sun" : next === "dark" ? "moon" : "monitor" });
    return next;
  }
  function setMotion(on) {
    root.setAttribute("data-motion", on ? "on" : "off");
    store.set("motion", on ? "on" : "off");
  }
  function motionOn() { return store.get("motion", "on") !== "off"; }

  /* ---------- Параллакс атмосферы ---------- */
  function initParallax() {
    const layers = $$(".ambient__par[data-par]");
    if (!layers.length) return;
    let raf = 0, sy = 0, mx = 0, my = 0;
    const apply = () => {
      raf = 0;
      if (prefersReduced()) return;
      for (const l of layers) {
        const k = parseFloat(l.dataset.par) || 0;
        const y = -sy * k + my * k * 260;
        const x = mx * k * 260;
        l.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      }
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(apply); };
    window.addEventListener("scroll", () => { sy = window.scrollY || 0; schedule(); }, { passive: true });
    if (window.matchMedia && window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", e => {
        mx = (e.clientX / window.innerWidth - .5) * 2;
        my = (e.clientY / window.innerHeight - .5) * 2;
        schedule();
      }, { passive: true });
    }
    sy = window.scrollY || 0;
    schedule();
  }

  /* ---------- Состояние прокрутки для верхней панели ---------- */
  function initScrollState() {
    const bar = $(".topbar");
    if (!bar) return;
    let raf = 0;
    const upd = () => {
      raf = 0;
      bar.classList.toggle("is-scrolled", (window.scrollY || 0) > 6);
    };
    window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    upd();
  }

  function focusMode(on) {
    document.body.classList.toggle("is-focus", !!on);
  }

  /* ---------- Ползунок: заполнение дорожки ---------- */
  function bindRange(input) {
    if (!input) return;
    const upd = () => {
      const min = parseFloat(input.min) || 0, max = parseFloat(input.max) || 100;
      const v = parseFloat(input.value) || 0;
      input.style.setProperty("--fill", `${((v - min) / (max - min || 1)) * 100}%`);
    };
    input.addEventListener("input", upd);
    upd();
  }

  /* ---------- Прокрутка элемента в поле зрения (над клавиатурой) ---------- */
  function scrollIntoSoft(el) {
    if (!el) return;
    setTimeout(() => {
      try { el.scrollIntoView({ block: "center", behavior: prefersReduced() ? "auto" : "smooth" }); } catch (e) { try { el.scrollIntoView(); } catch (e2) { } }
    }, 60);
  }

  if (reducedQuery && reducedQuery.addEventListener) {
    reducedQuery.addEventListener("change", e => { reduced = e.matches; });
  }

  return {
    toast, sheet, alert: alertBox, confirm: confirmBox,
    haptic, stagger, revealAll, countUp,
    setTheme, themePref, cycleTheme, applyTheme, resolvedDark,
    setMotion, motionOn, prefersReduced,
    initParallax, initScrollState, focusMode, bindRange, scrollIntoSoft, lockScroll
  };
})();
