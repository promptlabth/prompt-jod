import { describe, it, expect, beforeEach, vi } from 'vitest';
import { chatWithGemini } from '../../services/gemini';
import { saveMessage, getRecentMessages } from '../../services/chatHistory';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis()
    })),
  }
}));

// Mock Google Generative AI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      startChat: vi.fn().mockReturnValue({
        sendMessage: vi.fn().mockResolvedValue({
          response: {
            text: vi.fn().mockReturnValue('Mock response'),
          },
        }),
      }),
    }),
  })),
}));

describe('Chat Service', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z'
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('chatWithGemini', () => {
    it('should handle normal chat response', async () => {
      const mockResponse = {
        text: 'Hello! How can I help you?',
        isReminder: false,
      };

      const result = await chatWithGemini('Hello', [], 'en');
      expect(result).toEqual(expect.objectContaining({
        text: expect.any(String),
        isReminder: false,
      }));
    });

    it('should handle reminder detection', async () => {
      const mockResponse = {
        text: 'I detected a reminder',
        isReminder: true,
        reminderData: {
          title: 'Meeting',
          description: 'Team meeting',
          dateTime: '2024-04-21T10:00:00Z',
          day: 'Sunday',
        },
      };

      const result = await chatWithGemini('Remind me about the team meeting tomorrow at 10 AM', [], 'en');
      expect(result).toEqual(expect.objectContaining({
        text: expect.any(String),
        isReminder: expect.any(Boolean),
      }));
    });

    it('should handle different languages', async () => {
      const result = await chatWithGemini('สวัสดี', [], 'th');
      expect(result).toEqual(expect.objectContaining({
        text: expect.any(String),
        isReminder: expect.any(Boolean),
      }));
    });
  });

  describe('Chat History', () => {
    describe('saveMessage', () => {
      it('should save user message', async () => {
        const mockMessage = {
          content: 'Hello',
          role: 'user' as const,
        };

        const mockDbResponse = {
          data: { id: 'msg1', ...mockMessage, user_id: mockUser.id },
          error: null,
        };

        vi.mocked(supabase.from).mockReturnValueOnce({
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce(mockDbResponse),
          url: '',
          headers: {},
          upsert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis()
        } as any);

        const result = await saveMessage(mockUser, mockMessage.role, mockMessage.content);
        expect(result).toEqual(mockDbResponse.data);
      });

      it('should save assistant message', async () => {
        const mockMessage = {
          content: 'How can I help you?',
          role: 'assistant' as const,
        };

        const mockDbResponse = {
          data: { id: 'msg2', ...mockMessage, user_id: mockUser.id },
          error: null,
        };

        vi.mocked(supabase.from).mockReturnValueOnce({
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValueOnce(mockDbResponse),
          url: '',
          headers: {},
          upsert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis()
        } as any);

        const result = await saveMessage(mockUser, mockMessage.role, mockMessage.content);
        expect(result).toEqual(mockDbResponse.data);
      });

      it('should handle save error', async () => {
        const mockError = new Error('Save failed');
        vi.mocked(supabase.from).mockReturnValueOnce({
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockRejectedValueOnce(mockError),
          url: '',
          headers: {},
          upsert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis()
        } as any);

        await expect(saveMessage(mockUser, 'user', 'Hello'))
          .rejects.toThrow(mockError);
      });
    });

    describe('getRecentMessages', () => {
      it('should fetch recent messages', async () => {
        const mockMessages = [
          { id: 'msg1', content: 'Hello', role: 'user' },
          { id: 'msg2', content: 'Hi there!', role: 'assistant' },
        ];

        vi.mocked(supabase.from).mockReturnValueOnce({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValueOnce({ data: mockMessages, error: null }),
          url: '',
          headers: {},
          upsert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis()
        } as any);

        const result = await getRecentMessages(mockUser);
        expect(result).toEqual(mockMessages.reverse());
      });

      it('should handle fetch error', async () => {
        const mockError = new Error('Fetch failed');
        vi.mocked(supabase.from).mockReturnValueOnce({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockRejectedValueOnce(mockError),
          url: '',
          headers: {},
          upsert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis()
        } as any);

        await expect(getRecentMessages(mockUser))
          .rejects.toThrow(mockError);
      });

      it('should respect message limit', async () => {
        const limit = 5;
        const mockMessages = Array(limit).fill(null).map((_, i) => ({
          id: `msg${i}`,
          content: `Message ${i}`,
          role: i % 2 === 0 ? 'user' : 'assistant'
        }));

        vi.mocked(supabase.from).mockReturnValueOnce({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValueOnce({ data: mockMessages, error: null }),
          url: '',
          headers: {},
          upsert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis()
        } as any);

        const result = await getRecentMessages(mockUser, limit);
        expect(result).toEqual(mockMessages.reverse());
      });
    });
  });
}); 