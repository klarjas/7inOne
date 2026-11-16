/** Tailwind v3 build for the static 7inOne marketplace. */
export default {
  content: [
    './frontend/public/marketplace/index.html',
    './frontend/public/marketplace/app.js',
  ],
  safelist: [
    { pattern: /^(bg|text|border|ring|from|to|via)-(emerald|amber)-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^(hover|focus|active|disabled):(bg|text|border|ring)-(emerald|amber)-(50|100|200|300|400|500|600|700|800|900)$/ },
    { pattern: /^(bg|text|border)-(slate|gray|white|black)-(50|100|200|300|400|500|600|700|800|900)$/ },
  ],
  theme: {
    extend: {
      fontFamily: { khmer: ['Kantumruy Pro', 'sans-serif'] },
      colors: { brand: '#064E3B' },
    },
  },
  plugins: [],
};
