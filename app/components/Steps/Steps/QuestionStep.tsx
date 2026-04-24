import { TextStyle, useWindowDimensions, View, ViewStyle } from "react-native"
import { Easing } from "react-native-reanimated"

import { FadeInFadeOut } from "@/components/Anims/FadeInFadeOut"
import { FadeInOutScale } from "@/components/Anims/FadeInOutScale"
import { Image } from "@/components/UI/Image"
import { TalkBubble } from "@/components/Steps/TalkBubble"
import { StepScreenLayout } from "@/components/Steps/StepScreenLayout"
import { Button, ButtonState } from "@/components/UI/Button"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import { useState } from "react"

const FIGURE_URL = "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/figures/bmFigure.svg"
const SIGNAL_ICON_URL = "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/misc/signal0.svg"
const TALK_BUBBLE_TEXT = "Whats is yours english level?"
const WIDE_LAYOUT_BREAKPOINT = 720

function SignalAccessory({ style }: { style: ViewStyle }) {
  return <Image uri={SIGNAL_ICON_URL} style={[style, $signalIcon]} />
}

export function QuestionStep() {
  const { themed } = useAppTheme()
  const [state, setState] = useState<ButtonState>("default")
  const { width } = useWindowDimensions()
  const isWide = width >= WIDE_LAYOUT_BREAKPOINT

  return (
    <StepScreenLayout style={themed($stepContainer)} contentStyle={themed($stepContent)}>
      <View style={[themed($heroGroup), isWide ? $heroGroupWide : $heroGroupNarrow]}>
        <FadeInFadeOut style={themed($imageFrame)}>
          <Image uri={FIGURE_URL} style={themed($image)} />
        </FadeInFadeOut>
        <FadeInOutScale
          inDelay={90}
          outDelay={40}
          inEasing={Easing.out(Easing.back(1.1))}
          style={[themed($bubble), isWide ? $bubbleWide : $bubbleNarrow]}
        >
          <TalkBubble
            text={TALK_BUBBLE_TEXT}
            arrowPosition={isWide ? "left" : "down"}
            arrowTranslateX={isWide ? 0 : 50}
            arrowTranslateY={isWide ? -10 : 0}
          />
        </FadeInOutScale>
      </View>
      <FadeInFadeOut inDelay={150} style={$button}>
        <Button
          state="disabled"
          text="Disabled"
          textStyle={themed($buttonText)}
          LeftAccessory={SignalAccessory}
        />
      </FadeInFadeOut>
      <FadeInFadeOut inDelay={250} style={$button}>
        <Button
          state={state}
          text="Default"
          onPress={() => (state === "default" ? setState("selected") : setState("default"))}
          textStyle={themed($buttonText)}
          LeftAccessory={SignalAccessory}
        />
      </FadeInFadeOut>
      <FadeInFadeOut inDelay={350} style={$button}>
        <Button
          state="selected"
          text="Selected true"
          textStyle={themed($buttonText)}
          LeftAccessory={SignalAccessory}
        />
      </FadeInFadeOut>
    </StepScreenLayout>
  )
}

const $image = (theme: any): ViewStyle => ({
  width: 120,
  height: 120,
})

const $imageFrame = (theme: any): ViewStyle => ({
  alignItems: "center",
  justifyContent: "center",
})

const $heroGroup = (theme: any): ViewStyle => ({
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  marginBottom: spacing.xl,
})

const $heroGroupWide: ViewStyle = {
  flexDirection: "row",
  gap: spacing.lg,
}

const $heroGroupNarrow: ViewStyle = {
  flexDirection: "column-reverse",
  gap: spacing.md,
}

const $bubble = (theme: any): ViewStyle => ({
  maxWidth: 280,
  alignSelf: "center",
})

const $bubbleWide: ViewStyle = {
  alignSelf: "center",
}

const $bubbleNarrow: ViewStyle = {
  alignSelf: "center",
}

const $stepContainer = (theme: any): ViewStyle => ({
  flex: 1,
  backgroundColor: theme.colors.background,
})

const $stepContent: ViewStyle = {
  paddingBottom: 120,
  paddingHorizontal: spacing.lg,
}

const $button: ViewStyle = {
  marginBottom: spacing.md,
  maxHeight: 56,
  maxWidth: 420,
  width: "100%",
  alignSelf: "center",
  marginVertical: spacing.sm,
}

const $buttonText = (theme: any): TextStyle => ({
  textAlign: "left",
})

const $signalIcon: ViewStyle = {
  width: 24,
  height: 24,
}
