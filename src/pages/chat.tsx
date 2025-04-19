import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ReminderModal, { ReminderData } from '../components/ReminderModal';
import { Box, TextField, IconButton, Paper, Typography, useTheme, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { chatWithGemini } from '../services/gemini';
import { parse } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ReminderResponse {
  text: string;
  isReminder: boolean;
  reminderData?: {
    title: string;
    description: string;
    dateTime: string;
    day: string;
  };
}

const ChatPage = () => {
  const { t, i18n } = useTranslation('common');
  const theme = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reminderData, setReminderData] = useState<ReminderData | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const parseReminderData = (data: ReminderResponse['reminderData']): ReminderData | null => {
    if (!data) return null;
    
    let date = new Date();
    const [hours, minutes] = data.dateTime.split(':').map(Number);
    
    // Adjust date based on day
    if (data.day === 'พรุ่งนี้' || data.day === 'tomorrow') {
      date.setDate(date.getDate() + 1);
    } else if (data.day === 'มะรืนนี้' || data.day === 'day after tomorrow') {
      date.setDate(date.getDate() + 2);
    }
    
    date.setHours(hours, minutes, 0, 0);
    
    return {
      title: data.title,
      description: data.description,
      dateTime: date,
      offset: '30min',
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        text: input,
        isUser: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Get AI response
      const response = await chatWithGemini(input, i18n.language);

      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);

      // If it's a reminder, open the modal with the data
      if (response.isReminder && response.reminderData) {
        const parsedReminderData = parseReminderData(response.reminderData);
        if (parsedReminderData) {
          setReminderData(parsedReminderData);
          setIsReminderModalOpen(true);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: i18n.language === 'th' ? 'ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองอีกครั้ง' : 'Sorry, an error occurred. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleReminderSave = (reminder: ReminderData) => {
    // TODO: Implement reminder saving logic
    console.log('Reminder saved:', reminder);
    setIsReminderModalOpen(false);
    setReminderData(null);
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 200px)',
        flex: 1,
      }}
    >
      <Paper 
        elevation={0}
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 4,
          mb: 4,
          backgroundColor: 'transparent',
          border: '1px solid rgba(78, 204, 163, 0.1)',
          borderRadius: '20px',
        }}
      >
        {messages.length === 0 ? (
          <Typography 
            align="center"
            sx={{ 
              color: theme.palette.text.secondary,
              py: 8,
            }}
          >
            {t('chat.noMessages')}
          </Typography>
        ) : (
          messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  maxWidth: '70%',
                  p: 2,
                  backgroundColor: message.isUser 
                    ? 'rgba(78, 204, 163, 0.1)'
                    : 'rgba(78, 204, 163, 0.05)',
                  color: theme.palette.text.primary,
                  borderRadius: '16px',
                  border: '1px solid rgba(78, 204, 163, 0.1)',
                }}
              >
                <Typography>{message.text}</Typography>
              </Paper>
            </Box>
          ))
        )}
      </Paper>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('chat.inputPlaceholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          multiline
          maxRows={4}
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'transparent',
              borderRadius: '20px',
              border: '1px solid rgba(78, 204, 163, 0.1)',
              '&:hover': {
                borderColor: 'rgba(78, 204, 163, 0.3)',
              },
              '&.Mui-focused': {
                borderColor: '#4ECCA3',
              },
              '& fieldset': {
                borderColor: 'transparent',
              },
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          sx={{
            backgroundColor: 'rgba(78, 204, 163, 0.1)',
            color: '#4ECCA3',
            width: 56,
            height: 56,
            borderRadius: '20px',
            '&:hover': {
              backgroundColor: 'rgba(78, 204, 163, 0.2)',
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(78, 204, 163, 0.05)',
              color: 'rgba(78, 204, 163, 0.3)',
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
        </IconButton>
      </Box>

      <ReminderModal
        open={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setReminderData(null);
        }}
        onSave={handleReminderSave}
        initialData={reminderData}
      />
      <LoginModal 
        open={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </Box>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default ChatPage; 