import { TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/UI/Button"
import { Text } from "@/components/UI/Text"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import { useState } from "react"

export function Step1() {
  const { themed } = useAppTheme()
  const [state, setState] = useState("default")

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

      <Button state="disabled" text="Disabled" style={$button} textStyle={$buttonText} />
      <Button state={state} text="Default" style={$button} onPress={() => state == "default" ? setState("selected") : setState("default")} textStyle={$buttonText} />
      <Button state="selected" text="Selected true" style={$button} textStyle={$buttonText} />
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
  marginBottom: spacing.xs,
}

const $button: ViewStyle = {
  marginBottom: spacing.xs,
  maxHeight: 56,
  maxWidth: 420,
  width: "100%",
  alignSelf: "center",
}

const $buttonText = (theme: any): TextStyle => ({
  textAlign: "left",
})
