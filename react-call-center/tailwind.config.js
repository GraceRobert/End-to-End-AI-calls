/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ─── Imla2.0 Editorial Color Palette ─────────────────────────────
      colors: {
        // Burnt Terracotta — primary brand / CTA accent
        primary: {
          50: "#fdf8f4",
          100: "#fbeadc",
          400: "#e58a4d",
          500: "#cc6622",
          600: "#a54f15",
          700: "#843c10",
          800: "#5c2a0b",
        },
        // Jet Black / Near-White — text & structural elements
        secondary: {
          50:  "#fcfcfc",
          800: "#1a1b1e",
          900: "#111111",
        },
        // Earthy backgrounds
        bg: {
          sand:  "#f4f1ed",
          paper: "#ffffff",
        },
        // Keep a full gray scale for utility classes
        gray: {
          50:  "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },

      // ─── Imla2.0 Editorial Typefaces ─────────────────────────────────
      fontFamily: {
        display: ["Syne", "sans-serif"],   // headings / brand wordmarks
        sans:    ["DM Sans", "sans-serif"], // body copy / UI text
      },

      // ─── Brutalist offset-shadow utilities ───────────────────────────
      boxShadow: {
        "brutalist-sm": "2px 2px 0px #111111",
        "brutalist":    "4px 4px 0px #111111",
        "brutalist-lg": "6px 6px 0px #111111",
        "brutalist-accent": "4px 4px 0px #cc6622",
      },
    },
  },
  plugins: [],
}
