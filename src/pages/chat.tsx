import { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ReminderModal, { ReminderData } from '../components/ReminderModal';
import { Box, TextField, IconButton, Paper, Typography, useTheme, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { chatWithGemini } from '../services/gemini';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from '../components/LoginModal';
import { saveMessage, getRecentMessages, ChatMessage } from '../services/chatHistory';
import { saveAppointment } from '../services/reminders';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
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
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Load chat history when user is authenticated
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user) {
        try {
          const history = await getRecentMessages(user);
          setChatHistory(history);
          
          // Convert chat history to messages for display
          const displayMessages = history.map(msg => ({
            id: msg.id,
            text: msg.content,
            isUser: msg.role === 'user',
            timestamp: new Date(msg.created_at)
          }));
          setMessages(displayMessages);
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      }
    };

    loadChatHistory();
  }, [user]);

  const handleSend = async () => {
    if (!input.trim() || !user) {
      if (!user) {
        setIsLoginModalOpen(true);
      }
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Save user message to history
      const savedUserMessage = await saveMessage(user, 'user', userMessage);
      
      // Add user message to display
      setMessages(prev => [...prev, {
        id: savedUserMessage.id,
        text: userMessage,
        isUser: true,
        timestamp: new Date()
      }]);

      // Get response from Gemini with chat history
      const response = await chatWithGemini(userMessage, chatHistory, i18n.language);
      
      // Save assistant message to history
      const savedAssistantMessage = await saveMessage(user, 'assistant', response.text);
      
      // Add assistant message to display
      setMessages(prev => [...prev, {
        id: savedAssistantMessage.id,
        text: response.text,
        isUser: false,
        timestamp: new Date()
      }]);

      // Update chat history
      setChatHistory(prev => [...prev, savedUserMessage, savedAssistantMessage]);

      // Handle reminder if detected
      if (response.isReminder && response.reminderData) {
        let date = new Date();
        const [hours, minutes] = response.reminderData.dateTime.split(':').map(Number);
        
        // Adjust date based on day
        if (response.reminderData.day === 'พรุ่งนี้' || response.reminderData.day === 'tomorrow') {
          date.setDate(date.getDate() + 1);
        } else if (response.reminderData.day === 'มะรืนนี้' || response.reminderData.day === 'day after tomorrow') {
          date.setDate(date.getDate() + 2);
        }
        
        date.setHours(hours, minutes, 0, 0);
        
        setReminderData({
          title: response.reminderData.title,
          description: response.reminderData.description,
          dateTime: date,
          offset: '30min'
        });
        setIsReminderModalOpen(true);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      // Add error message to display
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: i18n.language === 'th' ? 'ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองอีกครั้ง' : 'Sorry, an error occurred. Please try again.',
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReminderSave = async (reminder: ReminderData) => {
    if (!user) return;

    try {
      // Convert the date and time to the required format
      const date = reminder.dateTime.toISOString().split('T')[0];
      const time = reminder.dateTime.toTimeString().split(' ')[0].substring(0, 5);
      
      await saveAppointment(user, {
        title: reminder.title,
        description: reminder.description,
        date,
        time,
        reminder_minutes_before: 10 // Default to 10 minutes before
      });

      // Show success message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: i18n.language === 'th' 
          ? 'บันทึกการนัดหมายเรียบร้อยแล้วครับ' 
          : 'Appointment saved successfully',
        isUser: false,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error saving appointment:', error);
      // Show error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: i18n.language === 'th' 
          ? 'ขออภัยครับ ไม่สามารถบันทึกการนัดหมายได้ กรุณาลองอีกครั้ง' 
          : 'Sorry, failed to save appointment. Please try again.',
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsReminderModalOpen(false);
      setReminderData(null);
    }
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