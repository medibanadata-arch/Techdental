import fs from 'node:fs';

const UA = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36' };
const BASE = 'http://127.0.0.1:4322';

const norm = (u) => {
  const p = new URL(u).pathname.replace(/\/+$/, '') || '/';
  return p;
};

// 1. Old sitemap
const oldUrls = [];
for (const name of ['post-sitemap.xml', 'page-sitemap.xml', 'product-sitemap.xml']) {
  const xml = await (await fetch(`https://techdentalcare.com/${name}`, { headers: UA })).text();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) oldUrls.push({ sitemap: name, url: m[1], path: norm(m[1]) });
}

// 2. New sitemap (local)
const newXml = await (await fetch(`${BASE}/sitemap.xml`)).text();
const newUrls = [...newXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const newSet = new Set(newUrls.map(norm));

// 3. Check every old URL on the new site
const results = [];
for (const item of oldUrls) {
  const res = await fetch(BASE + item.path, { redirect: 'manual' });
  const loc = res.headers.get('location');
  results.push({ ...item, status: res.status, location: loc || '' });
}

const inSitemap = results.filter((r) => newSet.has(r.path));
const notInSitemap = results.filter((r) => !newSet.has(r.path));
const redirected = notInSitemap.filter((r) => r.status === 301 || r.status === 302 || r.status === 308);
const alive = notInSitemap.filter((r) => r.status === 200);
const missing = notInSitemap.filter((r) => r.status === 404);
const other = notInSitemap.filter((r) => ![200, 301, 302, 308, 404].includes(r.status));

console.log('OLD total', results.length);
console.log('NEW sitemap total', newUrls.length);
console.log('matched (old path in new sitemap)', inSitemap.length);
console.log('not in sitemap', notInSitemap.length, '=> 200 alive', alive.length, '| redirect', redirected.length, '| 404', missing.length, '| other', other.length);

const lines = [];
lines.push('# Old vs New Sitemap Report');
lines.push('');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push('');
lines.push('| Metric | Count |');
lines.push('|---|---:|');
lines.push(`| Old sitemap URLs | ${results.length} |`);
lines.push(`| New sitemap URLs | ${newUrls.length} |`);
lines.push(`| Exact match (same path in both) | ${inSitemap.length} |`);
lines.push(`| Old URL not in new sitemap but live 200 | ${alive.length} |`);
lines.push(`| Old URL 301/302 redirects | ${redirected.length} |`);
lines.push(`| Old URL 404 | ${missing.length} |`);
lines.push(`| Other status | ${other.length} |`);

const table = (title, rows, extra = '') => {
  lines.push('', `## ${title} (${rows.length})`, '');
  if (!rows.length) { lines.push('_None._'); return; }
  lines.push('| Old URL | Status | Notes |');
  lines.push('|---|---:|---|');
  for (const r of rows) lines.push(`| ${r.path} | ${r.status} | ${extra ? extra(r) : ''} |`);
};

table('In new sitemap', inSitemap);
table('Not in new sitemap — live 200 (sitemap gap)', alive);
table('Redirected', redirected, (r) => r.location);
table('404 — missing on new site', missing);
table('Other status', other);

fs.writeFileSync('D:/tech dental z/docs/sitemap-comparison.md', lines.join('\n'));
console.log('report written to docs/sitemap-comparison.md');

// Console summary of gaps and 404s (paths only)
console.log('\n--- live 200 but not in sitemap ---');
alive.forEach((r) => console.log(r.path));
console.log('\n--- 404 ---');
missing.forEach((r) => console.log(r.path));
console.log('\n--- redirects (sample 30) ---');
redirected.slice(0, 30).forEach((r) => console.log(r.path, '->', r.location));
