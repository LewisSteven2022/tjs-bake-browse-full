import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { primary: "#7DB9FF", surface: "#FFFFFF", textbody: "#111827" }, borderRadius: { '2xl': '1rem' } } },
  plugins: []
};
export default config;
