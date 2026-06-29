# Onboarding

This guide maps Tough Leaf product flows to the Platform SDK documentation. The SDK consumes the same Laravel `/api/v1` JSON contract as the production frontend.

## Prerequisites

- Laravel backend on port **8080**
- SDK built: `npm run build` in `toughleaf-platform-sdk`
- Studio (optional): `npm run dev` in this repo → http://localhost:5175

Postgres and internal development tooling are not required for SDK integration.

## Recommended reading order

1. [Getting started](../../toughleaf-platform-sdk/docs/getting-started.md)
2. [API envelope](../../toughleaf-platform-sdk/docs/concepts/api-envelope.md)
3. Recipes (copy-paste integration examples):
   - [01 Public lookup](../../toughleaf-platform-sdk/docs/recipes/01-public-lookup.md)
   - [02 Login + getUser](../../toughleaf-platform-sdk/docs/recipes/02-login-get-user.md)
   - [03 Observe dedupe](../../toughleaf-platform-sdk/docs/recipes/03-login-observe-dedupe.md)

## Product flow index

| Application flow | Documentation |
|------------------|---------------|
| Sign-in | [authentication.md](../../toughleaf-platform-sdk/docs/guides/authentication.md) |
| User profile / header | [account-user.md](../../toughleaf-platform-sdk/docs/guides/account-user.md) |
| Projects list | [projects-list.md](../../toughleaf-platform-sdk/docs/guides/projects-list.md) |
| Public reference data | [public-lookup.md](../../toughleaf-platform-sdk/docs/guides/public-lookup.md) |
| Environment / feature flags | [env-features.md](../../toughleaf-platform-sdk/docs/guides/env-features.md) |

## Guide structure

Each guide in the SDK repository follows:

1. Application behavior (screen or workflow)
2. Representative Laravel request/response JSON
3. `createClient()` integration snippet

## Support

Contact engineering for API changes, authentication, or architecture questions.
