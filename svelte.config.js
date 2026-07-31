import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		// allow up to 150kb of style to be inlined with the HTML
		// Faster FCP (First Contentful Paint) by reducing the number of requests
		inlineStyleThreshold: 150000,
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH || '/kalai'
		},
		prerender: {
			handleHttpError: 'warn'
		},
		alias: {
			$lib: './src/lib'
		}
	}
};

export default config;
