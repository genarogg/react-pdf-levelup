import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { hero } from "./home/hero";
import { value } from "./home/value";
import { templates } from "./home/templates";
import { how } from "./home/how";
import { dev } from "./home/dev";
import { use } from "./home/use";
import { api } from "./home/api";
import { roadmap } from "./home/roadmap";
import { support } from "./home/support";
import { faq } from "./home/faq";
import { nav } from "./home/nav";

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
