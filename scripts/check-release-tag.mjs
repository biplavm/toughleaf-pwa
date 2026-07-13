import { readFile } from 'node:fs/promises';

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const tag = process.argv[2] ?? '';
const expected = `v${pkg.version}`;

if (tag !== expected) {
  console.error(`Release tag mismatch: expected ${expected}, got ${tag || '(empty)'}`);
  process.exit(1);
}
console.log(`Release tag ${tag} matches Studio ${pkg.version}`);
