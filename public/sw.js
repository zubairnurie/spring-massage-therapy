// Minimal service worker for PWA installability.
//
// Why this exists: Android Chrome only offers "Install app" / "Add to home
// screen" when the site has a registered service worker with a fetch handler.
// We don't need offline support for the admin (it's an editing tool, not
// public content) so this file is intentionally trivial — it just exists to
// satisfy the install prompt criteria.
//
// If you ever want offline / background sync support, this is the file to
// extend.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Pass through; let the network handle every request.
});
