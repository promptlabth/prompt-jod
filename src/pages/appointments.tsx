import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { 
  Box, 
  Paper, 
  Typography, 
  useTheme, 
  CircularProgress,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Snackbar,
  Alert,
  Fade
} from '@mui/material';
import { 
  AccessTime,
  Add,
  CalendarToday,
  CheckCircle,
  Edit,
  NotificationsActive
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { getUpcomingReminders, updateReminder, deleteReminder, Appointment } from '../services/reminders';
import { addToGoogleCalendar } from '../services/googleCalendar';
import { format } from 'date-fns';
import { th, enUS } from 'date-fns/locale';
import { supabase } from '../lib/supabase';

const AppointmentsPage = () => {
  const { t, i18n } = useTranslation('common');
  const theme = useTheme();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isConnectCalendarDialogOpen, setIsConnectCalendarDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddingToCalendar, setIsAddingToCalendar] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [recentlyAddedToCalendar, setRecentlyAddedToCalendar] = useState<string | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleEditAppointment = async (updatedAppointment: Appointment) => {
    try {
      const existingAppointment = appointments.find(apt => apt.id === updatedAppointment.id);
      if (!existingAppointment) return;

      const appointmentToUpdate: Appointment = {
        ...existingAppointment,
        ...updatedAppointment,
        datetime: new Date(`${updatedAppointment.date}T${updatedAppointment.time}`),
        updated_at: new Date(),
        description: updatedAppointment.description || ''
      };
      
      await updateReminder(appointmentToUpdate);
      setAppointments(appointments.map(apt => 
        apt.id === updatedAppointment.id ? appointmentToUpdate : apt
      ));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleAddToCalendar = async (appointment: Appointment) => {
    setIsAddingToCalendar(appointment.id);
    try {
      const appointmentForCalendar = {
        ...appointment,
        datetime: new Date(appointment.datetime).toISOString(),
        created_at: new Date(appointment.created_at).toISOString(),
        updated_at: new Date(appointment.updated_at).toISOString()
      };
      await addToGoogleCalendar(appointmentForCalendar);
      setAppointments(appointments.map(apt => 
        apt.id === appointment.id ? { ...apt, isAddedToCalendar: true } : apt
      ));
      setSuccessMessage(t('notifications.calendar.success'));
      setRecentlyAddedToCalendar(appointment.id);
      setTimeout(() => {
        setRecentlyAddedToCalendar(null);
      }, 5000);
    } catch (error) {
      console.error('Error adding to calendar:', error);
      if (error instanceof Error && error.message.includes('Please connect your Google Calendar')) {
        setIsConnectCalendarDialogOpen(true);
      } else {
        setErrorMessage(t('notifications.calendar.error'));
      }
    } finally {
      setIsAddingToCalendar(null);
    }
  };

  const handleConnectCalendar = async () => {
    try {
      // Redirect to Google OAuth flow
      const { data: { url }, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar',
          redirectTo: `${window.location.origin}/appointments`
        }
      });
      
      if (error) throw error;
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Error connecting calendar:', error);
      setErrorMessage(t('notifications.connectCalendar.error'));
    }
  };

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

  const drawerWidth = 240;

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)', // Account for navbar height
        width: '100%',
        px: { xs: 2, sm: 4 },
        py: 4,
        maxWidth: '1200px',
        mx: 'auto'
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4,
          color: theme.palette.primary.main,
          fontWeight: 600,
          textAlign: 'center'
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
            width: '100%',
            maxWidth: '600px'
          }}
        >
          <Typography color="text.secondary">
            {t('appointments.noAppointments')}
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          width: '100%',
          maxWidth: '800px'
        }}>
          {appointments.map((appointment) => (
            <Paper
              key={appointment.id}
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                backgroundColor: 'transparent',
                border: '1px solid rgba(78, 204, 163, 0.1)',
                borderRadius: '20px',
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  borderColor: 'primary.main'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 0 } }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 1,
                      color: theme.palette.primary.main,
                      fontWeight: 600
                    }}
                  >
                    {appointment.title}
                  </Typography>
                  
                  {appointment.description && (
                    <Typography 
                      sx={{ 
                        mb: 2,
                        color: theme.palette.text.secondary,
                        fontSize: '0.95rem'
                      }}
                    >
                      {appointment.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 3, 
                    flexWrap: 'wrap',
                    color: theme.palette.text.secondary,
                    fontSize: '0.9rem',
                    '& > div': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }
                  }}>
                    <Box>
                      <CalendarToday fontSize="small" />
                      {formatDate(appointment.date, appointment.time)}
                    </Box>
                    <Box>
                      <AccessTime fontSize="small" />
                      {formatTime(appointment.time)}
                    </Box>
                    <Box>
                      <NotificationsActive fontSize="small" />
                      {formatReminderTime(appointment.reminder_minutes_before)}
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 1,
                  ml: 'auto',
                  mt: { xs: 2, sm: 0 }
                }}>
                  <IconButton
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsEditDialogOpen(true);
                    }}
                    sx={{ 
                      color: theme.palette.primary.main,
                      '&:hover': { backgroundColor: 'rgba(78, 204, 163, 0.1)' }
                    }}
                  >
                    <Edit />
                  </IconButton>
                  {!appointment.isAddedToCalendar && (
                    <IconButton
                      onClick={() => handleAddToCalendar(appointment)}
                      disabled={isAddingToCalendar === appointment.id}
                      sx={{ 
                        color: theme.palette.primary.main,
                        '&:hover': { backgroundColor: 'rgba(78, 204, 163, 0.1)' },
                        position: 'relative'
                      }}
                    >
                      {isAddingToCalendar === appointment.id ? (
                        <CircularProgress
                          size={24}
                          sx={{
                            color: theme.palette.primary.main,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px'
                          }}
                        />
                      ) : (
                        <Add />
                      )}
                    </IconButton>
                  )}
                </Box>
              </Box>
              {appointment.isAddedToCalendar && (
                <Fade in={true} timeout={500}>
                  <Chip
                    icon={<CheckCircle />}
                    label={t('appointments.addedToCalendar')}
                    color="success"
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8,
                      backgroundColor: recentlyAddedToCalendar === appointment.id 
                        ? 'rgba(78, 204, 163, 0.2)' 
                        : 'rgba(78, 204, 163, 0.1)',
                      borderColor: theme.palette.success.main,
                      color: theme.palette.success.main,
                      transition: 'all 0.3s ease-in-out',
                      transform: recentlyAddedToCalendar === appointment.id 
                        ? 'scale(1.05)' 
                        : 'scale(1)',
                      '& .MuiChip-icon': {
                        color: theme.palette.success.main
                      }
                    }}
                  />
                </Fade>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>{t('appointments.editAppointment')}</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label={t('appointments.title')}
                value={selectedAppointment.title}
                onChange={(e) => setSelectedAppointment({ ...selectedAppointment, title: e.target.value })}
                fullWidth
              />
              <TextField
                label={t('appointments.description')}
                value={selectedAppointment.description}
                onChange={(e) => setSelectedAppointment({ ...selectedAppointment, description: e.target.value })}
                fullWidth
                multiline
                rows={4}
              />
              <TextField
                label={t('appointments.date')}
                type="date"
                value={selectedAppointment.date}
                onChange={(e) => setSelectedAppointment({ ...selectedAppointment, date: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label={t('appointments.time')}
                type="time"
                value={selectedAppointment.time}
                onChange={(e) => setSelectedAppointment({ ...selectedAppointment, time: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={() => selectedAppointment && handleEditAppointment(selectedAppointment)}
            variant="contained"
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Connect Calendar Dialog */}
      <Dialog
        open={isConnectCalendarDialogOpen}
        onClose={() => setIsConnectCalendarDialogOpen(false)}
      >
        <DialogTitle>{t('notifications.connectCalendar.title')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('notifications.connectCalendar.description')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConnectCalendarDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleConnectCalendar} variant="contained">
            {t('notifications.connectCalendar.connect')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Status Snackbar */}
      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={successMessage ? 3000 : 5000}
        onClose={() => {
          setSuccessMessage(null);
          setErrorMessage(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => {
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          severity={successMessage ? 'success' : 'error'}
          sx={{ 
            width: '100%',
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }}
        >
          {successMessage && <CheckCircle fontSize="small" />}
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default AppointmentsPage; 