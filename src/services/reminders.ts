import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

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

export const saveAppointment = async (user: User, appointmentData: {
  title: string;
  description?: string;
  date: string;
  time: string;
  reminder_minutes_before?: number;
}): Promise<Appointment> => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([
      {
        user_id: user.id,
        title: appointmentData.title,
        description: appointmentData.description,
        date: appointmentData.date,
        time: appointmentData.time,
        reminder_minutes_before: appointmentData.reminder_minutes_before || 10,
      }
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save appointment: ${error.message}`);
  }

  return {
    ...data,
    datetime: new Date(data.datetime),
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  };
};

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