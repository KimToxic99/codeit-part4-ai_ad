import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18233A",
        sand: "#FFF7EE",
        peach: "#FFE0D2",
        brand: {
          50: "#FFF2EA",
          100: "#FFE1CF",
          200: "#FFC2A0",
          300: "#FF9A6A",
          400: "#FF7649",
          500: "#F75A2A",
          600: "#D8451A"
        }
      },
      boxShadow: {
        panel: "0 24px 60px rgba(24, 35, 58, 0.10)"
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
