import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="th">
      <Head>
        {/* Favicon for modern browsers */}
        <link rel="icon" type="image/webp" sizes="192x192" href="/icons/logo-192x192.webp" />
        <link rel="icon" type="image/webp" sizes="32x32" href="/icons/logo-32x32.webp" />
        
        {/* Fallback favicon for older browsers */}
        <link rel="shortcut icon" href="/icons/logo-32x32.webp" />
        
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/logo-192x192.webp" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#4ECCA3" />
        
        {/* Additional meta tags for better icon support */}
        <meta name="msapplication-TileImage" content="/icons/logo-144x144.webp" />
        <meta name="msapplication-TileColor" content="#4ECCA3" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 