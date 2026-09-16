/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/**/*.liquid',
    './templates/**/*.json',
    './src/**/*.{js,css}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-body-family)', 'system-ui', 'sans-serif'],
        'body': ['var(--font-body-family)', 'system-ui', 'sans-serif'],
        'heading': ['var(--font-heading-family)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}