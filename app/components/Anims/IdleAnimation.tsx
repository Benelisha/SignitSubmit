import { useEffect } from "react"
import { StyleProp, ViewStyle } from "react-native"
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated"

interface IdleAnimationProps {
    children: React.ReactNode
    style?: StyleProp<ViewStyle>
}

export function IdleAnimation({ children, style }: IdleAnimationProps) {
    const scale = useSharedValue(1)
    const translateY = useSharedValue(0)
    const rotate = useSharedValue(0)

    useEffect(() => {
        const easing = Easing.inOut(Easing.sin)

        scale.value = withRepeat(
            withTiming(1.08, { duration: 1600, easing }),
            -1,
            true,
        )

        translateY.value = withRepeat(
            withTiming(-3, { duration: 1600, easing }),
            -1,
            true,
        )

        rotate.value = withRepeat(
            withTiming(6, { duration: 2200, easing }),
            -1,
            true,
        )
    }, [rotate, scale, translateY])

    const $animatedStyle = useAnimatedStyle(() => ({
        transform: [
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
