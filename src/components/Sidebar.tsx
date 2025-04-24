import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  useTheme,
  Box
} from '@mui/material';
import {
  CalendarToday,
  Chat,
  Settings
} from '@mui/icons-material';
import { useSidebar } from '../contexts/SidebarContext';

const drawerWidth = 240;

const Sidebar = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const theme = useTheme();
  const { isOpen, closeSidebar } = useSidebar();

  const menuItems = [
    { text: t('sidebar.appointments'), icon: <CalendarToday />, path: '/appointments' },
    { text: t('sidebar.chat'), icon: <Chat />, path: '/chat' },
    { text: t('sidebar.settings'), icon: <Settings />, path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    closeSidebar();
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={isOpen}
      onClose={closeSidebar}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          backgroundColor: theme.palette.background.paper,
          borderRight: '1px solid rgba(78, 204, 163, 0.1)',
        },
      }}
    >
      <Box sx={{ mt: 8 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(78, 204, 163, 0.1)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(78, 204, 163, 0.2)',
                },
              }}
              selected={router.pathname === item.path}
            >
              <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 