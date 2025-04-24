import { useState, useEffect } from 'react';
import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, Menu, MenuItem, Button, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import GoogleIcon from '@mui/icons-material/Google';
import CalendarConnectionModal from './CalendarConnectionModal';
import PWAInstallPrompt from './PWAInstallPrompt';
import { checkCalendarConnection } from '../services/googleCalendar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();
  const { t } = useTranslation('common');
  const { user, signInWithGoogle, signOut, isCalendarConnected, setIsCalendarConnected, showPWAPrompt, setShowPWAPrompt } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  useEffect(() => {
    if (user && !isCalendarConnected) {
      // Check if user is already connected
      checkCalendarConnection(user.id).then((isConnected: boolean) => {
        if (isConnected) {
          setIsCalendarConnected(true);
        } else {
          // Show calendar connection modal after a short delay
          const timer = setTimeout(() => {
            setShowCalendarModal(true);
          }, 1000);
          return () => clearTimeout(timer);
        }
      });
    }
  }, [user, isCalendarConnected]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    handleMenuClose();
  };

  const handleConnectCalendar = () => {
    // Here you would implement the actual calendar connection logic
    setIsCalendarConnected(true);
    setShowCalendarModal(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: theme.transitions.create(['background-color', 'color'], {
          duration: theme.transitions.duration.standard,
        }),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          maxWidth: theme.breakpoints.values.xl,
          width: '100%',
          mx: 'auto',
          px: { xs: 2, sm: 4 },
          py: { xs: 4, sm: 8 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>

      <CalendarConnectionModal
        open={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        onConnect={handleConnectCalendar}
      />

      <PWAInstallPrompt
        open={showPWAPrompt}
        onClose={() => setShowPWAPrompt(false)}
      />
    </Box>
  );
};

export default Layout; 