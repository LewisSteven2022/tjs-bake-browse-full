/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// Modern Blue-Focused Palette
				primary: "#4EA1D3", // sky blue
				primaryDark: "#6474E5", // royal blue
				primaryLight: "#9AA4EC", // lavender blue
				surface: "#F8FAFB", // very light blue-tinted background
				surfaceAlt: "#EDF4F7", // light blue-grey
				ringBrand: "#9AA4EC", // focus ring / accents
				textPrimary: "#2D3748", // dark blue-grey
				textSecondary: "#4A5568", // medium blue-grey
				cardBg: "#FFFFFF", // pure white
				accent: "#F4A4A4", // minimal pink accent (sparingly used)
			},
		},
	},
	plugins: [],
};
