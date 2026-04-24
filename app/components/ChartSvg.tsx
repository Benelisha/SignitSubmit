import { useEffect, useState } from "react"
import { LayoutChangeEvent, StyleProp, ViewStyle } from "react-native"
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated"
import Svg, { Circle, Path, Rect } from "react-native-svg"

const AnimatedPath = Animated.createAnimatedComponent(Path)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export const CHART_VIEWBOX_WIDTH = 343
export const CHART_VIEWBOX_HEIGHT = 235
export const CHART_PATH_START_DELAY = 120
export const CHART_PATH_ANIMATION_DURATION = 1800
export const CHART_BUBBLE_REVEAL_INTERVAL = 320
export const CHART_BUBBLE_REVEAL_OFFSET = 400
const CIRCLE_APPEAR_DURATION = 220
const PATH_DASH_LENGTH = 1000
const CURVE_PATH = "M18.6 187.031c12.146-18.148 26.356-27.551 48.262-34.293 21.905-6.743 54.128 2.557 67.895-9.319 13.767-11.877 21.82-20.621 39.7-29.526 17.879-8.905 43.859 2.357 65.553-8.448 21.694-10.806 19.51-44.103 74.774-44.103"

interface CirclePoint {
  id: "start" | "middle" | "end"
  cx: number
  cy: number
  r: number
  fill: string
  stroke?: string
  strokeWidth?: number
}

const CIRCLE_POINTS: CirclePoint[] = [
  {
    id: "start",
    cx: 90.084,
    cy: 149.843,
    r: 4,
    fill: "#63D4F8",
  },
  {
    id: "middle",
    cx: 197.314,
    cy: 110.5,
    r: 4,
    fill: "#63D4F8",
  },
  {
    id: "end",
    cx: 310.406,
    cy: 61.3467,
    r: 5.5,
    fill: "#fff",
    stroke: "#40B9DB",
    strokeWidth: 3,
  },
] 

export interface ChartBGPointLayout {
  id: CirclePoint["id"]
  x: number
  y: number
}

export interface ChartCirclePoint {
  id: CirclePoint["id"]
  cx: number
  cy: number
}

export const CHART_CIRCLE_POINTS: ChartCirclePoint[] = CIRCLE_POINTS.map(({ id, cx, cy }) => ({ id, cx, cy }))

interface ChartBGProps {
  style?: StyleProp<ViewStyle>
  onPointsLayout?: (points: ChartBGPointLayout[]) => void
}

function ChartBG({ style, onPointsLayout }: ChartBGProps) {
  const [size, setSize] = useState({ width: CHART_VIEWBOX_WIDTH, height: CHART_VIEWBOX_HEIGHT })
  const pathProgress = useSharedValue(0)
  const circleVisibility = CIRCLE_POINTS.map(() => useSharedValue(0))

  useEffect(() => {
    pathProgress.value = 0
    circleVisibility.forEach((visibility) => {
      visibility.value = 0
    })

    pathProgress.value = withDelay(
      CHART_PATH_START_DELAY,
      withTiming(1, {
        duration: CHART_PATH_ANIMATION_DURATION,
        // easing: Easing.bezier(0.33, 0.08, 0.22, 1),
        easing: Easing.bezier(0.33, 0.08, 0.22, 0.6),
      }),
    )

    circleVisibility.forEach((visibility, index) => {
      visibility.value = withDelay(
        CHART_PATH_START_DELAY + CHART_BUBBLE_REVEAL_OFFSET + index * CHART_BUBBLE_REVEAL_INTERVAL,
        withTiming(1, {
          duration: CIRCLE_APPEAR_DURATION,
          easing: Easing.out(Easing.back(1.35)),
        }),
      )
    })
  }, [circleVisibility, pathProgress])

  const handleLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    const nextWidth = Math.round(layout.width)
    const nextHeight = Math.round(layout.height)

    if (!nextWidth || !nextHeight) {
      return
    }

    setSize((currentSize) => {
      if (currentSize.width === nextWidth && currentSize.height === nextHeight) {
        return currentSize
      }

      return { width: nextWidth, height: nextHeight }
    })
  }

  useEffect(() => {
    onPointsLayout?.(
      CIRCLE_POINTS.map((point) => ({
        id: point.id,
        x: (point.cx / CHART_VIEWBOX_WIDTH) * size.width,
        y: (point.cy / CHART_VIEWBOX_HEIGHT) * size.height,
      })),
    )
  }, [onPointsLayout, size.height, size.width])

  const pathAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: PATH_DASH_LENGTH * (1 - pathProgress.value),
  }))

  const circleAnimatedProps = CIRCLE_POINTS.map((point, index) =>
    useAnimatedProps<React.ComponentProps<typeof Circle>>(() => ({
      opacity: circleVisibility[index].value,
      r: point.r * circleVisibility[index].value,
    })),
  )

  return (
    <Svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${CHART_VIEWBOX_WIDTH} ${CHART_VIEWBOX_HEIGHT}`}
      fill="none"
      onLayout={handleLayout}
      style={style}
    >
      <Rect x={1.00781} y={1.5} width={341} height={232} rx={19} fill="#fff" />
      <Rect
        x={1.00781}
        y={1.5}
        width={341}
        height={232}
        rx={19}
        stroke="#DCF5FF"
        strokeWidth={2}
      />
      <Path
        stroke="#F7F7F7"
        strokeWidth={2}
        strokeLinecap="round"
        d="M17.0078 53.5L318.008 53.5"
      />
      <Path
        stroke="#F7F7F7"
        strokeWidth={2}
        strokeLinecap="round"
        d="M17.0078 81.5L318.008 81.5"
      />
      <Path
        stroke="#F7F7F7"
        strokeWidth={2}
        strokeLinecap="round"
        d="M17.0078 109.5L318.008 109.5"
      />
      <Path
        stroke="#F7F7F7"
        strokeWidth={2}
        strokeLinecap="round"
        d="M17.0078 137.5L318.008 137.5"
      />
      <Path
        stroke="#F7F7F7"
        strokeWidth={2}
        strokeLinecap="round"
        d="M17.0078 165.5L318.008 165.5"
      />
      <Path
        stroke="#F7F7F7"
        strokeWidth={2}
        strokeLinecap="round"
        d="M17.0078 193.5L318.008 193.5"
      />
      <AnimatedPath
        d={CURVE_PATH}
        stroke="#63D4F8"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${PATH_DASH_LENGTH} ${PATH_DASH_LENGTH}`}
        animatedProps={pathAnimatedProps}
      />
      {CIRCLE_POINTS.map((point, index) => (
        <AnimatedCircle
          key={point.id}
          cx={point.cx}
          cy={point.cy}
          r={point.r}
          fill={point.fill}
          stroke={point.stroke}
          strokeWidth={point.strokeWidth}
          opacity={0}
          animatedProps={circleAnimatedProps[index]}
        />
      ))}
    </Svg>
  )
}

export default ChartBG
