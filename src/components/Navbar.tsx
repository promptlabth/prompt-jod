import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Menu, 
  MenuItem, 
  IconButton,
  useTheme as useMuiTheme,
  Avatar
} from '@mui/material';
import { 
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';

interface NavButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const NavButton = ({ children, onClick }: NavButtonProps) => (
  <Button
    onClick={onClick}
    sx={{
      color: 'text.primary',
      backgroundColor: 'rgba(78, 204, 163, 0.1)',
      '&:hover': {
        backgroundColor: 'rgba(78, 204, 163, 0.2)',
      },
      borderRadius: '20px',
      px: 3,
    }}
  >
    {children}
  </Button>
);

const Navbar = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const { user, signInWithGoogle, signOut } = useAuth();
  const { toggleSidebar } = useSidebar();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    handleProfileMenuClose();
  };

  const changeLanguage = (newLocale: string) => {
    router.push(router.pathname, router.asPath, { locale: newLocale });
    handleMenuClose();
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'th', name: 'ไทย' },
    // Add more languages here in the future
  ];

  const getProjectName = () => {
    return locale === 'th' ? 'พร้อมจด' : 'Prompt Jod';
  };

  return (
    <AppBar 
      position="static" 
      sx={{
        backgroundColor: 'transparent',
        borderBottom: 'none',
      }}
    >
      <Toolbar sx={{ py: 2, gap: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={toggleSidebar}
            sx={{ 
              color: muiTheme.palette.text.primary,
              backgroundColor: 'rgba(78, 204, 163, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(78, 204, 163, 0.2)',
              },
              width: 40,
              height: 40,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              color: '#4ECCA3',
              fontWeight: 600,
              fontSize: '1.5rem',
            }}
          >
            {getProjectName()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={toggleTheme}
            sx={{ 
              color: muiTheme.palette.text.primary,
              backgroundColor: 'rgba(78, 204, 163, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(78, 204, 163, 0.2)',
              },
              width: 40,
              height: 40,
            }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <Button
            onClick={handleMenuOpen}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ 
              color: muiTheme.palette.text.primary,
              backgroundColor: 'rgba(78, 204, 163, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(78, 204, 163, 0.2)',
              },
              borderRadius: '20px',
              px: 2,
              minWidth: 100,
            }}
          >
            {locale === 'th' ? 'ไทย' : 'English'}
          </Button>

          <Menu
            id="language-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            keepMounted
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1,
                backgroundColor: muiTheme.palette.background.paper,
                borderRadius: 2,
                border: '1px solid rgba(78, 204, 163, 0.1)',
              }
            }}
          >
            {languages.map((lang) => (
              <MenuItem
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                selected={locale === lang.code}
                sx={{
                  minWidth: 120,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(78, 204, 163, 0.1)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(78, 204, 163, 0.05)',
                  }
                }}
              >
                {lang.name}
              </MenuItem>
            ))}
          </Menu>

          {user ? (
            <>
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ p: 0 }}
              >
                <Avatar 
                  alt={user.email || 'User'} 
                  src={user.user_metadata.avatar_url}
                  sx={{ 
                    width: 40, 
                    height: 40,
                    backgroundColor: 'rgba(78, 204, 163, 0.1)',
                  }}
                />
              </IconButton>
              <Menu
                anchorEl={profileAnchorEl}
                open={Boolean(profileAnchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1,
                    backgroundColor: muiTheme.palette.background.paper,
                    borderRadius: 2,
                    border: '1px solid rgba(78, 204, 163, 0.1)',
                  }
                }}
              >
                <MenuItem onClick={handleSignOut}>{t('navbar.logout')}</MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={signInWithGoogle}
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
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 