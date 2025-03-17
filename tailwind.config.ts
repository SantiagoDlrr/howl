import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        main: ["Alexandria", "sans-serif"],
      },
      colors: {
        "primary" : {
          DEFAULT: "#A836FF",
          light: "#C67CFF",
          extralight: "#D9A8FF",
        },
        "gray" : {
          DEFAULT: "#BBBDC0",
        },
        "text": {
          DEFAULT: "#4C4C4C",
          light: "#7C7C7C",
        },
        "bg" : {
          DEFAULT: "#F9F9F9",
          dark: "F3F5F9"
        },
      },
      animation: {
        "gradient-slide": "gradient-slide 0.6s linear forwards", // Adjust duration as needed
      },
      keyframes: {
        "gradient-slide": {
          "0%": { backgroundPosition: "0% 50%" }, // Start with gray (secondary)
          "100%": { backgroundPosition: "100% 50%" }, // End with purple (primary)
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
