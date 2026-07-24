/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "rgb(var(--clr-navy-50) / <alpha-value>)",
          100: "rgb(var(--clr-navy-100) / <alpha-value>)",
          200: "rgb(var(--clr-navy-200) / <alpha-value>)",
          300: "rgb(var(--clr-navy-300) / <alpha-value>)",
          400: "rgb(var(--clr-navy-400) / <alpha-value>)",
          500: "rgb(var(--clr-navy-500) / <alpha-value>)",
          600: "rgb(var(--clr-navy-600) / <alpha-value>)",
          700: "rgb(var(--clr-navy-700) / <alpha-value>)",
          800: "rgb(var(--clr-navy-800) / <alpha-value>)",
          900: "rgb(var(--clr-navy-900) / <alpha-value>)",
          950: "rgb(var(--clr-navy-950) / <alpha-value>)",
        },
        brand: {
          50: "rgb(var(--clr-brand-50) / <alpha-value>)",
          100: "rgb(var(--clr-brand-100) / <alpha-value>)",
          200: "rgb(var(--clr-brand-200) / <alpha-value>)",
          300: "rgb(var(--clr-brand-300) / <alpha-value>)",
          400: "rgb(var(--clr-brand-400) / <alpha-value>)",
          500: "rgb(var(--clr-brand-500) / <alpha-value>)",
          600: "rgb(var(--clr-brand-600) / <alpha-value>)",
          700: "rgb(var(--clr-brand-700) / <alpha-value>)",
          800: "rgb(var(--clr-brand-800) / <alpha-value>)",
          900: "rgb(var(--clr-brand-900) / <alpha-value>)",
        },
        accent: {
          50: "rgb(var(--clr-accent-50) / <alpha-value>)",
          100: "rgb(var(--clr-accent-100) / <alpha-value>)",
          200: "rgb(var(--clr-accent-200) / <alpha-value>)",
          300: "rgb(var(--clr-accent-300) / <alpha-value>)",
          400: "rgb(var(--clr-accent-400) / <alpha-value>)",
          500: "rgb(var(--clr-accent-500) / <alpha-value>)",
          600: "rgb(var(--clr-accent-600) / <alpha-value>)",
          700: "rgb(var(--clr-accent-700) / <alpha-value>)",
          800: "rgb(var(--clr-accent-800) / <alpha-value>)",
          900: "rgb(var(--clr-accent-900) / <alpha-value>)",
        },
        surface: {
          50: "rgb(var(--clr-surface-50) / <alpha-value>)",
          100: "rgb(var(--clr-surface-100) / <alpha-value>)",
          200: "rgb(var(--clr-surface-200) / <alpha-value>)",
          300: "rgb(var(--clr-surface-300) / <alpha-value>)",
          400: "rgb(var(--clr-surface-400) / <alpha-value>)",
          500: "rgb(var(--clr-surface-500) / <alpha-value>)",
          600: "rgb(var(--clr-surface-600) / <alpha-value>)",
          700: "rgb(var(--clr-surface-700) / <alpha-value>)",
          800: "rgb(var(--clr-surface-800) / <alpha-value>)",
          900: "rgb(var(--clr-surface-900) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.35s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "bounce-dot": "bounceDot 1.4s infinite ease-in-out both",
        "shimmer": "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(124, 58, 237, 0.3)" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(124, 58, 237, 0.15)",
        "glow": "0 0 30px rgba(124, 58, 237, 0.2)",
        "glow-lg": "0 0 50px rgba(124, 58, 237, 0.25)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
