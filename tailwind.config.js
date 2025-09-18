/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1f2937',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f3f4f6',
          foreground: '#1f2937',
        },
        background: '#ffffff',
        foreground: '#1f2937',
        muted: {
          DEFAULT: '#f3f4f6',
          foreground: '#6b7280',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#1f2937',
        },
        border: '#e5e7eb',
        input: '#f9fafb',
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}