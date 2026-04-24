// import { ComponentType, useCallback, useMemo, useState } from "react"
// import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native"

// import { Image } from "@/components/UI/Image"
// import { useAppTheme } from "@/theme/context"
// import ChartBG, { ChartBGPointLayout } from "./ChartBG"

// const ENGLISH_JOURNEY_IMAGE_URL =
//     "https://s3.us-east-2.amazonaws.com/assets.singit.io/onboardingFlow/graphs/englishJourney.svg"

// const DEFAULT_MAX_VALUE = 10
// const REGULAR_POINT_SIZE = 7
// const LAST_POINT_SIZE = 14

// export interface ChartPoint {
//     x: number
//     y: number
// }

// interface ChartBaseProps {
//     LineChartComponent: ComponentType<any>
//     points: ChartPoint[]
//     onChartPointsLayout?: (points: ChartBGPointLayout[]) => void
// }

// export function ChartBase({ LineChartComponent, points, onChartPointsLayout }: ChartBaseProps) {
//     const { theme } = useAppTheme()
//     const [size, setSize] = useState({ width: 0, height: 0 })

//     const handleLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
//         const nextWidth = Math.round(layout.width)
//         const nextHeight = Math.round(layout.height)

//         if (nextWidth !== size.width || nextHeight !== size.height) {
//             setSize({ width: nextWidth, height: nextHeight })
//         }
//     }

//     const chartPoints = useMemo(() => points.slice().sort((left, right) => left.x - right.x), [points])
//     const chartWidth = Math.max(size.width, 0)
//     const chartHeight = Math.max(size.height, 0)
//     const initialSpacing = chartWidth * 0.11
//     const endSpacing = chartWidth * 0.06
//     const maxX = chartPoints.at(-1)?.x ?? 0
//     const minX = chartPoints[0]?.x ?? 0
//     const xRange = Math.max(maxX - minX, 1)
//     const maxValue = Math.max(DEFAULT_MAX_VALUE, Math.ceil((Math.max(...chartPoints.map((point) => point.y), 0) + 5) / 10) * 10)
//     const spacing =
//         chartPoints.length > 1 ? Math.max((chartWidth - initialSpacing - endSpacing) / (chartPoints.length - 1), 0) : 0

//     const chartData = useMemo(
//         () =>
//             chartPoints.map((point, index) => {
//                 const isLastPoint = index === chartPoints.length - 1

//                 return {
//                     value: point.y,
//                     spacing:
//                         index === 0
//                             ? undefined
//                             : Math.max(
//                                 ((point.x - chartPoints[index - 1].x) / xRange) * (chartWidth - initialSpacing - endSpacing),
//                                 0,
//                             ),
//                     customDataPoint: () =>
//                         isLastPoint ? (
//                             <View style={[$pointBase, $lastPointWrap, { width: LAST_POINT_SIZE, height: LAST_POINT_SIZE, borderColor: theme.colors.stepGradientTop }]}>
//                                 <View
//                                     style={{
//                                         width: 6,
//                                         height: 6,
//                                         borderRadius: 999,
//                                         backgroundColor: theme.colors.stepGradientTop,
//                                     }}
//                                 />
//                             </View>
//                         ) : (
//                             <View
//                                 style={[
//                                     $pointBase,
//                                     {
//                                         width: REGULAR_POINT_SIZE,
//                                         height: REGULAR_POINT_SIZE,
//                                         borderRadius: REGULAR_POINT_SIZE / 2,
//                                         backgroundColor: theme.colors.stepGradientTop,
//                                     },
//                                 ]}
//                             />
//                         ),
//                 }
//             }),
//         [chartHeight, chartPoints, chartWidth, endSpacing, initialSpacing, theme.colors.stepGradientTop, xRange],
//     )

//     const handleChartPointsLayout = useCallback(
//         (chartPointLayouts: ChartBGPointLayout[]) => {
//             onChartPointsLayout?.(chartPointLayouts)
//         },
//         [onChartPointsLayout],
//     )

//     return (
//         <View style={$container} onLayout={handleLayout}>
//             {/* <Image uri={ENGLISH_JOURNEY_IMAGE_URL} style={$backgroundImage} contentFit="cover" /> */}
//             <ChartBG style={$backgroundImage} onPointsLayout={handleChartPointsLayout} />
//             <LineChartComponent
//                 data={chartData}
//                 width={chartWidth}
//                 height={chartHeight}
//                 maxValue={maxValue}
//                 adjustToWidth
//                 disableScroll
//                 isAnimated
//                 animationDuration={2000}
//                 curved
//                 hideAxesAndRules
//                 hideYAxisText
//                 hideDataPoints={false}
//                 xAxisThickness={0}
//                 yAxisThickness={0}
//                 // initialSpacing={initialSpacing}
//                 // endSpacing={endSpacing}
//                 // spacing={spacing}
//                 thickness={3}
//                 color={theme.colors.stepGradientMiddle}
//                 dataPointsColor={theme.colors.stepGradientMiddle}
//                 dataPointsRadius={REGULAR_POINT_SIZE / 2}
//                 dataPointsWidth={REGULAR_POINT_SIZE}
//                 dataPointsHeight={REGULAR_POINT_SIZE}
//             />
//         </View>
//     )
// }

// const $container: ViewStyle = {
//     flex: 1,
//     width: "100%",
//     height: "100%",
// }

// const $backgroundImage: ViewStyle = {
//     ...StyleSheet.absoluteFillObject,

// }

// const $pointBase: ViewStyle = {
//     alignItems: "center",
//     justifyContent: "center",
// }

// const $lastPointWrap: ViewStyle = {
//     borderWidth: 2,
//     borderRadius: LAST_POINT_SIZE / 2,
//     backgroundColor: "rgba(255, 255, 255, 0.92)",
//     shadowColor: "#00C1FF",
//     shadowOpacity: 0.22,
//     shadowRadius: 8,
//     shadowOffset: {
//         width: 0,
//         height: 0,
//     },
//     elevation: 5,
// }