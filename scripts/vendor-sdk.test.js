import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const vendor = path.join(root, 'vendor', '@toughleaf', 'platform-sdk');
const vendorManifest = JSON.parse(await readFile(path.join(vendor, 'manifest.json'), 'utf8'));
const tag = vendorManifest.tag;
const assetFiles = {
  'manifest.json': 'manifest.json',
  'toughleaf-platform-sdk.esm.js': 'index.js',
  'toughleaf-platform-sdk.esm.js.map': 'index.js.map',
  'toughleaf-platform-sdk.d.ts': 'index.d.ts',
};

async function fixtures(mode) {
  const result = {};
  for (const [asset, local] of Object.entries(assetFiles)) {
    result[asset] = await readFile(path.join(vendor, local));
  }
  if (mode === 'wrong-tag') {
    const manifest = JSON.parse(result['manifest.json'].toString('utf8'));
    manifest.tag = 'v9.9.9';
    result['manifest.json'] = Buffer.from(`${JSON.stringify(manifest)}\n`);
  }
  if (mode === 'corrupt') {
    result['toughleaf-platform-sdk.esm.js'] = Buffer.concat([
      result['toughleaf-platform-sdk.esm.js'],
      Buffer.from('\n// corrupt'),
    ]);
  }
  return result;
}

async function runVendor(mode) {
  const files = await fixtures(mode);
  let baseUrl = '';
  const server = createServer((req, res) => {
    if (req.url?.startsWith('/repos/fixture/sdk/releases/tags/')) {
      const names = Object.keys(files).filter(
        (name) => !(mode === 'missing' && name === 'toughleaf-platform-sdk.d.ts'),
      );
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ assets: names.map((name) => ({ name, url: `${baseUrl}/assets/${name}` })) }));
      return;
    }
    const name = decodeURIComponent(req.url?.replace('/assets/', '') ?? '');
    if (req.url?.startsWith('/assets/') && files[name]) {
      res.end(files[name]);
      return;
    }
    res.statusCode = 404;
    res.end('not found');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
  const dest = await mkdtemp(path.join(tmpdir(), 'studio-vendor-test-'));

  try {
    const result = await new Promise((resolve) => {
      const child = spawn(process.execPath, ['scripts/vendor-sdk.mjs'], {
        cwd: root,
        env: {
          ...process.env,
          SDK_TAG: tag,
          SDK_REPO: 'fixture/sdk',
          SDK_API_BASE: baseUrl,
          SDK_VENDOR_DEST: dest,
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (chunk) => (stdout += chunk));
      child.stderr.on('data', (chunk) => (stderr += chunk));
      child.on('close', (code) => resolve({ code, stdout, stderr, dest }));
    });
    return { ...result, cleanup: () => rm(dest, { recursive: true, force: true }) };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

describe('SDK release download', () => {
  it('downloads a tagged release and verifies every checksum', async () => {
    const result = await runVendor('valid');
    try {
      expect(result.code, result.stderr).toBe(0);
      const manifest = JSON.parse(await readFile(path.join(result.dest, 'manifest.json'), 'utf8'));
      const downloaded = await readFile(path.join(result.dest, 'index.js'));
      expect(createHash('sha256').update(downloaded).digest('hex')).toBe(
        manifest.sha256['toughleaf-platform-sdk.esm.js'],
      );
    } finally {
      await result.cleanup();
    }
  });

  it.each([
    ['missing', /missing expected asset/i],
    ['wrong-tag', /tag mismatch/i],
    ['corrupt', /checksum mismatch/i],
  ])('rejects a %s release', async (mode, message) => {
    const result = await runVendor(mode);
    try {
      expect(result.code).not.toBe(0);
      expect(result.stderr).toMatch(message);
    } finally {
      await result.cleanup();
    }
  });
});
