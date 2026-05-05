#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifestPath = resolve(__dirname, '..', '..', 'docs', 'nitrosend.mcp.json');
const outPath = resolve(__dirname, '..', 'src', 'schemas.generated.ts');

const KNOWN_KEYWORDS = new Set([
  'type', 'properties', 'required', 'items', 'enum',
  'description', 'default', 'format', 'minimum', 'maximum',
  'minItems', 'maxItems', 'minLength', 'maxLength',
  'additionalProperties', 'title', 'examples'
]);

function assertKnown(schema) {
  const unknown = Object.keys(schema).filter(k => !KNOWN_KEYWORDS.has(k));
  if (unknown.length) {
    throw new Error(`Unknown JSON Schema keyword(s): ${unknown.join(', ')}`);
  }
}

function escapeKey(key) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
}

function indent(source, spaces) {
  const pad = ' '.repeat(spaces);
  return source.split('\n').map((line, i) => i === 0 ? line : pad + line).join('\n');
}

function schemaToZod(schema) {
  if (!schema || typeof schema !== 'object') {
    throw new Error(`Invalid schema fragment: ${JSON.stringify(schema)}`);
  }
  assertKnown(schema);

  let expr;
  if (Array.isArray(schema.enum)) {
    if (schema.enum.length === 0) {
      throw new Error('enum cannot be empty');
    }
    if (schema.enum.length === 1) {
      expr = `z.literal(${JSON.stringify(schema.enum[0])})`;
    } else if (schema.enum.every(v => typeof v === 'string')) {
      expr = `z.enum([${schema.enum.map(v => JSON.stringify(v)).join(', ')}])`;
    } else {
      const literals = schema.enum.map(v => `z.literal(${JSON.stringify(v)})`).join(', ');
      expr = `z.union([${literals}])`;
    }
  } else if (schema.type === 'string') {
    if (schema.format === 'email') expr = 'z.email()';
    else if (schema.format === 'url' || schema.format === 'uri') expr = 'z.url()';
    else if (schema.format === 'uuid') expr = 'z.uuid()';
    else if (schema.format === 'date-time') expr = 'z.iso.datetime()';
    else if (schema.format === 'date') expr = 'z.iso.date()';
    else expr = 'z.string()';
    if (typeof schema.minLength === 'number') expr += `.min(${schema.minLength})`;
    if (typeof schema.maxLength === 'number') expr += `.max(${schema.maxLength})`;
  } else if (schema.type === 'integer') {
    expr = 'z.number().int()';
    if (typeof schema.minimum === 'number') expr += `.gte(${schema.minimum})`;
    if (typeof schema.maximum === 'number') expr += `.lte(${schema.maximum})`;
  } else if (schema.type === 'number') {
    expr = 'z.number()';
    if (typeof schema.minimum === 'number') expr += `.gte(${schema.minimum})`;
    if (typeof schema.maximum === 'number') expr += `.lte(${schema.maximum})`;
  } else if (schema.type === 'boolean') {
    expr = 'z.boolean()';
  } else if (schema.type === 'array') {
    if (!schema.items) throw new Error('array schema missing items');
    expr = `z.array(${schemaToZod(schema.items)})`;
    if (typeof schema.minItems === 'number') expr += `.min(${schema.minItems})`;
    if (typeof schema.maxItems === 'number') expr += `.max(${schema.maxItems})`;
  } else if (schema.type === 'object' || (!schema.type && schema.properties)) {
    const props = schema.properties ?? {};
    const required = new Set(schema.required ?? []);
    const entries = Object.entries(props);
    if (entries.length === 0) {
      expr = 'z.object({})';
    } else {
      const lines = entries.map(([key, value]) => {
        const inner = schemaToZod(value);
        const desc = typeof value?.description === 'string'
          ? `.describe(${JSON.stringify(value.description)})`
          : '';
        // `.default()` already implies the field can be omitted (Zod fills
        // it with the default). Adding `.optional()` after `.default()`
        // creates ZodOptional<ZodDefault<...>>, which short-circuits on
        // undefined and never applies the default — silently dropping
        // every manifest default. Only emit `.optional()` when there is
        // no default to preserve.
        const hasDefault = value && Object.prototype.hasOwnProperty.call(value, 'default');
        const optional = required.has(key) || hasDefault ? '' : '.optional()';
        return `  ${escapeKey(key)}: ${indent(inner, 2)}${desc}${optional}`;
      });
      expr = `z.object({\n${lines.join(',\n')}\n})`;
    }
    if (schema.additionalProperties === false) {
      expr = `${expr}.strict()`;
    } else {
      // JSON Schema default for additionalProperties is true. Without
      // .passthrough(), Zod silently strips unknown keys — that would
      // drop payload fields on tools where the manifest intentionally
      // declares an open-ended object (e.g. webhook headers, event_data).
      expr = `${expr}.passthrough()`;
    }
  } else if (!schema.type) {
    expr = 'z.unknown()';
  } else {
    throw new Error(`Unsupported schema: ${JSON.stringify(schema.type)} in ${JSON.stringify(schema)}`);
  }

  if (schema.default !== undefined) {
    expr = `${expr}.default(${JSON.stringify(schema.default)})`;
  }
  return expr;
}

function main() {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (!manifest || !Array.isArray(manifest.tools)) {
    throw new Error(`Invalid manifest at ${manifestPath}: expected tools[]`);
  }
  const tools = [...manifest.tools].sort((a, b) => a.name.localeCompare(b.name));

  const lines = [];
  lines.push('// AUTO-GENERATED. Do not edit by hand.');
  lines.push('// Source: docs/nitrosend.mcp.json');
  lines.push('// Regenerate with: npm run generate:schemas');
  lines.push('');
  lines.push("import { z } from 'zod';");
  lines.push('');
  lines.push('export const nitrosendToolSchemas = {');
  for (const tool of tools) {
    const zod = schemaToZod(tool.inputSchema);
    lines.push(`  ${escapeKey(tool.name)}: ${indent(zod, 2)},`);
  }
  lines.push('} as const;');
  lines.push('');
  lines.push('export type NitrosendToolName = keyof typeof nitrosendToolSchemas;');
  lines.push('');
  lines.push('export const nitrosendToolNames: readonly NitrosendToolName[] = Object.freeze(');
  lines.push('  Object.keys(nitrosendToolSchemas) as NitrosendToolName[],');
  lines.push(');');
  lines.push('');
  lines.push('export type NitrosendToolSchemaMap<T extends readonly NitrosendToolName[]> = {');
  lines.push('  [K in T[number]]: { inputSchema: (typeof nitrosendToolSchemas)[K] };');
  lines.push('};');
  lines.push('');
  lines.push('export function pickNitrosendToolSchemas<const T extends readonly NitrosendToolName[]>(');
  lines.push('  ...names: T');
  lines.push('): NitrosendToolSchemaMap<T> {');
  lines.push('  const out: Record<string, { inputSchema: unknown }> = {};');
  lines.push('  for (const name of names) {');
  lines.push('    out[name] = { inputSchema: nitrosendToolSchemas[name] };');
  lines.push('  }');
  lines.push('  return out as NitrosendToolSchemaMap<T>;');
  lines.push('}');
  lines.push('');

  writeFileSync(outPath, lines.join('\n'));
  console.log(`Wrote ${tools.length} schemas to ${outPath}`);
}

main();
