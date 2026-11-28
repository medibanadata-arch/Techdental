import fs from 'node:fs';

const OLD = 'https://techdentalcare.com';
const NEW = 'http://127.0.0.1:4322';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';
const OUT = 'C:/Users/Tech Dental Marketin/AppData/Local/Temp/opencode/old-crawl.json';

const SKIP_EXT = /\.(jpe?g|png|gif|svg|webp|avif|css|js|json|pdf|zip|rar|ico|woff2?|ttf|eot|mp4|mp3|webm|xml|txt|xsl)$/i;
const SKIP_PATH = /\/(wp-admin|wp-json|wp-content|wp-includes|wp-login|feed|comments|xmlrpc|cdn-cgi|go|track|search)\b/i;

const norm = (raw, base) => {
  let u;
  try { u = new URL(raw, base); } catch { return null; }
  if (!/^(www\.)?techdentalcare\.com$/i.test(u.hostname)) return null;
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
  let path = decodeURI(u.pathname).replace(/\/+/g, '/');
  if (path.length > 1) path = path.replace(/\/+$/, '');
  if (SKIP_EXT.test(path) || SKIP_PATH.test(path)) return null;
  return path;
};

const seen = new Map(); // path -> {depth, parents}
const queue = [['/', 0]];
seen.set('/', { depth: 0, parents: [] });
let fetched = 0;
const MAX = 1500;

const getHtml = async (url) => {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' }, signal: AbortSignal.timeout(20000) });
  const type = res.headers.get('content-type') || '';
  if (!res.ok || !type.includes('text/html')) return { status: res.status, html: '', final: res.url };
  return { status: res.status, html: await res.text(), final: res.url };
};

const workers = Array.from({ length: 6 }, async () => {
  while (queue.length && fetched < MAX) {
    const [path, depth] = queue.shift();
    if (depth > 5) continue;
    fetched++;
    let page;
    try { page = await getHtml(OLD + path); } catch { continue; }
    if (!page.html) continue;
    const links = [...page.html.matchAll(/href\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]);
    for (const raw of links) {
      const p = norm(raw, page.final || OLD + path);
      if (!p) continue;
      if (!seen.has(p)) {
        seen.set(p, { depth: depth + 1, parents: [path] });
        queue.push([p, depth + 1]);
      } else if (depth + 1 < seen.get(p).depth) {
        seen.get(p).depth = depth + 1;
      }
    }
  }
});
await Promise.all(workers);

console.log('crawled pages:', fetched, '| unique urls found:', seen.size);
const list = [...seen.keys()].sort();
fs.writeFileSync(OUT, JSON.stringify({ crawledAt: new Date().toISOString(), fetched, urls: list }, null, 1));
console.log('saved', OUT);
const byDepth = {};
for (const v of seen.values()) byDepth[v.depth] = (byDepth[v.depth] || 0) + 1;
console.log('by depth:', byDepth);
