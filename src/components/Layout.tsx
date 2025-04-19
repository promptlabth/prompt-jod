import { useState } from 'react';
import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, Menu, MenuItem, Button, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import GoogleIcon from '@mui/icons-material/Google';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();
  const { t } = useTranslation('common');
  const { user, signInWithGoogle, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
    </Box>
  );
};

export default Layout; 