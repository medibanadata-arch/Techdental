import fs from 'node:fs';
import path from 'node:path';

const root = 'D:/tech dental z/astro-site/src';
const STACK = "'Times New Roman', Times, 'SolaimanLipi', 'Noto Sans Bengali', 'Hind Siliguri', serif";

const replacements = [
  ["'Inter', 'Plus Jakarta Sans', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif", STACK],
  ["'Plus Jakarta Sans', 'Inter', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif", STACK],
  ["'Inter', 'SolaimanLipi', 'Hind Siliguri', sans-serif", STACK],
  ["'Playfair Display', Georgia, serif", "'Times New Roman', Times, 'SolaimanLipi', serif"],
  ["'Plus Jakarta Sans', 'Inter', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif", STACK],
  ["Fraunces, Georgia, \"Times New Roman\", serif", "'Times New Roman', Times, 'SolaimanLipi', serif"],
  ["'Playfair Display', serif", "'Times New Roman', Times, 'SolaimanLipi', serif"],
  ["'Lora', Georgia, serif", "'Times New Roman', Times, 'SolaimanLipi', serif"],
  ["font-['Plus_Jakarta_Sans','Inter','SolaimanLipi','Noto_Sans_Bengali',sans-serif]", 'font-sans'],
  ["font-['Inter','Plus_Jakarta_Sans','SolaimanLipi','Noto_Sans_Bengali',sans-serif]", 'font-sans'],
  ["font-['Noto_Sans_Bengali','Anek_Bangla','Hind_Siliguri','Inter',sans-serif]", 'font-sans'],
  ["font-['Noto_Sans_Bengali','Anek_Bangla',sans-serif]", 'font-sans'],
  ["font-['Barlow_Condensed',sans-serif]", 'font-serif'],
  ["font-['Plus_Jakarta_Sans',sans-serif]", 'font-serif'],
  ["font-family: sans-serif;", "font-family: 'Times New Roman', Times, serif;"],
];

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(tsx|ts|astro|css)$/.test(entry.name)) files.push(p);
  }
}
walk(root);

let changed = 0;
const report = [];
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  // any remaining arbitrary font family utility -> inherit the site stack
  text = text.replace(/font-\['[^']*(?:sans-serif|serif)[^']*'\]/g, 'font-sans');
  if (text !== before) {
    fs.writeFileSync(file, text);
    changed++;
    report.push(file.replace(root + '/', ''));
  }
}
console.log('files changed:', changed);
console.log(report.join('\n'));
