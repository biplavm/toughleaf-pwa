import { readFile } from 'node:fs/promises';
import process from 'node:process';
import { createHash } from 'node:crypto';

const root = new URL('../', import.meta.url);
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const manifest = JSON.parse(
  await readFile(new URL('vendor/@toughleaf/platform-sdk/manifest.json', root), 'utf8'),
);

const apiBase = (process.env.TL_API_BASE_URL ?? 'http://127.0.0.1:8080/api/v1').replace(/\/$/, '');
const email = process.env.TL_DEMO_EMAIL;
const password = process.env.TL_DEMO_PASSWORD;
const expectedVersion = process.env.TL_EXPECTED_VERSION ?? pkg.version;
const workflowId = process.env.TL_DEMO_WORKFLOW_ID;
const participantCompanyId = process.env.TL_DEMO_PARTICIPANT_COMPANY_ID;
const participantCompanyName = process.env.TL_DEMO_PARTICIPANT_COMPANY_NAME;
const localCandidate = process.env.TL_LOCAL_CANDIDATE === '1';
const failures = [];

function check(name, condition, detail) {
  const status = condition ? 'PASS' : 'FAIL';
  console.log(`${status.padEnd(4)} ${name}: ${detail}`);
  if (!condition) failures.push(name);
}

check('Studio version', pkg.version === expectedVersion, `${pkg.version} (expected ${expectedVersion})`);
check('SDK manifest version', manifest.version === expectedVersion, `${manifest.version} (expected ${expectedVersion})`);
check('SDK manifest tag', manifest.tag === `v${manifest.version}`, `${manifest.tag} (expected v${manifest.version})`);
check(
  '0.4 release source',
  localCandidate || (manifest.version === '0.4.0' && manifest.tag === 'v0.4.0'),
  localCandidate ? 'local candidate explicitly allowed; release gate not certified' : `${manifest.version} / ${manifest.tag}`,
);
check(
  'SDK bundle inventory',
  Array.isArray(manifest.files) && manifest.files.length >= 6,
  `${manifest.files?.length ?? 0} checksummed files`,
);

const vendorFiles = [
  ['index.js', 'toughleaf-platform-sdk.esm.js'],
  ['index.js.map', 'toughleaf-platform-sdk.esm.js.map'],
  ['toughleaf-platform-sdk.esm.js.map', 'toughleaf-platform-sdk.esm.js.map'],
  ['index.d.ts', 'toughleaf-platform-sdk.d.ts'],
];
for (const [localName, assetName] of vendorFiles) {
  const contents = await readFile(
    new URL(`vendor/@toughleaf/platform-sdk/${localName}`, root),
  );
  const actual = createHash('sha256').update(contents).digest('hex');
  check(`SDK checksum ${localName}`, actual === manifest.sha256?.[assetName], actual.slice(0, 12));
}

try {
  check('Demo credentials', Boolean(email && password), email ? 'email set; password redacted' : 'set TL_DEMO_EMAIL and TL_DEMO_PASSWORD');
  check('Workflow config', Boolean(workflowId), workflowId ?? 'set TL_DEMO_WORKFLOW_ID');
  check('Participant id config', Boolean(participantCompanyId), participantCompanyId ?? 'set TL_DEMO_PARTICIPANT_COMPANY_ID');
  check('Participant name config', Boolean(participantCompanyName), participantCompanyName ?? 'set TL_DEMO_PARTICIPANT_COMPANY_NAME');
  if (!email || !password || !workflowId || !participantCompanyId || !participantCompanyName) {
    throw new Error('Required integration configuration is incomplete');
  }
  const { ToughLeafClient } = await import(
    new URL('vendor/@toughleaf/platform-sdk/index.js', root)
  );
  const client = new ToughLeafClient({ baseUrl: apiBase });
  await client.lookup.listStates();
  check('Laravel reachability', true, apiBase);

  await client.login({ email, password });
  const [user, company, invites] = await Promise.all([
    client.account.getUser(),
    client.account.getCompany(),
    client.invites.list(),
  ]);
  check('Demo login', user.email === email, user.email ?? 'missing email');
  check(
    'Complete company',
    Boolean(company.company_name && company.phone && company.addresses?.length),
    `${company.company_name ?? 'missing name'} / ${company.addresses?.length ?? 0} address(es)`,
  );
  check('Invite permission', Array.isArray(invites), `${invites.length} pending invite(s)`);
  check(
    'Owner permission',
    user.job_title === 'Owner' && Array.isArray(invites),
    `${user.job_title ?? 'missing title'}; invite list authorized`,
  );

  const [workflow, search] = await Promise.all([
    client.workflows.get(workflowId, { staleTime: 0 }),
    client.companies.search({ states: ['NY'] }, { fresh: true }),
  ]);
  check('Demo workflow', workflow.id === workflowId, workflow.id);
  const participant = search.results.find((candidate) =>
    candidate.id === Number(participantCompanyId) && candidate.company_name === participantCompanyName,
  );
  check('Participant search', Boolean(participant), `${participantCompanyName} / ${participantCompanyId}`);
  await client.companies.deleteSearch(search.id);
} catch (error) {
  check('Laravel integration', false, error instanceof Error ? error.message : String(error));
}

if (failures.length > 0) {
  console.error(`\nPreflight failed: ${failures.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('\nPreflight passed. Studio journeys may run against this Laravel instance.');
}
