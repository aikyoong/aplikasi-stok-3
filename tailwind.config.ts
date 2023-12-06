import { Config } from "tailwindcss";

import { shadcnPreset } from "./src/lib/shadcn/shadcn-preset";
import { tremorPreset } from "./src/lib/tremor/tremor-preset";

const config = {
  presets: [shadcnPreset, tremorPreset],
  content: [
    "./index.html",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",

    // Path to the Tremor module
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green_light: "#ebfae8",
        blue_soft: "#192432",
        blue_accent: "#5992D9",
        gold_accent: "#EDC997",
        red_accent: "#B32420",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        philoshoper: ["Philosopher", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
} satisfies Config;

export default config;
// "bg-blue-dark": "#161D28",
