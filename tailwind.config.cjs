/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: ["class"],
	theme: {
	  extend: {
		colors: {
			background: "hsl(var(--background) / <alpha-value>)",
			primary: {
				DEFAULT: "hsl(var(--primary) / <alpha-value>)",
				foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
			},
			accent: {
				DEFAULT: "hsl(var(--accent) / <alpha-value>)",
				foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
			},
		  },
		fontFamily: {
				  inter: ['Inter', 'sans-serif'],
				  },
	  }
	},
	plugins: [
		require('@tailwindcss/typography'),
		// other plugins...
	  ],
  };