import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import svg from '@poppanator/sveltekit-svg';

export default defineConfig({
	plugins: [sveltekit(), svg()],
	server: {
		port: 3000 // Set your desired port here
	},
	preview: {
		port: 3000 // Port for the preview command
	}
});
