import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export interface ChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export const saveMessage = async (user: User, role: 'user' | 'assistant', content: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([
      {
        user_id: user.id,
        role,
        content,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error saving message:', error);
    throw error;
  }

  return data;
};

export const getRecentMessages = async (user: User, limit: number = 10) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data.reverse(); // Reverse to get chronological order
};

export const formatMessagesForGemini = (messages: ChatMessage[]) => {
  return messages.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));
}; 