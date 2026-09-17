// Service Worker: сеть прежде всего, кеш — запасной вариант (офлайн)
"use strict";
const VERSION = "lf-2.1.0";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const SHELL = [
  "./",
  "./index.html",
  "data/course.js",
  "data/dialogues.js",
  "data/grammar_a1.js",
  "data/grammar_a2b1.js",
  "data/grammar_b2c1.js",
  "data/idioms.js",
  "data/methodology.js",
  "data/phonetics.js",
  "data/reading.js",
  "data/verbs.js",
  "data/vocab_a1.js",
  "data/vocab_a2.js",
  "data/vocab_b1.js",
  "data/vocab_b2.js",
  "css/style.css",
  "css/components.css",
  "css/screens.css",
  "css/motion.css",
  "css/features.css",
  "icons/icon.svg",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "images/cafe-reader.png",
  "images/snail-plan.png",
  "manifest.webmanifest",
  "js/icons.js",
  "js/utils.js",
  "js/speech.js",
  "js/srs.js",
  "js/activity.js",
  "js/study_plan.js",
  "js/ui.js",
  "js/core.js",
  "js/exercises.js",
  "js/screen_home.js",
  "js/screen_learn.js",
  "js/screen_library.js",
  "js/screen_practice.js",
  "js/screen_vocab.js",
  "js/screen_you.js",
  "js/screen_plan.js",
  "js/main.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then(cache => Promise.allSettled(SHELL.map(url => cache.add(new Request(url, { cache: "reload" })))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== SHELL_CACHE && k !== RUNTIME_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    // Шрифты и прочее со сторонних доменов: кеш, затем сеть
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(cache =>
        cache.match(req).then(hit => hit || fetch(req).then(res => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        }).catch(() => hit))
      )
    );
    return;
  }

  event.respondWith(
    fetch(req).then(res => {
      if (res && (res.ok || res.type === "opaque")) {
        const copy = res.clone();
        caches.open(RUNTIME_CACHE).then(cache => cache.put(req, copy));
      }
      return res;
    }).catch(() =>
      caches.match(req).then(hit => {
        if (hit) return hit;
        if (req.mode === "navigate") return caches.match("./index.html");
        return new Response("", { status: 504, statusText: "Offline" });
      })
    )
  );
});
