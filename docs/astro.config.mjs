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

				})
			],
			title: 'REACT PDF LEVELUP',
			favicon: './public/iconos/favicon-32x32.png',
			logo: {
				src: './public/iconos/favicon-192x192.png',
			},
			routeMiddleware: ['./src/starlightRouteData.ts'],
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
			// Oculta el selector "Selecciona tu idioma" / "Select language" del sidebar
			components: {
				LanguageSelect: './src/components/EmptyLanguageSelect.astro',
			},
			sidebar: [
				{
					label: 'Get Started',
					translations: {
						en: 'Get Started'
					},
					items: [
						{ slug: 'get-started', label: 'Get Started' },
						{ slug: 'studio', label: 'Playground - Local', translations: { en: 'Playground - Local' } },
						{ slug: 'playground', label: 'Playground - Online', translations: { en: 'Playground - Online' } },
					],
				},
				{
					label: 'Guías',
					translations: {
						en: 'Guides'
					},
					items: [
						{ slug: 'guides/api-rest', label: 'API REST' },
						{ slug: 'guides/backend-integration', label: 'Integración Backend', translations: { en: 'Backend Integration' } },
						{ slug: 'guides/first-template', label: 'Tu Primer Template', translations: { en: 'Your First Template' } },
						{
							label: 'Funciones',
							translations: {
								en: 'Functions'
							},
							items: [
								{ slug: 'guides/functions/fonts', label: 'Gestión de Fuentes', translations: { en: 'Font Management' } },
								{ slug: 'guides/functions/generate-pdf', label: 'generatePDF' },
							],
						},
					],
				},
				{
					label: 'Componentes',
					translations: {
						en: 'Components'
					},
					items: [
						{
							label: 'Estructura',
							translations: { en: 'Structure' },
							items: [
								{ slug: 'components/layout', label: 'Layout' },
								{ slug: 'components/layout-multi-page', label: 'LayoutMultiPage' },
								{ slug: 'components/grid', label: 'Columnas', translations: { en: 'Columns' } },
								{ slug: 'components/position', label: 'Position' },
							],
						},
						{
							label: 'Contenido',
							translations: { en: 'Content' },
							items: [
								{ slug: 'components/text', label: 'Text' },
								{ slug: 'components/table', label: 'Table' },
								{ slug: 'components/lists', label: 'Lists' },
								{ slug: 'components/media', label: 'Media' },
							],
						},
						{
							label: 'Avanzado',
							translations: { en: 'Advanced' },
							items: [
								{ slug: 'components/form', label: 'Formulario', translations: { en: 'Form' } },
								{ slug: 'components/gradiant', label: 'Gradiant', translations: { en: 'Gradiant' } },
							],
						},
					],
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
