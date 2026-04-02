import type { APIContext } from 'astro';

export const onRequest = async (context: APIContext, next: () => Promise<void>) => {
	if (context.locals?.starlightRoute) {
		context.locals.starlightRoute.siteTitleHref = '/';
	}
	await next();
};
