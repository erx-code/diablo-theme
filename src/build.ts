import { mkdir, writeFile } from 'node:fs/promises';
import { necromancerDark } from './palettes/necromancer-dark.ts';
import { necromancerLight } from './palettes/necromancer-light.ts';

// Resolve relative to this file so generation does not depend on the working directory.
const outputDirectory = new URL('../themes/', import.meta.url);
await mkdir(outputDirectory, { recursive: true });

for (const theme of [necromancerDark, necromancerLight]) {
  const filename = `${theme.name}-color-theme.json`;
  await writeFile(new URL(filename, outputDirectory), `${JSON.stringify(theme, null, 2)}\n`);
  console.log(`Generated themes/${filename}`);
}
