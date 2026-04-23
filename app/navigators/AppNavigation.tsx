import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Config from "@/config"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { StepsScreen } from "@/screens/StepsScreen"
import { useAppTheme } from "@/theme/context"

export type AppStackParamList = {
  Steps: undefined
}

export interface AppNavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer<AppStackParamList>>> {}

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
      initialRouteName="Steps"
    >
      <Stack.Screen name="Steps" component={StepsScreen} />
    </Stack.Navigator>
  )
}

export function AppNavigation(props: AppNavigationProps) {
  const { navigationTheme } = useAppTheme()

  return (
    <NavigationContainer theme={navigationTheme} {...props}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AppStack />
      </ErrorBoundary>
    </NavigationContainer>
  )
}