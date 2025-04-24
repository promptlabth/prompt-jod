import { Box, Typography, Button, useTheme } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { WifiOff } from '@mui/icons-material';

const OfflinePage = () => {
  const { t } = useTranslation('common');
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        textAlign: 'center',
        p: 4,
      }}
    >
      <WifiOff
        sx={{
          fontSize: 64,
          color: theme.palette.primary.main,
          mb: 2,
        }}
      />
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 2,
          color: theme.palette.text.primary,
          fontWeight: 'bold',
        }}
      >
        {t('offline.title')}
      </Typography>
      <Typography
        sx={{
          mb: 4,
          color: theme.palette.text.secondary,
        }}
      >
        {t('offline.description')}
      </Typography>
      <Button
        variant="contained"
        onClick={() => window.location.reload()}
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
          borderRadius: '20px',
          px: 4,
        }}
      >
        {t('offline.retry')}
      </Button>
    </Box>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default OfflinePage; 