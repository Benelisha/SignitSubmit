import { StyleProp, TextStyle, View, ViewStyle } from "react-native"

import BubbleArrow from "@assets/chart_bubble_arrow.svg"
import { FadeInFadeOut } from "@/components/Anims/FadeInFadeOut"
import { Text } from "@/components/UI/Text"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import type { Theme } from "@/theme/types"
import { FloatingAnimation } from "../Anims/FloatingAnimation"

const ARROW_SIZE = 24
const ARROW_INSET = -20
const ARROW_OFFSET = spacing.md

export type ChartBubbleArrowPosition = "left" | "right" | "top" | "down"

interface ChartBubbleProps {
    text: string
    style?: StyleProp<ViewStyle>
    arrowPosition?: ChartBubbleArrowPosition
    arrowTranslateX?: number
    arrowTranslateY?: number
    textColor?: string
}

export function ChartBubble({
    text,
    style,
    arrowPosition = "left",
    arrowTranslateX = 0,
    arrowTranslateY = 0,
    textColor = "#999999",
}: ChartBubbleProps) {
    const { themed } = useAppTheme()

    return (
        <FloatingAnimation mode="vertical" size={4}>
            <View style={[themed($bubble), style]}>
                <FadeInFadeOut inDelay={120} inDuration={260}>
                    <Text text={text} style={[themed($text), { color: textColor }]} />
                </FadeInFadeOut>
                <View style={[$arrowBase, getArrowStyle(arrowPosition, arrowTranslateX, arrowTranslateY)]}>
                    <BubbleArrow width="100%" height="100%" />
                </View>
            </View>
        </FloatingAnimation>
    )
}

const $bubble = (_theme: Theme): ViewStyle => ({
    position: "relative",
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#EDEDED",
    borderRadius: spacing.xs,
    overflow: "visible",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 22,
    shadowOffset: {
        width: 0,
        height: 12,
    },
    elevation: 10,
})

const $text = (theme: Theme): TextStyle => ({
    fontFamily: theme.typography.primary.bold,
    fontSize: theme.typography.sizes.xxs.fontSize -2,
    lineHeight: theme.typography.sizes.xxs.lineHeight -2,
    letterSpacing: 0,
    textAlign: "center",
    textAlignVertical: "center",
    textTransform: "uppercase",
    maxWidth: 90,
})

const $arrowBase: ViewStyle = {
    position: "absolute",
    width: ARROW_SIZE,
    height: ARROW_SIZE,
}

function getArrowStyle(
    position: ChartBubbleArrowPosition,
    translateX: number,
    translateY: number,
): ViewStyle {
    switch (position) {
        case "right":
            return {
                right: ARROW_INSET,
                top: ARROW_OFFSET,
                transform: [{ translateX }, { translateY }, { rotate: "-90deg" }],
            }
        case "top":
            return {
                top: ARROW_INSET,
                left: ARROW_OFFSET,
                transform: [{ translateX }, { translateY }, { rotate: "180deg" }],
            }
        case "down":
            return {
                bottom: ARROW_INSET,
                left: ARROW_OFFSET,
                transform: [{ translateX }, { translateY }],
            }
        case "left":
        default:
            return {
                left: ARROW_INSET,
                top: ARROW_OFFSET,
                transform: [{ translateX }, { translateY }, { rotate: "90deg" }],
            }
    }
}