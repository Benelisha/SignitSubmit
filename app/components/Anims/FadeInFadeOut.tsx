import { ReactNode } from "react"
import { StyleProp, ViewStyle } from "react-native"
import Animated, {
  EasingFunction,
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutLeft,
  FadeOutRight,
  FadeOutUp,
} from "react-native-reanimated"

type FadeDirection = "top" | "bottom" | "left" | "right"

interface FadeInFadeOutProps {
  children: ReactNode
  style?: StyleProp<ViewStyle>
  in?: FadeDirection
  out?: FadeDirection
  inDelay?: number
  outDelay?: number
  inDuration?: number
  outDuration?: number
  inEasing?: EasingFunction
  outEasing?: EasingFunction
}

const DEFAULT_DURATION = 360

export function FadeInFadeOut({
  children,
  style,
  in: enterDirection,
  out: exitDirection,
  inDelay = 0,
  outDelay = 0,
  inDuration = DEFAULT_DURATION,
  outDuration = DEFAULT_DURATION,
  inEasing,
  outEasing,
}: FadeInFadeOutProps) {
  const entering = buildEnteringAnimation(enterDirection, inDelay, inDuration, inEasing)
  const exiting = buildExitingAnimation(exitDirection, outDelay, outDuration, outEasing)

  return (
    <Animated.View entering={entering} exiting={exiting} style={style}>
      {children}
    </Animated.View>
  )
}

function buildEnteringAnimation(
  direction: FadeDirection | undefined,
  delay: number,
  duration: number,
  easing?: EasingFunction,
) {
  let animation

  switch (direction) {
    case "top":
      animation = FadeInUp.duration(duration).delay(delay)
      break
    case "bottom":
      animation = FadeInDown.duration(duration).delay(delay)
      break
    case "left":
      animation = FadeInLeft.duration(duration).delay(delay)
      break
    case "right":
      animation = FadeInRight.duration(duration).delay(delay)
      break
    default:
      animation = FadeIn.duration(duration).delay(delay)
      break
  }

  if (easing) {
    animation = animation.easing(easing)
  }

  return animation
}

function buildExitingAnimation(
  direction: FadeDirection | undefined,
  delay: number,
  duration: number,
  easing?: EasingFunction,
) {
  let animation = getDirectionalExitAnimation(direction).duration(duration).delay(delay)

  if (easing) {
    animation = animation.easing(easing)
  }

  return animation
}

function getDirectionalExitAnimation(direction: FadeDirection | undefined) {
  switch (direction) {
    case "top":
      return FadeOutUp
    case "bottom":
      return FadeOutDown
    case "left":
      return FadeOutLeft
    case "right":
      return FadeOutRight
    default:
      return FadeOut
  }
}
