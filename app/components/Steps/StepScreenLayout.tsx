import { ReactNode } from "react"
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { STEPS_HEADER_BAR_HEIGHT } from "@/components/Steps/StepsHeader"

interface StepScreenLayoutProps {
  background?: ReactNode
  children: ReactNode
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
}

export function StepScreenLayout({
  background,
  children,
  style,
  contentStyle,
}: StepScreenLayoutProps) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[$container, style]}>
      {background ? <View style={$background}>{background}</View> : null}
      {/* Keep the background full-bleed under the absolute header, and offset only foreground content.
          This fixes the overlap issue without pushing gradients/images down with padding on the whole step. */}
      <View style={[$content, { paddingTop: insets.top + STEPS_HEADER_BAR_HEIGHT }, contentStyle]}>
        {children}
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
}

const $background: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
}

const $content: ViewStyle = {
  flex: 1,
}