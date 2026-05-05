import {
  createMCPClient,
  type MCPClient,
  type OAuthClientProvider,
} from '@ai-sdk/mcp';
import type { z } from 'zod';
import { NitrosendAISDKError } from './errors.js';
import {
  pickNitrosendToolSchemas,
  nitrosendToolSchemas,
  type NitrosendToolName,
} from './schemas.generated.js';

const DEFAULT_URL = 'https://api.nitrosend.com/mcp';
const CLIENT_NAME = '@nitrosend/ai-sdk';
const CLIENT_VERSION = '0.1.0';

export interface NitrosendOptions {
  apiKey?: string;
  bearerToken?: string;
  headers?: Record<string, string>;
  url?: string;
  authProvider?: OAuthClientProvider;
  tools?: readonly NitrosendToolName[];
  fetch?: typeof fetch;
}

export interface ResolvedAuth {
  headers: Record<string, string>;
  authProvider?: OAuthClientProvider;
}

function setAuthorization(headers: Record<string, string>, value: string): void {
  // Delete any pre-existing case variant so callers passing lowercase
  // `authorization` don't end up with both keys — fetch's Headers
  // collapses them into a comma-joined value, which would mix the old
  // credential with the new one.
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === 'authorization') delete headers[key];
  }
  headers['Authorization'] = value;
}

function applyApiKey(headers: Record<string, string>, apiKey: string): void {
  if (!apiKey.startsWith('nskey_live_') && !apiKey.startsWith('nskey_test_')) {
    throw new NitrosendAISDKError(
      'AUTH_INVALID_PREFIX',
      "Nitrosend API keys must start with 'nskey_live_' or 'nskey_test_'.",
    );
  }
  setAuthorization(headers, `Bearer ${apiKey}`);
}

export function resolveNitrosendAuth(options: NitrosendOptions): ResolvedAuth {
  const headers: Record<string, string> = { ...(options.headers ?? {}) };

  // Once a credential is selected via headers, authProvider must NOT be
  // forwarded to the MCP transport: @ai-sdk/mcp applies authProvider tokens
  // after headers, which would silently overwrite the explicit
  // Nitrosend credential and authenticate the wrong account.
  if (options.apiKey) {
    applyApiKey(headers, options.apiKey);
    return { headers };
  }
  if (options.bearerToken) {
    setAuthorization(headers, `Bearer ${options.bearerToken}`);
    return { headers };
  }
  if (headers['Authorization'] || headers['authorization']) {
    return { headers };
  }
  if (process.env.NITROSEND_API_KEY) {
    applyApiKey(headers, process.env.NITROSEND_API_KEY);
    return { headers };
  }
  if (process.env.NITROSEND_BEARER_TOKEN) {
    setAuthorization(headers, `Bearer ${process.env.NITROSEND_BEARER_TOKEN}`);
    return { headers };
  }
  if (options.authProvider) {
    // No other credential resolved — let the OAuth provider handle auth.
    return { headers, authProvider: options.authProvider };
  }
  throw new NitrosendAISDKError(
    'AUTH_MISSING',
    "No Nitrosend credential found. Pass `apiKey`, `bearerToken`, or `authProvider`, or set NITROSEND_API_KEY or NITROSEND_BEARER_TOKEN.",
  );
}

export function resolveNitrosendUrl(options: NitrosendOptions): string {
  return options.url ?? process.env.NITROSEND_MCP_URL ?? DEFAULT_URL;
}

export async function createNitrosendMCPClient(
  options: NitrosendOptions = {},
): Promise<MCPClient> {
  const { headers, authProvider } = resolveNitrosendAuth(options);
  const url = resolveNitrosendUrl(options);
  try {
    return await createMCPClient({
      transport: {
        type: 'http',
        url,
        headers,
        authProvider,
        redirect: 'error',
        fetch: options.fetch,
      },
      name: CLIENT_NAME,
      version: CLIENT_VERSION,
    });
  } catch (cause) {
    throw new NitrosendAISDKError(
      'CLIENT_INIT_FAILED',
      `Failed to initialize Nitrosend MCP client at ${url}.`,
      { cause },
    );
  }
}

export type NitrosendTools = Awaited<ReturnType<MCPClient['tools']>>;

type NitrosendToolValue = NitrosendTools[string];

export type NitrosendToolInput<K extends NitrosendToolName> = z.infer<
  (typeof nitrosendToolSchemas)[K]
>;

export type NitrosendTool<K extends NitrosendToolName> = Omit<
  NitrosendToolValue,
  'inputSchema' | 'execute'
> & {
  inputSchema: (typeof nitrosendToolSchemas)[K];
  execute: (
    input: NitrosendToolInput<K>,
    options: { toolCallId: string; messages: unknown[]; abortSignal?: AbortSignal },
  ) => Promise<unknown>;
};

export type NarrowedNitrosendTools<T extends readonly NitrosendToolName[]> = {
  [K in T[number]]: NitrosendTool<K>;
};

export interface NitrosendToolset<TTools = NitrosendTools> {
  tools: TTools;
  client: MCPClient;
  close: () => Promise<void>;
}

export async function nitrosend<const T extends readonly NitrosendToolName[]>(
  options: NitrosendOptions & { tools: T },
): Promise<NitrosendToolset<NarrowedNitrosendTools<T>>>;
export async function nitrosend(
  options?: Omit<NitrosendOptions, 'tools'>,
): Promise<NitrosendToolset<NitrosendTools>>;
export async function nitrosend(
  options: NitrosendOptions = {},
): Promise<NitrosendToolset<NitrosendTools | NarrowedNitrosendTools<NitrosendToolName[]>>> {
  const client = await createNitrosendMCPClient(options);
  let tools: NitrosendTools;
  try {
    if (options.tools !== undefined) {
      // Explicit subset (including the empty array). An empty tuple is
      // an explicit "no tools" request, not a fall-through to all tools.
      tools = (
        options.tools.length === 0
          ? {}
          : await client.tools({
              schemas: pickNitrosendToolSchemas(...options.tools),
            })
      ) as NitrosendTools;
    } else {
      tools = await client.tools();
    }
  } catch (cause) {
    await client.close().catch(() => {});
    throw new NitrosendAISDKError(
      'TOOLS_LIST_FAILED',
      'Failed to list Nitrosend MCP tools.',
      { cause },
    );
  }
  return {
    tools,
    client,
    close: () => client.close(),
  };
}

export async function runWithToolset<TTools, R>(
  toolset: NitrosendToolset<TTools>,
  callback: (toolset: NitrosendToolset<TTools>) => Promise<R>,
): Promise<R> {
  try {
    return await callback(toolset);
  } finally {
    await toolset.close().catch(() => {});
  }
}

export async function withNitrosendTools<const T extends readonly NitrosendToolName[], R>(
  options: NitrosendOptions & { tools: T },
  callback: (toolset: NitrosendToolset<NarrowedNitrosendTools<T>>) => Promise<R>,
): Promise<R>;
export async function withNitrosendTools<R>(
  options: Omit<NitrosendOptions, 'tools'>,
  callback: (toolset: NitrosendToolset<NitrosendTools>) => Promise<R>,
): Promise<R>;
export async function withNitrosendTools<R>(
  options: NitrosendOptions,
  callback: (toolset: NitrosendToolset<any>) => Promise<R>,
): Promise<R> {
  const toolset = await nitrosend(options as NitrosendOptions);
  return runWithToolset(toolset, callback);
}
