import { useMemo } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationIndependentTree,
  NavigationState,
  ParamListBase,
} from "@react-navigation/native"

export interface StepItem {
  id: string
  render: () => React.ReactNode
}

export type StepsParamList = ParamListBase
export type StepsNavigationRef = NavigationContainerRef<StepsParamList>

const Stack = createNativeStackNavigator<StepsParamList>()

interface StepsNavigationProps {
  steps: StepItem[]
  navigationRef: React.RefObject<StepsNavigationRef | null>
  onIndexChange: (index: number) => void
}

export function StepsNavigation({ steps, navigationRef, onIndexChange }: StepsNavigationProps) {
  const initialRouteName = useMemo(() => steps[0]?.id, [steps])

  if (!initialRouteName) return null

  const syncIndexFromState = (state?: NavigationState) => {
    if (!state) return

    const routeName = state.routes[state.index]?.name
    const nextIndex = steps.findIndex((step) => step.id === routeName)

    if (nextIndex >= 0) {
      onIndexChange(nextIndex)
    }
  }

  return (
    <NavigationIndependentTree>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          onIndexChange(0)
        }}
        onStateChange={syncIndexFromState}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
          initialRouteName={initialRouteName}
        >
          {steps.map((step) => (
            <Stack.Screen key={step.id} name={step.id}>
              {() => <>{step.render()}</>}
            </Stack.Screen>
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}