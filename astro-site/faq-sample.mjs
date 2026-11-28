import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('D:/tech dental z/database/database.sqlite', { readOnly: true });
const samples = [
  ['services','faqs',1],['services','faqs_bn',19],['medicines','faqs',1],['medicines','faqs',2],
  ['doctors','faqs',1],['locations','faqs',1],['locations','faqs_bn',2],['home_content','faqs',1],
  ['price_settings','faqs',1],['doctor_settings','faqs',1]
];
for (const [t,c,id] of samples) {
  const row = db.prepare(`SELECT "${c}" v FROM "${t}" WHERE rowid = ?`).get(id);
  if (!row) { console.log(t,c,id,'no row'); continue; }
  const arr = JSON.parse(row.v);
  console.log(`\n=== ${t}.${c} row ${id} (${arr.length} faqs)`);
  for (const f of arr.slice(0, 2)) {
    console.log('Q:', f.q);
    console.log('A:', String(f.a).slice(-360).replace(/\n/g, ' '));
  }
}
