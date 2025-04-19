"use client"

import { useContext } from "react"
import { useIntl } from "react-intl"
import { I18nContext } from "@/components/i18n/I18nProvider"

export function useTranslation() {
  const intl = useIntl()
  const { locale, setLocale, messages } = useContext(I18nContext)

  const t = (id: string, values?: Record<string, string | number>) => {
    return intl.formatMessage({ id }, values as Record<string, string>)
  }

  const changeLanguage = (newLocale: string) => {
    if (newLocale === "en" || newLocale === "th") {
      setLocale(newLocale)
    }
  }

  return {
    t,
    changeLanguage,
    currentLanguage: locale,
    messages,
  }
}
