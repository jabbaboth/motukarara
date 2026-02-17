import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        crew: {
          jade: "#2E86AB",
          ryan: "#A23B72",
          jamie: "#F18F01",
          hedge: "#6C757D",
        },
        feeder: {
          "111": "rgba(255, 160, 122, 0.13)",
          "112": "rgba(255, 107, 107, 0.13)",
          "113": "rgba(69, 183, 209, 0.13)",
          "114": "rgba(78, 205, 196, 0.13)",
        },
        status: {
          completed: "#d4edda",
          "in-progress": "#fff3cd",
          pending: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};

export default config;
