import { View, ViewStyle } from "react-native"

import { FadeInFadeOut } from "@/components/Anims/FadeInFadeOut"
import { Chart } from "@/components/Steps/Chart"
import { GradientBG } from "@/components/Steps/GradientBG"
import { StepScreenLayout } from "@/components/Steps/StepScreenLayout"
import { Text } from "@/components/UI/Text"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import type { Theme } from "@/theme/types"

export function JourneyStep() {
  const { themed } = useAppTheme()

  return (
    <StepScreenLayout background={<GradientBG />} style={themed($stepContainer)} contentStyle={$content}>
      <Chart />

      <View style={{ flex: 1, maxWidth: 650, justifyContent: "center", alignSelf: "center", paddingHorizontal: spacing.lg, gap: 24 }}>
        <FadeInFadeOut in="left" inDelay={800} style={$spaceBottom}>
          <Text preset="heading" text="Beginner" />
        </FadeInFadeOut>
        <FadeInFadeOut in="bottom"inDelay={1200} inDuration={260} style={$spaceBottom}>
          <Text preset="subheading">
            You're just <Text preset="subheading" style={themed($subheadingHighlight)}>getting started</Text>, and that’s exciting!
            We’ll guide you step by step and introduce English through simple, fun songs.
          </Text>
        </FadeInFadeOut>
      </View>
    </StepScreenLayout>
  )
}

const $stepContainer = (theme: any): ViewStyle => ({
  flex: 1,
  // backgroundColor: theme.colors.background,
})

const $content: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
}

const $spaceBottom: ViewStyle = {
  marginBottom: spacing.md,
}

const $subheadingHighlight = (theme: Theme) => ({
  color: theme.colors.palette.primary500,
})
