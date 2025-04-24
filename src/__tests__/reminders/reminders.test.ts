import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../lib/supabase';
import { saveAppointment, getUpcomingReminders, updateAppointment, deleteAppointment } from '../../services/reminders';
import { createCalendarEvent } from '../../services/googleCalendar';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  }
}));

// Mock Google Calendar
vi.mock('../../services/googleCalendar', () => ({
  createCalendarEvent: vi.fn()
}));

describe('Reminders Service', () => {
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

  describe('saveAppointment', () => {
    it('should save appointment to both calendar and database', async () => {
      const mockAppointment = {
        title: 'Test Appointment',
        description: 'Test Description',
        dateTime: new Date('2024-04-01T10:00:00Z'),
        offset: 30
      };

      const mockDbResponse = {
        data: { id: 'appt1', ...mockAppointment, user_id: mockUser.id },
        error: null
      };

      vi.mocked(createCalendarEvent).mockResolvedValueOnce({ id: 'cal1' });

      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce(mockDbResponse)
      } as any);

      const result = await saveAppointment(mockUser.id, mockAppointment);
      expect(result).toEqual(mockDbResponse.data);
    });

    it('should handle database error', async () => {
      const mockError = new Error('Database error');
      
      vi.mocked(createCalendarEvent).mockResolvedValueOnce({ id: 'cal1' });

      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockRejectedValueOnce(mockError)
      } as any);

      await expect(saveAppointment(mockUser.id, {
        title: 'Test',
        description: 'Test',
        dateTime: new Date('2024-04-01T10:00:00Z'),
        offset: 30
      })).rejects.toThrow('Database error');
    });
  });

  describe('getUpcomingReminders', () => {
    it('should fetch upcoming reminders', async () => {
      const mockReminders = [
        { id: '1', title: 'Reminder 1' },
        { id: '2', title: 'Reminder 2' }
      ];

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValueOnce({ data: mockReminders, error: null })
      } as any);

      const result = await getUpcomingReminders(mockUser.id);
      expect(result).toEqual(mockReminders);
    });

    it('should handle fetch error', async () => {
      const mockError = new Error('Fetch error');

      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        order: vi.fn().mockRejectedValueOnce(mockError)
      } as any);

      await expect(getUpcomingReminders(mockUser.id)).rejects.toThrow('Fetch error');
    });
  });

  describe('updateAppointment', () => {
    it('should update appointment', async () => {
      const mockUpdate = {
        id: 'appt1',
        title: 'Updated Title'
      };

      vi.mocked(supabase.from).mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({ data: mockUpdate, error: null })
      } as any);

      await expect(updateAppointment(mockUser, mockUpdate.id, mockUpdate)).resolves.not.toThrow();
    });

    it('should handle update error', async () => {
      const mockError = new Error('Update error');
      const mockUpdate = {
        id: 'appt1',
        title: 'Test'
      };

      vi.mocked(supabase.from).mockReturnValueOnce({
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockRejectedValueOnce(mockError)
      } as any);

      await expect(updateAppointment(mockUser, mockUpdate.id, mockUpdate)).rejects.toThrow('Update error');
    });
  });

  describe('deleteAppointment', () => {
    it('should delete appointment', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({ data: null, error: null })
      } as any);

      await expect(deleteAppointment(mockUser, 'appt1')).resolves.not.toThrow();
    });
  });
}); 