"use client"

import type React from "react"

import { useState } from "react"
import { TextField, IconButton, Paper } from "@mui/material"
import { Send } from "lucide-react"
import { useTranslation } from "@/hooks/useTranslation"

interface MessageInputProps {
  onSendMessage: (content: string) => void
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const { t } = useTranslation()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={3}
      className="p-2 m-4 flex items-center bg-white dark:bg-gray-700"
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder={t("message_placeholder")}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-grow"
        size="small"
        InputProps={{
          className: "dark:text-white",
        }}
      />
      <IconButton type="submit" color="primary" className="ml-2" disabled={!message.trim()}>
        <Send />
      </IconButton>
    </Paper>
  )
}
