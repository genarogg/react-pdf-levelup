import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { hero } from "./translations/hero";
import { value } from "./translations/value";
import { templates } from "./translations/templates";
import { how } from "./translations/how";
import { dev } from "./translations/dev";
import { use } from "./translations/use";
import { api } from "./translations/api";
import { roadmap } from "./translations/roadmap";
import { support } from "./translations/support";
import { faq } from "./translations/faq";
import { nav } from "./translations/nav";

const resources = {
  es: {
    translation: {
      ...hero.es.translation,
      ...value.es.translation,
      ...templates.es.translation,
      ...how.es.translation,
      ...dev.es.translation,
      ...use.es.translation,
      ...api.es.translation,
      ...roadmap.es.translation,
      ...support.es.translation,
      ...faq.es.translation,
      ...nav.es.translation,
    },
  },
  en: {
    translation: {
      ...hero.en.translation,
      ...value.en.translation,
      ...templates.en.translation,
      ...how.en.translation,
      ...dev.en.translation,
      ...use.en.translation,
      ...api.en.translation,
      ...roadmap.en.translation,
      ...support.en.translation,
      ...faq.en.translation,
      ...nav.en.translation,
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
