import { View, ViewStyle } from "react-native"

import { FadeInFadeOut } from "@/components/Anims/FadeInFadeOut"
import { Chart } from "@/components/Steps/Chart"
import { GradientBG } from "@/components/Steps/GradientBG"
import { StepScreenLayout } from "@/components/Steps/StepScreenLayout"
import { Text } from "@/components/UI/Text"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import type { Theme } from "@/theme/types"
import { useStepContext } from "@/context/StepContext"
import { useLang } from "@/context/LangContext"
import { useMemo } from "react"

export function JourneyStep() {
  const { themed } = useAppTheme()
  const { lang } = useLang()
  const { responses, activeStepId, data } = useStepContext()

  const stepData = useMemo(() => {
    if (!data) return null

    const findStep = (id?: string | null) => {
      if (!id) return null
      return data.steps.find((step) => step.id === id) ?? null
    }

    const fallbackStep = findStep(activeStepId)

    const latestResponse = responses?.responses.at(-1)
    if (!latestResponse) return fallbackStep

    const sourceStep = findStep(latestResponse.stepId)
    if (!sourceStep) return fallbackStep

    const matchedNextStep = sourceStep.nextSteps.find((nextStep) => {
      if (nextStep.conditions.length === 0) return true
      return nextStep.conditions.some(
        (condition) =>
          condition.stepId === latestResponse.stepId && latestResponse.selectedOptionIds.includes(condition.optionId),
      )
    })

    if (!matchedNextStep) return fallbackStep

    return findStep(matchedNextStep.nextStepId) ?? fallbackStep
  }, [data, responses, activeStepId])

  const copy = stepData?.content[lang] ?? stepData?.content.en
  const title = copy?.text1 ?? ""
  const body = copy?.text2 ?? ""
  const bodyParts = useMemo(() => body.split(/(\*[^*]+\*)/g).filter(Boolean), [body])

  console.log("JourneyStep render", stepData)

  return (
    <StepScreenLayout background={<GradientBG />} style={themed($stepContainer)} contentStyle={$content}>
      <Chart />

      <View style={{ flex: 1, maxWidth: 650, justifyContent: "center", alignSelf: "center", paddingHorizontal: spacing.lg, gap: 24 }}>
        <FadeInFadeOut in="left" inDelay={800} style={$spaceBottom}>
          <Text preset="heading" text={title} />
        </FadeInFadeOut>
        <FadeInFadeOut in="bottom" inDelay={1200} inDuration={260} style={$spaceBottom}>
          <Text preset="subheading">
            {bodyParts.map((part, index) => {
              const isHighlighted = part.startsWith("*") && part.endsWith("*")
              if (!isHighlighted) return part

              return (
                <Text key={`${part}-${index}`} preset="subheading" style={themed($subheadingHighlight)}>
                  {part.slice(1, -1)}
                </Text>
              )
            })}
          </Text>
        </FadeInFadeOut>
      </View>
    </StepScreenLayout>
  )
}

const $stepContainer = (theme: any): ViewStyle => ({
  flex: 1,
  // backgroundColor: theme.colors.background,
})

const $content: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
}

const $spaceBottom: ViewStyle = {
  marginBottom: spacing.md,
}

const $subheadingHighlight = (theme: Theme) => ({
  color: theme.colors.palette.primary500,
})
