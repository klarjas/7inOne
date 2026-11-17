import fs from 'node:fs/promises';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss-v3';
import config from '../tailwind.config.js';

const input = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;
const output = 'frontend/public/marketplace/tailwind.css';
const result = await postcss([tailwindcss(config)]).process(input, { from: 'tailwind.input.css', to: output });
await fs.writeFile(output, result.css, 'utf8');
console.log('Built ' + output);
