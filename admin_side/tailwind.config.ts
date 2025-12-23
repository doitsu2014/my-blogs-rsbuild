import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography'),
  ],
  daisyui: {
    themes: ['abyss'], // Using DaisyUI's abyss theme
    darkTheme: 'abyss', // Set abyss as the dark theme
  },
};

export default config;
