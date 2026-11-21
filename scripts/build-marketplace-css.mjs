import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss-v3';
import config from '../tailwind.config.js';

const input = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
const output = fileURLToPath(new URL('../frontend/public/marketplace/tailwind.css', import.meta.url));
const result = await postcss([tailwindcss(config)]).process(input, { from: 'tailwind.input.css', to: output });
await fs.writeFile(output, result.css, 'utf8');
console.log('Built ' + output);
