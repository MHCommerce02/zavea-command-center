import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        zbg: "#0F1015",
        zsurface: "#171922",
        zsurfaceRaised: "#1D2029",
        zborder: "#2A2D38",
        ztext: "#F2EFE9",
        ztextMuted: "#8D909D",
        zaccent: "#C9915B",
        zcritical: "#E5484D",
        zwatch: "#E0A63E",
        zgood: "#4CAF7D",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
