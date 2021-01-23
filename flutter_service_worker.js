'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "206ed2f8623a0c370470c1a04ed3626f",
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
"assets/assets/splash_background.png": "026ebaf896ab1c21b8b920d25f9ca365",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "a174cf5fec7f12f16f6d096c8a7ab14a",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "1038c5e2ef67d1bd710d21ccc5ef4237",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "022bb6aeb6870fe876bcdf98a489aa42",
"/": "022bb6aeb6870fe876bcdf98a489aa42",
"main.dart.js": "30c758f798181e722cefd96510335e28",
"manifest.json": "9a3c437de8d17b66b056cb4f6f565d35",
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
