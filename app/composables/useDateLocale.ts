import { enGB, ptBR, sv } from "date-fns/locale"
import type { Locale } from "date-fns"

const DATE_LOCALES: Record<string, Locale> = {
  "en-GB": enGB,
  "pt-BR": ptBR,
  sv,
}

export function useDateLocale() {
  const { locale } = useI18n()
  return computed(() => DATE_LOCALES[locale.value] ?? enGB)
}
