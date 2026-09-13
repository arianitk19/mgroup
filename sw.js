/* Morina Group SW — cache i shellit, rrjet-i-pari; të dhënat (Supabase) kurrë nga cache. */
const C='mg-cloud-v1';
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/favicon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.hostname.endsWith('supabase.co')) return; // të dhënat gjithmonë nga rrjeti
  if(e.request.method!=='GET') return;
  if(e.request.mode==='navigate'){ e.respondWith(fetch(e.request).catch(()=>caches.match('index.html'))); return; }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res&&res.status===200&&u.origin===location.origin){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp))}return res}).catch(()=>r)));
});
