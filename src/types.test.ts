import { test } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import {
  nitrosendToolSchemas,
  pickNitrosendToolSchemas,
  type NarrowedNitrosendTools,
  type NitrosendToolInput,
} from './index.js';

test('NitrosendToolInput exposes per-tool input shape', () => {
  type SendInput = NitrosendToolInput<'nitro_send_message'>;
  // Compile-time: parsing a valid payload yields the expected fields.
  const parsed: SendInput = nitrosendToolSchemas.nitro_send_message.parse({
    channel: 'email',
    to: 'a@b.com',
    subject: 'Hi',
  });
  assert.equal(parsed.channel, 'email');
  assert.equal(parsed.to, 'a@b.com');
});

test('NarrowedNitrosendTools restricts keys to the requested subset', () => {
  type Subset = NarrowedNitrosendTools<['nitro_get_status', 'nitro_send_message']>;
  // @ts-expect-error — nitro_compose_flow not in the subset
  const _missing: Subset = { nitro_compose_flow: undefined } as never;
  // Sanity that accepted keys compile.
  const accepted: Pick<Subset, 'nitro_get_status' | 'nitro_send_message'> = {
    nitro_get_status: undefined as never,
    nitro_send_message: undefined as never,
  };
  assert.ok(accepted);
});

test('pickNitrosendToolSchemas returns the inputSchema-shaped record', () => {
  const picked = pickNitrosendToolSchemas('nitro_get_status', 'nitro_send_message');
  assert.ok(picked.nitro_get_status.inputSchema instanceof z.ZodObject);
  assert.ok(picked.nitro_send_message.inputSchema instanceof z.ZodObject);
  // Subset should not include unrequested tools.
  assert.equal(
    Object.keys(picked).sort().join(','),
    ['nitro_get_status', 'nitro_send_message'].sort().join(','),
  );
});

test('Zod default lands on the parsed value when input omits the field', () => {
  // Regression for the .default(...).optional() bug — defaults must apply.
  const parsed = nitrosendToolSchemas.nitro_compose_flow.parse({
    name: 'Welcome',
    trigger: { event: 'contact_add' },
    steps: [],
  });
  assert.equal(parsed.mode, 'create');
});
