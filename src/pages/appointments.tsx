import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Paper, Typography, useTheme, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getUpcomingReminders } from '../services/reminders';
import { format } from 'date-fns';
import { th, enUS } from 'date-fns/locale';

interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  datetime: string;
  reminder_minutes_before: number;
}

const AppointmentsPage = () => {
  const { t, i18n } = useTranslation('common');
  const theme = useTheme();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getUpcomingReminders(user.id);
        setAppointments(data);
      } catch (error) {
        console.error('Error loading appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [user]);

  const formatDate = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    const locale = i18n.language === 'th' ? th : enUS;
    
    return format(dateObj, 'PPP', { locale });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const formatReminderTime = (minutes: number) => {
    if (minutes >= 1440) {
      const days = Math.floor(minutes / 1440);
      return t('appointments.reminderDays', { days });
    } else if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return t('appointments.reminderHours', { hours });
    } else {
      return t('appointments.reminderMinutes', { minutes });
    }
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 200px)',
        p: 4,
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4,
          color: theme.palette.text.primary,
          fontWeight: 'bold'
        }}
      >
        {t('appointments.title')}
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : appointments.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: 'transparent',
            border: '1px solid rgba(78, 204, 163, 0.1)',
            borderRadius: '20px',
          }}
        >
          <Typography color="text.secondary">
            {t('appointments.noAppointments')}
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {appointments.map((appointment) => (
            <Paper
              key={appointment.id}
              elevation={0}
              sx={{
                p: 3,
                backgroundColor: 'transparent',
                border: '1px solid rgba(78, 204, 163, 0.1)',
                borderRadius: '20px',
                '&:hover': {
                  borderColor: 'rgba(78, 204, 163, 0.3)',
                },
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: theme.palette.primary.main,
                  mb: 1 
                }}
              >
                {appointment.title}
              </Typography>
              
              {appointment.description && (
                <Typography 
                  sx={{ 
                    mb: 2,
                    color: theme.palette.text.secondary 
                  }}
                >
                  {appointment.description}
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', gap: 4, color: theme.palette.text.secondary }}>
                <Typography>
                  📅 {formatDate(appointment.date, appointment.time)}
                </Typography>
                <Typography>
                  ⏰ {formatTime(appointment.time)}
                </Typography>
                <Typography>
                  🔔 {formatReminderTime(appointment.reminder_minutes_before)}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default AppointmentsPage; 