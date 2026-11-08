#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifestPath = resolve(__dirname, '..', '..', 'docs', 'nitrosend.mcp.json');
const outPath = resolve(__dirname, '..', 'src', 'schemas.generated.ts');

const KNOWN_KEYWORDS = new Set([
  '$schema',
  'type', 'properties', 'required', 'items', 'enum',
  'description', 'default', 'format', 'minimum', 'maximum',
  'minItems', 'maxItems', 'minLength', 'maxLength', 'pattern', 'maxProperties',
  'uniqueItems', 'additionalProperties', 'title', 'examples',
  '$defs', '$ref', 'oneOf'
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

function schemaToTypeScript(schema, refs = new Map()) {
  if (!schema || typeof schema !== 'object') {
    throw new Error(`Invalid schema fragment: ${JSON.stringify(schema)}`);
  }
  // A type union ({ type: ["string", "array"] }) is a oneOf of single types.
  if (Array.isArray(schema.type)) {
    const { type, ...rest } = schema;
    return schemaToTypeScript({ oneOf: type.map(single => ({ ...rest, type: single })) }, refs);
  }
  assertKnown(schema);

  if (typeof schema.$ref === 'string') {
    const ref = refs.get(schema.$ref);
    if (!ref) {
      throw new Error(`Unsupported or unresolved JSON Schema ref: ${schema.$ref}`);
    }
    return ref;
  }
  if (Array.isArray(schema.oneOf)) {
    if (schema.oneOf.length === 0) {
      throw new Error('oneOf cannot be empty');
    }
    return schema.oneOf
      .map(option => schemaToTypeScript(option, refs))
      .join(' |\n');
  }
  if (Array.isArray(schema.enum)) {
    if (schema.enum.length === 0) {
      throw new Error('enum cannot be empty');
    }
    return schema.enum.map(value => JSON.stringify(value)).join(' | ');
  }
  if (schema.type === 'string') return 'string';
  if (schema.type === 'integer' || schema.type === 'number') return 'number';
  if (schema.type === 'boolean') return 'boolean';
  if (schema.type === 'array') {
    if (!schema.items) throw new Error('array schema missing items');
    return `Array<${indent(schemaToTypeScript(schema.items, refs), 2)}>`;
  }
  if (schema.type === 'object' || (!schema.type && schema.properties)) {
    const properties = Object.entries(schema.properties ?? {});
    if (properties.length === 0) {
      return schema.additionalProperties === false
        ? 'Record<string, never>'
        : 'Record<string, unknown>';
    }

    const required = new Set(schema.required ?? []);
    const lines = properties.map(([key, value]) => {
      const hasDefault = value && Object.prototype.hasOwnProperty.call(value, 'default');
      const optional = required.has(key) || hasDefault ? '' : '?';
      const type = schemaToTypeScript(value, refs);
      return `  ${escapeKey(key)}${optional}: ${indent(type, 2)};`;
    });
    if (schema.additionalProperties !== false) {
      lines.push('  [key: string]: unknown;');
    }
    return `{\n${lines.join('\n')}\n}`;
  }
  if (!schema.type) return 'unknown';

  throw new Error(`Unsupported schema: ${JSON.stringify(schema.type)} in ${JSON.stringify(schema)}`);
}

function schemaToZod(schema, refs = new Map()) {
  if (!schema || typeof schema !== 'object') {
    throw new Error(`Invalid schema fragment: ${JSON.stringify(schema)}`);
  }
  // A type union ({ type: ["string", "array"] }) is a oneOf of single types.
  if (Array.isArray(schema.type)) {
    const { type, ...rest } = schema;
    return schemaToZod({ oneOf: type.map(single => ({ ...rest, type: single })) }, refs);
  }
  assertKnown(schema);

  let expr;
  if (typeof schema.$ref === 'string') {
    const ref = refs.get(schema.$ref);
    if (!ref) {
      throw new Error(`Unsupported or unresolved JSON Schema ref: ${schema.$ref}`);
    }
    expr = ref;
  } else if (Array.isArray(schema.oneOf)) {
    if (schema.oneOf.length === 0) {
      throw new Error('oneOf cannot be empty');
    }
    const options = schema.oneOf.map(option => schemaToZod(option, refs));
    expr = options.length === 1
      ? options[0]
      : `z.union([\n${options.map(option => `  ${indent(option, 2)}`).join(',\n')}\n])`;
  } else if (Array.isArray(schema.enum)) {
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
    if (typeof schema.pattern === 'string') expr += `.regex(new RegExp(${JSON.stringify(schema.pattern)}))`;
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
    expr = `z.array(${schemaToZod(schema.items, refs)})`;
    if (typeof schema.minItems === 'number') expr += `.min(${schema.minItems})`;
    if (typeof schema.maxItems === 'number') expr += `.max(${schema.maxItems})`;
    if (schema.uniqueItems === true) {
      if (!['string', 'integer', 'number', 'boolean'].includes(schema.items.type)) {
        throw new Error('uniqueItems is supported only for primitive array items');
      }
      expr += '.refine(values => new Set(values).size === values.length, { message: "Array items must be unique" })';
    }
  } else if (schema.type === 'object' || (!schema.type && schema.properties)) {
    const props = schema.properties ?? {};
    const required = new Set(schema.required ?? []);
    const entries = Object.entries(props);
    if (entries.length === 0) {
      expr = 'z.object({})';
    } else {
      const lines = entries.map(([key, value]) => {
        const inner = schemaToZod(value, refs);
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
    if (typeof schema.maxProperties === 'number') {
      expr += `.refine(value => Object.keys(value).length <= ${schema.maxProperties}, { message: "At most ${schema.maxProperties} properties" })`;
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

function definitionName(toolName, definitionName) {
  const words = `${toolName}_${definitionName}`.split(/[^A-Za-z0-9]+/).filter(Boolean);
  const identifier = words.map(word => word[0].toUpperCase() + word.slice(1)).join('');
  return `${identifier}Schema`;
}

function definitionTypeName(toolName, name) {
  return definitionName(toolName, name).replace(/Schema$/, '');
}

function definitionRefs(tool) {
  return new Map(
    Object.keys(tool.inputSchema?.$defs ?? {}).map(name => [
      `#/$defs/${name}`,
      definitionName(tool.name, name),
    ]),
  );
}

function definitionTypeRefs(tool) {
  return new Map(
    Object.keys(tool.inputSchema?.$defs ?? {}).map(name => [
      `#/$defs/${name}`,
      definitionTypeName(tool.name, name),
    ]),
  );
}

export function generateSchemas({
  manifestPath: sourcePath = manifestPath,
  outPath: destinationPath = outPath,
} = {}) {
  const manifest = JSON.parse(readFileSync(sourcePath, 'utf8'));
  if (!manifest || !Array.isArray(manifest.tools)) {
    throw new Error(`Invalid manifest at ${sourcePath}: expected tools[]`);
  }
  const tools = [...manifest.tools].sort((a, b) => a.name.localeCompare(b.name));
  const hasDefinitions = tools.some(
    tool => Object.keys(tool.inputSchema?.$defs ?? {}).length > 0,
  );

  const lines = [];
  lines.push('// AUTO-GENERATED. Do not edit by hand.');
  lines.push('// Source: docs/nitrosend.mcp.json');
  lines.push('// Regenerate with: npm run generate:schemas');
  lines.push('');
  lines.push("import { z } from 'zod';");
  lines.push('');
  for (const tool of tools) {
    const definitions = tool.inputSchema?.$defs ?? {};
    const refs = definitionTypeRefs(tool);
    for (const [name, definition] of Object.entries(definitions)) {
      const identifier = refs.get(`#/$defs/${name}`);
      const type = schemaToTypeScript(definition, refs);
      lines.push(`type ${identifier} = ${indent(type, 2)};`);
    }
  }
  if (hasDefinitions) {
    lines.push('');
  }
  for (const tool of tools) {
    const definitions = tool.inputSchema?.$defs ?? {};
    const refs = definitionRefs(tool);
    const typeRefs = definitionTypeRefs(tool);
    for (const [name, definition] of Object.entries(definitions)) {
      const identifier = refs.get(`#/$defs/${name}`);
      const typeIdentifier = typeRefs.get(`#/$defs/${name}`);
      const zod = schemaToZod(definition, refs);
      lines.push(`const ${identifier}: z.ZodType<${typeIdentifier}> = z.lazy(() => ${indent(zod, 2)});`);
    }
  }
  if (hasDefinitions) {
    lines.push('');
  }
  lines.push('export const nitrosendToolSchemas = {');
  for (const tool of tools) {
    const zod = schemaToZod(tool.inputSchema, definitionRefs(tool));
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

  writeFileSync(destinationPath, lines.join('\n'));
  console.log(`Wrote ${tools.length} schemas to ${destinationPath}`);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : undefined;
if (invokedPath === fileURLToPath(import.meta.url)) {
  generateSchemas();
}
