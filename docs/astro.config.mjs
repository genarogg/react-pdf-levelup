// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	base: '/docs',
	redirects: {
		'/': '/docs/get-started',
	},
	server: {
		host: '0.0.0.0',
		allowedHosts: true,

	},

	integrations: [
		starlight({
			title: 'react pdf levelup',
			social: [{
				icon: 'github',
				label: 'GitHub',
				href: 'https://github.com/genarogg/react-pdf-levelup'
			}],
			disable404Route: true,
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
