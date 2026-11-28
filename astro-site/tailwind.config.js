import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          maroon: '#800038',
          hover: '#9c0c4a',
          light: '#fdf2f4',
          border: '#fce7f3',
          black: '#111111',
        },
        accent: {
          blue: '#1a73e8',
          light: '#eff6ff',
        },
        page: { bg: '#f4f6f9' },
        card: { bg: '#ffffff' },
        border: { subtle: '#e5e9f0' },
        text: { main: '#1f2937', muted: '#64748b' },
        success: { green: '#16a34a' },
      },
      fontFamily: {
        sans: ['Times New Roman', 'Times', 'SolaimanLipi', 'Noto Sans Bengali', 'Anek Bangla', 'Hind Siliguri', 'serif'],
        inter: ['Times New Roman', 'Times', 'SolaimanLipi', 'Noto Sans Bengali', 'Anek Bangla', 'Hind Siliguri', 'serif'],
        serif: ['Times New Roman', 'Times', 'SolaimanLipi', 'serif'],
        bengali: ['SolaimanLipi', 'Noto Sans Bengali', 'Anek Bangla', 'Hind Siliguri', 'system-ui', 'sans-serif'],
        solaiman: ['SolaimanLipi', 'Noto Sans Bengali', 'Anek Bangla', 'Hind Siliguri', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
    },
  },
  plugins: [forms],
};
