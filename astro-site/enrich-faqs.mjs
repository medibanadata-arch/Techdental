import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('D:/tech dental z/database/database.sqlite');
const EN = 'en', BN = 'bn';

const rules = [
  { re: /invisalign|clear aligner|অ্যালাইনার|ইনভিসালাইন/i, en: '/service/invisalign-clear-aligners-usa-brand', bn: '/bn/service/invisalign-clear-aligners-cost-bd', aen: 'Invisalign clear aligners in Dhaka', abn: 'ঢাকায় ইনভিসালাইন ক্লিয়ার অ্যালাইনার', ext: 'https://en.wikipedia.org/wiki/Clear_aligner', xen: 'clear aligners on Wikipedia', xbn: 'উইকিপিডিয়ায় ক্লিয়ার অ্যালাইনার' },
  { re: /braces|orthodont|overbite|crooked|ব্রেসেস|অর্থোডন্টিক|আঁকাবাঁকা/i, en: '/service/teeth-braces-cost-bangladesh', bn: '/bn/service/teeth-braces-cost-bd', aen: 'teeth braces treatment in Bangladesh', abn: 'বাংলাদেশে ব্রেসেস চিকিৎসা', ext: 'https://en.wikipedia.org/wiki/Dental_braces', xen: 'dental braces on Wikipedia', xbn: 'উইকিপিডিয়ায় ডেন্টাল ব্রেসেস' },
  { re: /implant|ইমপ্লান্ট/i, en: '/service/dental-implants-cost-in-bangladesh', bn: '/bn/service/dental-implants-cost-bd', aen: 'dental implant cost in Bangladesh', abn: 'বাংলাদেশে ডেন্টাল ইমপ্লান্টের খরচ', ext: 'https://en.wikipedia.org/wiki/Dental_implant', xen: 'dental implants on Wikipedia', xbn: 'উইকিপিডিয়ায় ডেন্টাল ইমপ্লান্ট' },
  { re: /root canal|\brct\b|রুট ক্যানেল/i, en: '/service/tooth-root-canal-cost-bd', bn: '/bn/service/tooth-root-canal-cost', aen: 'root canal treatment cost in Dhaka', abn: 'ঢাকায় রুট ক্যানেল চিকিৎসার খরচ', ext: 'https://en.wikipedia.org/wiki/Root_canal_treatment', xen: 'root canal treatment on Wikipedia', xbn: 'উইকিপিডিয়ায় রুট ক্যানেল চিকিৎসা' },
  { re: /whiten|bleach|হোয়াইটেনিং|সাদা করা/i, en: '/service/tooth-whitening-cost-bd-en', bn: '/bn/service/tooth-whitening-cost-bd', aen: 'professional teeth whitening in Dhaka', abn: 'ঢাকায় পেশাদার টুথ হোয়াইটেনিং', ext: 'https://en.wikipedia.org/wiki/Tooth_whitening', xen: 'tooth whitening on Wikipedia', xbn: 'উইকিপিডিয়ায় দাঁত সাদা করা' },
  { re: /zirconia|জিরকোনিয়া/i, en: '/service/zirconia-cap-price-bd', bn: '/bn/service/zirconia-cap-price', aen: 'zirconia crown price in Bangladesh', abn: 'বাংলাদেশে জিরকোনিয়া ক্যাপের দাম', ext: 'https://en.wikipedia.org/wiki/Zirconium_dioxide', xen: 'zirconia dental crowns on Wikipedia', xbn: 'উইকিপিডিয়ায় জিরকোনিয়া' },
  { re: /crown|tooth cap|ক্রাউন|ক্যাপ/i, en: '/service/teeth-cap-price-bd', bn: '/bn/service/teeth-cap-price', aen: 'dental crown and teeth cap price', abn: 'ডেন্টাল ক্রাউন ও দাঁতের ক্যাপের দাম', ext: 'https://en.wikipedia.org/wiki/Crown_(dentistry)', xen: 'dental crowns on Wikipedia', xbn: 'উইকিপিডিয়ায় ডেন্টাল ক্রাউন' },
  { re: /bridge|ব্রিজ/i, en: '/service/dental-bridge-cost-bangladesh-en', bn: '/bn/service/dental-bridge-cost-bangladesh', aen: 'dental bridge treatment in Dhaka', abn: 'ঢাকায় ডেন্টাল ব্রিজ চিকিৎসা', ext: 'https://en.wikipedia.org/wiki/Bridge_(dentistry)', xen: 'dental bridges on Wikipedia', xbn: 'উইকিপিডিয়ায় ডেন্টাল ব্রিজ' },
  { re: /denture|ডেনচার/i, en: '/service/flexible-denture-cost-bd', bn: '/bn/service/flexible-denture-cost', aen: 'flexible denture cost in Bangladesh', abn: 'বাংলাদেশে ফ্লেক্সিবল ডেনচারের খরচ', ext: 'https://en.wikipedia.org/wiki/Dentures', xen: 'dentures on Wikipedia', xbn: 'উইকিপিডিয়ায় ডেনচার' },
  { re: /veneer|ভিনিয়ার/i, en: '/service/direct-composite-veneers-teeth', bn: '/bn/service/direct-composite-veneers', aen: 'direct composite veneers in Bangladesh', abn: 'বাংলাদেশে ডিরেক্ট কম্পোজিট ভিনিয়ার', ext: 'https://en.wikipedia.org/wiki/Veneer_(dentistry)', xen: 'dental veneers on Wikipedia', xbn: 'উইকিপিডিয়ায় ডেন্টাল ভিনিয়ার' },
  { re: /wisdom|আক্কেল/i, en: '/service/wisdom-teeth-removal-cost-in-bangladesh', bn: '/bn/service/wisdom-teeth-removal-cost-bd', aen: 'wisdom teeth removal cost in Bangladesh', abn: 'বাংলাদেশে আক্কেল দাঁত তোলার খরচ', ext: 'https://en.wikipedia.org/wiki/Wisdom_tooth', xen: 'wisdom teeth on Wikipedia', xbn: 'উইকিপিডিয়ায় আক্কেল দাঁত' },
  { re: /extract|tooth removal|remove a tooth|তোলা|উত্পাটন/i, en: '/service/tooth-extraction-cost-bangaldesh', bn: '/bn/service/tooth-extraction-cost-bd', aen: 'painless tooth extraction in Dhaka', abn: 'ঢাকায় ব্যথাহীন দাঁত তোলা', ext: 'https://en.wikipedia.org/wiki/Dental_extraction', xen: 'tooth extraction on Wikipedia', xbn: 'উইকিপিডিয়ায় দাঁত তোলা' },
  { re: /filling|cavity|ফিলিং|ক্যাভিটি/i, en: '/service/tooth-filling-cost-bd', bn: '/bn/service/tooth-filling-cost', aen: 'tooth filling cost in Dhaka', abn: 'ঢাকায় দাঁতের ফিলিং খরচ', ext: 'https://en.wikipedia.org/wiki/Dental_restoration', xen: 'dental fillings on Wikipedia', xbn: 'উইকিপিডিয়ায় ডেন্টাল ফিলিং' },
  { re: /scaling|polish|tartar|plaque|clean(ing)?|স্কেলিং|পলিশিং/i, en: '/service/teeth-scaling-polishing-price-bd', bn: '/bn/service/teeth-scaling-polishing-price-bn', aen: 'teeth scaling and polishing price', abn: 'দাঁতের স্কেলিং ও পলিশিংয়ের দাম', ext: 'https://en.wikipedia.org/wiki/Scaling_and_root_planing', xen: 'scaling and root planing on Wikipedia', xbn: 'উইকিপিডিয়ায় স্কেলিং' },
  { re: /gap|ফাঁকা/i, en: '/service/teeth-gap-filling-cost-bd', bn: '/bn/service/teeth-gap-filling-cost-bangladesh', aen: 'teeth gap treatment in Dhaka', abn: 'ঢাকায় ফাঁকা দাঁতের চিকিৎসা', ext: 'https://en.wikipedia.org/wiki/Diastema', xen: 'teeth gaps on Wikipedia', xbn: 'উইকিপিডিয়ায় দাঁতের ফাঁক' },
  { re: /broken|chip|fractur|ভাঙা/i, en: '/service/broken-tooth-restoration-cost-bd-en', bn: '/bn/service/broken-tooth-restoration-cost-bd', aen: 'broken tooth restoration in Dhaka', abn: 'ঢাকায় ভাঙা দাঁতের চিকিৎসা', ext: 'https://en.wikipedia.org/wiki/Dental_trauma', xen: 'dental trauma on Wikipedia', xbn: 'উইকিপিডিয়ায় ডেন্টাল ট্রমা' },
  { re: /child|kid|pediatric|শিশু|বাচ্চা/i, en: '/doctors', bn: '/doctors', aen: 'our specialist dental surgeons', abn: 'আমাদের বিশেষজ্ঞ ডেন্টাল সার্জনরা', ext: 'https://en.wikipedia.org/wiki/Pediatric_dentistry', xen: 'pediatric dentistry on Wikipedia', xbn: 'উইকিপিডিয়ায় পেডিয়াট্রিক ডেন্টিস্ট্রি' },
  { re: /cost|price|fee|charge|খরচ|দাম|টাকা/i, en: '/price-list', bn: '/bn/services', aen: 'dental treatment price list in Dhaka', abn: 'ঢাকায় ডেন্টাল চিকিৎসার মূল্যতালিকা', ext: 'https://www.nhs.uk/nhs-services/dentists/dental-costs/', xen: 'how dental costs work (NHS)', xbn: 'ডেন্টাল খরচের ব্যাখ্যা (NHS)' },
  { re: /appointment|book(ing)?|অ্যাপয়েন্টমেন্ট|বুকিং/i, en: '/appointment', bn: '/appointment', aen: 'book a dental appointment', abn: 'ডেন্টাল অ্যাপয়েন্টমেন্ট বুক করুন', ext: 'https://www.who.int/news-room/fact-sheets/detail/oral-health', xen: 'WHO oral health fact sheet', xbn: 'WHO-এর মুখগহ্বর স্বাস্থ্য তথ্য' },
  { re: /branch|location|address|where|শাখা|ঠিকানা|কোথায়/i, en: '/branch/mirpur', bn: '/bn/branch/mirpur', aen: 'our Mirpur dental branch', abn: 'আমাদের মিরপুর ডেন্টাল শাখা', ext: 'https://www.google.com/maps/search/?api=1&query=Tech+Dental+Care+Dhaka', xen: 'Tech Dental on Google Maps', xbn: 'গুগল ম্যাপে টেক ডেন্টাল' },
];

const DEFAULTS = {
  services: { en: '/services', bn: '/bn/services', aen: 'our dental treatments in Dhaka', abn: 'ঢাকায় আমাদের ডেন্টাল চিকিৎসা', ext: 'https://www.who.int/news-room/fact-sheets/detail/oral-health', xen: 'WHO oral health fact sheet', xbn: 'WHO-এর মুখগহ্বর স্বাস্থ্য তথ্য' },
  medicines: { en: '/medicines', bn: '/bn/medicines', aen: 'our dental medicine guide', abn: 'আমাদের ডেন্টাল ঔষধ নির্দেশিকা', ext: 'https://medlineplus.gov/druginformation.html', xen: 'MedlinePlus drug information', xbn: 'MedlinePlus ঔষধ তথ্য' },
  doctors: { en: '/doctors', bn: '/doctors', aen: 'our BMDC-registered dental surgeons', abn: 'আমাদের বিএমডিসি-নিবন্ধিত ডেন্টাল সার্জনরা', ext: 'https://www.bmdc.org.bd/', xen: 'Bangladesh Medical & Dental Council', xbn: 'বাংলাদেশ মেডিকেল ও ডেন্টাল কাউন্সিল' },
  locations: null,
};

function resolveLink(question, lang, ctx) {
  if (ctx.table === 'medicines') return DEFAULTS.medicines;
  if (ctx.table === 'doctors' || ctx.table === 'doctor_settings') return DEFAULTS.doctors;
  if (ctx.table === 'locations' && ctx.branch) {
    const slug = ctx.branch.slug;
    return {
      en: `/branch/${slug}`, bn: `/bn/branch/${slug}`,
      aen: `${ctx.branch.name.replace(/\s*Branch$/i, '')} dental branch in Dhaka`,
      abn: 'এই শাখার ঠিকানা, সময়সূচি ও যোগাযোগ',
      ext: /google\.com\/maps/.test(ctx.branch.review_url || '')
        ? ctx.branch.review_url
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ctx.branch.name + ' Tech Dental Dhaka')}`,
      xen: 'this branch on Google Maps', xbn: 'গুগল ম্যাপে এই শাখা',
    };
  }
  for (const r of rules) if (r.re.test(question)) return r;
  return DEFAULTS[ctx.table] || DEFAULTS.services;
}

function appendLinks(answer, question, lang, ctx) {
  const html = String(answer || '');
  if (html.includes('data-faq-links')) return null;
  const hasInternal = /href=["'](?:https?:\/\/(?:www\.)?techdentalcare\.com)?\/(?!\/)/i.test(html);
  const hasExternal = /href=["']https?:\/\/(?!(?:www\.)?techdentalcare\.com)/i.test(html);
  if (hasInternal && hasExternal) return null;
  const link = resolveLink(String(question || ''), lang, ctx);
  let internalHref = lang === BN ? link.bn : link.en;
  let internalAnchor = lang === BN ? link.abn : link.aen;
  if (ctx.ownPath && internalHref.replace(/\/+$/, '') === ctx.ownPath.replace(/\/+$/, '')) {
    internalHref = lang === BN ? '/bn/services' : '/services';
    internalAnchor = lang === BN ? 'ঢাকায় আমাদের ডেন্টাল চিকিৎসা' : 'our dental treatments in Dhaka';
  }
  const label = lang === BN ? 'সম্পর্কিত' : 'Related';
  const parts = [];
  if (!hasInternal) parts.push(`<a href="${internalHref}">${internalAnchor}</a>`);
  if (!hasExternal) parts.push(`<a href="${link.ext}" target="_blank" rel="noopener noreferrer">${lang === BN ? link.xbn : link.xen}</a>`);
  const end = lang === BN ? '।' : '.';
  return `${html}<!--faq-links--><p><strong>${label}:</strong> ${parts.join(' · ')}${end}</p>`;
}

const branches = db.prepare('SELECT id, name, slug, review_url FROM locations').all();
const branchById = new Map(branches.map(b => [b.id, b]));

const targets = [
  ['services', 'faqs', EN], ['services', 'faqs_bn', BN],
  ['medicines', 'faqs', EN],
  ['doctors', 'faqs', EN],
  ['locations', 'faqs', EN], ['locations', 'faqs_bn', BN],
  ['home_content', 'faqs', EN],
  ['price_settings', 'faqs', EN],
  ['doctor_settings', 'faqs', EN],
];

let changedRows = 0, changedFaqs = 0, skipped = 0;
const log = [];
for (const [table, col, lang] of targets) {
  const extra = table === 'locations' ? ', id AS __loc' : '';
  const rows = db.prepare(`SELECT rowid AS rid${extra}, "${col}" v FROM "${table}" WHERE "${col}" IS NOT NULL AND "${col}" != ''`).all();
  for (const row of rows) {
    let arr;
    try { arr = JSON.parse(row.v); } catch { continue; }
    if (!Array.isArray(arr)) continue;
    const ctx = { table, branch: table === 'locations' ? branchById.get(row.__loc) : null, ownPath: null };
    let rowChanged = false;
    const next = arr.map((f) => {
      if (!f || !f.a) return f;
      const updated = appendLinks(f.a, f.q, lang, ctx);
      if (updated === null) { skipped++; return f; }
      rowChanged = true;
      changedFaqs++;
      return { ...f, a: updated };
    });
    if (rowChanged) {
      db.prepare(`UPDATE "${table}" SET "${col}" = ? WHERE rowid = ?`).run(JSON.stringify(next), row.rid);
      changedRows++;
    }
  }
  log.push(`${table}.${col}: rows ${rows.length}`);
}

console.log('rows updated:', changedRows, 'faqs updated:', changedFaqs, 'skipped (already linked):', skipped);
console.log(log.join('\n'));
