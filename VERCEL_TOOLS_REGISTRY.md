# Vercel AI SDK Tools Registry submission

This file tracks the entry submitted to the
[AI SDK Tools Registry](https://ai-sdk.dev/tools-registry) under
[`vercel/ai`](https://github.com/vercel/ai), at
`content/tools-registry/registry.ts`.

## Prerequisites

1. `@nitrosend/ai-sdk` is published on npm with the version referenced
   below. Do not open the registry PR until the package is publicly
   installable.
2. The README, this file, and `docs/integrations/vercel-ai-sdk.mdx` are in
   sync with the published version.
3. The Tools Registry contributing guide
   ([add-new-tool-to-registry.md](https://github.com/vercel/ai/blob/main/contributing/add-new-tool-to-registry.md))
   has been read end to end.

## Registry entry

Add this object to `content/tools-registry/registry.ts`:

```ts
{
  slug: 'nitrosend',
  name: 'Nitrosend',
  description: 'Nitrosend tools for Vercel AI SDK agents — send email and SMS, manage contacts and segments, build flows, run campaigns. Backed by the Nitrosend remote MCP server.',
  packageName: '@nitrosend/ai-sdk',
  tags: ['email', 'sms', 'marketing', 'mcp', 'automation', 'crm'],
  apiKeyEnvName: 'NITROSEND_API_KEY',
  installCommand: {
    pnpm: 'pnpm add @nitrosend/ai-sdk ai @ai-sdk/mcp zod @ai-sdk/openai',
    npm: 'npm install @nitrosend/ai-sdk ai @ai-sdk/mcp zod @ai-sdk/openai',
    yarn: 'yarn add @nitrosend/ai-sdk ai @ai-sdk/mcp zod @ai-sdk/openai',
    bun: 'bun add @nitrosend/ai-sdk ai @ai-sdk/mcp zod @ai-sdk/openai',
  },
  codeExample: `import { generateText, isStepCount } from 'ai';
import { openai } from '@ai-sdk/openai';
import { withNitrosendTools } from '@nitrosend/ai-sdk';

// withNitrosendTools opens the MCP transport and runs await close() in
// a finally block when the callback resolves or throws.
const result = await withNitrosendTools({}, async ({ tools }) => {
  return generateText({
    model: openai('gpt-4o'),
    tools: tools,
    // Allow follow-up steps after the model invokes a Nitrosend tool so
    // the final summary text reaches the caller.
    stopWhen: isStepCount(5),
    prompt: 'Send a welcome email to founder@acme.com from our team.',
  });
});

console.log(result.text);`,
  docsUrl: 'https://docs.nitrosend.com/integrations/vercel-ai-sdk',
  apiKeyUrl: 'https://app.nitrosend.com/settings/api-keys',
  websiteUrl: 'https://nitrosend.com',
  npmUrl: 'https://www.npmjs.com/package/@nitrosend/ai-sdk',
}
```

## Submission checklist

- [ ] `npm view @nitrosend/ai-sdk` returns the published version that ships
      the example above.
- [ ] `docsUrl` resolves to the public docs page.
- [ ] `apiKeyUrl` is the dashboard route where users mint a new
      `nskey_live_*` / `nskey_test_*` key.
- [ ] `codeExample` builds and runs end-to-end against the live MCP
      endpoint with `NITROSEND_API_KEY` set.
- [ ] The PR description explains that this listing is for AI SDK tool
      discovery only.

## Notes for reviewers

- The package wraps the remote Nitrosend MCP server via `@ai-sdk/mcp`. It
  does not implement an LLM and is not packaged for the Vercel platform's
  one-click install surface — that lives in a separate Nitrosend internal
  spec and is not part of this listing.
- All mutating tools (sends, imports, deletes) are non-retrying. The
  wrapper surfaces errors to the calling agent rather than silently
  retrying writes.
