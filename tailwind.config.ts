/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#3b82f6", // main blue
				primaryDark: "#1e40af", // deeper blue
				primaryLight: "#93c5fd", // lighter blue
			},
		},
	},
	plugins: [],
};
