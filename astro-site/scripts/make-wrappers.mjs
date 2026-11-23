import fs from 'node:fs';
import path from 'node:path';

const pagesDir = path.resolve('src/app/Pages');
const outDir = path.resolve('src/app/wrappers');
fs.mkdirSync(outDir, { recursive: true });

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.tsx')) files.push(full);
  }
}
walk(pagesDir);

const manifest = [];
for (const file of files) {
  const relative = path.relative(pagesDir, file).replace(/\\/g, '/').replace(/\.tsx$/, '');
  const name = relative.replace(/\//g, '_') + 'Page';
  const importPath = '../Pages/' + relative;
  const content = `import { PageProvider } from '../../lib/inertia';\nimport Page from '${importPath}';\n\nexport default function ${name}({ page }: { page: any }) {\n  return (\n    <PageProvider page={page}>\n      <Page {...page.props} />\n    </PageProvider>\n  );\n}\n`;
  fs.writeFileSync(path.join(outDir, name + '.tsx'), content);
  manifest.push({ name, relative });
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`generated ${manifest.length} wrappers`);
