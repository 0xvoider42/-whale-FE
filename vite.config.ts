import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), purgeCss()],
	server: {
		port: 4000
	},
	test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts']
    }
});