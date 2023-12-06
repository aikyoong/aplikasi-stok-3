import type { Config } from "tailwindcss";
import { tremorPlugin } from "./tremor-plugin";
import headlessUI from "@headlessui/tailwindcss";

export const tremorPreset = {
  darkMode: "class",
  plugins: [headlessUI, tremorPlugin],
  content: [
    "./index.html",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",

    // Path to the Tremor module
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
} satisfies Config;
