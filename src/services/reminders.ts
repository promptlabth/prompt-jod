import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { createCalendarEvent } from './googleCalendar';

export interface Appointment {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format
  datetime: Date;
  reminder_minutes_before: number;
  created_at: Date;
  updated_at: Date;
}

interface ReminderData {
  title: string;
  description: string;
  dateTime: Date;
  offset: number;
}

export async function saveAppointment(userId: string, data: ReminderData) {
  try {
    // Convert date and time to ISO string
    const startDateTime = new Date(data.dateTime);
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30); // Default 30-minute duration

    // Create calendar event
    const calendarEvent = await createCalendarEvent(userId, {
      summary: data.title,
      description: data.description,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [
          {
            method: 'popup',
            minutes: data.offset,
          },
        ],
      },
    });

    // Save to Supabase
    const { data: appointment, error } = await supabase
      .from('appointments')
      .insert([
        {
          user_id: userId,
          title: data.title,
          description: data.description,
          date: startDateTime.toISOString().split('T')[0],
          time: startDateTime.toTimeString().split(' ')[0].substring(0, 5),
          reminder_minutes_before: data.offset
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return appointment;
  } catch (error) {
    console.error('Error saving appointment:', error);
    throw error;
  }
}

export async function getUpcomingReminders(userId: string) {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .gte('datetime', new Date().toISOString())
      .order('datetime', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

export const getAppointments = async (user: User): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', user.id)
    .order('datetime', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch appointments: ${error.message}`);
  }

  return data.map(appointment => ({
    ...appointment,
    datetime: new Date(appointment.datetime),
    created_at: new Date(appointment.created_at),
    updated_at: new Date(appointment.updated_at),
  }));
};

export const updateAppointment = async (user: User, appointmentId: string, updates: Partial<Appointment>): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', appointmentId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update appointment: ${error.message}`);
  }

  return {
    ...data,
    datetime: new Date(data.datetime),
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
};

export const deleteAppointment = async (user: User, appointmentId: string): Promise<void> => {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Failed to delete appointment: ${error.message}`);
  }
}; 