import { ReactNode } from "react"
import { StyleProp, ViewStyle } from "react-native"
import Animated, { Easing, EasingFunction, ZoomIn, ZoomOut } from "react-native-reanimated"

interface FadeInOutScaleProps {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  inDelay?: number
  outDelay?: number
  inDuration?: number
  outDuration?: number
  inEasing?: EasingFunction
  outEasing?: EasingFunction
}

const DEFAULT_DURATION = 360
const DEFAULT_IN_EASING = Easing.out(Easing.cubic)
const DEFAULT_OUT_EASING = Easing.in(Easing.cubic)

export function FadeInOutScale({
  children,
  style,
  inDelay = 0,
  outDelay = 0,
  inDuration = DEFAULT_DURATION,
  outDuration = DEFAULT_DURATION,
  inEasing = DEFAULT_IN_EASING,
  outEasing = DEFAULT_OUT_EASING,
}: FadeInOutScaleProps) {
  const entering = ZoomIn.duration(inDuration).delay(inDelay).easing(inEasing)
  const exiting = ZoomOut.duration(outDuration).delay(outDelay).easing(outEasing)

  return (
    <Animated.View entering={entering} exiting={exiting} style={style}>
      {children}
    </Animated.View>
  )
}