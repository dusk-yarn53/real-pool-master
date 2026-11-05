const CACHE='fuguang-pool-20261105-v1';
const CORE=['./','./index.html','./site.css','./game.js','./audio.js','./mobile.js','./assets/fuguang-arena.jpg','./assets/icons/app-icon-192.png','./assets/icons/app-icon-512.png','./play/','./play/index.html','./play/site.css','./play/game.js','./play/audio.js','./play/mobile.js','./play/assets/fuguang-arena.jpg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  event.respondWith(fetch(request).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}
    return response;
  }).catch(async()=>{
    const cache=await caches.open(CACHE);
    return await cache.match(request,{ignoreSearch:true})||(request.mode==='navigate'?await cache.match('./index.html'):Response.error());
  }));
});
