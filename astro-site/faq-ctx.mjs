import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('D:/tech dental z/database/database.sqlite', { readOnly: true });
console.log(db.prepare('PRAGMA table_info("locations")').all().map(c=>c.name).join(','));
for (const r of db.prepare('SELECT id,name,short_name,slug,review_url FROM locations').all()) console.log(JSON.stringify(r));
console.log('medicines rows', db.prepare('SELECT MIN(rowid) mn, MAX(rowid) mx, COUNT(*) c FROM medicines').get());
const m = db.prepare('SELECT rowid rid, name, faqs FROM medicines WHERE faqs IS NOT NULL LIMIT 2').all();
for (const r of m) console.log(r.rid, r.name, String(r.faqs).slice(0,200));
