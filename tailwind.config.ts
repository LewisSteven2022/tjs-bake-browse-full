/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// Brand palette (from test-styling/about-modern)
				primary: "#638ECB", // brand blue
				primaryDark: "#395B86", // deep brand blue
				primaryLight: "#8AAEE0", // light brand blue
				surface: "#F0F3FA", // light surface
				surfaceAlt: "#D5DEEF", // alt surface / borders
				ringBrand: "#B1C9EF", // focus ring / accents
			},
		},
	},
	plugins: [],
};
