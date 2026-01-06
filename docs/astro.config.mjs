// @ts-check
import { defineConfig } from 'astro/config';
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
			title: 'react pdf levelup',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/genarogg/react-pdf-levelup' }],
			sidebar: [
				{
					label: 'Componentes',
					autogenerate: { directory: 'components' },
				},
				{
					label: 'Funciones',
					autogenerate: { directory: 'functions' },
				},
			],
		}),
	],
});
