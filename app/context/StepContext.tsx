import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useEffect, useMemo, useState } from "react"

import { fetchOnboardingData } from "@/services/onboarding/onboardingService"
import { delay } from "@/utils/delay"

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export interface StepContextType {
    activeStepId: string | null
    setActiveStepId: (id: string | null) => void

    data: any
    setData: Dispatch<SetStateAction<any>>

    isLoading: boolean
}

export const StepContext = createContext<StepContextType | null>(null)

export const StepProvider: FC<PropsWithChildren> = ({ children }) => {
    const [data, setData] = useState<any>(null)
    const [activeStepId, setActiveStepId] = useState<string | null>(null)
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                setLoading(true)
                const parsedData = await fetchOnboardingData()
                if (!mounted) return
                setData(parsedData)
            } finally {
                if (mounted)
                    setLoading(false)
            }
        }
        load()
        return () => {
            mounted = false
        }
    }, [])

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
