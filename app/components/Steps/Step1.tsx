import { View, ViewStyle } from "react-native"

import { Button } from "@/components/UI/Button"
import { Text } from "@/components/UI/Text"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"

export function Step1() {
  const { themed } = useAppTheme()

  return (
    <View style={themed($stepContainer)}>
      <Text preset="heading" text="Welcome to Singit" style={$spaceBottom} />
      <Text
        preset="subheading"
        text="Your English learning journey starts here."
        style={$spaceBottom}
      />
      <Text preset="bold" text="Bold text preset" style={$spaceBottom} />
      <Text
        preset="default"
        text="Default text preset — the body copy style used throughout the app."
        style={$spaceBottom}
      />
      <Text preset="formLabel" text="Form label preset" style={$spaceBottom} />
      <Text
        preset="formHelper"
        text="Form helper preset — used for hints and captions."
        style={$spaceBottom}
      />

      <Button preset="filled" text="Filled Button" style={$spaceBottom} />
      <Button preset="default" text="Default Button" style={$spaceBottom} />
      <Button preset="reversed" text="Reversed Button" />
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