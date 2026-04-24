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
  const { isLoading, data, activeStepId, responses } = useStepContext()
  const { lang } = useLang()

  const handleNext = () => {
    const isFirstStep = activeStepId === data?.steps?.[0]?.id;
    // move to next
    if (isFirstStep && navigationRef.current?.isReady()) {
      navigationRef.current.navigate("step-2")
    }
  }

  const handleBack = () => {
    if (!navigationRef.current?.isReady() || activeStepId === data?.steps?.[0]?.id) return
    navigationRef.current.goBack()
  }

  const actionButtonText = isLoading ? "LOADING" : data?.defaults?.ctaText[lang] || "LOADING";
  const activeStepData = data?.steps.find(step => step.id === activeStepId);
  const canContinue =
    // no data or no options means nothing to answer, so allow continue
    !activeStepData || activeStepData.options.length === 0 ||
    // Is Step has response
    responses?.responses.some(r => r.stepId === activeStepId)

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
          onIndexChange={() => { }}
        />
      </View>

      <View style={themed($footer)}>
        <ActionButton
          text={actionButtonText}
          onPress={handleNext}
          textStyle={{ color: "#FFFFFF" }}
          style={$footerButton}
          disabled={isLoading || !canContinue}
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
