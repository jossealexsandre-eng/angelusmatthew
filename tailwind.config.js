/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border, rgba(201, 173, 127, 0.28))",
        input: "var(--input, rgba(201, 173, 127, 0.28))",
        ring: "var(--ring, #c9ad7f)",
        background: "var(--background, #2e0a0d)",
        foreground: "var(--foreground, #f3eadb)",
        primary: {
          DEFAULT: "var(--primary, #c9ad7f)",
          foreground: "var(--primary-foreground, #2e0a0d)",
        },
        secondary: {
          DEFAULT: "var(--secondary, #3d0f14)",
          foreground: "var(--secondary-foreground, #f3eadb)",
        },
        muted: {
          DEFAULT: "var(--muted, rgba(90, 26, 32, 0.6))",
          foreground: "var(--muted-foreground, #c9b7a3)",
        },
        accent: {
          DEFAULT: "var(--accent, #c9ad7f)",
          foreground: "var(--accent-foreground, #2e0a0d)",
        },
        card: {
          DEFAULT: "var(--card, #3d0f14)",
          foreground: "var(--card-foreground, #f3eadb)",
        },
      },
      borderRadius: {
        lg: "var(--radius, 0.5rem)",
        md: "calc(var(--radius, 0.5rem) - 2px)",
        sm: "calc(var(--radius, 0.5rem) - 4px)",
      },
    },
  },
  plugins: [],
};
