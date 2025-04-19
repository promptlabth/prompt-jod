import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '../contexts/ThemeContext';
import Layout from '../components/Layout';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default appWithTranslation(App); 