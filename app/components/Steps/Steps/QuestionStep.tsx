import { TextStyle, useWindowDimensions, View, ViewStyle } from "react-native"
import { Easing } from "react-native-reanimated"

import { FadeInFadeOut } from "@/components/Anims/FadeInFadeOut"
import { FadeInOutScale } from "@/components/Anims/FadeInOutScale"
import { Image } from "@/components/UI/Image"
import { TalkBubble } from "@/components/Steps/TalkBubble"
import { StepScreenLayout } from "@/components/Steps/StepScreenLayout"
import { Button, ButtonAccessoryProps } from "@/components/UI/Button"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import { ComponentType, useMemo } from "react"
import { useStepContext } from "@/context/StepContext"
import { useLang } from "@/context/LangContext"
import { OnboardingOption } from "@/services/onboarding/types"

const WIDE_LAYOUT_BREAKPOINT = 720

export function QuestionStep() {
  const { themed } = useAppTheme()
  const { lang } = useLang()
  // const [state, setState] = useState<ButtonState>("default")
  const { width } = useWindowDimensions()
  const isWide = width >= WIDE_LAYOUT_BREAKPOINT

  const { isLoading, responses, setResponses, activeStepId, data } = useStepContext();
  
  const stepData = useMemo(() => {
    if (!data || !activeStepId) return null
    const step = data.steps.find((step) => step.id === activeStepId)
    if (!step) return null
    return step
  }, [data, activeStepId])

  const selectedOptionIds = useMemo(() => {
    return responses?.responses.find((r) => r.stepId === activeStepId)?.selectedOptionIds ?? []
  }, [responses, activeStepId])

  // Build stable LeftAccessory components per option so React never unmounts/remounts them.
  // Keep this hook above any conditional return to preserve hook call order.
  const optionAccessories = useMemo(() => {
    const map = new Map<string, ComponentType<ButtonAccessoryProps>>()
    if (!stepData) return map

    for (const option of stepData.options) {
      const uri = option.imgUrl ?? ""
      map.set(option.id, ({ style }: ButtonAccessoryProps) => <Image uri={uri} style={[style, $signalIcon]} />)
    }
    return map
  }, [stepData])

  const handleOptionPress = (option: OnboardingOption) => {
    if (!activeStepId) return

    const isSelected = selectedOptionIds.includes(option.id)
    setResponses((prev) => {
      const existing = prev?.responses ?? []
      const others = existing.filter((r) => r.stepId !== activeStepId)
      if (isSelected) return { responses: others }
      return { responses: [...others, { stepId: activeStepId, selectedOptionIds: [option.id] }] }
    })
  }

  // console.log('lang', lang)
  // console.log('stepData', responses)

  // Avoid no data
  if (!stepData || isLoading)
    return <StepScreenLayout style={themed($stepContainer)} contentStyle={themed($stepContent)}>
      <View></View>
    </StepScreenLayout>;


  const imageURL = stepData.assets.image1
  const bubbleText = stepData.content[lang].text1;
  const options = stepData.options;
  // Render screen
  return (
    <StepScreenLayout style={themed($stepContainer)} contentStyle={themed($stepContent)}>
      <View style={[themed($heroGroup), isWide ? $heroGroupWide : $heroGroupNarrow]}>
        <FadeInFadeOut style={themed($imageFrame)}>
          <Image uri={imageURL} style={themed($image)} />
        </FadeInFadeOut>
        <FadeInOutScale
          inDelay={90}
          outDelay={40}
          inEasing={Easing.out(Easing.back(1.1))}
          style={[themed($bubble), isWide ? $bubbleWide : $bubbleNarrow]}
        >
          <TalkBubble
            text={bubbleText}
            arrowPosition={isWide ? "left" : "down"}
            arrowTranslateX={isWide ? 0 : 50}
            arrowTranslateY={isWide ? -10 : 0}
          />
        </FadeInOutScale>
      </View>

      {options.map((option, index) => {
        const isSelected = selectedOptionIds.includes(option.id)
        const LeftAccessory = optionAccessories.get(option.id)
        return <FadeInFadeOut key={option.id} inDelay={150 + index * 80} style={$button}>
          <Button
            state={isSelected ? "selected" : "default"}
            text={option.translations[lang]}
            textStyle={themed($buttonText)}
            LeftAccessory={LeftAccessory}
            onPress={() => handleOptionPress(option)}
          />
        </FadeInFadeOut>
      })}
    </StepScreenLayout>
  )
}

const $image = (theme: any): ViewStyle => ({
  width: 120,
  height: 120,
})

const $imageFrame = (theme: any): ViewStyle => ({
  alignItems: "center",
  justifyContent: "center",
})

const $heroGroup = (theme: any): ViewStyle => ({
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  marginBottom: spacing.xl,
})

const $heroGroupWide: ViewStyle = {
  flexDirection: "row",
  gap: spacing.lg,
}

const $heroGroupNarrow: ViewStyle = {
  flexDirection: "column-reverse",
  gap: spacing.md,
}

const $bubble = (theme: any): ViewStyle => ({
  maxWidth: 280,
  alignSelf: "center",
})

const $bubbleWide: ViewStyle = {
  alignSelf: "center",
}

const $bubbleNarrow: ViewStyle = {
  alignSelf: "center",
}

const $stepContainer = (theme: any): ViewStyle => ({
  flex: 1,
  backgroundColor: theme.colors.background,
})

const $stepContent: ViewStyle = {
  paddingBottom: 120,
  paddingHorizontal: spacing.lg,
}

const $button: ViewStyle = {
  marginBottom: spacing.md,
  maxHeight: 56,
  maxWidth: 420,
  width: "100%",
  alignSelf: "center",
  marginVertical: spacing.sm,
}

const $buttonText = (theme: any): TextStyle => ({
  textAlign: "left",
})

const $signalIcon: ViewStyle = {
  width: 24,
  height: 24,
}
