self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  console.log(url);
  if (
    url.origin.includes("clerk.accounts.dev") ||
    url.origin.includes("clerk.com")
  ) {
    return;
  }
  event.respondWith(fetch(event.request));
});
