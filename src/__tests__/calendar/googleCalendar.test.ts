import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../lib/supabase';
import { createCalendarEvent } from '../../services/googleCalendar';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn()
    }
  }
}));

// Mock fetch
global.fetch = vi.fn();

describe('Google Calendar Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create calendar event successfully', async () => {
    const mockAccessToken = 'mock-access-token';
    const mockEventId = 'mock-event-id';

    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: {
        session: {
          provider_token: mockAccessToken
        }
      },
      error: null
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: mockEventId })
    });

    const event = {
      title: 'Test Event',
      description: 'Test Description',
      startTime: '2024-04-01T10:00:00Z',
      endTime: '2024-04-01T11:00:00Z'
    };

    const result = await createCalendarEvent(event);
    expect(result).toEqual({ id: mockEventId });
  });

  it('should handle session error', async () => {
    const mockError = new Error('Session error');
    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: { session: null },
      error: mockError
    });

    const event = {
      title: 'Test Event',
      description: 'Test Description',
      startTime: '2024-04-01T10:00:00Z',
      endTime: '2024-04-01T11:00:00Z'
    };

    await expect(createCalendarEvent(event)).rejects.toThrow('Failed to get session');
  });

  it('should handle Google Calendar API error', async () => {
    const mockAccessToken = 'mock-access-token';

    vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({
      data: {
        session: {
          provider_token: mockAccessToken
        }
      },
      error: null
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ error: { message: 'Invalid request' } })
    });

    const event = {
      title: 'Test Event',
      description: 'Test Description',
      startTime: '2024-04-01T10:00:00Z',
      endTime: '2024-04-01T11:00:00Z'
    };

    await expect(createCalendarEvent(event)).rejects.toThrow('Failed to create calendar event');
  });
}); 