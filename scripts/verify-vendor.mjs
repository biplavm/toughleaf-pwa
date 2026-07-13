import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Verifies that the committed vendor/@toughleaf/platform-sdk files match the
 * sha256 checksums recorded in their manifest.json. Guards against manual
 * edits or partial updates of the vendored bundle.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'vendor', '@toughleaf', 'platform-sdk');

/** Vendored name -> manifest (original asset) name. */
const FILES = [
  ['index.js', 'toughleaf-platform-sdk.esm.js'],
  ['index.js.map', 'toughleaf-platform-sdk.esm.js.map'],
  ['toughleaf-platform-sdk.esm.js.map', 'toughleaf-platform-sdk.esm.js.map'],
  ['index.d.ts', 'toughleaf-platform-sdk.d.ts'],
];

const manifest = JSON.parse(await readFile(path.join(dir, 'manifest.json'), 'utf8'));
if (!manifest.sha256) {
  console.error('vendored manifest.json has no sha256 map — re-vendor with npm run vendor:sdk');
  process.exit(1);
}

let failed = false;
for (const [local, original] of FILES) {
  const expected = manifest.sha256[original];
  const actual = createHash('sha256')
    .update(await readFile(path.join(dir, local)))
    .digest('hex');
  if (actual !== expected) {
    console.error(`Checksum mismatch: ${local} (expected ${expected}, got ${actual})`);
    failed = true;
  }
}

if (failed) {
  console.error('Vendored SDK bundle does not match its manifest. Re-run npm run vendor:sdk.');
  process.exit(1);
}

console.log(`Vendored SDK verified: ${manifest.name}@${manifest.version} (tag ${manifest.tag})`);
