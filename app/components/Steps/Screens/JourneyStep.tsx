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
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StepsParamList } from "@/navigators/StepsNavigation"

type JourneyStepProps = NativeStackScreenProps<StepsParamList, "englishJourney">

export function JourneyStep({ route }: JourneyStepProps) {
  const { themed } = useAppTheme()
  const { lang } = useLang()
  const { data } = useStepContext()
  const stepId = route.params?.stepId
  
  // DATA
  const stepData = data?.onboardingFlow?.steps?.find((step: any) => step._id === stepId)
  // Break to texts
  console.log("[JourneyStep.tsx]", "data", stepData)
  const title = stepData?.content[lang]?.text1 ??  ""
  const body: string = stepData?.content[lang]?.text2 ?? ""
  const chartTitle = stepData?.content?.[lang]?.text3 ?? stepData?.content?.en?.text3 ?? ""
  const chartBubble1 = stepData?.content?.[lang]?.text4 ?? stepData?.content?.en?.text4 ?? ""
  const chartBubble2 = stepData?.content?.[lang]?.text5 ?? stepData?.content?.en?.text5 ?? ""
  const chartBubble3 = stepData?.content?.[lang]?.text6 ?? stepData?.content?.en?.text6 ?? ""
  const chartWhen = stepData?.content?.[lang]?.text7 ?? stepData?.content?.en?.text7 ?? ""
  const chartTime = stepData?.content?.[lang]?.text8 ?? stepData?.content?.en?.text8 ?? ""
  // const bodyParts = useMemo<string[]>(() => body.split(/(\*[^*]+\*)/g).filter(Boolean), [body])
  const bodyParts = body.split(/(\*[^*]+\*)/g).filter(Boolean)

  return (
    <StepScreenLayout background={<GradientBG />} style={themed($stepContainer)} contentStyle={$content}>
      
      {/* ---=== Chart ===--- */}
      <Chart 
        txTitle={chartTitle}
        txWhen={chartWhen}
        txTime={chartTime}
        txBubble1={chartBubble1}
        txBubble2={chartBubble2}
        txBubble3={chartBubble3}
      />

      {/* ---=== Bottom Texts ===--- */}
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
