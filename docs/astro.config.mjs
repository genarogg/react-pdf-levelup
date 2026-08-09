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
			favicon: 'https://react-pdf-levelup.nimbux.cloud/iconos/favicon-32x32.png',
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
								{
									label: 'Generar PDF',
									translations: { en: 'Generate PDF' },
									items: [
										{ slug: 'guides/functions/generate-pdf/single', label: 'Single', translations: { en: 'Single' } },
										{ slug: 'guides/functions/generate-pdf/worker', label: 'Worker', translations: { en: 'Worker' } },
									],
								},
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
								{ slug: 'components/button', label: 'Button' },
								{ slug: 'components/form', label: 'Formulario', translations: { en: 'Form' } },
							],
						},
						{
							label: 'Extend',
							translations: { en: 'Extend' },
							items: [
								{ slug: 'components/grid', label: 'Grid (Columnas)', translations: { en: 'Grid (Columns)' } },
								{ slug: 'components/gradiant', label: 'Gradiant' },
								{ slug: 'components/badge', label: 'Badge' },
								{ slug: 'components/divider', label: 'Divider' },
								{ slug: 'components/graph', label: 'Graph' },
								{ slug: 'components/pass', label: 'Pass' },
							],
						},
					],
				},
				{
					label: 'Plugins',
					translations: {
						en: 'Plugins'
					},
					items: [
						{
							label: 'QR',
							items: [
								{ slug: 'plugin/qr/qr', label: 'QR' },
								{ slug: 'plugin/qr/qrstyle', label: 'QRstyle' },
							],
						},
						{ slug: 'plugin/client', label: 'Cliente', translations: { en: 'Client' } },
						{ slug: 'plugin/chartjs', label: 'ChartJS' },
						{ slug: 'plugin/icon', label: 'Icon' },
						{ slug: 'plugin/codebar', label: 'CodeBar' },
					],
				},
			],
		}),
	],
});
