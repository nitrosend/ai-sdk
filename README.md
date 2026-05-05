# @nitrosend/ai-sdk

Vercel AI SDK tools for [Nitrosend](https://nitrosend.com) — the multi-channel
marketing platform. Drops Nitrosend's 21 MCP tools (send email, manage
contacts, build flows, run campaigns, …) into `generateText`, `streamText`,
and agent loops.

This package is a thin, typed wrapper over Nitrosend's remote MCP server. It
ships the Nitrosend tool surface for AI SDK developers — it is **not** a
language model implementation, and it does not replace `@ai-sdk/openai`,
`@ai-sdk/anthropic`, or any other model package.

## 1. Install

```bash
npm install @nitrosend/ai-sdk ai @ai-sdk/mcp zod
```

The examples below also use `@ai-sdk/openai` to pick a model. Replace it
with whichever AI SDK model package you use (`@ai-sdk/anthropic`,
`@ai-sdk/google`, etc.):

```bash
npm install @ai-sdk/openai
```

Set one of:

| Variable                  | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `NITROSEND_API_KEY`       | Nitrosend API key (`nskey_live_…` / `nskey_test_…`). |
| `NITROSEND_BEARER_TOKEN`  | Opaque bearer issued by your own auth flow.          |
| `NITROSEND_MCP_URL`       | Override the MCP endpoint (defaults to prod).        |

Get an API key from **Settings → API Keys** in the Nitrosend dashboard.

## 2. Quickstart

`generateText` (one-shot completion). `stopWhen: isStepCount(N)` lets the
model take a follow-up step after a tool call so the final summary text
gets back to you — without it, AI SDK stops after the first tool result:

```ts
import { generateText, isStepCount } from 'ai';
import { openai } from '@ai-sdk/openai';
import { withNitrosendTools } from '@nitrosend/ai-sdk';

const result = await withNitrosendTools({}, async ({ tools }) => {
  return generateText({
    model: openai('gpt-4o'),
    tools,
    stopWhen: isStepCount(5),
    prompt: 'Send a welcome email to founder@acme.com from our team.',
  });
});

console.log(result.text);
```

`streamText` (token-stream UI):

```ts
import { streamText, isStepCount } from 'ai';
import { openai } from '@ai-sdk/openai';
import { withNitrosendTools } from '@nitrosend/ai-sdk';

await withNitrosendTools({}, async ({ tools }) => {
  const stream = streamText({
    model: openai('gpt-4o'),
    tools,
    stopWhen: isStepCount(5),
    prompt: 'Find the founder@acme.com contact and add them to the "Power users" list.',
  });

  for await (const part of stream.textStream) {
    process.stdout.write(part);
  }

  await stream.consumeStream();
});
```

`withNitrosendTools` reads `NITROSEND_API_KEY` from the environment, opens
the MCP transport, runs your callback, and closes the transport in a
`finally` block — including when `streamText` is awaited inside the
callback (the close runs after the stream is fully consumed).

## 3. Lifecycle, subsets, errors

### Explicit lifecycle

If you need the raw client (e.g. inside a long-running server), call
`nitrosend()` directly and close it yourself:

```ts
import { nitrosend } from '@nitrosend/ai-sdk';

const { tools, client, close } = await nitrosend({ apiKey: process.env.NITROSEND_API_KEY });
try {
  // …use tools / client.listResources() / client.experimental_listPrompts() …
} finally {
  await close();
}
```

### Tool subsets

Restrict the toolset to specific tools — this filters at the MCP layer and
narrows the TypeScript types. Always use `withNitrosendTools` (or your
own `try/finally`) so the transport closes:

```ts
import { withNitrosendTools } from '@nitrosend/ai-sdk';

await withNitrosendTools(
  { tools: ['nitro_get_status', 'nitro_send_message'] },
  async ({ tools }) => {
    // tools is typed as { nitro_get_status: …; nitro_send_message: … }
  },
);
```

If you must hold the client outside a callback, retain the `close` handle
and run it in a `finally` yourself:

```ts
import { createNitrosendMCPClient, pickNitrosendToolSchemas } from '@nitrosend/ai-sdk';

const client = await createNitrosendMCPClient();
try {
  const tools = await client.tools({
    schemas: pickNitrosendToolSchemas('nitro_compose_flow', 'nitro_send_message'),
  });
  // …use tools…
} finally {
  await client.close();
}
```

### Errors

All wrapper failures throw `NitrosendAISDKError` with a stable `.code`
(`AUTH_MISSING`, `AUTH_INVALID_PREFIX`, `CLIENT_INIT_FAILED`,
`TOOLS_LIST_FAILED`) and the original `cause` preserved. The wrapper does
**not** retry — mutating tool calls (sends, imports, deletes) must remain
caller-driven. Network errors and 5xx responses surface to your code so
your application can decide what to do.

## 4. When to use this vs other Nitrosend packages

| Use case                                  | Reach for                                                          |
| ----------------------------------------- | ------------------------------------------------------------------ |
| AI agents calling Nitrosend tools         | **`@nitrosend/ai-sdk`** (this package)                             |
| Plain HTTP from any language              | [`@nitrosend/sdk`](https://www.npmjs.com/package/@nitrosend/sdk)   |
| Claude Desktop / Cursor / IDE MCP clients | [`@nitrosend/mcp`](https://www.npmjs.com/package/@nitrosend/mcp)   |

`@nitrosend/sdk` is the typed REST client for app code. `@nitrosend/mcp` is
the stdio MCP bridge consumed by IDE clients. This package targets
programmatic AI SDK usage and does not duplicate either. All three speak to
the same Nitrosend backend.

## 5. Publish + Tools Registry checklist

Before submitting to the [AI SDK Tools Registry](https://ai-sdk.dev/tools-registry):

1. Bump `version` and run `npm run prepack` (regenerates schemas, builds, type-checks).
2. Publish: `npm publish --access public`.
3. Open a PR to [`vercel/ai`](https://github.com/vercel/ai) adding an entry
   to `content/tools-registry/registry.ts`. The exact object to paste —
   plus pre-publish checklist — lives next to this README in the source
   repo as `VERCEL_TOOLS_REGISTRY.md` (it is intentionally not shipped to
   npm; view it on GitHub at
   [github.com/nitrosend/ai-sdk/blob/main/VERCEL_TOOLS_REGISTRY.md](https://github.com/nitrosend/ai-sdk/blob/main/VERCEL_TOOLS_REGISTRY.md)).
4. The full Vercel Marketplace distribution (one-click installs from
   Vercel, secret rotation, billing) is tracked separately in the
   companion `vercel-marketplace-native-integration` spec — that work is
   not part of this package.
