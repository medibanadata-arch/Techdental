import fs from 'node:fs';

const NEW = 'http://127.0.0.1:4322';
const IN = 'C:/Users/Tech Dental Marketin/AppData/Local/Temp/opencode/old-crawl.json';
const { urls } = JSON.parse(fs.readFileSync(IN, 'utf8'));

const xml = await (await fetch(NEW + '/sitemap.xml')).text();
const sitemapSet = new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/+$/, '') || '/'));

const GENERIC = new Set(['/', '/blog', '/bn/blog', '/services', '/bn/services', '/medicines', '/doctors', '/team', '/about', '/contact', '/branches']);

const check = async (path) => {
  let url = NEW + path;
  const hops = [];
  for (let i = 0; i < 4; i++) {
    let res;
    try {
      res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(15000) });
    } catch (e) {
      return { path, status: -1, hops, final: '', note: 'fetch error' };
    }
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location') || '';
      hops.push({ status: res.status, to: loc });
      if (!loc) return { path, status: res.status, hops, final: '', note: 'no location' };
      url = loc.startsWith('http') ? loc : NEW + loc;
      continue;
    }
    return { path, status: res.status, hops, final: url.replace(NEW, '') || '/' };
  }
  return { path, status: -2, hops, final: '', note: 'too many redirects' };
};

const results = [];
const concurrency = 8;
let idx = 0;
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (idx < urls.length) {
    const i = idx++;
    results[i] = await check(urls[i]);
  }
}));

const inSitemap = results.filter((r) => sitemapSet.has(r.path));
const direct200 = results.filter((r) => r.status === 200 && r.hops.length === 0 && !sitemapSet.has(r.path));
const redirected = results.filter((r) => r.status === 200 && r.hops.length > 0);
const generic = redirected.filter((r) => GENERIC.has(r.final));
const specific = redirected.filter((r) => !GENERIC.has(r.final));
const missing = results.filter((r) => r.status === 404);
const broken = results.filter((r) => r.status !== 200 && r.status !== 404);

const counts = {
  'old crawled urls': results.length,
  'in new sitemap (same path)': inSitemap.length,
  'live 200 but not in sitemap': direct200.length,
  'redirect to a specific page': specific.length,
  'redirect to a generic hub': generic.length,
  '404 on new site': missing.length,
  'other/broken': broken.length,
};
console.log(counts);

const esc = (s) => String(s).replace(/\|/g, '\\|');
const lines = [];
lines.push('# Old site (techdentalcare.com) vs new site — URL audit');
lines.push('');
lines.push(`Crawled: ${new Date().toISOString()} — ${results.length} old URLs found by crawling the live old site (not only its sitemap).`);
lines.push('');
lines.push('| Metric | Count |');
lines.push('|---|---:|');
for (const [k, v] of Object.entries(counts)) lines.push(`| ${k} | ${v} |`);
lines.push('');

const table = (title, rows, noteFn) => {
  lines.push(`## ${title} (${rows.length})`, '');
  if (!rows.length) { lines.push('_None._', ''); return; }
  lines.push('| Old URL | New status | New URL | Note |');
  lines.push('|---|---:|---|---|');
  for (const r of rows) lines.push(`| ${esc(r.path)} | ${r.status} | ${esc(r.final || '')} | ${noteFn ? esc(noteFn(r)) : ''} |`);
  lines.push('');
};

table('Missing — 404 on new site', missing, () => 'content not migrated');
table('Redirected to a generic hub (content effectively lost)', generic, (r) => r.hops.map((h) => `${h.status} -> ${h.to}`).join(' ; '));
table('Redirected to a specific page', specific, (r) => r.final);
table('Live 200 but not in new sitemap', direct200, () => 'exists, not listed in sitemap');
table('Other / broken', broken, (r) => r.note || '');

fs.writeFileSync('D:/tech dental z/docs/old-site-url-audit.md', lines.join('\n'));
console.log('report: docs/old-site-url-audit.md');
console.log('\n404:', missing.map((r) => r.path).join('\n'));
console.log('\ngeneric:', generic.map((r) => r.path + ' -> ' + r.final).join('\n'));
