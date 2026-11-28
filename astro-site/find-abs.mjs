import { DatabaseSync } from 'node:sqlite';

const file = 'D:/tech dental z/database/database.sqlite';
const db = new DatabaseSync(file);
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
const patterns = [
  /https?:\/\/(?:www\.)?techdentalcare\.com\/uploads\//gi,
  /https?:\/\/(?:www\.)?techdentalbd\.com\/uploads\//gi,
];
const found = new Map();
for (const t of tables) {
  const cols = db.prepare(`PRAGMA table_info("${t}")`).all().filter(c => /TEXT|CHAR|CLOB|VARCHAR/i.test(c.type || '')).map(c => c.name);
  if (!cols.length) continue;
  const rows = db.prepare(`SELECT rowid AS __rid, * FROM "${t}"`).all();
  for (const row of rows) {
    for (const c of cols) {
      const v = row[c];
      if (typeof v !== 'string' || !v.includes('/uploads/')) continue;
      for (const p of patterns) {
        const m = v.match(p);
        if (m) {
          const key = `${t}.${c}`;
          if (!found.has(key)) found.set(key, { count: 0, sample: v.slice(0, 120) });
          found.get(key).count += m.length;
        }
      }
    }
  }
}
console.log('columns with absolute upload URLs:', found.size);
for (const [k, v] of found) console.log(k, v.count, '|', v.sample.replace(/\s+/g, ' ').slice(0, 90));
