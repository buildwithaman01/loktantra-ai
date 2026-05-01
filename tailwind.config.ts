import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#f97316",
          green: "#16a34a",
          "dark-orange": "#c2410c",
        },
      },
      fontFamily: {
        dyslexia: ['"Comic Sans MS"', '"Trebuchet MS"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
