const { i18n } = require('./next-i18next.config');
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google profile images
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

module.exports = withPWA(nextConfig); 