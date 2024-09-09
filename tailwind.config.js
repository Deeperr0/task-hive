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
				helvetica: ["Helvetica", "sans-serif"],
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
				primary: "#0f0c29",
				secondary: "#0C1229",
				secondaryShade1: "#180C29",
				secondaryShade2: "#220C29",
				customText: "#fff",
				customBackground: "#FFF2E6",
				accent: "#3D3869",
				accentShade1: "#8885A8",
				accentShade1Hover: "#32a352",
				primaryShade1: "#27243e",
				primaryGradient: "#2f27ce",
				danger: "#e34d4d",
				warning: "#FF9950",
				subtleWarning: "#fbbd08",
				success: "#0fd15c",
				successHover: "#39a163",
				info: "#5BB0FF",
				neutral1: "#838383",
				primaryShade3: "#575569",
				primaryShade2: "#3f3d54",
				accentShade2: "#b8b6cb",
				customPurple: "#7a5eeb",
				purpleText: "#e4dffb",
			},
		},
	},
	plugins: [],
};
