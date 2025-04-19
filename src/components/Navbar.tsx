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
  useTheme as useMuiTheme
} from '@mui/material';
import { 
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

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
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

          <Button
            variant="contained"
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 