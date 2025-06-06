import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Typography, Container, useTheme } from '@mui/material';

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation('common');
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          py: 8,
          color: theme.palette.text.primary,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            mb: 4,
          }}
        >
          {t('privacy.title')}
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          {t('privacy.lastUpdated')}
        </Typography>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('privacy.introduction.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('privacy.introduction.content')}
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('privacy.dataCollection.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('privacy.dataCollection.content')}
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('privacy.dataUsage.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('privacy.dataUsage.content')}
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('privacy.dataProtection.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('privacy.dataProtection.content')}
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('privacy.contact.title')}
          </Typography>
          <Typography variant="body1">
            {t('privacy.contact.content')}
          </Typography>
        </Box>
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