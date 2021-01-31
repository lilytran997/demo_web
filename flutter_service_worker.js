'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "878ad0a24a596821f17aa9c21dc41c5e",
"assets/assets/ic-close.png": "8fe6ce1e7dc099dc834fe41b9ceb2826",
"assets/assets/ic-main-checklist.png": "7837fd47f3ceeb9492cb166e8bd9de0b",
"assets/assets/ic-main-customers-disable.png": "37b83b990356f119c889e6827a5f60c3",
"assets/assets/ic-main-delivery.png": "11200a22603ff8ff322c910884a262d9",
"assets/assets/ic-main-deployment.png": "041fac731a9444449b64d528ced6ca22",
"assets/assets/ic-main-map.png": "5a2be4b28a2a82e8b0c2f8041bd46879",
"assets/assets/ic-main-potential-cus.png": "63916881870bf3456d57c06046046ec1",
"assets/assets/ic-main-report.png": "63784223be32eaf1ede7b97e4c2cbae8",
"assets/assets/ic-main-sellmore.png": "e4d222f7fa6a6ecc5ec4f2e481d0cef3",
"assets/assets/ic-main-supplies-disable.png": "b281a84319a329fbefbe4f9507d5845b",
"assets/assets/ic-progress-completed.png": "50766392623a2263232b291ed9f69de8",
"assets/assets/ic-slip-returned.png": "ccc19fae43981e157380b757fac5561e",
"assets/assets/ic-tabbar-cart.png": "3db0a5a1c144b5b484c5745c36edb01c",
"assets/assets/ic-tabbar-home.png": "45a99c0c91de5b9974325db09fa4907b",
"assets/assets/ic-tabbar-notification.png": "4e8daa6554c206e55f5f80c48b92b89e",
"assets/assets/ic-tabbar-queue-in.png": "ddb20e20c06ffbb6d9f543aeb25f4288",
"assets/assets/ic-tabbar-user.png": "41984c9e82e067479af5f1a0979fcd34",
"assets/assets/ico-liquidation.png": "aa0f003ec76003efbca5cde7e42fc28f",
"assets/assets/icon-app-staging.png": "1038c5e2ef67d1bd710d21ccc5ef4237",
"assets/assets/img-bg-appbar.png": "69f85bcf2512c2999ccc9bd1a3f66704",
"assets/assets/login_background.png": "d5ef046942b111777ee1047fa62b32f3",
"assets/assets/logo-mobisale.png": "2b6d68bc3a7a1c70fcff614d9d358aae",
"assets/assets/selfie-ellipse.png": "6f404a528100f06542dbfbbf4f07e50c",
"assets/assets/splash_background.png": "026ebaf896ab1c21b8b920d25f9ca365",
"assets/FontManifest.json": "de3a5ec6340c657102a308dc6ca2894e",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "8bc2e464eefc89c94807cdff634d26d7",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/flutter_markdown/assets/logo.png": "67642a0b80f3d50277c44cde8f450e50",
"assets/packages/open_iconic_flutter/assets/open-iconic.woff": "3cf97837524dd7445e9d1462e3c4afe2",
"favicon.png": "1038c5e2ef67d1bd710d21ccc5ef4237",
"icons/Icon-192.png": "efb19cf9a28c0f07e419e03b5f58e4ae",
"icons/Icon-512.png": "a0e78bed8839a0306e1df0bd78294f1f",
"index.html": "ccbe9e60920f3c9ae8ccd54cc7b07269",
"/": "ccbe9e60920f3c9ae8ccd54cc7b07269",
"main.dart.js": "f97c4406c873bedc932ff8e54ff5ad67",
"manifest.json": "2ab7973d387283fcc5cff69e178d32e0",
"version.json": "8972b18bec7fc8ff91e74c919e6dc4a8"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
