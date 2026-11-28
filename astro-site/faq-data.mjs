import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('D:/tech dental z/database/database.sqlite', { readOnly: true });
console.log('services cols:', db.prepare('PRAGMA table_info("services")').all().map(c=>c.name).join(','));
for (const r of db.prepare('SELECT id, slug, slug_bn, title, title_bn FROM services ORDER BY id').all()) console.log(JSON.stringify(r));
console.log('--- locations');
for (const r of db.prepare('SELECT id, name, slug, faqs, faqs_bn FROM locations').all()) console.log(r.id, r.name, r.slug, 'faqs:', String(r.faqs||'').slice(0,300), '| bn:', String(r.faqs_bn||'').slice(0,120));
