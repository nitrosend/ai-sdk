#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifestPath = resolve(__dirname, '..', '..', 'docs', 'nitrosend.mcp.json');
const generatedPath = resolve(__dirname, '..', 'src', 'schemas.generated.ts');

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const expected = new Set(manifest.tools.map(t => t.name));

const source = readFileSync(generatedPath, 'utf8');
const block = source.match(/export const nitrosendToolSchemas = \{([\s\S]*?)\n\} as const;/);
if (!block) {
  console.error(`fail: could not locate nitrosendToolSchemas block in ${generatedPath}`);
  process.exit(1);
}
const found = new Set(
  [...block[1].matchAll(/^\s{2}([A-Za-z_][A-Za-z0-9_]*)\s*:/gm)].map(m => m[1]),
);

const missing = [...expected].filter(name => !found.has(name));
const extra = [...found].filter(name => !expected.has(name));

if (missing.length || extra.length) {
  if (missing.length) console.error(`missing schemas: ${missing.join(', ')}`);
  if (extra.length) console.error(`unexpected schemas: ${extra.join(', ')}`);
  process.exit(1);
}

console.log(`ok: ${found.size} schemas match manifest tool count`);
