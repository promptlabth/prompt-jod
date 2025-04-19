import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#1E1E1E',
        transition: theme.transitions.create('background-color', {
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