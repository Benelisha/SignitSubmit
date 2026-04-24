import { View, ViewStyle } from "react-native"

import { FadeInFadeOut } from "@/components/Anims/FadeInFadeOut"
import { FadeInOutScale } from "@/components/Anims/FadeInOutScale"
import { GradientBG } from "@/components/Steps/GradientBG"
import { Image } from "@/components/UI/Image"
import { StepScreenLayout } from "@/components/Steps/StepScreenLayout"
import { Text } from "@/components/UI/Text"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"

const ENGLISH_JOURNEY_IMAGE_URL =
  "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/graphs/englishJourney.svg"

export function Step2() {
  const { themed } = useAppTheme()

  return (
    <StepScreenLayout background={<GradientBG />} style={themed($stepContainer)} contentStyle={$content}>
      <FadeInOutScale inDelay={60} outDelay={40} style={$imageWrap}>
        <Image uri={ENGLISH_JOURNEY_IMAGE_URL} style={$image} contentFit="cover" />
      </FadeInOutScale>

      <View style={{ flex: 1, maxWidth: 650, justifyContent: "center", alignSelf: "center", paddingHorizontal: spacing.lg }}>
        <FadeInFadeOut in="top" out="top" inDelay={150} style={$spaceBottom}>
          <Text preset="heading" text="Beginner" />
        </FadeInFadeOut>
        <FadeInFadeOut inDelay={240} style={$spaceBottom}>
          <Text
            preset="subheading"
            text="You're just getting started, and that’s exciting! We’ll guide you step by step and introduce English through simple, fun songs."
          />
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

const $imageWrap: ViewStyle = {
  flex: 1,
  width: "100%",
  maxWidth: 340,
  maxHeight: 230,
  alignSelf: "center",
  marginTop: 34,
}

const $image: ViewStyle = {
  flex: 1,
  width: "100%",
}

const $spaceBottom: ViewStyle = {
  marginBottom: spacing.md,
}