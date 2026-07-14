# Vite + TypeScript starter

This is a standalone frontend. It imports only `@toughleaf/platform-sdk`, does not import Studio code, and does not call Laravel directly.

Read [the Studio walkthrough](../docs/walkthrough/README.md) first. Its four stories explain the business outcome this starter is intended to reconstruct with public SDK calls.

For local SDK development:

```powershell
npm install
$env:SDK_DIST='C:\path\to\toughleaf-platform-sdk\dist\cdn'
npm run vendor:sdk
npm run typecheck
npm run build
```

For an official release, replace `SDK_DIST` with `SDK_TAG=v0.4.0` and set `GITHUB_TOKEN` when the repository is private. The vendor command verifies every downloaded checksum before exposing the bundle to Vite.

Mail delivery is deliberately outside this app. Verify the workflow-generated message in the environment's mail sink after the SDK observes the `204` transition and survey refetch.
