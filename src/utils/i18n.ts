import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { InitOptions } from 'i18next';

const i18nConfig: InitOptions = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'th'],
  defaultNS: 'common',
  fallbackNS: 'common',
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  detection: {
    order: ['path', 'cookie', 'navigator'],
    caches: ['cookie']
  },
  interpolation: {
    escapeValue: false,
  },
};

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(i18nConfig);

export default i18n; 