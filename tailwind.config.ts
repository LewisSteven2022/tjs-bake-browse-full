/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// Minimal Elegance uses Tailwind's default neutral palette
				// Legacy color mappings for backward compatibility
				primary: "#000000",
				primaryDark: "#171717",
				primaryLight: "#404040",
				surface: "#FFFFFF",
				surfaceAlt: "#FAFAFA",
				textPrimary: "#171717",
				textSecondary: "#404040",
				cardBg: "#FFFFFF",
			},
		},
	},
	plugins: [],
};
