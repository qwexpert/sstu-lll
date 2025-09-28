import tailwindcss from '@tailwindcss/vite';
import wasm from 'vite-plugin-wasm'
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), wasm()]
});
