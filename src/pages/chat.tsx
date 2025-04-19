import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ReminderModal, { ReminderData } from '../components/ReminderModal';
import { Box, TextField, IconButton, Paper, Typography, useTheme } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatPage = () => {
  const { t } = useTranslation('common');
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: t('chat.reminderDetected'),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsReminderModalOpen(true);
    }, 1000);
  };

  const handleReminderSave = (reminder: ReminderData) => {
    // TODO: Implement reminder saving logic
    console.log('Reminder saved:', reminder);
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
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
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
          sx={{
            backgroundColor: 'rgba(78, 204, 163, 0.1)',
            color: '#4ECCA3',
            width: 56,
            height: 56,
            borderRadius: '20px',
            '&:hover': {
              backgroundColor: 'rgba(78, 204, 163, 0.2)',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>

      <ReminderModal
        open={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSave={handleReminderSave}
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