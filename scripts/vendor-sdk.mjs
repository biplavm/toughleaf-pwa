import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Vendors the compiled Platform SDK browser bundle into this repo.
 *
 * Distribution model: the Studio never links the SDK source repo. It consumes
 * the compiled, versioned bundle published as a GitHub Release asset (one
 * deliverable per tag), verified against the sha256 checksums in manifest.json.
 *
 * Modes (highest precedence first):
 *   SDK_TAG=v0.3.1 npm run vendor:sdk     Download the release for that tag.
 *   SDK_DIST=/path npm run vendor:sdk     Copy from a local bundle directory.
 *   npm run vendor:sdk                    Copy from ../toughleaf-platform-sdk/dist/cdn (local dev).
 *
 * Optional:
 *   SDK_REPO=owner/name   Override the source repository (default toughleaf/toughleaf-platform-sdk).
 *   GITHUB_TOKEN=...      Required for private repositories when using SDK_TAG.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dest = path.join(root, 'vendor', '@toughleaf', 'platform-sdk');
const repo = process.env.SDK_REPO ?? 'toughleaf/toughleaf-platform-sdk';
const tag = process.env.SDK_TAG;
const token = process.env.GITHUB_TOKEN;

/** Release asset name -> vendored name. manifest.json is copied as-is. */
const FILES = [
  ['toughleaf-platform-sdk.esm.js', 'index.js'],
  ['toughleaf-platform-sdk.esm.js.map', 'index.js.map'],
  ['toughleaf-platform-sdk.d.ts', 'index.d.ts'],
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function ghHeaders(extra = {}) {
  const headers = { 'User-Agent': 'toughleaf-sdk-studio-vendor', ...extra };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function downloadRelease(releaseTag) {
  const apiUrl = `https://api.github.com/repos/${repo}/releases/tags/${releaseTag}`;
  const res = await fetch(apiUrl, { headers: ghHeaders({ Accept: 'application/vnd.github+json' }) });
  if (!res.ok) {
    fail(
      `Cannot resolve release ${releaseTag} on ${repo} (HTTP ${res.status}).\n` +
        'For private repositories set GITHUB_TOKEN. Check that the tag has a published release.',
    );
  }
  const release = await res.json();
  const assets = new Map(release.assets.map((a) => [a.name, a]));

  const workdir = await mkdtemp(path.join(tmpdir(), 'tl-sdk-vendor-'));
  const wanted = ['manifest.json', ...FILES.map(([from]) => from)];
  for (const name of wanted) {
    const asset = assets.get(name);
    if (!asset) fail(`Release ${releaseTag} is missing expected asset: ${name}`);
    const dl = await fetch(asset.url, { headers: ghHeaders({ Accept: 'application/octet-stream' }) });
    if (!dl.ok) fail(`Failed to download asset ${name} (HTTP ${dl.status})`);
    await writeFile(path.join(workdir, name), Buffer.from(await dl.arrayBuffer()));
  }
  return workdir;
}

async function verifyChecksums(sourceDir, manifest) {
  if (!manifest.sha256) {
    fail(
      'manifest.json has no sha256 map — refusing to vendor an unverifiable bundle. ' +
        'Rebuild the SDK bundle (npm run build:all) with a manifest that includes checksums.',
    );
  }
  for (const [from] of FILES) {
    const expected = manifest.sha256[from];
    if (!expected) fail(`manifest.json has no sha256 entry for ${from}`);
    const actual = createHash('sha256')
      .update(await readFile(path.join(sourceDir, from)))
      .digest('hex');
    if (actual !== expected) {
      fail(
        `Checksum mismatch for ${from}\n  expected ${expected}\n  actual   ${actual}\n` +
          'The bundle is corrupt or does not match its manifest. Aborting.',
      );
    }
  }
}

let source;
let cleanup;
if (tag) {
  source = await downloadRelease(tag);
  cleanup = () => rm(source, { recursive: true, force: true });
} else {
  source = process.env.SDK_DIST
    ? path.resolve(process.env.SDK_DIST)
    : path.resolve(root, '..', 'toughleaf-platform-sdk', 'dist', 'cdn');
  if (!(await exists(source))) {
    fail(
      `SDK bundle source not found: ${source}\n` +
        'Build it first (npm run build:all in the SDK repo), set SDK_DIST to a bundle directory, ' +
        'or set SDK_TAG to download a published release.',
    );
  }
}

const manifestPath = path.join(source, 'manifest.json');
if (!(await exists(manifestPath))) fail(`Missing manifest.json in ${source}`);
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

if (tag && manifest.tag !== tag) {
  fail(`Release/manifest tag mismatch: requested ${tag}, manifest says ${manifest.tag}`);
}

await verifyChecksums(source, manifest);

await rm(dest, { recursive: true, force: true });
await mkdir(dest, { recursive: true });
for (const [from, to] of FILES) {
  await cp(path.join(source, from), path.join(dest, to));
}
await cp(manifestPath, path.join(dest, 'manifest.json'));
await cleanup?.();

console.log(
  `Vendored ${manifest.name}@${manifest.version} (${manifest.git_sha ?? 'no git sha'}) into ` +
    `${path.relative(root, dest)} — checksums verified (source: ${tag ?? source})`,
);
