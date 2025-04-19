"use client"

import type React from "react"

import { createContext, useState, useEffect } from "react"
import { IntlProvider } from "react-intl"
import enMessages from "@/i18n/locales/en/common.json"
import thMessages from "@/i18n/locales/th/common.json"

type Locale = "en" | "th"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: Record<string, string>
}

export const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  messages: {},
})

const messages: Record<Locale, Record<string, string>> = {
  en: enMessages,
  th: thMessages,
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en")

  // Load saved locale from localStorage on client side
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && (savedLocale === "en" || savedLocale === "th")) {
      setLocale(savedLocale)
    }
  }, [])

  // Save locale to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("locale", locale)
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, setLocale, messages: messages[locale] }}>
      <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="en">
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  )
}
