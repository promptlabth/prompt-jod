import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Wait for the session to be available
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          router.push('/login');
          return;
        }

        if (session) {
          // Ensure the session is properly set before redirecting
          await new Promise(resolve => setTimeout(resolve, 1000));
          router.replace('/');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
        router.replace('/login');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      Loading...
    </div>
  );
} 