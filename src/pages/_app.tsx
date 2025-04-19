import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '../contexts/ThemeContext';
import Layout from '../components/Layout';
import { Kanit } from 'next/font/google';
import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const kanit = Kanit({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin', 'thai'],
  display: 'swap',
});

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLanguageInitialized, setIsLanguageInitialized] = useState(false);

  useEffect(() => {
    // Get the user's preferred language from browser
    const userLang = navigator.language.toLowerCase().split('-')[0];
    const supportedLocales = ['en', 'th'];
    
    // If the user's language is supported and different from current locale
    if (supportedLocales.includes(userLang) && userLang !== router.locale) {
      // Update the locale in the URL
      router.push(router.pathname, router.asPath, { locale: userLang });
    }
    
    // Mark language as initialized
    setIsLanguageInitialized(true);
  }, []);

  // Don't render until language is initialized
  if (!isLanguageInitialized) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <CssBaseline />
        <main className={kanit.className}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </main>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(App); 