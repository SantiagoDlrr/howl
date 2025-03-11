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
          DEFAULT: "#8100E4",
          light: "#C67CFF",
        },
        "secondary" : {
          DEFAULT: "#848484",
          dark: "#2B2B2B",
          light: "#D2D2D2",
        },
        "bg" : {
          DEFAULT: "#0D0D0D",
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
