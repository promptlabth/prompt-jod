import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  useTheme,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

interface ReminderModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (reminder: ReminderData) => void;
  initialData?: ReminderData | null;
}

export interface ReminderData {
  title: string;
  description: string;
  dateTime: Date;
  offset: string;
}

const ReminderModal = ({ open, onClose, onSave, initialData }: ReminderModalProps) => {
  const { t } = useTranslation('common');
  const theme = useTheme();
  const [reminder, setReminder] = useState<ReminderData>({
    title: '',
    description: '',
    dateTime: new Date(),
    offset: '30min',
  });

  useEffect(() => {
    if (initialData) {
      setReminder(initialData);
    }
  }, [initialData]);

  const handleSave = () => {
    onSave(reminder);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: 'none',
        }
      }}
    >
      <DialogTitle sx={{ color: theme.palette.text.primary }}>
        {t('reminderModal.title')}
      </DialogTitle>
      <DialogContent>
        <Box className="flex flex-col gap-4 mt-4">
          <TextField
            label={t('reminderModal.title')}
            value={reminder.title}
            onChange={(e) => setReminder({ ...reminder, title: e.target.value })}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
              }
            }}
          />
          <TextField
            label={t('reminderModal.description')}
            value={reminder.description}
            onChange={(e) => setReminder({ ...reminder, description: e.target.value })}
            multiline
            rows={3}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
              }
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label={t('reminderModal.date')}
              value={reminder.dateTime}
              onChange={(date) => setReminder({ ...reminder, dateTime: date || new Date() })}
              format="dd/MM/yyyy HH:mm"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.background.paper,
                }
              }}
            />
          </LocalizationProvider>
          <TextField
            select
            label={t('reminderModal.offset')}
            value={reminder.offset}
            onChange={(e) => setReminder({ ...reminder, offset: e.target.value })}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.paper,
              }
            }}
          >
            {Object.entries(t('reminderModal.offsetOptions', { returnObjects: true })).map(
              ([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              )
            )}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: theme.palette.background.paper }}>
        <Button onClick={onClose} sx={{ color: theme.palette.text.secondary }}>
          {t('reminderModal.cancel')}
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            }
          }}
        >
          {t('reminderModal.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReminderModal; 