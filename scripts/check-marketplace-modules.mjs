import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';

const root = fileURLToPath(new URL('../frontend/public/marketplace/src/', import.meta.url));
const jsDir = path.join(root, 'js');
const cssDir = path.join(root, 'css');

const jsFiles = (await fs.readdir(jsDir)).filter(file => file.endsWith('.js')).sort();
const cssFiles = (await fs.readdir(cssDir)).filter(file => file.endsWith('.css')).sort();

for (const file of jsFiles) {
  const source = await fs.readFile(path.join(jsDir, file), 'utf8');
  new vm.Script(source, { filename: file });
  console.log('JS syntax OK: ' + file);
}

for (const file of cssFiles) {
  const source = await fs.readFile(path.join(cssDir, file), 'utf8');
  postcss.parse(source, { from: file });
  console.log('CSS syntax OK: ' + file);
}

console.log('Validated ' + jsFiles.length + ' JavaScript modules and ' + cssFiles.length + ' CSS modules.');
