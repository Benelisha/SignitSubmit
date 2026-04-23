import { useEffect, useState } from "react"
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import { useAppTheme } from "@/theme/context"

interface ProgressBarProps {
  progress: number
  duration?: number
  style?: StyleProp<ViewStyle>
}

export function ProgressBar({ progress, duration = 260, style }: ProgressBarProps) {
  const { themed } = useAppTheme()
  const [trackWidth, setTrackWidth] = useState(0)

  const clampedProgress = Math.max(0, Math.min(100, progress))
  const animatedProgress = useSharedValue(clampedProgress)

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, { duration })
  }, [animatedProgress, clampedProgress, duration])

  const $fillAnimatedStyle = useAnimatedStyle(() => {
    const width = trackWidth * (animatedProgress.value / 100)
    return { width }
  }, [trackWidth])

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width)
  }

  return (
    <View style={[themed($track), style]} onLayout={handleLayout}>
      <Animated.View style={[themed($fill), $fillAnimatedStyle]} />
    </View>
  )
}

const $track = (theme: any): ViewStyle => ({
  height: 14,
  width: "100%",
  borderRadius: 999,
  backgroundColor: theme.colors.palette.secondary200,
  overflow: "hidden",
})

const $fill = (theme: any): ViewStyle => ({
  height: "100%",
  borderRadius: 999,
  backgroundColor: theme.colors.palette.secondary500,
})
