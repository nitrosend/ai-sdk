import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveNitrosendAuth,
  resolveNitrosendUrl,
  withNitrosendTools,
  runWithToolset,
  nitrosend,
  type NitrosendToolset,
} from './client.js';
import { NitrosendAISDKError } from './errors.js';

const ENV_KEYS = ['NITROSEND_API_KEY', 'NITROSEND_BEARER_TOKEN', 'NITROSEND_MCP_URL'];

let savedEnv: Record<string, string | undefined>;

beforeEach(() => {
  savedEnv = {};
  for (const k of ENV_KEYS) {
    savedEnv[k] = process.env[k];
    delete process.env[k];
  }
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
});

describe('resolveNitrosendAuth', () => {
  test('throws AUTH_MISSING when nothing provided', () => {
    assert.throws(() => resolveNitrosendAuth({}), (err: unknown) => {
      assert.ok(err instanceof NitrosendAISDKError);
      assert.equal((err as NitrosendAISDKError).code, 'AUTH_MISSING');
      return true;
    });
  });

  test('throws AUTH_INVALID_PREFIX for malformed apiKey', () => {
    assert.throws(
      () => resolveNitrosendAuth({ apiKey: 'sk-1234567890abcdef' }),
      (err: unknown) => {
        assert.ok(err instanceof NitrosendAISDKError);
        assert.equal((err as NitrosendAISDKError).code, 'AUTH_INVALID_PREFIX');
        return true;
      },
    );
  });

  test('accepts nskey_live_ prefix', () => {
    const { headers } = resolveNitrosendAuth({ apiKey: 'nskey_live_abc123' });
    assert.equal(headers['Authorization'], 'Bearer nskey_live_abc123');
  });

  test('accepts nskey_test_ prefix', () => {
    const { headers } = resolveNitrosendAuth({ apiKey: 'nskey_test_abc123' });
    assert.equal(headers['Authorization'], 'Bearer nskey_test_abc123');
  });

  test('apiKey option overrides NITROSEND_API_KEY env', () => {
    process.env.NITROSEND_API_KEY = 'nskey_test_envonly';
    const { headers } = resolveNitrosendAuth({ apiKey: 'nskey_live_explicit' });
    assert.equal(headers['Authorization'], 'Bearer nskey_live_explicit');
  });

  test('falls back to NITROSEND_API_KEY env when apiKey not passed', () => {
    process.env.NITROSEND_API_KEY = 'nskey_live_fromenv';
    const { headers } = resolveNitrosendAuth({});
    assert.equal(headers['Authorization'], 'Bearer nskey_live_fromenv');
  });

  test('uses bearerToken when no apiKey', () => {
    const { headers } = resolveNitrosendAuth({ bearerToken: 'opaque.token.value' });
    assert.equal(headers['Authorization'], 'Bearer opaque.token.value');
  });

  test('apiKey takes precedence over bearerToken', () => {
    const { headers } = resolveNitrosendAuth({
      apiKey: 'nskey_live_priority',
      bearerToken: 'should-be-ignored',
    });
    assert.equal(headers['Authorization'], 'Bearer nskey_live_priority');
  });

  test('NITROSEND_BEARER_TOKEN env used as last resort', () => {
    process.env.NITROSEND_BEARER_TOKEN = 'envbearer';
    const { headers } = resolveNitrosendAuth({});
    assert.equal(headers['Authorization'], 'Bearer envbearer');
  });

  test('explicit bearerToken wins over NITROSEND_API_KEY env', () => {
    process.env.NITROSEND_API_KEY = 'nskey_live_envapikey';
    const { headers } = resolveNitrosendAuth({ bearerToken: 'explicit.bearer' });
    assert.equal(headers['Authorization'], 'Bearer explicit.bearer');
  });

  test('explicit apiKey replaces lowercase authorization caller header (no duplicate)', () => {
    const { headers } = resolveNitrosendAuth({
      apiKey: 'nskey_live_explicit',
      headers: { authorization: 'Bearer stale-old-creds' },
    });
    const keys = Object.keys(headers).filter((k) => k.toLowerCase() === 'authorization');
    assert.deepEqual(keys, ['Authorization']);
    assert.equal(headers['Authorization'], 'Bearer nskey_live_explicit');
  });

  test('explicit Authorization header wins over env apiKey', () => {
    process.env.NITROSEND_API_KEY = 'nskey_live_envapikey';
    const { headers } = resolveNitrosendAuth({
      headers: { Authorization: 'Bearer custom-from-caller' },
    });
    assert.equal(headers['Authorization'], 'Bearer custom-from-caller');
  });

  test('authProvider alone is sufficient when no apiKey/bearer present', () => {
    const fakeProvider = {} as any;
    const { authProvider, headers } = resolveNitrosendAuth({ authProvider: fakeProvider });
    assert.strictEqual(authProvider, fakeProvider);
    assert.equal(headers['Authorization'], undefined);
  });

  test('explicit apiKey wins over authProvider and authProvider is dropped to avoid header override', () => {
    const fakeProvider = {} as any;
    const { authProvider, headers } = resolveNitrosendAuth({
      apiKey: 'nskey_live_abc',
      authProvider: fakeProvider,
    });
    assert.equal(authProvider, undefined);
    assert.equal(headers['Authorization'], 'Bearer nskey_live_abc');
  });

  test('preserves user-supplied headers', () => {
    const { headers } = resolveNitrosendAuth({
      apiKey: 'nskey_live_abc',
      headers: { 'X-Custom': 'yes' },
    });
    assert.equal(headers['X-Custom'], 'yes');
    assert.equal(headers['Authorization'], 'Bearer nskey_live_abc');
  });

  test('accepts pre-set Authorization header without throwing AUTH_MISSING', () => {
    const { headers } = resolveNitrosendAuth({
      headers: { Authorization: 'Bearer custom' },
    });
    assert.equal(headers['Authorization'], 'Bearer custom');
  });
});

describe('resolveNitrosendUrl', () => {
  test('defaults to https://api.nitrosend.com/mcp', () => {
    assert.equal(resolveNitrosendUrl({}), 'https://api.nitrosend.com/mcp');
  });

  test('respects explicit url option', () => {
    assert.equal(
      resolveNitrosendUrl({ url: 'http://localhost:8000/mcp' }),
      'http://localhost:8000/mcp',
    );
  });

  test('falls back to NITROSEND_MCP_URL env', () => {
    process.env.NITROSEND_MCP_URL = 'http://staging.example/mcp';
    assert.equal(resolveNitrosendUrl({}), 'http://staging.example/mcp');
  });

  test('explicit url wins over env', () => {
    process.env.NITROSEND_MCP_URL = 'http://env.example/mcp';
    assert.equal(
      resolveNitrosendUrl({ url: 'http://explicit.example/mcp' }),
      'http://explicit.example/mcp',
    );
  });
});

describe('withNitrosendTools', () => {
  test('throws AUTH_MISSING up front when no credential available', async () => {
    await assert.rejects(
      () => withNitrosendTools({}, async () => 'never'),
      (err: unknown) => {
        assert.ok(err instanceof NitrosendAISDKError);
        assert.equal((err as NitrosendAISDKError).code, 'AUTH_MISSING');
        return true;
      },
    );
  });
});

describe('nitrosend', () => {
  test('init failure is wrapped in CLIENT_INIT_FAILED with cause preserved', async () => {
    const failingFetch: typeof fetch = async () => {
      throw new Error('boom from fetch');
    };
    await assert.rejects(
      () => nitrosend({ apiKey: 'nskey_live_abc', fetch: failingFetch }),
      (err: unknown) => {
        assert.ok(err instanceof NitrosendAISDKError);
        assert.equal((err as NitrosendAISDKError).code, 'CLIENT_INIT_FAILED');
        const cause = (err as NitrosendAISDKError).cause;
        assert.ok(cause instanceof Error);
        assert.match((cause as Error).message, /boom from fetch/);
        return true;
      },
    );
  });

  test('default transport hits api.nitrosend.com/mcp with redirect: error and Authorization header', async () => {
    let capturedUrl = '';
    let capturedRedirect: string | undefined;
    let capturedAuth = '';
    const probeFetch: typeof fetch = async (input, init) => {
      capturedUrl = typeof input === 'string' ? input : (input as URL | Request).toString();
      capturedRedirect = (init as RequestInit | undefined)?.redirect;
      const headers = new Headers((init as RequestInit | undefined)?.headers);
      capturedAuth = headers.get('authorization') ?? '';
      throw new Error('probe-stop');
    };
    await assert.rejects(
      () => nitrosend({ apiKey: 'nskey_live_probekey123', fetch: probeFetch }),
      (err: unknown) => err instanceof NitrosendAISDKError,
    );
    assert.match(capturedUrl, /^https:\/\/api\.nitrosend\.com\/mcp/);
    assert.equal(capturedRedirect, 'error');
    assert.equal(capturedAuth, 'Bearer nskey_live_probekey123');
  });

  test('NITROSEND_MCP_URL env overrides default transport URL', async () => {
    process.env.NITROSEND_MCP_URL = 'https://staging.example/mcp';
    let capturedUrl = '';
    const probeFetch: typeof fetch = async (input) => {
      capturedUrl = typeof input === 'string' ? input : (input as URL | Request).toString();
      throw new Error('probe-stop');
    };
    await assert.rejects(
      () => nitrosend({ apiKey: 'nskey_live_envurl', fetch: probeFetch }),
      (err: unknown) => err instanceof NitrosendAISDKError,
    );
    assert.match(capturedUrl, /^https:\/\/staging\.example\/mcp/);
  });
});

describe('runWithToolset lifecycle', () => {
  function fakeToolset(closeCounter: { calls: number; throwOn?: 'close' }): NitrosendToolset<{}> {
    return {
      tools: {} as any,
      client: {} as any,
      close: async () => {
        closeCounter.calls++;
        if (closeCounter.throwOn === 'close') throw new Error('close failed');
      },
    };
  }

  test('close runs after a successful callback', async () => {
    const counter = { calls: 0 };
    const result = await runWithToolset(fakeToolset(counter), async () => 'ok');
    assert.equal(result, 'ok');
    assert.equal(counter.calls, 1);
  });

  test('close runs when the callback throws and the original error propagates', async () => {
    const counter = { calls: 0 };
    await assert.rejects(
      () =>
        runWithToolset(fakeToolset(counter), async () => {
          throw new Error('callback boom');
        }),
      (err: unknown) => err instanceof Error && (err as Error).message === 'callback boom',
    );
    assert.equal(counter.calls, 1);
  });

  test('close errors are swallowed but the callback error still propagates', async () => {
    const counter = { calls: 0, throwOn: 'close' as const };
    await assert.rejects(
      () =>
        runWithToolset(fakeToolset(counter), async () => {
          throw new Error('callback boom');
        }),
      (err: unknown) => err instanceof Error && (err as Error).message === 'callback boom',
    );
    assert.equal(counter.calls, 1);
  });
});

describe('withNitrosendTools init failure', () => {
  test('does not invoke the callback when MCP init fails', async () => {
    let calls = 0;
    const failingFetch: typeof fetch = async () => {
      throw new Error('init fail');
    };
    await assert.rejects(
      () =>
        withNitrosendTools(
          { apiKey: 'nskey_live_abc', fetch: failingFetch },
          async () => {
            calls++;
            return 'never';
          },
        ),
      (err: unknown) => err instanceof NitrosendAISDKError,
    );
    assert.equal(calls, 0);
  });
});
