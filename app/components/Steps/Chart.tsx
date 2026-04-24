import { useCallback, useMemo, useState } from "react"
import { LayoutChangeEvent, StyleSheet, TextStyle, View, ViewStyle, useWindowDimensions } from "react-native"
import { Easing } from "react-native-reanimated"

import { FadeInOutScale } from "@/components/Anims/FadeInOutScale"
import ChartBG, {
    CHART_BUBBLE_REVEAL_INTERVAL,
    CHART_BUBBLE_REVEAL_OFFSET,
    CHART_PATH_START_DELAY,
    CHART_VIEWBOX_HEIGHT,
    CHART_VIEWBOX_WIDTH,
    CHART_CIRCLE_POINTS,
    type ChartCirclePoint,
} from "@/components/ChartSvg"
import { ChartBubble } from "@/components/Steps/ChartBubble"
import { Text } from "@/components/UI/Text"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import type { Theme } from "@/theme/types"

const CHART_BUBBLE_GAP = 22
const CHART_EDGE_LABEL_COLOR = "#999999"
const CHART_MAX_WIDTH = 340
const CHART_HORIZONTAL_SCREEN_PADDING = 32
const CHART_ANIMATION_SPEED_FACTOR = 0.5
const CHART_BUBBLE_TEXT: Record<ChartCirclePoint["id"], string> = {
    start: "Start",
    middle: "Middle",
    end: "End",
}

type BubbleSizeMap = Partial<Record<ChartCirclePoint["id"], { width: number; height: number }>>

export function Chart() {
    const { themed, theme } = useAppTheme()
    const { width: screenWidth } = useWindowDimensions()
    const [bubbleSizes, setBubbleSizes] = useState<BubbleSizeMap>({})

    const chartWidth = useMemo(
        () => Math.min(Math.max(screenWidth - CHART_HORIZONTAL_SCREEN_PADDING, 0), CHART_MAX_WIDTH),
        [screenWidth],
    )
    const chartHeight = useMemo(
        () => (chartWidth / CHART_VIEWBOX_WIDTH) * CHART_VIEWBOX_HEIGHT,
        [chartWidth],
    )
    // Single scale factor derived purely from width — no async layout callbacks needed
    const chartScale = chartWidth / CHART_VIEWBOX_WIDTH

    const handleBubbleLayout = useCallback(
        (id: ChartCirclePoint["id"]) =>
            ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
                const nextWidth = Math.round(layout.width)
                const nextHeight = Math.round(layout.height)

                setBubbleSizes((currentBubbleSizes) => {
                    const currentSize = currentBubbleSizes[id]

                    if (currentSize?.width === nextWidth && currentSize.height === nextHeight) {
                        return currentBubbleSizes
                    }

                    return {
                        ...currentBubbleSizes,
                        [id]: {
                            width: nextWidth,
                            height: nextHeight,
                        },
                    }
                })
            },
        [],
    )

    // Overlay sits at VIEWBOX size and is scaled as a single unit from its top-left corner.
    // This means every child inside can be positioned in VIEWBOX coordinates with no extra math.
    const overlayTransform: ViewStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        width: CHART_VIEWBOX_WIDTH,
        height: CHART_VIEWBOX_HEIGHT,
        transform: [
            { translateX: -(CHART_VIEWBOX_WIDTH * (1 - chartScale)) / 2 },
            { translateY: -(CHART_VIEWBOX_HEIGHT * (1 - chartScale)) / 2 },
            { scale: chartScale },
        ],
    }

    return (
        <FadeInOutScale
            inDelay={60 * CHART_ANIMATION_SPEED_FACTOR}
            outDelay={40 * CHART_ANIMATION_SPEED_FACTOR}
            style={[$imageWrap, { width: chartWidth, height: chartHeight }]}
        >
            <ChartBG style={$backgroundImage} />
            <View pointerEvents="none" style={overlayTransform}>
                {/* Text labels — positioned in viewBox coordinates */}
                <Text preset="heading" text="English journey" style={themed($chartHeading)} />
                <Text style={[themed($chartEdgeLabel), $chartNowLabel]}>Now</Text>
                <Text style={[themed($chartEdgeLabel), $chartDaysLabel]}>27 Days</Text>

                {/* Bubbles — anchored to the known circle cx/cy in viewBox space */}
                {CHART_CIRCLE_POINTS.map((point, index) => {
                    const bubbleSize = bubbleSizes[point.id]
                    const bubbleWidth = bubbleSize?.width ?? 0
                    const bubbleHeight = bubbleSize?.height ?? 0

                    return (
                        <FadeInOutScale
                            key={point.id}
                            inDelay={
                                (CHART_PATH_START_DELAY +
                                    CHART_BUBBLE_REVEAL_OFFSET +
                                    index * CHART_BUBBLE_REVEAL_INTERVAL) *
                                CHART_ANIMATION_SPEED_FACTOR
                            }
                            inDuration={360 * CHART_ANIMATION_SPEED_FACTOR}
                            inEasing={Easing.out(Easing.back(1.3))}
                            style={[
                                $bubblePosition,
                                {
                                    left: point.cx - bubbleWidth / 2,
                                    top: point.cy - bubbleHeight - CHART_BUBBLE_GAP,
                                },
                            ]}
                        >
                            <View onLayout={handleBubbleLayout(point.id)}>
                                <ChartBubble
                                    text={CHART_BUBBLE_TEXT[point.id]}
                                    arrowPosition="down"
                                    arrowTranslateX={Math.max(bubbleWidth / 2 - 28, 0)}
                                    textColor={point.id === "end" ? theme.colors.stepGradientMiddle : undefined}
                                />
                            </View>
                        </FadeInOutScale>
                    )
                })}
            </View>
        </FadeInOutScale>
    )
}

const $imageWrap: ViewStyle = {
    alignSelf: "center",
    marginTop: 34,
}

const $backgroundImage: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
}

const $bubblePosition: ViewStyle = {
    position: "absolute",
}

const $chartHeading = (_theme: Theme): TextStyle => ({
    position: "absolute",
    left: spacing.md,
    top: spacing.md,
    fontSize: _theme.typography.sizes.sm.fontSize,
})

const $chartEdgeLabel = (theme: Theme): TextStyle => ({
    position: "absolute",
    fontFamily: theme.typography.primary.bold,
    fontSize: theme.typography.sizes.xxs.fontSize,
    lineHeight: theme.typography.sizes.xxs.lineHeight,
    color: CHART_EDGE_LABEL_COLOR,
    letterSpacing: 0,
    textTransform: "uppercase",
    fontVariant: ["lining-nums", "proportional-nums"],
})

const $chartNowLabel: TextStyle = {
    left: spacing.md,
    bottom: spacing.md,
}

const $chartDaysLabel: TextStyle = {
    right: spacing.md,
    bottom: spacing.md,
}