// @ts-check
import { defineConfig } from 'astro/config';
import starlightThemeSix from '@six-tech/starlight-theme-six';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	base: '/docs',
	redirects: {
		'/': '/docs/es/get-started',
	},
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
					],
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
					items: [
						{ label: 'Get Started', slug: 'get-started' },
						{ label: 'Playground', slug: 'playground' },
					],
				},
				{
					label: 'Guías',
					items: [
						{ label: 'Tu Primer Template', slug: 'guides/first-template' },
						{ label: 'Integración Backend', slug: 'guides/backend-integration' },
						{ label: 'API REST (fetch)', slug: 'guides/api-rest' },
					],
				},
				{
					label: 'Componentes',
					autogenerate: { directory: 'components' },
				},
				{
					label: 'Funciones',
					autogenerate: { directory: 'functions' },
				},
				{
					label: 'Plugins',
					autogenerate: { directory: 'plugin' },
				},
			],
		}),
	],
});
