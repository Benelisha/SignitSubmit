import { StyleProp, ViewStyle } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

import { useAppTheme } from "@/theme/context"
import type { Theme } from "@/theme/types"
import { FadeInFadeOut } from "../Anims/FadeInFadeOut"

type GradientColors = readonly [string, string, ...string[]]
type GradientLocations = readonly [number, number, ...number[]]

interface GradientBGProps {
    colors?: GradientColors
    locations?: GradientLocations
    style?: StyleProp<ViewStyle>
}

export function GradientBG({ colors, locations, style }: GradientBGProps) {
    const { theme } = useAppTheme()

    const gradientColors = colors ?? getDefaultGradientColors(theme)
    const gradientLocations = locations ?? DEFAULT_GRADIENT_LOCATIONS

    return (
        <FadeInFadeOut style={[themedGradientBackground]}>
            <LinearGradient
                colors={gradientColors}
                locations={gradientLocations}
                start={{ x: 0.5, y: 0.0 }}
                end={{ x: 0.5, y: 1 }}
                pointerEvents="none"
                style={[themedGradientBackground, style]}
            />
        </FadeInFadeOut>
    )
}

const themedGradientBackground: ViewStyle = {
    position: "absolute",
    top: -30,
    right: 0,
    bottom: 0,
    left: 0,
}

const DEFAULT_GRADIENT_LOCATIONS: GradientLocations = [0, 0.14, 0.3, 0.58, 1]

function getDefaultGradientColors(theme: Theme): GradientColors {
    return [
        theme.colors.transparent,
        theme.colors.stepGradientTop,
        theme.colors.stepGradientMiddle,
        theme.colors.stepGradientBottom,
        theme.colors.stepGradientBottom,
    ]
}