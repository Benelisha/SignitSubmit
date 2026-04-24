import { useCallback, useState } from "react"
import { LayoutChangeEvent, StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { Easing } from "react-native-reanimated"

import { FadeInOutScale } from "@/components/Anims/FadeInOutScale"
import ChartBG, {
    CHART_BUBBLE_REVEAL_INTERVAL,
    CHART_BUBBLE_REVEAL_OFFSET,
    CHART_PATH_START_DELAY,
    CHART_VIEWBOX_HEIGHT,
    CHART_VIEWBOX_WIDTH,
    type ChartBGPointLayout,
} from "@/components/ChartSvg"
import { ChartBubble } from "@/components/Steps/ChartBubble"
import { Text } from "@/components/UI/Text"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import type { Theme } from "@/theme/types"

const CHART_BUBBLE_GAP = 22
const CHART_EDGE_LABEL_COLOR = "#999999"
const CHART_BUBBLE_TEXT: Record<ChartBGPointLayout["id"], string> = {
    start: "Start",
    middle: "Middle",
    end: "End",
}

type BubbleSizeMap = Partial<Record<ChartBGPointLayout["id"], { width: number; height: number }>>

export function Chart() {
    const { themed, theme } = useAppTheme()
    const [chartPointLayouts, setChartPointLayouts] = useState<ChartBGPointLayout[]>([])
    const [bubbleSizes, setBubbleSizes] = useState<BubbleSizeMap>({})
    const [chartSize, setChartSize] = useState({ width: CHART_VIEWBOX_WIDTH, height: CHART_VIEWBOX_HEIGHT })

    const handleChartPointsLayout = useCallback((nextChartPointLayouts: ChartBGPointLayout[]) => {
        setChartPointLayouts((currentChartPointLayouts) => {
            if (
                currentChartPointLayouts.length === nextChartPointLayouts.length &&
                currentChartPointLayouts.every(
                    (point, index) =>
                        point.id === nextChartPointLayouts[index]?.id &&
                        point.x === nextChartPointLayouts[index]?.x &&
                        point.y === nextChartPointLayouts[index]?.y,
                )
            ) {
                return currentChartPointLayouts
            }

            return nextChartPointLayouts
        })
    }, [])

    const handleBubbleLayout = useCallback(
        (id: ChartBGPointLayout["id"]) =>
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

    const handleChartLayout = useCallback(({ nativeEvent: { layout } }: LayoutChangeEvent) => {
        const nextWidth = Math.round(layout.width)
        const nextHeight = Math.round(layout.height)

        if (!nextWidth || !nextHeight) {
            return
        }

        setChartSize((currentSize) => {
            if (currentSize.width === nextWidth && currentSize.height === nextHeight) {
                return currentSize
            }

            return { width: nextWidth, height: nextHeight }
        })
    }, [])

    const chartScale = Math.min(chartSize.width / CHART_VIEWBOX_WIDTH, chartSize.height / CHART_VIEWBOX_HEIGHT)

    return (
        <FadeInOutScale inDelay={60} outDelay={40} style={$imageWrap}>
            <ChartBG style={$backgroundImage} onPointsLayout={handleChartPointsLayout} />
            <View pointerEvents="none" style={$chartTextOverlay}>
                <Text preset="heading" text="English journey" style={[themed($chartHeading), getScaledHeadingStyle(chartScale)]} />
                <Text style={[themed($chartEdgeLabel), getScaledEdgeLabelStyle(chartScale), $chartNowLabel]}>Now</Text>
                <Text style={[themed($chartEdgeLabel), getScaledEdgeLabelStyle(chartScale), $chartDaysLabel]}>27 Days</Text>
            </View>
            <View pointerEvents="none" style={$bubbleOverlay} onLayout={handleChartLayout}>
                {chartPointLayouts.map((point) => {
                    const bubbleSize = bubbleSizes[point.id]
                    const bubbleWidth = bubbleSize?.width ?? 0
                    const bubbleHeight = bubbleSize?.height ?? 0

                    return (
                        <FadeInOutScale
                            key={point.id}
                            inDelay={
                                CHART_PATH_START_DELAY +
                                CHART_BUBBLE_REVEAL_OFFSET +
                                chartPointLayouts.findIndex(({ id }) => id === point.id) * CHART_BUBBLE_REVEAL_INTERVAL
                            }
                            inDuration={360}
                            inEasing={Easing.out(Easing.back(1.3))}
                            style={[
                                $bubblePosition,
                                {
                                    left: point.x - bubbleWidth / 2,
                                    top: point.y - bubbleHeight - CHART_BUBBLE_GAP * chartScale,
                                },
                            ]}
                        >
                            <View onLayout={handleBubbleLayout(point.id)}>
                                <ChartBubble
                                    text={CHART_BUBBLE_TEXT[point.id]}
                                    arrowPosition="down"
                                    arrowTranslateX={Math.max(bubbleWidth / 2 - 28 * chartScale, 0)}
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
    flex: 1,
    width: "100%",
    maxWidth: 340,
    maxHeight: 230,
    alignSelf: "center",
    marginTop: 34,
}

const $backgroundImage: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
}

const $chartTextOverlay: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
}

const $bubbleOverlay: ViewStyle = {
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

const $chartNowLabel: ViewStyle = {
    left: spacing.md,
}

const $chartDaysLabel: ViewStyle = {
    right: spacing.md,
}

function getScaledHeadingStyle(scale: number): TextStyle {
    return {
        left: spacing.md * scale,
        top: spacing.md * scale,
    }
}

function getScaledEdgeLabelStyle(scale: number): TextStyle {
    const fontSize = Math.max(8, 10 * scale)

    return {
        fontSize,
        lineHeight: fontSize,
        left: undefined,
        right: undefined,
        bottom: spacing.md * scale,
    }
}