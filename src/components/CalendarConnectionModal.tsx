import { Modal, Box, Typography, Button, useTheme } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useAuth } from '../contexts/AuthContext';

interface CalendarConnectionModalProps {
  open: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export default function CalendarConnectionModal({ open, onClose, onConnect }: CalendarConnectionModalProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="calendar-connection-modal-title"
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
        <Typography id="calendar-connection-modal-title" variant="h6" component="h2" gutterBottom>
          {t('notifications.connectCalendar.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t('notifications.connectCalendar.description')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={onConnect}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              borderRadius: '20px',
              px: 3,
            }}
          >
            {t('notifications.connectCalendar.connect')}
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
              },
              borderRadius: '20px',
              px: 3,
            }}
          >
            {t('notifications.connectCalendar.later')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
} 