import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { SidebarProvider } from '../contexts/SidebarContext';
import Sidebar from '../components/Sidebar';
import Layout from '../components/Layout';
import { Kanit } from 'next/font/google';
import '../styles/globals.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const kanit = Kanit({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
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

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful');
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  // Don't render until language is initialized
  if (!isLanguageInitialized) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          <Sidebar />
          <main className={kanit.className}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </main>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default appWithTranslation(MyApp); 