# Tough Leaf SDK Studio

Workflow-first reference app for the Tough Leaf Platform SDK. Version 0.3.2 turns TL-808, TL-809, and TL-810 into three executable journeys with visible HTTP evidence and deterministic cleanup.

## Golden journeys

| Journey | Contract exercised |
|---|---|
| Account + company (TL-808) | login, shared cache observation, user mutation, company read, restore |
| Invite lifecycle (TL-809) | list, create, 204/refetch, resend, verification, delete |
| Project lifecycle (TL-810) | create, full read, 204/refetch update, package, participant, cleanup |

Every run shows request method/path, actual HTTP status, latency, response/error, step assertions, and cleanup state. Disposable invites, projects, packages, and participants are removed in `finally` blocks.

## Clean setup

```bash
npm ci
npx playwright install chromium
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Development server:

```bash
npm run dev
```

Open `http://127.0.0.1:5175`.

## Laravel demo seed and preflight

From the Laravel repository, after the normal base seed:

```bash
php artisan db:seed --class=SdkDemoSeeder
```

This creates an idempotent, isolated demo owner, a complete GC company, a participant company, and a minimal workflow. Local-only credentials are:

```text
sdk.demo@toughleaf.local / sdk-demo-password
```

Then validate the complete environment before opening Studio:

```bash
TL_API_BASE_URL=http://127.0.0.1:8080/api/v1 \
TL_DEMO_PARTICIPANT_COMPANY_ID=<printed by seeder> \
npm run preflight
```

Optional variables: `TL_DEMO_EMAIL`, `TL_DEMO_PASSWORD`, and `TL_EXPECTED_VERSION`.

## SDK bundle contract

Studio never reaches into the SDK monorepo at runtime. It imports the checksummed bundle under `vendor/@toughleaf/platform-sdk/`.

```bash
# Official release input
SDK_TAG=vX.Y.Z GITHUB_TOKEN=... npm run vendor:sdk

# Local candidate input
cd ../toughleaf-platform-sdk
npm ci && npm run build:all
cd ../toughleaf-sdk-studio
npm run vendor:sdk
```

Both paths verify `manifest.json` checksums. `npm run preflight` additionally requires Studio, SDK manifest, and expected versions to agree.

`SDK_REPO` can select another repository and `SDK_API_BASE` can select a GitHub Enterprise API endpoint. Every downloaded asset is rejected unless it matches the release `manifest.json` checksum.

## Real E2E

The shell Playwright test always runs. Laravel-backed journeys activate only when their environment is explicitly supplied:

```bash
TL_E2E_API_BASE=http://127.0.0.1:8080/api/v1 \
TL_DEMO_EMAIL=sdk.demo@toughleaf.local \
TL_DEMO_PASSWORD=sdk-demo-password \
TL_DEMO_ROLE_ID=1 \
TL_DEMO_WORKFLOW_ID=01J5DKDEMA0000000000000000 \
TL_DEMO_PARTICIPANT_COMPANY_ID=<printed by seeder> \
npm run test:e2e
```

The participant company id and workflow id printed by `SdkDemoSeeder` can be entered in Studio configuration for the full TL-810 path.

## Distribution

GitHub Releases is the current distribution channel; npm remains private. Publishing order is SDK release, verified vendor import, then Studio release. Pushes, PRs, tags, and releases are separate explicit public actions.

## License

UNLICENSED — internal Tough Leaf use.
