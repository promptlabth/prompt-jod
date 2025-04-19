/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'th'],
    localeDetection: true,
    localeStructure: '{{lng}}/{{ns}}',
  },
  defaultNS: 'common',
  ns: ['common'],
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  detection: {
    order: ['path', 'cookie', 'navigator'],
    caches: ['cookie'],
    cookieSameSite: 'strict',
  },
} 