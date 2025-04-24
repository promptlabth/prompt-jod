import { Box, Typography } from '@mui/material';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  showText?: boolean;
  textSize?: 'small' | 'medium' | 'large';
}

const Logo = ({ size = 40, showText = true, textSize = 'medium' }: LogoProps) => {
  const getTextSize = () => {
    switch (textSize) {
      case 'small':
        return '1rem';
      case 'large':
        return '2rem';
      default:
        return '1.5rem';
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box 
        sx={{ 
          position: 'relative',
          width: size,
          height: size,
        }}
      >
        <Image
          src="/logo.webp"
          alt="พร้อมจด Logo"
          fill
          style={{ objectFit: 'contain' }}
          priority
        />
      </Box>
      {showText && (
        <Typography
          sx={{
            fontSize: getTextSize(),
            fontWeight: 600,
            color: '#4ECCA3',
            lineHeight: 1,
          }}
        >
          พร้อมจด
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 