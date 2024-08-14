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
				customGrid:
					"1rem 10.625rem 8.75rem 9.375rem 10.625rem 6.25rem 10.625rem 8.75rem",
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
				danger: "#FF5656",
				warning: "#FF9950",
				subtleWarning: "#fbbd08",
				success: "#00F060",
				info: "#5BB0FF",
				neutral1: "#838383",
				primaryShade3: "rgba(206, 39, 39, 0.05)",
				accentShade2: "rgba(39, 207, 87, 0.3)",
			},
		},
	},
	plugins: [],
};
