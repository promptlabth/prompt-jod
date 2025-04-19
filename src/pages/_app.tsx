import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '../contexts/ThemeContext';
import Layout from '../components/Layout';
import { Kanit } from 'next/font/google';
import '../styles/globals.css';

const kanit = Kanit({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin', 'thai'],
  display: 'swap',
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <CssBaseline />
      <main className={kanit.className}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </ThemeProvider>
  );
}

export default appWithTranslation(App); 