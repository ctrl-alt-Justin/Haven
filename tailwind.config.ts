import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cottage: {
          cream: "#F4EFE3",
          "cream-light": "#FAF7F0",
          "cream-dark": "#ECE4D0",
          sage: "#DCE5D2",
          "sage-light": "#EBF1E6",
          "sage-dark": "#8A9F7B",
          rose: "#EBD9D5",
          "rose-light": "#F6EDEA",
          "rose-dark": "#B27D74",
          moss: "#B8C6B0",
          "moss-deep": "#4A6146",
          brown: "#806F5B",
          "brown-light": "#A89885",
          "brown-dark": "#43382D",
          bark: "#2E2620",
          terracotta: "#C86A53",
          border: "#E0D7C4",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        cottage: "1.25rem",
        "cottage-sm": "0.75rem",
        "cottage-lg": "1.75rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(128, 111, 91, 0.08), 0 2px 6px -1px rgba(128, 111, 91, 0.04)",
        card: "0 10px 30px -4px rgba(67, 56, 45, 0.06), 0 4px 8px -2px rgba(67, 56, 45, 0.03)",
        lifted: "0 20px 35px -8px rgba(67, 56, 45, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
