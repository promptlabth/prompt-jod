import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';
import { useState } from 'react';

export default function Home() {
  const { t, i18n } = useTranslation('common');
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleGetStarted = () => {
    if (user) {
      router.push('/chat');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            mb: 4,
          }}
        >
          {t('home.title')}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: theme.palette.text.secondary,
            mb: 6,
            maxWidth: '800px',
          }}
        >
          {t('home.description')}
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={handleGetStarted}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            px: 4,
            py: 2,
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          {t('home.getStarted')}
        </Button>

        <LoginModal
          open={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </Box>
    </Container>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 