import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('D:/tech dental z/database/database.sqlite', { readOnly: true });
for (const t of ['services','medicines','doctors','locations','home_content','about_content','price_settings','pages','posts','doctor_settings','settings']) {
  try {
    const cols = db.prepare(`PRAGMA table_info("${t}")`).all().map(c => c.name);
    const faqCols = cols.filter(c => /faq/i.test(c));
    const n = db.prepare(`SELECT COUNT(*) c FROM "${t}"`).get().c;
    console.log(t, 'rows=' + n, 'faqCols=' + faqCols.join(','));
    for (const c of faqCols) {
      const row = db.prepare(`SELECT "${c}" v FROM "${t}" WHERE "${c}" IS NOT NULL AND "${c}" != '' LIMIT 1`).get();
      if (row) console.log('   ', c, String(row.v).replace(/\s+/g,' ').slice(0, 180));
    }
  } catch (e) { console.log(t, 'ERR', e.message); }
}
