import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'D:/tech dental z/astro-site/src';
const EXT = new Set(['.ts', '.tsx', '.astro']);
const SKIP = new Set(['legacy.ts']);

const RULES = [
  [/(?<![\w.\-])\/bn\/blog/g, '/bn/dentistry'],
  [/(?<![\w.\-])\/blog\//g, '/dentistry/'],
  [/(?<![\w.\-])\/blog(?=['"`])/g, '/dentistry'],
  [/(?<![\w.\-])\/bn\/medicines/g, '/bn/medication'],
  [/(?<![\w.\-])\/medicines\//g, '/medication/'],
  [/(?<![\w.\-])\/medicines(?=['"`])/g, '/medication'],
];

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (EXT.has(path.extname(e.name))) out.push(p);
  }
  return out;
};

const dry = process.argv.includes('--dry');
const files = walk(ROOT).filter((f) => !SKIP.has(path.basename(f)));
const changed = [];
for (const f of files) {
  const before = fs.readFileSync(f, 'utf8');
  let text = before;
  for (const [re, to] of RULES) text = text.replace(re, to);
  if (text !== before) {
    changed.push(f.replace(ROOT + '\\', ''));
    if (!dry) fs.writeFileSync(f, text);
  }
}
console.log(dry ? 'DRY RUN' : 'APPLIED', '- files changed:', changed.length);
for (const f of changed) console.log('  ', f);
