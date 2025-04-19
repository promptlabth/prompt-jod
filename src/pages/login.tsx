import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        gap: 2
      }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to PromptLab
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={signInWithGoogle}
          sx={{
            backgroundColor: '#4285F4',
            '&:hover': {
              backgroundColor: '#357ABD',
            },
          }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
} 