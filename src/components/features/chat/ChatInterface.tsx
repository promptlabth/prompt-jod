"use client"

import { useState, useRef, useEffect } from "react"
import { Box, Paper } from "@mui/material"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import ReminderModal from "../reminders/ReminderModal"
import { useTranslation } from "@/hooks/useTranslation"
import { detectReminder } from "@/utils/reminder-detection"
import type { Message, ReminderData } from "@/types"
import { toast } from "react-toastify"

export default function ChatInterface() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: t("welcome_message"),
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [reminderModalOpen, setReminderModalOpen] = useState(false)
  const [reminderData, setReminderData] = useState<ReminderData | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Check for reminder in the message
    const reminderInfo = detectReminder(content)

    // Simulate AI response (with delay for realism)
    setTimeout(() => {
      let botResponse: string

      if (reminderInfo) {
        botResponse = t("reminder_detected")
        setReminderData(reminderInfo)
        setReminderModalOpen(true)
      } else {
        botResponse = t("ai_response")
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleSaveReminder = (reminder: ReminderData) => {
    // Here you would typically save the reminder to your backend
    toast.success(t("reminder_saved"))
    setReminderModalOpen(false)

    // Add confirmation message to chat
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      content: t("reminder_confirmation", { title: reminder.title, date: reminder.date }),
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, confirmationMessage])
  }

  return (
    <Box className="flex flex-col h-full">
      <Paper elevation={0} className="flex-grow flex flex-col h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-800">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        <MessageInput onSendMessage={handleSendMessage} />
      </Paper>

      <ReminderModal
        open={reminderModalOpen}
        onClose={() => setReminderModalOpen(false)}
        reminderData={reminderData}
        onSave={handleSaveReminder}
      />
    </Box>
  )
}
