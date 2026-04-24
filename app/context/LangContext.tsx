import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo } from "react"
import { useMMKVString } from "react-native-mmkv"

export type LangCode = "en" | "es" | "pt" | "ko" | "ar" | "he" | "de" | "fr" | "it" | "ru" | "vi" | "az"

export interface LangOption {
    code: LangCode
    label: string
    flagUrl: string
}

export const LANG_OPTIONS: LangOption[] = [
    { code: "en", label: "English", flagUrl: "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/flags/english.svg" },
    { code: "es", label: "Español", flagUrl: "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/flags/spanish.svg" },
    { code: "pt", label: "Português", flagUrl: "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/flags/portuguese.svg" },
    { code: "ko", label: "한국어", flagUrl: "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/flags/korean.svg" },
    { code: "ar", label: "العربية", flagUrl: "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/flags/arabic.svg" },
    { code: "he", label: "עברית", flagUrl: "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/flags/hebrew.svg" },
    { code: "de", label: "Deutsch", flagUrl: "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/flags/german.svg" },
    { code: "fr", label: "Français", flagUrl: "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/flags/french.svg" },
    { code: "it", label: "Italiano", flagUrl: "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/flags/italian.svg" },
    { code: "ru", label: "Русский", flagUrl: "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/flags/russian.svg" },
    { code: "vi", label: "Tiếng Việt", flagUrl: "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/flags/vietnamese.svg" },
    { code: "az", label: "Azərbaycan", flagUrl: "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/flags/azerbaijani.svg" },
]

export type LangContextType = {
    lang: LangCode
    langOption: LangOption
    setLang: (lang: LangCode) => void
}

export const LangContext = createContext<LangContextType | null>(null)

export const LangProvider: FC<PropsWithChildren> = ({ children }) => {
    const [storedLang, setStoredLang] = useMMKVString("LangProvider.lang")

    const lang = useMemo<LangCode>(
        () => (LANG_OPTIONS.find((o) => o.code === storedLang) ? (storedLang as LangCode) : "en"),
        [storedLang],
    )

    const langOption = useMemo(() => LANG_OPTIONS.find((o) => o.code === lang)!, [lang])

    const setLang = useCallback(
        (next: LangCode) => {
            setStoredLang(next)
        },
        [setStoredLang],
    )

    const value = useMemo<LangContextType>(
        () => ({ lang, langOption, setLang }),
        [lang, langOption, setLang],
    )

    return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export const useLang = () => {
    const context = useContext(LangContext)
    if (!context) throw new Error("useLang must be used within a LangProvider")
    return context
}
