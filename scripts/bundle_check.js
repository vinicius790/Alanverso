import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LIMITS = {
  '.js': 60 * 1024,
  '.css': 50 * 1024,
};

function checkDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDir(fullPath);
    } else {
      const ext = path.extname(entry.name);
      const stat = fs.statSync(fullPath);
      if (LIMITS[ext] && stat.size > LIMITS[ext]) {
        console.error(
          `ERROR: ${fullPath} exceeds modular size limit (${stat.size} bytes > ${LIMITS[ext]} bytes)`,
        );
        process.exit(1);
      }
    }
  }
}

console.log('Validating modular bundle budgets in Alanverso...');
checkDir(path.join(ROOT, 'src'));
checkDir(path.join(ROOT, 'styles'));
console.log('Bundle size verification: PASS OK');
