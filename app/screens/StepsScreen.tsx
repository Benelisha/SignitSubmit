import { useRef, useState } from "react"
import { StyleSheet, View, ViewStyle } from "react-native"
import { CommonActions } from "@react-navigation/native"

import { StepsHeader } from "@/components/Steps/StepsHeader"
import { Button } from "@/components/UI/Button"
import { Step1 } from "@/components/Steps/Step1"
import { Step2 } from "@/components/Steps/Step2"
import { StepItem, StepsNavigation, StepsNavigationRef } from "@/navigators/StepsNavigation"
import { useAppTheme } from "@/theme/context"

const STEPS: StepItem[] = [
  { id: "step-1", render: () => <Step1 /> },
  { id: "step-2", render: () => <Step2 /> },
]

export function StepsScreen() {
  const { themed } = useAppTheme()
  const navigationRef = useRef<StepsNavigationRef>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const isLastStep = currentIndex === STEPS.length - 1
  const progressByStep = [30, 65]
  const progress = progressByStep[currentIndex] ?? 0

  const handleNext = () => {
    if (!navigationRef.current?.isReady()) return

    if (currentIndex === 0) {
      navigationRef.current.navigate(STEPS[1].id)
      return
    }

    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: STEPS[0].id }],
      }),
    )
  }

  const handleBack = () => {
    if (!navigationRef.current?.isReady() || currentIndex === 0) return

    navigationRef.current.goBack()
  }

  return (
    <View style={$container}>
      {/* <SafeAreaView> */}
      <StepsHeader
        progress={progress}
        showBackButton={currentIndex > 0}
        onBackPress={handleBack}
      />

      <View style={$content}>
        <StepsNavigation
          steps={STEPS}
          navigationRef={navigationRef}
          onIndexChange={setCurrentIndex}
        />
      </View>

      <View style={themed($footer)}>
        <Button
          text={isLastStep ? "Finish" : "Continue"}
          preset="filled"
          onPress={handleNext}
          style={$footerButton}
        />
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
}

const $content: ViewStyle = {
  flex: 1,
  paddingTop: 22,
}

const $footer = (theme: any): ViewStyle => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  paddingHorizontal: 24,
  paddingBottom: 40,
  paddingTop: 16,
  backgroundColor: theme.colors.background,
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: theme.colors.separator,
})

const $footerButton: ViewStyle = {
  width: "100%",
}
