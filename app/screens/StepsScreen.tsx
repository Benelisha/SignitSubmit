import { useEffect, useRef, useState } from "react"
import { View, ViewStyle } from "react-native"
import { CommonActions, StackActions } from "@react-navigation/native"

import { StepsHeader } from "@/components/Steps/StepsHeader"
import { ActionButton } from "@/components/UI/Button"
import { StepsNavigation, StepsNavigationRef, StepsParamList } from "@/navigators/StepsNavigation"
import { useAppTheme } from "@/theme/context"
import { StepProvider, useStepContext } from "@/context/StepContext"
import { useLang } from "@/context/LangContext"

// Implanted on the data for user selections
export type OnboardingDataType = {
  SelectedOption?: string
  IsStepSatisfied?: boolean
}


export function StepsScreen() {
  return (
    <StepProvider>
      <StepsScreenContent />
    </StepProvider>
  )
}

function StepsScreenContent() {
  const { themed } = useAppTheme()
  const { isLoading, data, activeStepId, setActiveStepId } = useStepContext()
  const navigationRef = useRef<StepsNavigationRef>(null)
  const { lang } = useLang()
  const [progress, setProgress] = useState(30)


  // Set the default value
  useEffect(() => {
    if (isLoading || !data) return
    if (!activeStepId)
      setActiveStepId(data?.onboardingFlow.steps?.[0]?._id)
  }, [isLoading, data, activeStepId])


  const handleIndexChange = () => {
    const route = navigationRef.current?.getCurrentRoute()
    const routeStepId = (route?.params as { stepId?: string } | undefined)?.stepId
    if (routeStepId && routeStepId !== activeStepId)
      setActiveStepId(routeStepId)
  }


  const handleContinuePress = () => {
    const activeStepData = data?.onboardingFlow.steps?.find((step: any) => step._id === activeStepId)
    if (!activeStepData) return

    const currComp = activeStepData.componentType;
    if ('list' === currComp && activeStepData.__selectedOption) {
      const selectedOptionId = activeStepData.__selectedOption;
      // Find the next step based on the conditions
      const nextStepId = activeStepData.nextSteps?.find((next: any) =>
        next?.conditions?.some((condition: any) => condition.optionId === selectedOptionId),
      )?.nextStepId;
      if (nextStepId) {
        const currentStep = data?.onboardingFlow.steps?.find((step: any) => step._id === nextStepId)
        if (!currentStep?._id) return

        // Push creates a real history entry, so iOS swipe-back works for non-default steps.
        navigationRef.current?.dispatch(StackActions.push(currentStep.componentType as keyof StepsParamList, {
          stepId: currentStep._id,
        }))
        setActiveStepId(nextStepId)
        setProgress(100)
      }
    }

    if ('englishJourney' === currComp) {
      const currentStep = data?.onboardingFlow.steps?.[0]
      if (!currentStep?._id) return

      // Default step should have no back history.
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: currentStep.componentType as keyof StepsParamList,
              params: { stepId: currentStep._id },
            },
          ],
        }),
      )
      setActiveStepId(currentStep._id)
      setProgress(30)
    }
  }

  const handleBackPress = () => {
    if (!navigationRef.current?.isReady()) return
    if (!navigationRef.current.canGoBack()) return
    navigationRef.current.goBack()
  }


  const actionButtonText = isLoading ? "LOADING" : data?.onboardingFlow.defaults?.ctaText[lang] || "LOADING";
  const activeStepData = activeStepId ? data?.onboardingFlow.steps?.find((step: any) => step._id === activeStepId) : null;
  const canContinue = !activeStepData || activeStepData.__selectedOption || activeStepData.componentType === 'englishJourney'

  return (
    <View style={$container}>

      <StepsHeader
        showBackButton
        progress={progress}
        onBackPress={handleBackPress}
      />


      {activeStepId &&
        <View style={$content}>
          <StepsNavigation
            navigationRef={navigationRef}
            initialStepId={activeStepId}
            onIndexChange={handleIndexChange}
          />
        </View>
      }

      <View style={themed($footer)}>
        <ActionButton
          text={actionButtonText}
          onPress={handleContinuePress}
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
})

const $footerButton: ViewStyle = {
  width: "100%",
  maxHeight: 38,
  maxWidth: 380,
  alignSelf: "center",
}
