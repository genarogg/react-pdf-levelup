import { defineMiddleware } from 'astro:middleware';

const supportedLangs = ['en', 'es'];
const defaultLang = 'es';

export const onRequest = defineMiddleware(({ url, request, redirect }, next) => {
  if (url.pathname !== '/docs/') {
    return next();
  }

  const languages = request.headers.get('accept-language');

  if (!languages) {
    return redirect(`/docs/${defaultLang}/get-started`);
  }

  const preferredLangs = languages.split(',').map(lang => lang.split(';')[0].toLowerCase());

  for (const lang of preferredLangs) {
    const baseLang = lang.split('-')[0];
    if (supportedLangs.includes(baseLang)) {
      return redirect(`/docs/${baseLang}/get-started`);
    }
  }

  return redirect(`/docs/${defaultLang}/get-started`);
});
