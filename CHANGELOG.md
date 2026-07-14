# Changelog

All notable changes to `@toughleaf/sdk-studio` are documented here.

## 0.4.0 - 2026-07-14

### TL-878 GC project-to-outreach reference workflow

- Added the GC workflow across project, package, firm search, feedback, participant, survey, workflow transition, and API cleanup.
- Added request bodies, HTTP status, response/error, declared invalidation, observed refetch, assertions, and cleanup to the inspector.
- Added a standalone Vite + TypeScript starter that imports only the public SDK.
- Kept Mailpit verification and private seed configuration outside the public Studio build.
- Vendored the checksum-verified Platform SDK `v0.4.0` GitHub Release.

## 0.3.2 - 2026-07-13

### TL-809 + TL-810 journey closure

- Combined the invite and project lifecycle work into one certified milestone.
- Added executable TL-808 account/company, TL-809 invite, and TL-810 project journeys.
- Added request, HTTP status, response, invalidation, and cleanup evidence to every journey step.
- Added preflight validation for Laravel, seed data, permissions, SDK version, and the vendored manifest.
- Added unit and Playwright coverage, including deterministic cleanup against real Laravel.

### SDK bundle consumption

- Vendored the checksummed Platform SDK 0.3.2 browser bundle without a monorepo runtime dependency.
- Added release-tag validation and checksum verification to CI.
- Added release download support by SDK tag, with authenticated private-repository and GitHub Enterprise support.

## 0.1.0 - 2026-07-02

- Established the initial standalone Studio baseline and vendored SDK bundle contract.
- Added the initial TL-808 account/company playground surface.
