import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const repo = process.env.SDK_REPO ?? 'toughleaf/toughleaf-platform-sdk';
const tag = process.env.SDK_TAG;
const token = process.env.GITHUB_TOKEN;
const vendorSource = process.env.SDK_VENDOR_DIR ? path.resolve(process.env.SDK_VENDOR_DIR) : undefined;
const files = [
  ['toughleaf-platform-sdk.esm.js', 'index.js'],
  ['toughleaf-platform-sdk.esm.js.map', 'index.js.map'],
  ['toughleaf-platform-sdk.d.ts', 'index.d.ts'],
];

async function releaseDirectory(releaseTag) {
  const headers = { 'User-Agent': 'toughleaf-sdk-vite-starter', Accept: 'application/vnd.github+json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`https://api.github.com/repos/${repo}/releases/tags/${releaseTag}`, { headers });
  if (!response.ok) throw new Error(`Cannot resolve ${releaseTag} on ${repo}: HTTP ${response.status}`);
  const release = await response.json();
  const assets = new Map(release.assets.map((asset) => [asset.name, asset]));
  const directory = await mkdtemp(path.join(tmpdir(), 'toughleaf-starter-sdk-'));
  for (const name of ['manifest.json', ...files.map(([source]) => source)]) {
    const asset = assets.get(name);
    if (!asset) throw new Error(`Release ${releaseTag} is missing ${name}`);
    const download = await fetch(asset.url, { headers: { ...headers, Accept: 'application/octet-stream' } });
    if (!download.ok) throw new Error(`Cannot download ${name}: HTTP ${download.status}`);
    await writeFile(path.join(directory, name), Buffer.from(await download.arrayBuffer()));
  }
  return directory;
}

const source = tag
  ? await releaseDirectory(tag)
  : vendorSource
    ? vendorSource
  : process.env.SDK_DIST
    ? path.resolve(process.env.SDK_DIST)
    : undefined;
if (!source) throw new Error('Set SDK_TAG to an official release or SDK_DIST for local development');

try {
  const manifest = JSON.parse(await readFile(path.join(source, 'manifest.json'), 'utf8'));
  if (tag && manifest.tag !== tag) throw new Error(`Manifest tag ${manifest.tag} does not match ${tag}`);
  for (const [name, localName] of files) {
    const sourceName = vendorSource ? localName : name;
    const actual = createHash('sha256').update(await readFile(path.join(source, sourceName))).digest('hex');
    if (actual !== manifest.sha256?.[name]) throw new Error(`Checksum mismatch: ${name}`);
  }
  const destination = path.resolve('vendor/platform-sdk');
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  for (const [from, to] of files) await cp(path.join(source, vendorSource ? to : from), path.join(destination, to));
  await cp(path.join(source, 'manifest.json'), path.join(destination, 'manifest.json'));
  console.log(`Vendored ${manifest.name}@${manifest.version}; checksums verified.`);
} finally {
  if (tag) await rm(source, { recursive: true, force: true });
}
