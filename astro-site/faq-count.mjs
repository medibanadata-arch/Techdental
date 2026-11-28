import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('D:/tech dental z/database/database.sqlite', { readOnly: true });
const targets = [
  ['services','faqs'],['services','faqs_bn'],['medicines','faqs'],['doctors','faqs'],['doctors','faqs_bn'],
  ['locations','faqs'],['locations','faqs_bn'],['home_content','faqs'],['home_content','faqs_bn'],
  ['price_settings','faqs'],['price_settings','faqs_bn'],['doctor_settings','faqs'],['doctor_settings','faqs_bn'],['pages','faqs'],['posts','faqs']
];
for (const [t,c] of targets) {
  const rows = db.prepare(`SELECT rowid AS rid, "${c}" v FROM "${t}" WHERE "${c}" IS NOT NULL AND "${c}" != ''`).all();
  let n=0, withLink=0, internal=0, external=0;
  for (const r of rows) {
    let arr; try { arr = JSON.parse(r.v); } catch { continue; }
    if (!Array.isArray(arr)) continue;
    for (const f of arr) {
      if (!f || !f.a) continue;
      n++;
      const a = String(f.a);
      if (/<a\s/i.test(a)) withLink++;
      if (/href=["']\/(?!\/)/i.test(a)) internal++;
      if (/href=["']https?:\/\//i.test(a)) external++;
    }
  }
  console.log(`${t}.${c}: rows=${rows.length} faqs=${n} withLink=${withLink} internal=${internal} external=${external}`);
}
