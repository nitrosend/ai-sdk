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
  type CampaignInput = NitrosendToolInput<'nitro_compose_campaign'>;
  // Compile-time: parsing a valid payload yields the expected fields.
  const parsed: CampaignInput = nitrosendToolSchemas.nitro_compose_campaign.parse({
    channel: 'email',
    subject: 'Hi',
  });
  assert.equal(parsed.channel, 'email');
  assert.equal(parsed.subject, 'Hi');
});

test('control delivery keeps the reviewed-brand assertion optional and strict', () => {
  const schema = nitrosendToolSchemas.nitro_control_delivery;
  const base = {
    target_type: 'flow' as const,
    target_id: 7,
    operation: 'approve' as const,
  };

  const withoutAssertions: NitrosendToolInput<'nitro_control_delivery'> = schema.parse(base);
  assert.equal(withoutAssertions.expected_brand_sid, undefined);
  // Flow omission derives the current draft; presence asserts that draft is still current.
  assert.equal(withoutAssertions.revision_id, undefined);

  const withAssertions: NitrosendToolInput<'nitro_control_delivery'> = schema.parse({
    ...base,
    expected_brand_sid: 'brand-acme',
    revision_id: 42,
  });
  const revisionId: number | undefined = withAssertions.revision_id;
  assert.equal(withAssertions.expected_brand_sid, 'brand-acme');
  assert.equal(revisionId, 42);

  assert.throws(() => schema.parse({ ...base, expected_brand_sid: '' }));
  assert.throws(() => schema.parse({ ...base, unexpected: true }));
  assert.throws(() => schema.parse({ target_id: 7, operation: 'approve' }));
  assert.throws(() => schema.parse({ target_type: 'campaign', operation: 'approve' }));
  assert.throws(() => schema.parse({ target_type: 'campaign', target_id: 7 }));
});

test('NarrowedNitrosendTools restricts keys to the requested subset', () => {
  type Subset = NarrowedNitrosendTools<['nitro_get_status', 'nitro_compose_campaign']>;
  // @ts-expect-error — nitro_compose_flow not in the subset
  const _missing: Subset = { nitro_compose_flow: undefined } as never;
  // Sanity that accepted keys compile.
  const accepted: Pick<Subset, 'nitro_get_status' | 'nitro_compose_campaign'> = {
    nitro_get_status: undefined as never,
    nitro_compose_campaign: undefined as never,
  };
  assert.ok(accepted);
});

test('pickNitrosendToolSchemas returns the inputSchema-shaped record', () => {
  const picked = pickNitrosendToolSchemas('nitro_get_status', 'nitro_compose_campaign');
  assert.ok(picked.nitro_get_status.inputSchema instanceof z.ZodObject);
  assert.ok(picked.nitro_compose_campaign.inputSchema instanceof z.ZodObject);
  // Subset should not include unrequested tools.
  assert.equal(
    Object.keys(picked).sort().join(','),
    ['nitro_get_status', 'nitro_compose_campaign'].sort().join(','),
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
