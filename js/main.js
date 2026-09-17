// Запуск приложения
"use strict";
(() => {
  const VERSION = "lf-2.2.0";

  /* ---------- Служебный воркер: офлайн-режим ---------- */
  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    if (!/^https?:$/.test(location.protocol)) return;

    // Новый worker должен приходить с сервера, а не из HTTP-кеша браузера.
    // После активации один раз перезагружаем вкладку, чтобы весь интерфейс
    // сразу использовал файлы той же версии.
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      location.reload();
    });

    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("sw.js", {
          updateViaCache: "none"
        });
        await registration.update();
      } catch (_) { /* офлайн недоступен — не критично */ }
    });
  }

  /* ---------- Установка на главный экран ---------- */
  let installPrompt = null;
  window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    installPrompt = e;
    window.__lfInstall = () => installPrompt && installPrompt.prompt();
    showInstallRow();
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    hideInstallRow();
    UI.toast({ title: "Приложение установлено", sub: "Теперь оно живёт на главном экране", kind: "ok", icon: "check" });
  });

  const showInstallRow = () => {
    const row = document.getElementById("installRow");
    if (row) {
      row.classList.remove("hidden");
      const btn = document.getElementById("installBtn");
      if (btn && !btn.dataset.bound) {
        btn.dataset.bound = "1";
        btn.addEventListener("click", async () => {
          if (!installPrompt) return;
          installPrompt.prompt();
          const res = await installPrompt.userChoice;
          if (res && res.outcome === "accepted") hideInstallRow();
        });
      }
    }
  };
  const hideInstallRow = () => {
    const row = document.getElementById("installRow");
    if (row) row.classList.add("hidden");
  };

  /* ---------- Сеть ---------- */
  let wasOffline = false;
  window.addEventListener("offline", () => {
    wasOffline = true;
    UI.toast({ title: "Нет соединения", sub: "Всё содержимое и прогресс доступны офлайн", kind: "info", icon: "globe", ms: 2600 });
  });
  window.addEventListener("online", () => {
    if (!wasOffline) return;
    wasOffline = false;
    UI.toast({ title: "Соединение восстановлено", kind: "ok", icon: "check", ms: 1800 });
  });

  /* ---------- Системные настройки движения ---------- */
  function applySystemMotion() {
    if (!window.matchMedia) return;
    if (store.get("motion", null) !== null) return; // пользователь уже выбрал
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (q.matches) UI.setMotion(false);
  }

  /* ---------- Глобальные горячие клавиши ---------- */
  function bindShortcuts() {
    document.addEventListener("keydown", e => {
      const mod = e.metaKey || e.ctrlKey;
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || "");
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (App.route !== "vocab") App.navigate("#/vocab");
        setTimeout(() => { const q = document.getElementById("vq"); if (q) q.focus(); }, 120);
        return;
      }
      if (typing || mod) return;
      if (e.key === "?") {
        e.preventDefault();
        UI.sheet({
          eyebrow: "Raccourcis",
          title: "Горячие клавиши",
          sub: "Работают на клавиатуре в любом разделе",
          body: `<div class="entries">
            ${[
      ["1 — 4", "Выбрать вариант ответа в упражнении"],
      ["A — D", "То же, буквами"],
      ["Enter", "Продолжить после проверки"],
      ["Пробел", "Перевернуть карточку в колоде"],
      ["← →", "Забыл / Хорошо, если карточка открыта"],
      ["↑", "Легко"],
      ["Esc", "Закрыть окно или выйти из сессии"],
      ["Ctrl / ⌘ + K", "Открыть поиск по словарю"]
    ].map(([k, v]) => `<div class="entry">
                <span class="entry__n"><kbd class="kbd">${esc(k)}</kbd></span>
                <span class="entry__body"><span class="entry__t">${esc(v)}</span></span>
              </div>`).join("")}
          </div>`,
          footer: `<button class="btn btn--primary btn--lg" type="button" data-close>${icon("check", "sm")}Понятно</button>`
        });
      }
    });
  }

  /* ---------- Критические ошибки ---------- */
  let errorShown = false;
  window.addEventListener("error", e => {
    if (errorShown) return;
    const msg = (e && e.message) || "";
    if (!msg || /ResizeObserver/.test(msg)) return;
    errorShown = true;
    console.error("[Le Français]", msg);
    UI.toast({ title: "Сбой в интерфейсе", sub: "Прогресс сохранён. Попробуйте обновить страницу.", kind: "bad", icon: "alert", ms: 6000 });
  });

  /* ---------- Старт ---------- */
  function boot() {
    applySystemMotion();
    bindShortcuts();
    App.start();
    registerSW();
    document.addEventListener("app:route", () => {
      if (installPrompt) showInstallRow();
    });
    // Мягкое приветствие при первом запуске
    if (!store.get("welcomed", false)) {
      store.set("welcomed", true);
      setTimeout(() => UI.toast({
        title: "Bienvenue !",
        sub: "Начните с цели дня — остальные разделы откроются по ходу",
        kind: "gold", icon: "sparkles", ms: 4200
      }), 1400);
    }
  }

  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot, { once: true });

  window.LF_VERSION = VERSION;
})();
