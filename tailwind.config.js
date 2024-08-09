/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			borderRadius: {
				4: "4px",
			},
			fontFamily: {
				poppins: ["Poppins", "sans-serif"],
				playfair: ["Playfair Display", "serif"],
			},
			fontSize: {
				"5.5xl": "3.25rem",
			},
			borderWidth: {
				1: "1px",
			},
			gridTemplateColumns: {
				customGrid: "1rem 170px 140px 150px 170px 100px 170px 140px",
			},
			boxShadow: {
				custom: "2px -2px 10px rgba(3, 3, 3, 0.1)",
				secondaryCustom: "-2px -2px 10px rgba(3, 3, 3, 0.1)",
			},
			colors: {
				primary: "#CE2727",
				secondary: "#FB8100",
				secondaryShade1: "#FFD0AD",
				customText: "#050315",
				customBackground: "#FFF2E6",
				accent: "#27CF57",
				accentShade1: "#3DD468",
				primaryShade1: "#D85252",
				primaryGradient: "#2f27ce",
				danger: "#db2828",
				warning: "#f2711c",
				subtleWarning: "#fbbd08",
				success: "#21ba45",
				info: "#0085FF",
				neutral1: "#838383",
			},
		},
	},
	plugins: [],
};
