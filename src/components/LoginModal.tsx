import { Modal, Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'next-i18next';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { t, i18n } = useTranslation('common');
  const { signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Force reload translations when locale changes
    i18n.reloadResources(router.locale, 'common');
  }, [router.locale]);

  const handleLogin = () => {
    signInWithGoogle();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="login-modal-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography id="login-modal-title" variant="h6" component="h2" gutterBottom>
          {t('loginModal.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('loginModal.description')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleLogin}
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
          {t('navbar.login')}
        </Button>
      </Box>
    </Modal>
  );
} 