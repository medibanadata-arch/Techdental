/**
 * Helper for scripts/restore_blog_images.py.
 *
 * WordPress sits behind Cloudflare and rejects Python's TLS fingerprint, while
 * Node's fetch is accepted. This script fetches the WordPress JSON and images
 * on Python's behalf.
 *
 *   node scripts/wp-fetch.mjs docs   <cacheDir>
 *   node scripts/wp-fetch.mjs images <manifest.json> <outputDir>
 *
 * Manifest format: [{ key, candidates: [url, ...] }]
 * Output format:   { key: { url, file, bytes, type } }
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; TechDentalMigration/1.0)' };
const API = 'https://techdentalcare.com/wp-json/wp/v2';

async function fetchDocs(outDir) {
  await fs.promises.mkdir(outDir, { recursive: true });
  for (const kind of ['posts', 'pages']) {
    let page = 1;
    const all = [];
    while (true) {
      const url = `${API}/${kind}?per_page=100&page=${page}&_fields=id,slug,link,title,content`;
      const res = await fetch(url, { headers: UA });
      if (!res.ok) break;
      const batch = await res.json();
      if (!batch.length) break;
      all.push(...batch);
      page += 1;
    }
    await fs.promises.writeFile(
      path.join(outDir, `${kind}.json`),
      JSON.stringify(all),
      'utf8'
    );
    console.log(`${kind}: ${all.length}`);
  }
}

async function fetchOne(entry, outDir) {
  for (const url of entry.candidates) {
    try {
      const res = await fetch(url, { headers: UA });
      if (!res.ok) continue;
      const type = res.headers.get('content-type') || '';
      const buf = Buffer.from(await res.arrayBuffer());
      const isImage =
        type.startsWith('image/') ||
        (buf[0] === 0xff && buf[1] === 0xd8) ||
        buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) ||
        buf.subarray(0, 4).toString('ascii') === 'RIFF' ||
        buf.subarray(0, 4).toString('ascii') === 'GIF8';
      if (!isImage || buf.length < 200) continue;
      const file = path.join(outDir, `${entry.key}.bin`);
      await fs.promises.writeFile(file, buf);
      return { key: entry.key, url, file, bytes: buf.length, type };
    } catch {
      // try the next candidate
    }
  }
  return { key: entry.key, error: 'no candidate downloaded' };
}

async function fetchImages(manifestPath, outDir) {
  await fs.promises.mkdir(outDir, { recursive: true });
  const manifest = JSON.parse(await fs.promises.readFile(manifestPath, 'utf8'));
  const results = {};
  let cursor = 0;
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (cursor < manifest.length) {
        const entry = manifest[cursor++];
        results[entry.key] = await fetchOne(entry, outDir);
      }
    })
  );
  console.log(JSON.stringify(results));
}

const [, , mode, a, b] = process.argv;
if (mode === 'docs') {
  await fetchDocs(a);
} else if (mode === 'images') {
  await fetchImages(a, b);
} else {
  console.error('usage: node scripts/wp-fetch.mjs docs <cacheDir> | images <manifest.json> <outDir>');
  process.exit(1);
}

// Keep crypto imported for callers that hash keys locally without shelling out.
export { crypto };
