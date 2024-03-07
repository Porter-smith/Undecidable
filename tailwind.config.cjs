/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: ["class"],
	theme: {
	  extend: {
		colors: {
			"background": 'var(--background)',
			"primary": 'var(--primary)',
		  },
		fontFamily: {
				  inter: ['Inter', 'sans-serif'],
				  },
	  }
	},
  };