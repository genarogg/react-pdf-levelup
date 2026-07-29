/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--color-primary-foreground) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        destructive: 'rgb(var(--color-destructive) / <alpha-value>)',
        // Solo pisamos estos 7 tonos de gray (300-900); el resto de la
        // paleta default de Tailwind (incluyendo gray-50/100/200/950 y
        // TODAS las demas familias: blue, purple, pink, emerald, cyan,
        // amber, fuchsia, slate, etc.) se mantiene intacta. Eso es clave:
        // code-block.tsx colorea su resaltado de sintaxis a mano con
        // text-fuchsia-400 / text-cyan-400 / text-emerald-400 / text-amber-400,
        // que son de la paleta default, no tokens custom.
        gray: {
          300: 'rgb(var(--color-gray-300) / <alpha-value>)',
          400: 'rgb(var(--color-gray-400) / <alpha-value>)',
          500: 'rgb(var(--color-gray-500) / <alpha-value>)',
          600: 'rgb(var(--color-gray-600) / <alpha-value>)',
          700: 'rgb(var(--color-gray-700) / <alpha-value>)',
          800: 'rgb(var(--color-gray-800) / <alpha-value>)',
          900: 'rgb(var(--color-gray-900) / <alpha-value>)',
        }
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
  safelist: [
    // Flexbox
    'flex', 'flex-col', 'flex-row', 'items-center', 'justify-center', 'justify-between', 'justify-around', 'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-6',
    // Sizing
    'w-full', 'h-full', 'min-h-screen', 'h-screen', 'h-[70px]', 'w-4', 'h-4', 'w-8', 'h-8', 'w-12', 'h-12',
    // Text
    'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl',
    'font-bold', 'font-semibold', 'font-medium', 'font-normal',
    'tracking-tight', 'leading-tight',
    // Colors
    'text-white', 'text-black', 'text-gray-300', 'text-gray-400', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900',
    'text-foreground', 'text-muted-foreground', 'text-primary', 'text-secondary', 'text-accent',
    'bg-black', 'bg-white', 'bg-background', 'bg-foreground', 'bg-secondary', 'bg-muted', 'bg-transparent',
    'bg-gradient-to-r', 'from-black', 'via-gray-900', 'to-black',
    'border-gray-800', 'border-gray-700', 'border-gray-600', 'border-gray-500',
    // Sintaxis coloreada a mano en code-block.tsx
    'text-fuchsia-400', 'text-cyan-400', 'text-emerald-400', 'text-amber-400',
    // Borders
    'border', 'border-b', 'border-t', 'border-l', 'border-r', 'rounded', 'rounded-lg',
    // Padding & Margin
    'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-6', 'p-8', 'px-2', 'px-3', 'px-4', 'px-6', 'py-2', 'py-3', 'py-4',
    'm-0', 'mx-auto', 'my-2', 'mb-2', 'mb-4', 'mt-2', 'mt-4',
    // Display
    'block', 'inline-block', 'inline', 'hidden', 'absolute', 'relative', 'fixed', 'sticky',
    // Positioning
    'inset-0', 'top-0', 'left-0', 'right-0', 'bottom-0',
    // Effects
    'shadow-lg', 'shadow-2xl', 'backdrop-blur-sm', 'opacity-50', 'opacity-75', 'opacity-100',
    // Responsive
    'sm:text-4xl', 'md:text-5xl', 'md:flex', 'md:hidden', 'md:block',
    // Animation
    'animate-spin', 'animate-pulse',
    // Transitions
    'transition', 'duration-200', 'transition-colors',
    // Hover/Focus
    'hover:text-white', 'hover:text-amber-300', 'focus:outline-none',
  ]
}