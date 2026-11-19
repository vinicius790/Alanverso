import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

function walk(dir, extFilter, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') walk(full, extFilter, acc);
    } else if (extFilter.includes(path.extname(entry.name))) {
      acc.push(full);
    }
  }
  return acc;
}

const jsFiles = [
  path.join(ROOT, 'sw.js'),
  ...walk(path.join(ROOT, 'src'), ['.js', '.mjs']),
  ...walk(path.join(ROOT, 'scripts'), ['.js', '.mjs']),
  ...walk(path.join(ROOT, 'tests'), ['.js', '.mjs']),
];

for (const file of jsFiles) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

const cssFiles = walk(path.join(ROOT, 'styles'), ['.css']);
for (const file of cssFiles) {
  const css = fs.readFileSync(file, 'utf8');
  const openBraces = (css.match(/\{/g) || []).length;
  const closeBraces = (css.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    console.error(`CSS braces unbalanced in ${file} (${openBraces} vs ${closeBraces})`);
    process.exit(1);
  }
}

console.log(`Syntax & CSS validation: PASS OK (${jsFiles.length} JS/MJS, ${cssFiles.length} CSS)`);
