import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        custom:
          "5px 8px 20px 5px rgba(0, 0, 0, 0.1), 0 4px 6px 2px rgba(0, 0, 0, 0.15)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#df2020",
        base: "#fb7701",
        secondary: "#f2a6a6",
        neon_blue: "#69C9D0",
        neon_pink: "#df2020",
        b_text: "#05696b",
        border: "#ebf2f3",
        bg_color: "rgb(241 245 249)",
        error: "rgb(239 68 68)",
        black: "#333333",
        bg_white: "#ffffff",
        gray_500: "rgb(107 114 128)",
        bg_gray_200: "rgb(229 231 235)",
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-lao-looped)", ...fontFamily.sans],
      },
      fontSize: {
        xs: ["12px", "20px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["20px", "28px"],
        xl: ["24px", "32px"],
        "title-xl": ["33px", "45px"],
        "title-xl2": ["40px", "45px"],
        "title-medium": ["50px", "45px"],
        "big-title": ["70px", "45px"],
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
