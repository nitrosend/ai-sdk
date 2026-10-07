# Releasing @nitrosend/ai-sdk

Maintainer checklist for publishing to npm and submitting to the
[AI SDK Tools Registry](https://ai-sdk.dev/tools-registry). This file is not
shipped to npm.

1. Bump `version` and run `npm run prepack` (regenerates schemas and the
   version constant, builds, type-checks).
2. Publish: `npm publish --access public`.
3. Open a PR to [`vercel/ai`](https://github.com/vercel/ai) adding an entry
   to `content/tools-registry/registry.ts`. The exact object to paste, plus
   the pre-publish checklist, lives in
   [`VERCEL_TOOLS_REGISTRY.md`](VERCEL_TOOLS_REGISTRY.md).
4. The full Vercel Marketplace distribution (one-click installs from
   Vercel, secret rotation, billing) is tracked separately in the
   companion `vercel-marketplace-native-integration` spec. That work is
   not part of this package.
