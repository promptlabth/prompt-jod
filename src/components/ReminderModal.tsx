import { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, MenuItem, useTheme } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTranslation } from 'next-i18next';
import { useAuth } from '../contexts/AuthContext';
import { saveAppointment } from '../services/reminders';
import { toast } from 'react-toastify';

export interface ReminderData {
  title: string;
  description: string;
  dateTime: Date;
  offset: number;
}

interface ReminderModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ReminderData) => void;
  initialData?: ReminderData | null;
}

const offsetOptions = [
  { value: 5, label: '5 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 1440, label: '1 day' },
];

export default function ReminderModal({ open, onClose, onSave, initialData }: ReminderModalProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();
  const { user, isCalendarConnected } = useAuth();
  const [data, setData] = useState<ReminderData>({
    title: '',
    description: '',
    dateTime: new Date(),
    offset: 15,
  });

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!user) return;

    try {
      await saveAppointment(user.id, data);
      onSave(data);
      onClose();
      toast.success(t('notifications.calendar'));
    } catch (error: any) {
      console.error('Error saving appointment:', error);
      if (error.message?.includes('No access token available')) {
        toast.error(t('notifications.calendarReconnect'));
      } else {
        toast.error(t('notifications.calendarError'));
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="reminder-modal-title"
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
        }}
      >
        <Typography id="reminder-modal-title" variant="h6" component="h2" gutterBottom>
          {t('reminderModal.title')}
        </Typography>

        <TextField
          fullWidth
          label={t('reminderModal.description')}
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          margin="normal"
        />

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Notes"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          margin="normal"
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label={t('reminderModal.date')}
            value={data.dateTime}
            onChange={(newValue) => {
              if (newValue) {
                setData({ ...data, dateTime: newValue });
              }
            }}
            sx={{ mt: 2, width: '100%' }}
          />
        </LocalizationProvider>

        <TextField
          select
          fullWidth
          label={t('reminderModal.offset')}
          value={data.offset}
          onChange={(e) => setData({ ...data, offset: Number(e.target.value) })}
          margin="normal"
        >
          {offsetOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {t(`reminderModal.offsetOptions.${option.value}min`)}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
            {t('reminderModal.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!data.title || !isCalendarConnected}
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
            {t('reminderModal.save')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
} 