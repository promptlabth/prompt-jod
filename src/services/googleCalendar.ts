import { supabase } from '../lib/supabase';

interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  reminders: {
    useDefault: boolean;
    overrides: {
      method: 'email' | 'popup';
      minutes: number;
    }[];
  };
}

export async function createCalendarEvent(userId: string, event: CalendarEvent) {
  try {
    // Get the user's access token from Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw new Error('Failed to get session');
    }
    if (!session?.provider_token) {
      console.error('No provider token available');
      throw new Error('No access token available. Please reconnect your Google Calendar.');
    }

    console.log('Using access token:', session.provider_token.substring(0, 10) + '...');

    // Create the event using Google Calendar API
    const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.provider_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Calendar API error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Failed to create calendar event: ${errorData.error?.message || 'Unknown error'}`);
    }

    const calendarEvent = await response.json();
    console.log('Calendar event created successfully:', calendarEvent);
    return calendarEvent;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}

export async function checkCalendarConnection(userId: string) {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Session error:', sessionError);
      return false;
    }
    if (!session?.provider_token) {
      console.error('No provider token available');
      return false;
    }

    // Test the connection by making a simple API call
    const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        'Authorization': `Bearer ${session.provider_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Calendar API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // If the error is due to insufficient permissions, we need to re-authenticate
      if (response.status === 403) {
        console.error('Insufficient permissions. Please re-authenticate with Google Calendar.');
        return false;
      }
    }

    return response.ok;
  } catch (error) {
    console.error('Error checking calendar connection:', error);
    return false;
  }
} 