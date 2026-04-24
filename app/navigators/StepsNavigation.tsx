import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationIndependentTree,
} from "@react-navigation/native"
import { ListStep as ListStep } from "@/components/Steps/Screens/ListStep"
import { JourneyStep } from "@/components/Steps/Screens/JourneyStep"

export type StepsParamList = {
  list: { stepId: string }
  englishJourney: { stepId: string }
}
export type StepsNavigationRef = NavigationContainerRef<StepsParamList>

const Stack = createNativeStackNavigator<StepsParamList>()

interface StepsNavigationProps {
  navigationRef: React.RefObject<StepsNavigationRef | null>
  onIndexChange: () => void
  initialStepId?: string | null
}

export function StepsNavigation({ navigationRef, onIndexChange, initialStepId }: StepsNavigationProps) {
  return (
    <NavigationIndependentTree>
      <NavigationContainer
        ref={navigationRef}
        onReady={onIndexChange}
        onStateChange={onIndexChange}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: "none",
          }}
          initialRouteName={"list"}
        >
          <Stack.Screen
            key={"list"}
            name={"list"}
            component={ListStep}
            initialParams={initialStepId ? { stepId: initialStepId } : undefined}
          />
          <Stack.Screen
            key={"englishJourney"}
            name={"englishJourney"}
            component={JourneyStep}
            initialParams={initialStepId ? { stepId: initialStepId } : undefined}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  )
}