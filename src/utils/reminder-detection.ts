/**
 * Simple utility to detect potential reminders in user messages
 * In a real app, this would use NLP or AI to detect reminders more accurately
 */
import type { ReminderData } from "@/types"

export function detectReminder(message: string): ReminderData | null {
  // Simple keyword detection for demo purposes
  const reminderKeywords = ["remind", "remember", "appointment", "meeting", "schedule", "calendar"]
  const hasReminderKeyword = reminderKeywords.some((keyword) => message.toLowerCase().includes(keyword))

  if (!hasReminderKeyword) return null

  // Extract potential date/time information
  // This is a very basic implementation - in a real app, use a date parsing library
  const dateRegex = /(\d{1,2})[/\-.](\d{1,2})(?:[/\-.](\d{2,4}))?/
  const timeRegex = /(\d{1,2}):(\d{2})\s*(am|pm)?/i

  const dateMatch = message.match(dateRegex)
  const timeMatch = message.match(timeRegex)

  const now = new Date()
  const reminderDate = new Date()

  if (dateMatch) {
    const day = Number.parseInt(dateMatch[1])
    const month = Number.parseInt(dateMatch[2]) - 1 // JS months are 0-indexed
    const year = dateMatch[3] ? Number.parseInt(dateMatch[3]) : now.getFullYear()

    reminderDate.setFullYear(year)
    reminderDate.setMonth(month)
    reminderDate.setDate(day)
  }

  if (timeMatch) {
    let hours = Number.parseInt(timeMatch[1])
    const minutes = Number.parseInt(timeMatch[2])
    const ampm = timeMatch[3]?.toLowerCase()

    if (ampm === "pm" && hours < 12) hours += 12
    if (ampm === "am" && hours === 12) hours = 0

    reminderDate.setHours(hours)
    reminderDate.setMinutes(minutes)
  }

  // Extract potential title from the message
  // This is a very basic implementation
  let title = ""
  const aboutIndex = message.toLowerCase().indexOf("about")
  if (aboutIndex !== -1) {
    title = message.substring(aboutIndex + 6).trim()
    // Truncate at punctuation
    const punctuationIndex = title.search(/[.!?]/)
    if (punctuationIndex !== -1) {
      title = title.substring(0, punctuationIndex)
    }
  } else {
    // Just use the first part of the message
    title = message.split(".")[0]
    if (title.length > 50) {
      title = title.substring(0, 50) + "..."
    }
  }

  return {
    title,
    description: message,
    date: reminderDate,
    reminderOffset: 10, // Default 10 minutes before
  }
}
