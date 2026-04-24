import { useRef, useState } from "react"
import { StyleSheet, View, ViewStyle } from "react-native"
import { CommonActions } from "@react-navigation/native"

import { StepsHeader } from "@/components/Steps/StepsHeader"
import { ActionButton } from "@/components/UI/Button"
import { QuestionStep } from "@/components/Steps/Steps/QuestionStep"
import { JourneyStep } from "@/components/Steps/Steps/JourneyStep"
import { StepItem, StepsNavigation, StepsNavigationRef } from "@/navigators/StepsNavigation"
import { useAppTheme } from "@/theme/context"
import { StepProvider, useStepContext } from "@/context/StepContext"
import { useLang } from "@/context/LangContext"

const STEPS: StepItem[] = [
  { id: "step-1", render: () => <QuestionStep /> },
  { id: "step-2", render: () => <JourneyStep /> },
]

export function StepsScreen() {
  return (
    <StepProvider>
      <StepsScreenContent />
    </StepProvider>
  )
}

function StepsScreenContent() {
  const { themed } = useAppTheme()
  const navigationRef = useRef<StepsNavigationRef>(null)
  const { isLoading, data, activeStepId } = useStepContext()
  const { lang } = useLang()


  // const [currentIndex, setCurrentIndex] = useState(0)
  // const isLastStep = currentIndex === STEPS.length - 1
  // const progressByStep = [30, 65]
  // const progress = progressByStep[currentIndex] ?? 0
  // if (!isLoading) {
  //   console.log("Data loaded:", data, activeStepId)
  // }
  const handleNext = () => {
    // if (!navigationRef.current?.isReady()) return

    // if (currentIndex === 0) {
    //   navigationRef.current.navigate(STEPS[1].id)
    //   return
    // }

    // navigationRef.current.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [{ name: STEPS[0].id }],
    //   }),
    // )
  }

  const handleBack = () => {
    // if (!navigationRef.current?.isReady() || currentIndex === 0) return
    // navigationRef.current.goBack()
  }

  const actionButtonText = isLoading ? "LOADING" : data?.defaults?.ctaText[lang] || "LOADING";
  const activeStepData = data?.steps.find(step => step.id === activeStepId);

  return (
    <View style={$container}>
      
      <StepsHeader
        showBackButton
        progress={10}
        onBackPress={handleBack}
      />
      
      <View style={$content}>
        <StepsNavigation
          steps={STEPS}
          navigationRef={navigationRef}
          onIndexChange={()=>{}}
        />
      </View>

      <View style={themed($footer)}>
        <ActionButton
          text={actionButtonText}
          onPress={handleNext}
          textStyle={{ color: "#FFFFFF" }}
          style={$footerButton}
          disabled={isLoading}
        />
      </View>
    </View>
  )
}

export default StepsScreen;

const $container: ViewStyle = {
  flex: 1,
}

const $content: ViewStyle = {
  flex: 1,
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
  maxHeight: 38,
  maxWidth: 380,
  alignSelf: "center",
}
