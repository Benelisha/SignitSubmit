import { ComponentType, useCallback, useEffect } from "react"
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleSheet,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated"

import { useAppTheme } from "@/theme/context"
import type { Theme } from "@/theme/types"

import { Text, TextProps } from "./Text"

const AnimatedText = Animated.createAnimatedComponent(Text)

export type ButtonState = "default" | "selected" | "disabled"
type ButtonVariant = "standard" | "action"

const BUTTON_DEPTH = 8
const SHELL_RADIUS = 14
const FACE_RADIUS = 12.5
const STATE_ORDER: ButtonState[] = ["default", "selected", "disabled"]

export interface ButtonAccessoryProps {
  style: StyleProp<any>
  pressableState: PressableStateCallbackType
  disabled?: boolean
}

interface BaseButtonProps extends PressableProps {
  tx?: TextProps["tx"]
  text?: TextProps["text"]
  txOptions?: TextProps["txOptions"]
  style?: StyleProp<ViewStyle>
  pressedStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  pressedTextStyle?: StyleProp<TextStyle>
  disabledTextStyle?: StyleProp<TextStyle>
  RightAccessory?: ComponentType<ButtonAccessoryProps>
  LeftAccessory?: ComponentType<ButtonAccessoryProps>
  children?: React.ReactNode
  disabledStyle?: StyleProp<ViewStyle>
  shadowColor?: string
  depth?: number
}

export interface ButtonProps extends BaseButtonProps {
  state?: ButtonState
}

export interface ActionButtonProps extends Omit<BaseButtonProps, "pressedTextStyle"> {
  actionDisabledTextStyle?: StyleProp<TextStyle>
}

type ButtonVisualStyle = {
  surfaceColor: string
  outlineColor: string
  textColor: string
  textStyle: TextStyle
}

function getButtonStyles(theme: Theme): Record<ButtonState, ButtonVisualStyle> {
  return {
    default: {
      surfaceColor: theme.colors.buttonDefaultSurface,
      outlineColor: theme.colors.buttonDefaultOutline,
      textColor: theme.colors.buttonDefaultText,
      textStyle: {
        fontFamily: theme.typography.primary.semiBold,
        fontSize: 18,
        lineHeight: 22,
      },
    },
    selected: {
      surfaceColor: theme.colors.buttonSelectedSurface,
      outlineColor: theme.colors.buttonSelectedOutline,
      textColor: theme.colors.buttonSelectedText,
      textStyle: {
        fontFamily: theme.typography.primary.extraBold,
        fontSize: 18,
        lineHeight: 22,
        fontVariant: ["lining-nums", "proportional-nums"],
      },
    },
    disabled: {
      surfaceColor: theme.colors.buttonDisabledSurface,
      outlineColor: theme.colors.buttonDisabledOutline,
      textColor: theme.colors.buttonDisabledText,
      textStyle: {
        fontFamily: theme.typography.primary.semiBold,
        fontSize: 18,
        lineHeight: 22,
      },
    },
  }
}

function getActionStyles(theme: Theme): Record<ButtonState, ButtonVisualStyle> {
  return {
    default: {
      surfaceColor: theme.colors.buttonFilledSurface,
      outlineColor: theme.colors.buttonFilledOutline,
      textColor: theme.colors.buttonFilledText,
      textStyle: {
        fontFamily: theme.typography.primary.extraBold,
        fontSize: 14,
        lineHeight: 18,
        textTransform: "uppercase",
        fontVariant: ["lining-nums", "proportional-nums"],
      },
    },
    selected: {
      surfaceColor: theme.colors.buttonFilledSurface,
      outlineColor: theme.colors.buttonFilledOutline,
      textColor: theme.colors.buttonFilledText,
      textStyle: {
        fontFamily: theme.typography.primary.extraBold,
        fontSize: 14,
        lineHeight: 18,
        textTransform: "uppercase",
        fontVariant: ["lining-nums", "proportional-nums"],
      },
    },
    disabled: {
      surfaceColor: theme.colors.buttonDisabledSurface,
      outlineColor: theme.colors.buttonDisabledOutline,
      textColor: theme.colors.buttonDisabledText,
      textStyle: {
        fontFamily: theme.typography.primary.semiBold,
        fontSize: 14,
        lineHeight: 18,
        textTransform: "uppercase",
        fontVariant: ["lining-nums", "proportional-nums"],
      },
    },
  }
}

function InternalButton(
  props: BaseButtonProps & {
    variant: ButtonVariant
    state: ButtonState
    actionDisabledTextStyle?: StyleProp<TextStyle>
  },
) {
  const {
    tx,
    text,
    txOptions,
    style: $styleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    disabledTextStyle: $disabledTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    disabled: disabledProp,
    disabledStyle: $disabledViewStyleOverride,
    state,
    variant,
    actionDisabledTextStyle: $actionDisabledTextStyleOverride,
    shadowColor,
    depth = BUTTON_DEPTH,
    onPressIn,
    onPressOut,
    ...rest
  } = props

  const { theme } = useAppTheme()
  const flatStyle = StyleSheet.flatten($styleOverride) ?? {}
  const isDisabled = !!disabledProp || state === "disabled"
  const resolvedState: ButtonState = isDisabled ? "disabled" : state
  const visualStylesByState = variant === "action" ? getActionStyles(theme) : getButtonStyles(theme)
  const currentVisualStyle = visualStylesByState[resolvedState]
  const modeIndex = STATE_ORDER.indexOf(resolvedState)
  const restingOffset = resolvedState === "disabled" ? depth : 0

  const modeProgress = useSharedValue(modeIndex)
  const pressOffset = useSharedValue(restingOffset)

  useEffect(() => {
    modeProgress.value = withTiming(modeIndex, {
      duration: 180,
      easing: Easing.inOut(Easing.sin),
    })

    pressOffset.value = withTiming(restingOffset, {
      duration: 180,
      easing: Easing.inOut(Easing.sin),
    })
  }, [modeIndex, modeProgress, pressOffset, restingOffset])

  const outlineColors = STATE_ORDER.map((buttonState) =>
    buttonState === resolvedState && shadowColor
      ? shadowColor
      : visualStylesByState[buttonState].outlineColor,
  )
  const surfaceColors = STATE_ORDER.map((buttonState) => visualStylesByState[buttonState].surfaceColor)
  const textColors = STATE_ORDER.map((buttonState) => visualStylesByState[buttonState].textColor)

  const $topFaceAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressOffset.value }],
  }))

  const $shellAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(modeProgress.value, [0, 1, 2], outlineColors),
  }))

  const $surfaceAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(modeProgress.value, [0, 1, 2], surfaceColors),
    borderBottomColor: interpolateColor(modeProgress.value, [0, 1, 2], outlineColors),
  }))

  const $bottomAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(modeProgress.value, [0, 1, 2], outlineColors),
  }))

  const $textAnimatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(modeProgress.value, [0, 1, 2], textColors),
  }))

  const handlePressIn = useCallback(
    (e: any) => {
      if (!isDisabled) {
        pressOffset.value = withTiming(depth, {
          duration: 10,
          easing: Easing.out(Easing.sin),
        })
      }

      onPressIn?.(e)
    },
    [depth, isDisabled, onPressIn, pressOffset],
  )

  const handlePressOut = useCallback(
    (e: any) => {
      pressOffset.value = withSpring(restingOffset, { damping: 54, stiffness: 820 })
      onPressOut?.(e)
    },
    [onPressOut, pressOffset, restingOffset],
  )

  const {
    height,
    minHeight,
    maxHeight,
    padding,
    paddingVertical,
    paddingTop,
    paddingBottom,
    ...$wrapperStyleRest
  } = flatStyle

  const $wrapperStyle: StyleProp<ViewStyle> = [$outerWrapper, { paddingBottom: depth }, $wrapperStyleRest]

  const $faceSizeOverride: ViewStyle = {
    ...(typeof height === "number" ? { height } : {}),
    ...(typeof minHeight === "number"
      ? { minHeight }
      : typeof height === "number" || typeof maxHeight === "number"
        ? { minHeight: 0 }
        : {}),
    ...(typeof maxHeight === "number" ? { maxHeight } : {}),
    ...(typeof padding === "number" ? { padding } : {}),
    ...(typeof paddingVertical === "number" ? { paddingVertical } : {}),
    ...(typeof paddingTop === "number" ? { paddingTop } : {}),
    ...(typeof paddingBottom === "number" ? { paddingBottom } : {}),
  }

  const $textModeStyle: StyleProp<TextStyle> = [
    $baseTextStyle,
    currentVisualStyle.textStyle,
    $textStyleOverride,
    resolvedState === "disabled" && $disabledTextStyleOverride,
    variant === "action" && resolvedState === "disabled" && $actionDisabledTextStyleOverride,
  ]

  const $faceModeStyle: ViewStyle = {
    justifyContent: variant === "action" ? "center" : "flex-start",
    gap: variant === "action" ? 0 : 8,
    paddingHorizontal: variant === "action" ? 0 : 16,
  }

  const $leftAccessoryStyle: ViewStyle = {
    marginEnd: theme.spacing.xs,
    zIndex: 1,
  }

  const $rightAccessoryStyle: ViewStyle = {
    marginStart: theme.spacing.xs,
    zIndex: 1,
  }

  return (
    <View style={$wrapperStyle}>
      <Animated.View
        pointerEvents="none"
        style={[$bottomSlabStyle, { top: depth }, $bottomAnimatedStyle]}
      />

      <Animated.View style={[$topFaceWrapper, $topFaceAnimatedStyle]}>
        <Animated.View style={[$topShellBase, $shellAnimatedStyle]}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled, selected: resolvedState === "selected" }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isDisabled}
            {...rest}
          >
            {({ pressed }) => (
              <Animated.View
                style={[
                  $faceBase,
                  $faceModeStyle,
                  $faceSizeOverride,
                  $surfaceAnimatedStyle,
                  // (pressed || mode === "disabled") && $pressedBottomBorder,
                  pressed && $pressedViewStyleOverride,
                  resolvedState === "disabled" && $disabledViewStyleOverride,
                ]}
              >
                {!!LeftAccessory && (
                  <LeftAccessory
                    style={$leftAccessoryStyle}
                    pressableState={{ pressed } as PressableStateCallbackType}
                    disabled={isDisabled}
                  />
                )}

                <AnimatedText
                  tx={tx}
                  text={text}
                  txOptions={txOptions}
                  style={[
                    $textModeStyle,
                    $textAnimatedStyle,
                    pressed && $pressedTextStyleOverride,
                    resolvedState === "disabled" && $disabledTextStyleOverride,
                    {
                      textAlign: variant === "action" ? "center" : "left",
                    },
                  ]}
                >
                  {children}
                </AnimatedText>

                {!!RightAccessory && (
                  <RightAccessory
                    style={$rightAccessoryStyle}
                    pressableState={{ pressed } as PressableStateCallbackType}
                    disabled={isDisabled}
                  />
                )}
              </Animated.View>
            )}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  )
}

export function Button(props: ButtonProps) {
  const { state = "default", ...rest } = props
  return <InternalButton {...rest} variant="standard" state={state} />
}

export function ActionButton(props: ActionButtonProps) {
  const { actionDisabledTextStyle, ...rest } = props
  return (
    <InternalButton
      {...rest}
      variant="action"
      state={props.disabled ? "disabled" : "default"}
      actionDisabledTextStyle={actionDisabledTextStyle}
    />
  )
}

const $outerWrapper: ViewStyle = {
  position: "relative",
  overflow: "visible",
}

const $topFaceWrapper: ViewStyle = {
  zIndex: 1,
}

const $topShellBase: ViewStyle = {
  padding: 3,
  borderRadius: SHELL_RADIUS,
}

const $faceBase: ViewStyle = {
  minHeight: 56,
  borderRadius: FACE_RADIUS,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 12,
  paddingHorizontal: 12,
  overflow: "hidden",
}

const $baseTextStyle: TextStyle = {
  textAlign: "center",
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
  letterSpacing: 0,
}

const $bottomSlabStyle: ViewStyle = {
  position: "absolute",
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 0,
  borderTopLeftRadius: SHELL_RADIUS,
  borderTopRightRadius: SHELL_RADIUS,
  borderBottomLeftRadius: SHELL_RADIUS,
  borderBottomRightRadius: SHELL_RADIUS,
}

