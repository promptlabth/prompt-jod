export interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export interface ReminderData {
  title: string
  description: string
  date: Date
  reminderOffset: number // minutes before event
}

export interface User {
  id: string
  name: string
  email: string
  picture?: string
}
