import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Typography, Container, useTheme } from '@mui/material';

export default function TermsOfService() {
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
          {t('terms.title')}
        </Typography>

        <Typography variant="body1" sx={{ mb: 4 }}>
          {t('terms.lastUpdated')}
        </Typography>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('terms.acceptance.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('terms.acceptance.content')}
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('terms.useOfService.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('terms.useOfService.content')}
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('terms.userResponsibilities.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('terms.userResponsibilities.content')}
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('terms.limitations.title')}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {t('terms.limitations.content')}
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('terms.termination.title')}
          </Typography>
          <Typography variant="body1">
            {t('terms.termination.content')}
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