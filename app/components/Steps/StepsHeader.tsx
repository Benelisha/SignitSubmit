import { View, ViewStyle } from "react-native"

import { Header } from "@/components/UI/Header"
import { ProgressBar } from "@/components/UI/ProgressBar"
import { useAppTheme } from "@/theme/context"
import { IdleAnimation } from "../Anims/IdleAnimation"
import GiftSvg from "../GiftSvg"
import { LangPicker } from "./LangPicker"
import { FadeInFadeOut } from "../Anims/FadeInFadeOut"

interface StepsHeaderProps {
    progress: number
    showBackButton?: boolean
    onBackPress?: () => void
}

export const STEPS_HEADER_BAR_HEIGHT = 64

export function StepsHeader({ progress, showBackButton = false, onBackPress }: StepsHeaderProps) {
    const { themed } = useAppTheme()

    return (
        <FadeInFadeOut in="top" out="top" style={$headerContainer} inDuration={180} inDelay={300}>
            <Header
                backgroundColor="transparent"
                // leftIcon="caretLeft" onLeftPress={onBackPress}
                {...(showBackButton ? { leftIcon: "caretLeft", onLeftPress: onBackPress } : {})}
                RightActionComponent={<LangPicker />}
                titleComponent={
                    <View style={themed($content)}>
                        <View style={$progressWrapper}>
                            <ProgressBar progress={progress} />
                        </View>
                        <IdleAnimation style={[themed($giftContainer), $giftAbsolute]}>
                            <GiftSvg width={28} height={28} />
                        </IdleAnimation>
                    </View>
                }
            />
        </FadeInFadeOut>
    )
}

const $headerContainer: ViewStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
}

const $content = (theme: any): ViewStyle => ({
    flex: 1,
    width: "100%",
    maxWidth: 620,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.transparent,
    position: "relative",
    paddingLeft: theme.spacing.xxl,
    paddingRight: theme.spacing.xxl,
})

const $progressWrapper: ViewStyle = {
    flex: 1,
    marginRight: 24,
    marginLeft: -24,
}

const $giftAbsolute: ViewStyle = {
    position: "absolute",
    right: 64,
    // marginRight: 48,
}

const $giftContainer = (theme: any): ViewStyle => ({
    marginRight: 16,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
})