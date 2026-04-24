import { useEffect } from "react"
import { StyleProp, ViewStyle } from "react-native"
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated"

type FloatingAnimationMode = "none" | "horizontal" | "vertical"

interface FloatingAnimationProps {
    children: React.ReactNode
    style?: StyleProp<ViewStyle>
    mode?: FloatingAnimationMode
    size?: number
}

export function FloatingAnimation({
    children,
    style,
    mode = "vertical",
    size = 3,
}: FloatingAnimationProps) {
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)

    useEffect(() => {
        const easing = Easing.inOut(Easing.sin)
        const nextX = mode === "horizontal" ? size : 0
        const nextY = mode === "vertical" ? -size : 0

        translateX.value = withRepeat(
            withTiming(nextX, { duration: 1600, easing }),
            -1,
            true,
        )

        translateY.value = withRepeat(
            withTiming(nextY, { duration: 1600, easing }),
            -1,
            true,
        )
    }, [mode, size, translateX, translateY])

    const $animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }))

    return (
        <Animated.View style={[style, $animatedStyle]}>
            {children}
        </Animated.View>
    )
}