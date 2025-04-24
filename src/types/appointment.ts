import { Appointment as BaseAppointment } from '../services/reminders';

export interface Appointment extends Omit<BaseAppointment, 'datetime' | 'created_at' | 'updated_at'> {
  datetime: string;
  created_at: string;
  updated_at: string;
  isAddedToCalendar?: boolean;
} 