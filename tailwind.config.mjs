/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    // Единая сетка контейнера
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        md: '2rem',
        lg: '2.5rem',
      },
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        // rgb(var(--x-rgb) / <alpha-value>) — чтобы работали модификаторы прозрачности
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        green: {
          DEFAULT: 'rgb(var(--green-rgb) / <alpha-value>)',
          2: 'rgb(var(--green-2-rgb) / <alpha-value>)',
        },
        bronze: 'rgb(var(--bronze-rgb) / <alpha-value>)',
        ivory: {
          DEFAULT: 'rgb(var(--ivory-rgb) / <alpha-value>)',
          2: 'rgb(var(--ivory-2-rgb) / <alpha-value>)',
        },
        paper: 'rgb(var(--paper-rgb) / <alpha-value>)',
        line: 'rgb(var(--line-rgb) / <alpha-value>)',
        muted: 'rgb(var(--muted-rgb) / <alpha-value>)',
      },
      fontFamily: {
        // Заголовки — Cormorant Garamond; интерфейс/текст — Manrope
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      fontSize: {
        // Адаптивная типографика через clamp()
        h1: ['clamp(2rem, 1.2rem + 3.4vw, 3rem)', { lineHeight: '1.08', fontWeight: '600' }],
        h2: ['clamp(1.65rem, 1.15rem + 2.1vw, 2.125rem)', { lineHeight: '1.15', fontWeight: '600' }],
        h3: ['clamp(1.25rem, 1.05rem + 0.9vw, 1.375rem)', { lineHeight: '1.25', fontWeight: '600' }],
        lead: ['clamp(1.05rem, 1rem + 0.35vw, 1.25rem)', { lineHeight: '1.55' }],
      },
      borderRadius: {
        // Премиальные минимальные радиусы
        card: '6px',
        btn: '4px',
        xs: '2px',
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        header: '0 1px 0 var(--line), 0 8px 30px -18px rgba(28,27,25,0.28)',
        card: '0 1px 2px rgba(28,27,25,0.04), 0 12px 30px -24px rgba(28,27,25,0.35)',
        float: '0 10px 30px -10px rgba(28,27,25,0.45)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
