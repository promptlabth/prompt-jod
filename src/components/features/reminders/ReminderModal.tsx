"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material"
import { DatePicker, TimePicker } from "@mui/x-date-pickers"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { useTranslation } from "@/hooks/useTranslation"
import type { ReminderData } from "@/types"
import { Calendar } from "lucide-react"

interface ReminderModalProps {
  open: boolean
  onClose: () => void
  reminderData: ReminderData | null
  onSave: (reminder: ReminderData) => void
}

export default function ReminderModal({ open, onClose, reminderData, onSave }: ReminderModalProps) {
  const { t } = useTranslation()
  const [reminder, setReminder] = useState<ReminderData>({
    title: "",
    description: "",
    date: new Date(),
    reminderOffset: 10, // Default 10 minutes before
  })

  // Update form when reminderData changes
  useEffect(() => {
    if (reminderData) {
      setReminder({
        ...reminderData,
        // Ensure we have defaults for any missing fields
        title: reminderData.title || "",
        description: reminderData.description || "",
        date: reminderData.date || new Date(),
        reminderOffset: reminderData.reminderOffset || 10,
      })
    }
  }, [reminderData])

  const handleChange = (field: keyof ReminderData, value: any) => {
    setReminder((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave(reminder)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("new_reminder")}</DialogTitle>
      <DialogContent>
        <Box className="space-y-4 mt-2">
          <TextField
            fullWidth
            label={t("reminder_title")}
            value={reminder.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />

          <TextField
            fullWidth
            label={t("reminder_description")}
            value={reminder.description}
            onChange={(e) => handleChange("description", e.target.value)}
            multiline
            rows={3}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box className="flex flex-col sm:flex-row gap-4">
              <DatePicker
                label={t("date")}
                value={reminder.date}
                onChange={(date) => date && handleChange("date", date)}
                className="flex-1"
              />
              <TimePicker
                label={t("time")}
                value={reminder.date}
                onChange={(date) => date && handleChange("date", date)}
                className="flex-1"
              />
            </Box>
          </LocalizationProvider>

          <FormControl fullWidth>
            <InputLabel>{t("reminder_offset")}</InputLabel>
            <Select
              value={reminder.reminderOffset}
              label={t("reminder_offset")}
              onChange={(e) => handleChange("reminderOffset", e.target.value)}
            >
              <MenuItem value={0}>{t("at_event_time")}</MenuItem>
              <MenuItem value={5}>5 {t("minutes_before")}</MenuItem>
              <MenuItem value={10}>10 {t("minutes_before")}</MenuItem>
              <MenuItem value={15}>15 {t("minutes_before")}</MenuItem>
              <MenuItem value={30}>30 {t("minutes_before")}</MenuItem>
              <MenuItem value={60}>1 {t("hour_before")}</MenuItem>
            </Select>
          </FormControl>

          <Box className="mt-4 p-3 border border-dashed rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700">
            <Box className="flex items-center mb-2">
              <Calendar size={20} className="mr-2 text-primary" />
              <Typography variant="subtitle1">{t("google_calendar")}</Typography>
            </Box>
            <Button variant="outlined" fullWidth startIcon={<Calendar size={16} />}>
              {t("add_to_google_calendar")}
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!reminder.title}>
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
