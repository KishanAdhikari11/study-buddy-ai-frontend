// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Consider a sleek sans-serif font like 'Outfit', 'Inter', or 'DM Sans'
        // Make sure to import it in your global CSS or Next.js layout if not already.
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        // A more refined, softer palette
        primary: {
          50: '#FDF2F8', // Lightest blush
          100: '#FCE7F3',
          200: '#FBCFEA',
          300: '#F9A8D4',
          400: '#F472B6', // Main accent pink
          500: '#EC4899', // Deeper pink
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        },
        secondary: {
          50: '#F0F9FF', // Lightest blue
          100: '#E0F2FE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA', // Main accent blue
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Neutral palette for backgrounds, text, borders
        // Aim for soft off-whites/grays for light mode, deep charcoals for dark mode
        gray: {
          50: '#F9FAFB', // Light backgrounds
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937', // Dark backgrounds
          900: '#111827', // Darkest backgrounds
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        // For new card appearing
        cardEnter: {
          '0%': { transform: 'translateY(20px) scale(0.9)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        // For card exiting (when navigating between cards)
        cardExit: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-20px) scale(0.9)', opacity: '0' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideIn: 'slideIn 0.5s ease-out forwards',
        cardEnter: 'cardEnter 0.4s ease-out forwards',
        cardExit: 'cardExit 0.3s ease-in forwards',
        popIn: 'popIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};