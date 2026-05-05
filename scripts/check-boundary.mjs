#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcRoot = join(__dirname, '..', 'src');

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (path.endsWith('.ts') && !path.endsWith('.test.ts')) yield path;
  }
}

let bad = 0;
for (const file of walk(srcRoot)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    const lineNo = i + 1;
    if (/\bfetch\(/.test(line)) {
      console.error(`${file}:${lineNo}: direct fetch() call`);
      bad++;
    }
    if (/\/v1\/my/.test(line)) {
      console.error(`${file}:${lineNo}: REST endpoint /v1/my reference`);
      bad++;
    }
    for (const match of line.matchAll(/api\.nitrosend\.com\/[A-Za-z0-9_./-]+/g)) {
      if (!match[0].startsWith('api.nitrosend.com/mcp')) {
        console.error(`${file}:${lineNo}: non-MCP nitrosend URL: ${match[0]}`);
        bad++;
      }
    }
  });
}

if (bad > 0) {
  console.error(`boundary check failed: ${bad} violation(s)`);
  process.exit(1);
}
console.log('boundary ok: no direct REST endpoint usage in ai-sdk/src');
