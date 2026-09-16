import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';
import shopify from 'vite-plugin-shopify';

export default defineConfig({
	plugins: [
		tailwindcss(),
		shopify({
			sourceCodeDir: 'src',
			entrypointsDir: 'src/entrypoints',
		}),
	],
	publicDir: 'src/assets',
	build: {
		outDir: 'assets',
		emptyOutDir: true,
		cssCodeSplit: true,
		manifest: 'manifest.json',
		rollupOptions: {
			input: {
				app: resolve(__dirname, 'src/entrypoints/theme.js'),
				theme: resolve(__dirname, 'src/entrypoints/theme.css'),
				'blog-posts': resolve(__dirname, 'src/entrypoints/blog-posts.js'),
			},
			output: {
				entryFileNames: '[name].[hash].js',
				chunkFileNames: '[name].[hash].js',
				assetFileNames: '[name].[hash].[ext]',
			},
		},
	},
});