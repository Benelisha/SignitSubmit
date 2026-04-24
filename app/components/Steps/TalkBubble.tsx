import { StyleProp, TextStyle, View, ViewStyle } from "react-native"

import BubbleArrow from "@assets/bubble_arrow.svg"
import { Text } from "@/components/UI/Text"
import { useAppTheme } from "@/theme/context"
import { spacing } from "@/theme/spacing"
import type { Theme } from "@/theme/types"
import { FadeInFadeOut } from "../Anims/FadeInFadeOut"

const ARROW_SIZE = 36
const ARROW_INSET = -24
const ARROW_OFFSET = spacing.md

export type TalkBubbleArrowPosition = "left" | "right" | "top" | "down"

interface TalkBubbleProps {
  text: string
  style?: StyleProp<ViewStyle>
  arrowPosition?: TalkBubbleArrowPosition
  arrowTranslateX?: number
  arrowTranslateY?: number
}

export function TalkBubble({
  text,
  style,
  arrowPosition = "left",
  arrowTranslateX = 0,
  arrowTranslateY = 0,
}: TalkBubbleProps) {
  const { themed } = useAppTheme()

  return (
    <View style={[themed($bubble), style]}>
      <FadeInFadeOut inDelay={120} inDuration={500}>
        <Text text={text} style={themed($text)} />
      </FadeInFadeOut>
      <View style={[themed($arrowBase), getArrowStyle(arrowPosition, arrowTranslateX, arrowTranslateY)]}>
        <BubbleArrow width="100%" height="100%" />
      </View>
    </View>
  )
}

const $bubble = (theme: Theme): ViewStyle => ({
  position: "relative",
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
  backgroundColor: theme.colors.talkBubbleSurface,
  borderWidth: 2.5,
  borderColor: theme.colors.talkBubbleOutline,
  borderRadius: spacing.md,
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
  fontFamily: theme.typography.primary.medium,
  fontSize: theme.typography.sizes.md.fontSize + 2,
  lineHeight: theme.typography.sizes.xxl.fontSize,
  color: theme.colors.talkBubbleText,
  letterSpacing: 0,
  textAlignVertical: "center",

})

const $arrowBase: ViewStyle = {
  position: "absolute",
  width: ARROW_SIZE,
  height: ARROW_SIZE,
}

function getArrowStyle(
  position: TalkBubbleArrowPosition,
  translateX: number,
  translateY: number,
): ViewStyle {
  switch (position) {
    case "right":
      return {
        right: ARROW_INSET,
        top: ARROW_OFFSET,
        transform: [{ translateX }, { translateY }, { rotate: "180deg" }],
      }
    case "top":
      return {
        top: ARROW_INSET,
        left: ARROW_OFFSET,
        transform: [{ translateX }, { translateY }, { rotate: "90deg" }],
      }
    case "down":
      return {
        bottom: ARROW_INSET,
        left: ARROW_OFFSET,
        transform: [{ translateX }, { translateY }, { rotate: "-90deg" }],
      }
    case "left":
    default:
      return {
        left: ARROW_INSET,
        top: ARROW_OFFSET,
        transform: [{ translateX }, { translateY }],
      }
  }
}