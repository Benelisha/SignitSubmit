import { useCallback, useState } from "react"
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native"
import { Easing } from "react-native-reanimated"

import { FadeInFadeOut } from "@/components/Anims/FadeInFadeOut"
import { FadeInOutScale } from "@/components/Anims/FadeInOutScale"
import ChartBG, {
  CHART_BUBBLE_REVEAL_INTERVAL,
  CHART_BUBBLE_REVEAL_OFFSET,
  CHART_PATH_START_DELAY,
  type ChartBGPointLayout,
} from "@/components/ChartBG"
import { ChartBubble } from "@/components/Steps/ChartBubble"
import { GradientBG } from "@/components/Steps/GradientBG"
import { StepScreenLayout } from "@/components/Steps/StepScreenLayout"
import { Text } from "@/components/UI/Text"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import type { Theme } from "@/theme/types"

const CHART_BUBBLE_GAP = 22
const CHART_BUBBLE_TEXT: Record<ChartBGPointLayout["id"], string> = {
  start: "Start",
  middle: "Middle",
  end: "End",
}

type BubbleSizeMap = Partial<Record<ChartBGPointLayout["id"], { width: number; height: number }>>

export function Step2() {
  const { themed } = useAppTheme()
  const [chartPointLayouts, setChartPointLayouts] = useState<ChartBGPointLayout[]>([])
  const [bubbleSizes, setBubbleSizes] = useState<BubbleSizeMap>({})

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

  return (
    <StepScreenLayout background={<GradientBG />} style={themed($stepContainer)} contentStyle={$content}>
      <FadeInOutScale inDelay={60} outDelay={40} style={$imageWrap}>
        <ChartBG style={$backgroundImage} onPointsLayout={handleChartPointsLayout} />
        <View pointerEvents="none" style={$bubbleOverlay}>
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
                inDuration={380}
                inEasing={Easing.out(Easing.back(1.3))}
                style={[
                  $bubblePosition,
                  {
                    left: point.x - bubbleWidth / 2,
                    top: point.y - bubbleHeight - CHART_BUBBLE_GAP,
                  },
                ]}
              >
                <View onLayout={handleBubbleLayout(point.id)}>
                  <ChartBubble
                    text={CHART_BUBBLE_TEXT[point.id]}
                    arrowPosition="down"
                    arrowTranslateX={Math.max(bubbleWidth / 2 - 28, 0)}
                  />
                </View>
              </FadeInOutScale>
            )
          })}
        </View>
      </FadeInOutScale>

      <View style={{ flex: 1, maxWidth: 650, justifyContent: "center", alignSelf: "center", paddingHorizontal: spacing.lg, gap: 24 }}>
        <FadeInFadeOut in="left" inDelay={800} style={$spaceBottom}>
          <Text preset="heading" text="Beginner" />
        </FadeInFadeOut>
        <FadeInFadeOut in="bottom"inDelay={1200} inDuration={260} style={$spaceBottom}>
          <Text preset="subheading">
            You're just <Text preset="subheading" style={themed($subheadingHighlight)}>getting started</Text>, and that’s exciting!
            We’ll guide you step by step and introduce English through simple, fun songs.
          </Text>
        </FadeInFadeOut>
      </View>
    </StepScreenLayout>
  )
}

const $stepContainer = (theme: any): ViewStyle => ({
  flex: 1,
  // backgroundColor: theme.colors.background,
})

const $content: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
}

const $imageWrap: ViewStyle = {
  flex: 1,
  width: "100%",
  maxWidth: 340,
  maxHeight: 230,
  alignSelf: "center",
  marginTop: 34,
}

const $spaceBottom: ViewStyle = {
  marginBottom: spacing.md,
}

const $subheadingHighlight = (theme: Theme) => ({
  color: theme.colors.palette.primary500,
})


const $backgroundImage: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
}

const $bubbleOverlay: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
}

const $bubblePosition: ViewStyle = {
  position: "absolute",
}
