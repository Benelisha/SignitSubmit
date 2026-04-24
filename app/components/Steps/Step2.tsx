import { View, ViewStyle } from "react-native"

import { Button } from "@/components/UI/Button"
import { Text } from "@/components/UI/Text"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"

export function Step2() {
  const { themed } = useAppTheme()

  return (
    <View style={themed($stepContainer)}>
      <Text preset="heading" text="What's your goal?" style={$spaceBottom} />
      <Text
        preset="subheading"
        text="Tell us why you want to learn English."
        style={$spaceBottom}
      />
      <Text
        preset="default"
        text="We'll personalise your plan based on your answer."
        style={$spaceBottom}
      />
      <Button action text="Filled Button" style={$spaceBottom} />
      <Button state="default" text="Default Button" />
    </View>
  )
}

const $stepContainer = (theme: any): ViewStyle => ({
  flex: 1,
  paddingTop: 100,
  paddingBottom: 120,
  paddingHorizontal: spacing.lg,
  backgroundColor: theme.colors.background,
})

const $spaceBottom: ViewStyle = {
  marginBottom: spacing.md,
}