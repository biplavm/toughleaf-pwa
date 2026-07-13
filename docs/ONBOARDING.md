# Onboarding

This guide maps Tough Leaf product flows to the Platform SDK documentation. The SDK consumes the same Laravel `/api/v1` JSON contract as the production frontend.

## Prerequisites

- Laravel backend on port **8080**
- Studio: `npm run dev` in this repo -> http://localhost:5175

The Studio is **pure JavaScript** and does not link the SDK source repo. It consumes the compiled, versioned browser bundle committed under `vendor/@toughleaf/platform-sdk/` (one deliverable per SDK tag). TypeScript is only a dev-time checker (`npm run typecheck` via `checkJs`); merchants can copy the recipes into any stack (vanilla, React, Vue, Svelte, TS).

### Updating the vendored SDK

```bash
# From a published GitHub Release (one deliverable per tag; recommended)
SDK_TAG=vX.Y.Z GITHUB_TOKEN=... npm run vendor:sdk

# From a local SDK build (development)
npm run vendor:sdk                       # uses ../toughleaf-platform-sdk/dist/cdn
SDK_DIST=/path/to/bundle npm run vendor:sdk

# Verify the committed vendor matches its manifest checksums (also runs in CI)
node scripts/verify-vendor.mjs
```

All modes verify the sha256 checksums in `manifest.json` before vendoring.

## Recommended reading order

1. [Getting started](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/getting-started.md)
2. [API envelope](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/concepts/api-envelope.md)
3. Recipes (copy-paste integration examples):
   - [01 Public lookup](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/01-public-lookup.md)
   - [02 Login + getUser](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/02-login-get-user.md)
   - [03 Observe dedupe](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/03-login-observe-dedupe.md)
   - [04 updateUser](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/04-update-user-muta.md) - TL-808
   - [05 observeCompany](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/05-observe-company.md) - TL-808
   - [06 updateCompany](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/06-update-company.md) - TL-808
   - [Team invites](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/team-invites.md) - TL-809
   - [Projects lifecycle](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/projects-lifecycle.md) - TL-810

## Product flow index

| Application flow | Documentation |
|------------------|---------------|
| Sign-in | [authentication.md](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/guides/authentication.md) |
| User profile / header | [account-user.md](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/guides/account-user.md) |
| Profile update (TL-808) | [04-update-user-muta.md](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/04-update-user-muta.md) |
| Company settings (TL-808) | [06-update-company.md](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/06-update-company.md) |
| Team invites (TL-809) | [team-invites.md](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/team-invites.md) |
| Company people update (TL-809) | [team-invites.md](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/team-invites.md) |
| Projects list | [projects-list.md](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/guides/projects-list.md) |
| Projects lifecycle (TL-810) | [projects-lifecycle.md](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/projects-lifecycle.md) |
| Bid packages (TL-810) | [projects-lifecycle.md](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes/projects-lifecycle.md) |
| Public reference data | [public-lookup.md](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/guides/public-lookup.md) |
| Environment / feature flags | [env-features.md](https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/guides/env-features.md) |

## Guide structure

Each guide in the SDK repository follows:

1. Application behavior (screen or workflow)
2. Representative Laravel request/response JSON
3. `createClient()` integration snippet

## Support

Contact engineering for API changes, authentication, or architecture questions.
