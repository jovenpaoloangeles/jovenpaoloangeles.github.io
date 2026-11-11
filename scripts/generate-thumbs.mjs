import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOTS = ['public/photography', 'public/creative_coding'];
const OUT = 'public/thumbs';
const MAX_WIDTH = 720;
const QUALITY = 70;
const EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png']);
const CHECK = process.argv.includes('--check');

async function collect(dir, acc = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(p, acc);
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) acc.push(p);
  }
  return acc;
}

const sources = (await Promise.all(ROOTS.map((r) => collect(r)))).flat();

if (CHECK) {
  const text = await Promise.all([
    fs.readFile('src/components/Photography.tsx', 'utf8'),
    fs.readFile('src/components/CreativeCoding.tsx', 'utf8'),
  ]).then(([a, b]) => a + b);
  const urls = [...text.matchAll(/["'](\/(?:photography|creative_coding)\/[^"']+\.(?:webp|jpg|jpeg|png))["']/gi)].map((m) => m[1]);
  const missing = [];
  for (const url of new Set(urls)) {
    const thumb = path.join(OUT, url.slice(1));
    try { await fs.access(thumb); } catch { missing.push(url); }
  }
  if (missing.length) {
    console.error(`MISSING THUMBS (${missing.length}):`);
    for (const m of missing) console.error(`  ${m}`);
    process.exit(1);
  }
  console.log(`all ${new Set(urls).size} referenced images have thumbs (${sources.length} originals scanned)`);
  process.exit(0);
}

let made = 0, skipped = 0;
for (const src of sources) {
  const rel = path.relative('public', src);
  const dest = path.join(OUT, rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  try {
    const st = await fs.stat(dest);
    const ss = await fs.stat(src);
    if (st.mtimeMs >= ss.mtimeMs) { skipped++; continue; }
  } catch { /* thumb missing — generate */ }
  await sharp(src).resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY }).toFile(dest);
  made++;
}
console.log(`thumbnails: ${made} generated, ${skipped} skipped, ${sources.length} total`);
