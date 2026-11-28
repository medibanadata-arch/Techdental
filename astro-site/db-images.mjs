import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const db = new DatabaseSync('D:/tech dental z/database/database.sqlite', { readOnly: true });
const roots = ['D:/tech dental z/astro-site/dist/client', 'D:/tech dental z/astro-site/public'];
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r => r.name);
const missing = new Map();
const total = new Set();
for (const t of tables) {
  let cols;
  try { cols = db.prepare(`PRAGMA table_info("${t}")`).all(); } catch { continue; }
  const textCols = cols.filter(c => /TEXT|CHAR|CLOB|VARCHAR/i.test(c.type || '')).map(c => c.name);
  if (!textCols.length) continue;
  let rows;
  try { rows = db.prepare(`SELECT * FROM "${t}"`).all(); } catch { continue; }
  for (const row of rows) {
    for (const c of textCols) {
      const v = row[c];
      if (typeof v !== 'string' || !v.includes('/uploads/')) continue;
      for (const m of v.matchAll(/\/uploads\/[A-Za-z0-9._%\-\/]+\.(?:webp|jpg|jpeg|png|gif|svg|mp4|webm|pdf)/gi)) {
        let u = m[0];
        try { u = decodeURIComponent(u); } catch {}
        total.add(u);
        const exists = roots.some(r => fs.existsSync(path.join(r, u)));
        if (!exists) {
          if (!missing.has(u)) missing.set(u, new Set());
          missing.get(u).add(`${t}.${c}`);
        }
      }
    }
  }
}
console.log('unique upload refs in DB:', total.size, 'missing on disk:', missing.size);
for (const [u, where] of [...missing].slice(0, 80)) console.log('MISSING', u, '<-', [...where].slice(0, 3).join(', '));
