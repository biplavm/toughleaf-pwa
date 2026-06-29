# Tough Leaf SDK Studio

Minimal browser app for exploring the [Platform SDK](https://github.com/toughleaf/toughleaf-platform-sdk). Run integration recipes locally and reuse snippets in your application.

**Port:** 5175 (development) · **Ticket:** TL-758

## Prerequisites

Sibling checkout layout:

```text
~/toughleaf/
├── toughleaf-laravel/          # Docker :8080
├── toughleaf-platform-sdk/     # library + documentation
└── toughleaf-sdk-studio/       # this repository
```

Laravel must be reachable at `http://127.0.0.1:8080`. The Vite dev server proxies `/api` to the backend.

## Setup

```bash
cd ../toughleaf-platform-sdk
npm install
npm run build

cd ../toughleaf-sdk-studio
npm install
npm run dev
```

Open **http://localhost:5175**

## Recipes

| Tab | Application flow | SDK API |
|-----|------------------|---------|
| 01 Public lookup | Public reference data | `client.lookup.listStates()` |
| 02 Login + user | Authentication → profile | `client.login()`, `getUser()` |
| 03 Observe dedupe | Shared user state | `client.account.observeUser()` |

Full recipe markdown lives in the SDK repository under `docs/recipes/`.

## Documentation

| Topic | Location |
|-------|----------|
| Getting started | `../toughleaf-platform-sdk/docs/getting-started.md` |
| Guides | `../toughleaf-platform-sdk/docs/guides/` |
| Onboarding | [docs/ONBOARDING.md](./docs/ONBOARDING.md) |

## Local credentials

```text
hello@toughleaf.com / password
```

Use only with local or staging backends that include seeded test data.

## Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `VITE_TL_API_BASE` | `/api/v1` | API base URL (proxied in development) |

## Build

```bash
npm run build
npm run preview
```

## Scope

This repository is a lightweight integration shell. It is not the internal capability demo lab, not an automated evidence runner, and not a substitute for installing the SDK package in your application.

## License

UNLICENSED — internal Tough Leaf use.
