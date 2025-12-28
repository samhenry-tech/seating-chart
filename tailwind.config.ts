import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["DM Sans", "sans-serif"],
        heading: ["Eyesome Script", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
