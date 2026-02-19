// @ts-check
import { defineConfig } from 'astro/config';
import starlightThemeSix from '@six-tech/starlight-theme-six';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	base: '/docs',

	server: {
		host: '0.0.0.0',
		allowedHosts: true,

	},

	integrations: [
		starlight({
			plugins: [
				 starlightThemeSix({
					// Theme-specific options (all optional)
				 	navLinks: [
						{ label: 'Docs', link: '/es/get-started' },
					]
				})
			],
			title: 'react pdf levelup',
			customCss: [
				'./src/styles/custom.css',
			],
			social: [{
				icon: 'github',
				label: 'GitHub',
				href: 'https://github.com/genarogg/react-pdf-levelup'
			}],

			defaultLocale: 'es',
			locales: {
				es: { label: 'Español', lang: 'es-ES' },
				en: { label: 'English', lang: 'en-US' },
			},
			sidebar: [
				{
					label: 'Inicio',
					translations: {
						en: 'Start'
					},
					autogenerate: { directory: '/' },
				},
				{
					label: 'Guías',
					translations: {
						en: 'Guides'
					},
					autogenerate: { directory: 'guides' },
				},
				{
					label: 'Componentes',
					translations: {
						en: 'Components'
					},
					autogenerate: { directory: 'components' },
				},
				{
					label: 'Funciones',
					translations: {
						en: 'Functions'
					},
					autogenerate: { directory: 'functions' },
				},
				{
					label: 'Plugins',
					translations: {
						en: 'Plugins'
					},
					autogenerate: { directory: 'plugin' },
				},
			],
		}),
	],
});
