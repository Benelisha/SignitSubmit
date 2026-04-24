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
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { StepsParamList } from "@/navigators/StepsNavigation"

const WIDE_LAYOUT_BREAKPOINT = 720

type ListStepProps = NativeStackScreenProps<StepsParamList, "list">

export function ListStep({ route }: ListStepProps) {
  const { themed } = useAppTheme()
  const { lang } = useLang()
  const { width } = useWindowDimensions()
  const isWide = width >= WIDE_LAYOUT_BREAKPOINT
  const stepId = route.params?.stepId

  const { data, setData } = useStepContext()
  const stepData = data?.onboardingFlow?.steps?.find((step: any) => step._id === stepId)

  // Avoid react mount and remove, so the icon wont flash
  const optionAccessories = useMemo(() => {
    const map = new Map<string, ComponentType<ButtonAccessoryProps>>()
    if (!stepData) return map

    for (const option of stepData.options) {
      const optionId = option._id
      const uri = option.imgUrl ?? ""
      map.set(optionId, ({ style }: ButtonAccessoryProps) => <Image uri={uri} style={[style, $signalIcon]} />)
    }
    return map
  }, [stepData])

  const handleOptionPress = (_option: any) => {
    const updatedData = { ...data };

    const stepId = _option.stepId;
    // Find the step item and mark its selected
    const stepData = updatedData.onboardingFlow.steps.find((step: any) => step._id === stepId)
    if (stepData.__selectedOption === _option._id)
      stepData.__selectedOption = undefined;
    else
      stepData.__selectedOption = _option._id;

    setData(updatedData)
  }

  // Avoid no data
  if (!stepData)
    return <StepScreenLayout style={themed($stepContainer)} contentStyle={themed($stepContent)}><View /></StepScreenLayout>


  const imageURL = stepData.assets?.image1 ?? ""
  const bubbleText = stepData.content?.[lang]?.text1 ?? ""
  const options = stepData.options ?? []
  // Render screen
  return (
    <StepScreenLayout style={themed($stepContainer)} contentStyle={themed($stepContent)}>
      <View style={[themed($heroGroup), isWide ? $heroGroupWide : $heroGroupNarrow]}>
        {/* ---=== HERO ===--- */}
        <FadeInFadeOut style={themed($imageFrame)}>
          <Image uri={imageURL} style={themed($image)} />
        </FadeInFadeOut>
        {/* ---=== TEXT BUBBLE ===--- */}
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

      {/* ---=== List Options ===--- */}
        {options.map((option: any, index: number) => {
          const optionId = option._id
          const isSelected = stepData.__selectedOption === optionId
          const LeftAccessory = optionAccessories.get(optionId)
          return <FadeInFadeOut key={optionId} inDelay={150 + index * 80} style={$button}>
            <Button
              state={isSelected ? "selected" : "default"}
              text={option.translations?.[lang] ?? option.translations?.en ?? ""}
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
  marginBottom: spacing.xs,
  maxWidth: 420,
  width: "100%",
  alignSelf: "center",
}

const $buttonText = (theme: any): TextStyle => ({
  textAlign: "left",
})

const $signalIcon: ViewStyle = {
  width: 24,
  height: 24,
}
