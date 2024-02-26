import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: '#fff',
        secudary: '#000',
        '3d3d3d': '#3d3d3d',
        ffffff1F: '#ffffff1F',
        ffffff99: '#ffffff99',
        '555555': '#555555',
        bbbbbb: '#bbbbbb',
        '00000025': '#00000025',
        '00000099': '#00000099',
        '2f2e2e': '#2f2e2e',
        '0000001F': '#0000001F',
        efefef: '#efefef',
        '0006': '#0006',
      },
    },
  },
  plugins: [],
};
export default config;
