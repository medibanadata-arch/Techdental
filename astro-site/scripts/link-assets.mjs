import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const targets = [
  { name: 'uploads', source: path.resolve(root, '..', 'public', 'uploads') },
  { name: 'fonts', source: path.resolve(root, '..', 'public', 'fonts') },
];

fs.mkdirSync(publicDir, { recursive: true });

for (const { name, source } of targets) {
  const link = path.join(publicDir, name);
  if (fs.existsSync(link)) continue;
  if (!fs.existsSync(source)) {
    console.warn(`[link-assets] missing source: ${source}`);
    continue;
  }
  try {
    fs.symlinkSync(source, link, process.platform === 'win32' ? 'junction' : 'dir');
    console.log(`[link-assets] linked ${link} -> ${source}`);
  } catch (error) {
    // Fall back to copying when symlinks are unavailable (e.g. restricted CI).
    fs.cpSync(source, link, { recursive: true });
    console.log(`[link-assets] copied ${source} -> ${link}`);
  }
}

// Keep small public files in sync with the Laravel app.
for (const file of ['robots.txt', 'favicon.ico']) {
  const from = path.resolve(root, '..', 'public', file);
  const to = path.join(publicDir, file);
  if (fs.existsSync(from) && !fs.existsSync(to)) {
    fs.copyFileSync(from, to);
  }
}
