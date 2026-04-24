import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useEffect, useMemo, useState } from "react"

import { fetchOnboardingData } from "@/services/onboarding"
import type { OnboardingType } from "@/services/onboarding"
import { delay } from "@/utils/delay"

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface StepContextType {
    activeStepId: string | null
    setActiveStepId: (id: string | null) => void

    data: OnboardingType | null
    setData: Dispatch<SetStateAction<OnboardingType | null>>

    isLoading: boolean
}

export const StepContext = createContext<StepContextType | null>(null)

export const StepProvider: FC<PropsWithChildren> = ({ children }) => {
    const [data, setData] = useState<OnboardingType | null>(null)
    const [input, setInput] = useState<OnboardingType | null>(null)
    const [activeStepId, setActiveStepId] = useState<string | null>(null)
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        let mounted = true

        const load = async () => {
            try {
                setLoading(true)
                const parsedData = await fetchOnboardingData()
                await delay(1400)

                if (!mounted) return

                setData(parsedData)
            } finally {
                if (mounted) setLoading(false)
            }
        }

        load()

        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => {
        if (!data?.steps.length) {
            setActiveStepId(null)
            return
        }

        setActiveStepId((currentActiveStepId) => {
            if (currentActiveStepId && data.steps.some((step) => step.id === currentActiveStepId)) {
                return currentActiveStepId
            }

            return data.steps[0].id
        })
    }, [data])

    const value = useMemo<StepContextType>(
        () => ({
            activeStepId,
            setActiveStepId,
            data,
            setData,
            isLoading,
        }),
        [activeStepId, data, isLoading],
    )

    return <StepContext.Provider value={value}>{children}</StepContext.Provider>
}

export const useStepContext = () => {
    const context = useContext(StepContext)
    if (!context) throw new Error("useStepContext must be used within a StepProvider")
    return context
}
