import { access } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const required = [
  '.well-known/apple-app-site-association',
  'apple-app-site-association',
  'join/index.html',
  'qr/index.html',
];

const missing = [];

for (const file of required) {
  try {
    await access(join(dist, file));
  } catch {
    missing.push(file);
  }
}

if (missing.length) {
  console.error('Missing required build artifacts:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log('dist verification ok');
