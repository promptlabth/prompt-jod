import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

interface PWAInstallPromptProps {
  open: boolean;
  onClose: () => void;
}

const PWAInstallPrompt = ({ open, onClose }: PWAInstallPromptProps) => {
  const { t } = useTranslation('common');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="pwa-install-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              position: 'relative',
              width: 80,
              height: 80,
              margin: '0 auto',
            }}
          >
            <Image
              src="/icons/logo.webp"
              alt="พร้อมจด Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>
        </Box>

        <Typography id="pwa-install-title" variant="h6" component="h2" gutterBottom>
          {t('pwaPrompt.title')}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('pwaPrompt.description')}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: '20px', px: 3 }}
          >
            {t('common.later')}
          </Button>
          <Button
            variant="contained"
            onClick={handleInstall}
            sx={{
              backgroundColor: '#4ECCA3',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#45b892',
              },
              borderRadius: '20px',
              px: 3,
            }}
          >
            {t('pwaPrompt.install')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PWAInstallPrompt; 