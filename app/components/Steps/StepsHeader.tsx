import { useEffect } from "react"
import { View, ViewStyle } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"

import { Header } from "@/components/UI/Header"
import { ProgressBar } from "@/components/UI/ProgressBar"
import { useAppTheme } from "@/theme/context"

interface StepsHeaderProps {
  progress: number
  showBackButton?: boolean
  onBackPress?: () => void
}

export function StepsHeader({ progress, showBackButton = false, onBackPress }: StepsHeaderProps) {
  const { themed } = useAppTheme()
  const scale = useSharedValue(1)
  const translateY = useSharedValue(0)
  const rotate = useSharedValue(0)

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 900, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    )

    translateY.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 900, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    )

    rotate.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
        withTiming(2, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    )
  }, [rotate, scale, translateY])

  const $giftAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
      ],
    }
  }, [])

  return (
    <Header
      containerStyle={$headerContainer}
      backgroundColor="transparent"
      {...(showBackButton ? { leftIcon: "caretLeft", onLeftPress: onBackPress } : {})}
      titleComponent={
        <View style={themed($content)}>
          <View style={$progressWrapper}>
            <ProgressBar progress={progress} />
          </View>

          <Animated.View style={[themed($giftContainer), $giftAnimatedStyle]}>
            {/* <Image width={33} height={33} source={svg} /> */}
            {/* <GiftSvg width={33} height={33} /> */}
          </Animated.View>
        </View>
      }
    />
  )
}

const $headerContainer: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
}

const $content = (theme: any): ViewStyle => ({
  flex: 1,
    width: "100%",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: theme.colors.transparent,
})

const $progressWrapper: ViewStyle = {
  flex: 1,
}

const $giftContainer = (theme: any): ViewStyle => ({
  marginLeft: 10,
  width: 36,
  height: 36,
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 18,
  backgroundColor: theme.colors.palette.neutral100,
})