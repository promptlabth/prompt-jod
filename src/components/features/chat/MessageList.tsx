"use client"

import type React from "react"

import { Box, Avatar, Paper, Typography } from "@mui/material"
import type { Message } from "@/types"
import { Bot } from "lucide-react"

interface MessageListProps {
  messages: Message[]
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export default function MessageList({ messages, messagesEndRef }: MessageListProps) {
  return (
    <Box className="flex-grow p-4 overflow-y-auto">
      {messages.map((message) => (
        <Box key={message.id} className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
          {message.sender === "bot" && (
            <Avatar className="mr-2 bg-primary">
              <Bot size={20} />
            </Avatar>
          )}

          <Paper
            elevation={0}
            className={`p-3 max-w-[70%] ${
              message.sender === "user"
                ? "bg-primary text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                : "bg-white dark:bg-gray-700 rounded-tl-lg rounded-tr-lg rounded-br-lg"
            }`}
          >
            <Typography variant="body1">{message.content}</Typography>
          </Paper>

          {message.sender === "user" && (
            <Avatar className="ml-2 bg-gray-300">{/* User avatar - could be from auth profile */}U</Avatar>
          )}
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  )
}
