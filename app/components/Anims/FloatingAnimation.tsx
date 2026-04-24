import { useEffect } from "react"
import { StyleProp, ViewStyle } from "react-native"
import Animated, {
    cancelAnimation,
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
    const scale = useSharedValue(1)
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const rotate = useSharedValue(0)

    useEffect(() => {
        const easing = Easing.inOut(Easing.sin)

        if (mode === "none") {
            cancelAnimation(scale)
            cancelAnimation(translateX)
            cancelAnimation(translateY)
            cancelAnimation(rotate)

            scale.value = 1
            translateX.value = 0
            translateY.value = 0
            rotate.value = 0

            return
        }

        const nextX = mode === "horizontal" ? size : 0
        const nextY = mode === "vertical" ? -size : 0

        scale.value = withRepeat(
            withTiming(1.08, { duration: 1600, easing }),
            -1,
            true,
        )

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

        rotate.value = withRepeat(
            withTiming(6, { duration: 2200, easing }),
            -1,
            true,
        )
    }, [mode, rotate, scale, size, translateX, translateY])

    const $animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
            { rotate: `${rotate.value}deg` },
        ],
    }))

    return (
        <Animated.View style={[style, $animatedStyle]}>
            {children}
        </Animated.View>
    )
}