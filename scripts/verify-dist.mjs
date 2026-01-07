import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const required = [
  '.well-known/apple-app-site-association',
  'apple-app-site-association',
  'join/index.html',
  'qr/index.html',
];

const missing = [];
const invalid = [];

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

try {
  const joinHtml = await readFile(join(dist, 'join/index.html'), 'utf8');
  if (!joinHtml.includes('appclip.apple.com')) {
    invalid.push('join/index.html missing appclip.apple.com');
  }
  if (!joinHtml.includes('window.location.search')) {
    invalid.push('join/index.html missing query preservation logic');
  }
} catch {
  invalid.push('join/index.html could not be inspected');
}

if (invalid.length) {
  console.error('Invalid build artifacts:');
  for (const entry of invalid) console.error(`- ${entry}`);
  process.exit(1);
}

console.log('dist verification ok');
