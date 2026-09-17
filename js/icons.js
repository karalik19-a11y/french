// Иконки — единый минималистичный набор (stroke, 24×24). Никаких эмодзи.
"use strict";
window.ICONS = (() => {

  const P = {
    // --- Разделы ---
    home: '<path d="m3.4 10.6 8.6-6.9 8.6 6.9"/><path d="M5.8 9.6V19a1.6 1.6 0 0 0 1.6 1.6h3.2v-5.4h2.8v5.4h3.2A1.6 1.6 0 0 0 18.2 19V9.6"/>',
    path: '<path d="M3.6 19.6h3.8v-4.2h4V11h4.2V6.6h3.8"/><path d="m17.6 4.4 2.4 2.2-2.4 2.2"/><circle cx="5.5" cy="19.6" r="0"/>',
    cards: '<rect x="7.4" y="3.6" width="12.9" height="16.8" rx="2.6"/><path d="M4.4 7.6A2.8 2.8 0 0 0 3.7 9.5v9a2.8 2.8 0 0 0 2.8 2.8h8.1"/>',
    layers: '<path d="m12 3.2 8.6 4.5-8.6 4.5-8.6-4.5z"/><path d="m4.2 12 7.8 4.1 7.8-4.1"/><path d="m4.2 16.3 7.8 4.1 7.8-4.1"/>',
    book: '<path d="M6.2 3.4h13v17.2h-13A2.8 2.8 0 0 1 3.4 17.8V6.2a2.8 2.8 0 0 1 2.8-2.8Z"/><path d="M3.4 17.4h15.8"/>',
    bookOpen: '<path d="M12 6.6S9.9 4.4 6.4 4.4H3.2v13.2h3.2c3.5 0 5.6 2.2 5.6 2.2s2.1-2.2 5.6-2.2h3.2V4.4h-3.2c-3.5 0-5.6 2.2-5.6 2.2Z"/><path d="M12 6.6v13.2"/>',
    braces: '<path d="M9 3.6c-2.3 0-2.3 3-2.3 4.6 0 1.6-.7 2.8-2.3 2.8v2c1.6 0 2.3 1.2 2.3 2.8 0 1.6 0 4.6 2.3 4.6"/><path d="M15 3.6c2.3 0 2.3 3 2.3 4.6 0 1.6.7 2.8 2.3 2.8v2c-1.6 0-2.3 1.2-2.3 2.8 0 1.6 0 4.6-2.3 4.6"/>',
    page: '<rect x="4.4" y="3.2" width="15.2" height="17.6" rx="2.6"/><path d="M8.2 8.2h7.6M8.2 12h7.6M8.2 15.8h4.6"/>',
    chat: '<path d="M20.6 11.8c0 3.9-3.9 7.1-8.6 7.1-1 0-2-.14-2.9-.4L4 20.4l1.5-3.7a6.7 6.7 0 0 1-2.1-4.9c0-3.9 3.9-7.1 8.6-7.1s8.6 3.2 8.6 7.1Z"/>',
    quote: '<path d="M9.6 6.4C7.1 7.7 5.6 10 5.6 12.7v3.6a1.7 1.7 0 0 0 1.7 1.7h2.1a1.7 1.7 0 0 0 1.7-1.7v-2.9a1.7 1.7 0 0 0-1.7-1.7H7.9c0-1.6.7-2.9 2.3-3.8Z"/><path d="M18.4 6.4c-2.5 1.3-4 3.6-4 6.3v3.6a1.7 1.7 0 0 0 1.7 1.7h2.1a1.7 1.7 0 0 0 1.7-1.7v-2.9a1.7 1.7 0 0 0-1.7-1.7h-1.5c0-1.6.7-2.9 2.3-3.8Z"/>',
    wave: '<path d="M3 12h1.8M7.6 8.4v7.2M12 4.8v14.4M16.4 9.2v5.6M21 12h-1.8"/>',
    compass: '<circle cx="12" cy="12" r="8.8"/><path d="m15.4 8.6-1.9 4.5-4.5 1.9 1.9-4.5z"/>',
    chart: '<path d="M4 3.6V20h16.4"/><path d="M8 16.4v-4.2M12.4 16.4V7.2M16.8 16.4v-6.4"/>',
    user: '<circle cx="12" cy="8.4" r="3.9"/><path d="M4.6 20.2a7.6 7.6 0 0 1 14.8 0"/>',
    library: '<path d="M3.2 9.4h17.6L12 3.4z"/><path d="M5.4 9.4V18M9.8 9.4V18M14.2 9.4V18M18.6 9.4V18"/><path d="M3.2 20.6h17.6"/>',

    // --- Медиа ---
    volume: '<path d="M4 9.4h3.3L12 5.4v13.2l-4.7-4H4z"/><path d="M15.6 9.4a3.7 3.7 0 0 1 0 5.2"/><path d="M18.1 6.9a7.2 7.2 0 0 1 0 10.2"/>',
    volumeOff: '<path d="M4 9.4h3.3L12 5.4v13.2l-4.7-4H4z"/><path d="m16 10 4 4M20 10l-4 4"/>',
    play: '<path d="M8.2 5.4 18.6 12 8.2 18.6z"/>',
    pause: '<path d="M9.4 5.6v12.8M14.6 5.6v12.8"/>',
    stop: '<rect x="6.6" y="6.6" width="10.8" height="10.8" rx="2.2"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.4 11.6a6.6 6.6 0 0 0 13.2 0M12 18.2v2.6"/>',
    headphones: '<path d="M4 14.6v-2.4a8 8 0 0 1 16 0v2.4"/><rect x="2.8" y="13.6" width="4.6" height="6.8" rx="2.1"/><rect x="16.6" y="13.6" width="4.6" height="6.8" rx="2.1"/>',

    // --- Действия ---
    check: '<path d="m5.2 12.8 4.4 4.2L19 6.6"/>',
    x: '<path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6"/>',
    chevronLeft: '<path d="m14.6 5.4-6.6 6.6 6.6 6.6"/>',
    chevronRight: '<path d="m9.4 5.4 6.6 6.6-6.6 6.6"/>',
    chevronDown: '<path d="m5.4 9.4 6.6 6.6 6.6-6.6"/>',
    chevronUp: '<path d="m5.4 14.6 6.6-6.6 6.6 6.6"/>',
    arrowRight: '<path d="M4.4 12h15.2M13.6 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19.6 12H4.4M10.4 6l-6 6 6 6"/>',
    arrowUpRight: '<path d="M7 17 17 7M8.6 7H17v8.4"/>',
    plus: '<path d="M12 5.4v13.2M5.4 12h13.2"/>',
    minus: '<path d="M5.4 12h13.2"/>',
    search: '<circle cx="11" cy="11" r="6.6"/><path d="m15.9 15.9 4.5 4.5"/>',
    lock: '<rect x="4.6" y="10.4" width="14.8" height="10.2" rx="2.6"/><path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6"/>',
    unlock: '<rect x="4.6" y="10.4" width="14.8" height="10.2" rx="2.6"/><path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.3-1.3"/>',
    heart: '<path d="M12 20.2s-7.8-4.6-7.8-9.8a4.2 4.2 0 0 1 7.8-2.5 4.2 4.2 0 0 1 7.8 2.5c0 5.2-7.8 9.8-7.8 9.8Z"/>',
    star: '<path d="m12 3.8 2.5 5.1 5.6.8-4.1 4 1 5.6-5-2.7-5 2.7 1-5.6-4.1-4 5.6-.8z"/>',
    bookmark: '<path d="M6.6 3.6h10.8v17.2L12 16.6l-5.4 4.2z"/>',
    settings: '<path d="M3.6 7.6h9.2M17.6 7.6h2.8M3.6 16.4h3.2M11.2 16.4h9.2"/><circle cx="15.2" cy="7.6" r="2.4"/><circle cx="8.8" cy="16.4" r="2.4"/>',
    download: '<path d="M12 3.8v10.6M8 10.6l4 4 4-4M4.6 19.6h14.8"/>',
    upload: '<path d="M12 15.4V4.2M8 8.2l4-4 4 4M4.6 19.6h14.8"/>',
    trash: '<path d="M4.6 6.8h14.8M9.4 6.8V5.2a1.6 1.6 0 0 1 1.6-1.6h2a1.6 1.6 0 0 1 1.6 1.6v1.6"/><path d="m6.6 6.8.9 12.4a1.9 1.9 0 0 0 1.9 1.7h5.2a1.9 1.9 0 0 0 1.9-1.7l.9-12.4"/>',
    refresh: '<path d="M20.2 12a8.2 8.2 0 1 1-2.7-6.1"/><path d="M20.4 4.2v5.6h-5.6"/>',
    shuffle: '<path d="M17 4.2 20.6 8 17 11.8M17 12.2 20.6 16 17 19.8"/><path d="M3.4 8h3.9c2.1 0 3.1 1.5 4.3 3.3s2.3 4.7 5 4.7h4"/><path d="M3.4 16h3.9c1.7 0 2.7-.9 3.6-2.1"/>',
    external: '<path d="M13.8 4.4h5.8v5.8"/><path d="M19.2 4.8 11 13"/><path d="M18 14.2v4.4a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 18.6V7.8a1.6 1.6 0 0 1 1.6-1.6H10"/>',
    eye: '<path d="M2.6 12S6.2 5.8 12 5.8 21.4 12 21.4 12 17.8 18.2 12 18.2 2.6 12 2.6 12Z"/><circle cx="12" cy="12" r="3.1"/>',
    eyeOff: '<path d="M9.6 6.2A9.6 9.6 0 0 1 12 5.8c5.8 0 9.4 6.2 9.4 6.2a17 17 0 0 1-3.2 4M6.2 8A16.6 16.6 0 0 0 2.6 12S6.2 18.2 12 18.2a9.4 9.4 0 0 0 3.6-.7"/><path d="m4 4 16 16"/><path d="M10 10.2a2.9 2.9 0 0 0 4 4"/>',
    filter: '<path d="M3.6 5.4h16.8l-6.6 7.8v6l-3.6-2v-4z"/>',
    grid: '<rect x="3.6" y="3.6" width="7.2" height="7.2" rx="2.1"/><rect x="13.2" y="3.6" width="7.2" height="7.2" rx="2.1"/><rect x="3.6" y="13.2" width="7.2" height="7.2" rx="2.1"/><rect x="13.2" y="13.2" width="7.2" height="7.2" rx="2.1"/>',
    list: '<path d="M8.6 6.4h11.8M8.6 12h11.8M8.6 17.6h11.8M3.8 6.4h.2M3.8 12h.2M3.8 17.6h.2"/>',
    pen: '<path d="m14.6 5.2 4.2 4.2L8.4 19.8H4.2v-4.2z"/><path d="m12.6 7.2 4.2 4.2"/>',
    dice: '<rect x="3.8" y="3.8" width="16.4" height="16.4" rx="4.2"/><circle cx="8.8" cy="8.8" r="1.15"/><circle cx="15.2" cy="15.2" r="1.15"/><circle cx="15.2" cy="8.8" r="1.15"/><circle cx="8.8" cy="15.2" r="1.15"/>',
    bolt: '<path d="M13.6 2.8 5.8 13.6h4.7L9.9 21.2l7.9-10.8h-4.8z"/>',

    // --- Состояния и смыслы ---
    flame: '<path d="M12 21.2c3.7 0 6.3-2.6 6.3-6 0-4.7-4.5-6.2-4.5-10.5 0-1-.2-1.8-.5-2.5-2.5 1.4-4.1 3.7-4.1 6.2 0 1.3-.6 2-1.5 2-.8 0-1.4-.5-1.7-1.2a6.6 6.6 0 0 0-.3 2c0 3.4 2.6 6 6.3 6Z"/>',
    trophy: '<path d="M7.4 3.8h9.2v5a4.6 4.6 0 0 1-9.2 0z"/><path d="M7.4 5.4H5a2.6 2.6 0 0 0 2.6 4.6M16.6 5.4H19a2.6 2.6 0 0 1-2.6 4.6"/><path d="M12 13.4v3.4M8.6 20.4h6.8l-.9-3.6H9.5z"/>',
    medal: '<circle cx="12" cy="15" r="4.8"/><path d="M9.2 10.4 6.6 3.4h4L12 7.2M14.8 10.4l2.6-7h-4L12 7.2"/>',
    crown: '<path d="m3.8 17.6 1.6-9.8 4.1 3.5L12 5l2.5 6.3 4.1-3.5 1.6 9.8z"/><path d="M4.4 20.4h15.2"/>',
    sparkles: '<path d="m11.4 3.4 1.8 4.9 4.9 1.8-4.9 1.8-1.8 4.9-1.8-4.9-4.9-1.8 4.9-1.8z"/><path d="m18.4 15.2.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z"/>',
    calendar: '<rect x="3.4" y="5" width="17.2" height="15.6" rx="2.6"/><path d="M3.4 10h17.2M8.4 3.4v3.2M15.6 3.4v3.2"/>',
    clock: '<circle cx="12" cy="12" r="8.7"/><path d="M12 7v5.2l3.4 2"/>',
    target: '<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.1"/>',
    info: '<circle cx="12" cy="12" r="8.8"/><path d="M12 11.2v5.4M12 7.7v.2"/>',
    alert: '<path d="M12 4.2 21.2 19.8H2.8z"/><path d="M12 10v4.2M12 17v.2"/>',
    globe: '<circle cx="12" cy="12" r="8.7"/><path d="M3.5 12h17"/><path d="M12 3.3c2.3 2.4 3.5 5.5 3.5 8.7s-1.2 6.3-3.5 8.7c-2.3-2.4-3.5-5.5-3.5-8.7S9.7 5.7 12 3.3Z"/>',
    sun: '<circle cx="12" cy="12" r="4.1"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4 17 7M7 17l-1.6 1.6"/>',
    moon: '<path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8Z"/>',
    monitor: '<rect x="3" y="4.4" width="18" height="12.6" rx="2.4"/><path d="M8.4 20.6h7.2M12 17v3.6"/>',
    history: '<path d="M3.6 12a8.4 8.4 0 1 0 2.7-6.2"/><path d="M3.4 4.4V10h5.6"/><path d="M12 7.6V12l3.2 1.9"/>',
    trendUp: '<path d="m3.8 18.6 5.4-6 3.6 3.4 7.4-8.6"/><path d="M20.2 12.6V7.4H15"/>',
    scale: '<path d="M12 3.6v16.8M6.4 20.4h11.2"/><path d="M4 9.2h8M12 9.2h8"/><path d="m4 9.2-2.2 4.6a2.6 2.6 0 0 0 4.4 0zM20 9.2l-2.2 4.6a2.6 2.6 0 0 0 4.4 0z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    dot: '<circle cx="12" cy="12" r="3.4"/>'
  };

  /**
   * SVG-иконка.
   * @param {string} name
   * @param {string|object} [opt] — класс ("sm","lg","xl") или {cls, size}
   */
  function icon(name, opt) {
    const body = P[name] || P.dot;
    let cls = "ico";
    if (typeof opt === "string" && opt) cls += " ico--" + opt;
    else if (opt && opt.size) cls += " ico--" + opt.size;
    if (opt && opt.cls) cls += " " + opt.cls;
    return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
  }

  // Градиенты для колец прогресса (один раз на документ)
  function defs() {
    return `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#5C8BF5"/>
          <stop offset="58%" stop-color="#8FB0FF"/>
          <stop offset="100%" stop-color="#B9A9F2"/>
        </linearGradient>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#E4CFA8"/>
          <stop offset="52%" stop-color="#D2B078"/>
          <stop offset="100%" stop-color="#A9874E"/>
        </linearGradient>
      </defs>
    </svg>`;
  }

  // Декор: аркада парижского фасада
  function arcade(cls = "arcade") {
    return `<div class="${cls}" aria-hidden="true"><svg viewBox="0 0 340 190" fill="none" stroke="currentColor" stroke-width="1.1">
      <path d="M0 189V64M340 189V64"/>
      <path d="M14 189V96a26 26 0 0 1 52 0v93M94 189V96a26 26 0 0 1 52 0v93M174 189V96a26 26 0 0 1 52 0v93M254 189V96a26 26 0 0 1 52 0v93"/>
      <path d="M0 64h340M0 52h340M8 44h324"/>
      <path d="M40 96v93M120 96v93M200 96v93M280 96v93"/>
      <path d="M14 138h52M94 138h52M174 138h52M254 138h52"/>
      <path d="M0 24h340M24 24V8M92 24V8M160 24V8M228 24V8M296 24V8"/>
    </svg></div>`;
  }

  // Декор: тонкая виньетка-орнамент для карточек
  function ornament() {
    return `<svg class="fc__ornament" viewBox="0 0 320 120" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
      <path d="M0 118V70a40 40 0 0 1 80 0v48M80 118V70a40 40 0 0 1 80 0v48M160 118V70a40 40 0 0 1 80 0v48M240 118V70a40 40 0 0 1 80 0v48"/>
      <path d="M0 44h320M0 32h320"/>
    </svg>`;
  }

  return { icon, defs, arcade, ornament, has: n => !!P[n] };
})();

window.icon = window.ICONS.icon;
