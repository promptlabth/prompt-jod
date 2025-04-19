"use client"

import type React from "react"

import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from "@mui/material"
import { useState } from "react"
import { useTranslation } from "@/hooks/useTranslation"
import { useTheme } from "next-themes"
import { Sun, Moon, Languages } from "lucide-react"

export default function Navbar() {
  const { t, changeLanguage, currentLanguage } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [languageMenu, setLanguageMenu] = useState<null | HTMLElement>(null)

  const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageMenu(event.currentTarget)
  }

  const handleLanguageMenuClose = () => {
    setLanguageMenu(null)
  }

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang)
    handleLanguageMenuClose()
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <AppBar position="static" color="default" elevation={1} className="bg-white dark:bg-gray-900">
      <Toolbar className="justify-between">
        <Typography variant="h6" component="div" className="font-bold text-primary dark:text-white">
          Prompt Jod
        </Typography>

        <Box className="flex items-center">
          <IconButton onClick={toggleTheme} className="mr-2">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </IconButton>

          <IconButton onClick={handleLanguageMenuOpen}>
            <Languages size={20} />
          </IconButton>
          <Menu anchorEl={languageMenu} open={Boolean(languageMenu)} onClose={handleLanguageMenuClose}>
            <MenuItem onClick={() => handleLanguageChange("en")} selected={currentLanguage === "en"}>
              English
            </MenuItem>
            <MenuItem onClick={() => handleLanguageChange("th")} selected={currentLanguage === "th"}>
              ไทย
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
