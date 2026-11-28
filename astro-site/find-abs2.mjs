import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('D:/tech dental z/database/database.sqlite', { readOnly: true });
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
const found = [];
for (const t of tables) {
  const cols = db.prepare(`PRAGMA table_info("${t}")`).all().filter(c => /TEXT|CHAR|CLOB|VARCHAR/i.test(c.type || '')).map(c => c.name);
  if (!cols.length) continue;
  const rows = db.prepare(`SELECT rowid AS __rid, * FROM "${t}"`).all();
  for (const row of rows) {
    for (const c of cols) {
      const v = row[c];
      if (typeof v !== 'string' || !v.includes('techdentalcare.com')) continue;
      const plain = v.split('techdentalcare.com').length - 1;
      const esc = v.split('techdentalcare\\.com').length - 1;
      found.push({ t, c, rid: row.__rid, plain, esc, snippet: v.replace(/\s+/g, ' ').slice(0, 100) });
    }
  }
}
console.log('rows', found.length);
const agg = new Map();
for (const f of found) {
  const k = `${f.t}.${f.c}`;
  agg.set(k, (agg.get(k) || 0) + 1);
}
console.log([...agg].map(([k, n]) => `${k}: ${n} rows`).join('\n'));
for (const f of found.slice(0, 25)) console.log(f.t, f.c, f.rid, 'plain=' + f.plain, 'esc=' + f.esc, '|', f.snippet);
