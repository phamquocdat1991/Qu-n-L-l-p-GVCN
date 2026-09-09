import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(projectRoot, 'dist');

await rm(outputDir, { recursive: true, force: true });
await mkdir(join(outputDir, 'assets'), { recursive: true });
await copyFile(join(projectRoot, 'index.html'), join(outputDir, 'index.html'));
await copyFile(join(projectRoot, 'metadata.json'), join(outputDir, 'metadata.json'));
await copyFile(join(projectRoot, 'assets/dream-school.css'), join(outputDir, 'assets/dream-school.css'));

console.log('Prepared production files in dist/.');
