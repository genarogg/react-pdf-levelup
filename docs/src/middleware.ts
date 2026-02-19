import { defineMiddleware } from 'astro:middleware';

// Define los idiomas que soporta tu sitio.
const supportedLangs = ['en', 'es'];
const defaultLang = 'es';

export const onRequest = defineMiddleware(({ url, request, redirect }, next) => {
  // Solo ejecuta esta lógica en la página de inicio del sitio de documentación.
  if (url.pathname !== '/docs/') {
    return next();
  }

  // Obtiene la cabecera "Accept-Language" de la solicitud.
  const languages = request.headers.get('accept-language');
  
  // Si no hay cabecera, redirige al idioma por defecto.
  if (!languages) {
    return redirect(`/docs/${defaultLang}/`);
  }

  // Parsea la cabecera para obtener una lista de idiomas preferidos.
  // Ejemplo: "en-US,en;q=0.9,es;q=0.8" -> ["en-us", "en", "es"]
  const preferredLangs = languages.split(',').map(lang => lang.split(';')[0].toLowerCase());

  // Busca el primer idioma soportado que coincida con las preferencias del usuario.
  for (const lang of preferredLangs) {
    const baseLang = lang.split('-')[0];
    if (supportedLangs.includes(baseLang)) {
      // Redirige al idioma encontrado.
      return redirect(`/docs/${baseLang}/`);
    }
  }

  // Si no se encuentra ninguna coincidencia, usa el idioma por defecto.
  return redirect(`/docs/${defaultLang}/`);
});
