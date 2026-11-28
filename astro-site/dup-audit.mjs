import fs from 'node:fs';
const BASE = 'http://127.0.0.1:4322';
const map = JSON.parse(fs.readFileSync('D:/tech dental z/astro-site/src/data/legacy-entity-map.json', 'utf8'));

const candidates = new Set(Object.keys(map).map((k) => {
  const p = decodeURI(k);
  return p.length > 1 ? p.replace(/\/+$/, '') : p;
}));

// route-level aliases that are known to render
for (const b of ['mirpur', 'uttara', 'badda', 'jatrabari']) candidates.add('/' + b + '-branch');
for (let i = 1; i <= 4; i++) candidates.add('/branch/' + i);
for (let i = 1; i <= 6; i++) candidates.add('/team/' + i);

const list = [...candidates];
const results = [];
let i = 0;
const norm = (u) => { try { return new URL(u).pathname.replace(/\/+$/, '') || '/'; } catch { return ''; } };

await Promise.all(Array.from({ length: 8 }, async () => {
  while (i < list.length) {
    const p = list[i++];
    let res;
    try { res = await fetch(BASE + p, { redirect: 'manual', signal: AbortSignal.timeout(20000) }); }
    catch { results.push({ path: p, status: -1 }); continue; }
    let canonical = '';
    if (res.status === 200) {
      const html = await res.text();
      canonical = norm((html.match(/rel="canonical"[^>]+href="([^"]+)"/i) || [])[1] || '');
    }
    results.push({ path: p, status: res.status, canonical });
  }
}));

const byCanon = new Map();
for (const r of results) {
  if (r.status !== 200 || !r.canonical) continue;
  if (!byCanon.has(r.canonical)) byCanon.set(r.canonical, []);
  byCanon.get(r.canonical).push(r.path);
}
const dupes = [...byCanon.entries()].filter(([, v]) => new Set(v).size > 1);
const statusCounts = results.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});

console.log('candidates tested:', results.length);
console.log('status:', statusCounts);
console.log('pages with 200:', byCanon.size);
console.log('pages reachable by 2+ URLs:', dupes.length);
console.log('total extra URLs:', dupes.reduce((s, [, v]) => s + new Set(v).size - 1, 0));

const dist = {};
for (const [, v] of dupes) { const n = new Set(v).size; dist[n] = (dist[n] || 0) + 1; }
console.log('distribution:', dist);

fs.writeFileSync('C:/Users/Tech Dental Marketin/AppData/Local/Temp/opencode/dupe-urls.json', JSON.stringify({ statusCounts, dupes: dupes.map(([c, v]) => ({ canonical: c, urls: [...new Set(v)] })) }, null, 1));
console.log('\nfirst 25 duplicate groups:');
for (const [c, v] of dupes.slice(0, 25)) console.log(c, '<=', [...new Set(v)].join(' | '));
