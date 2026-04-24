import { View, ViewStyle } from "react-native"

import { Header } from "@/components/UI/Header"
import { ProgressBar } from "@/components/UI/ProgressBar"
import { useAppTheme } from "@/theme/context"
import { IdleAnimation } from "../Anims/IdleAnimation"
import GiftSvg from "../GiftSvg"

interface StepsHeaderProps {
    progress: number
    showBackButton?: boolean
    onBackPress?: () => void
}

export function StepsHeader({ progress, showBackButton = false, onBackPress }: StepsHeaderProps) {
    const { themed } = useAppTheme()

    return (
        <Header
            containerStyle={$headerContainer}
            backgroundColor="transparent"
            // leftIcon="caretLeft" onLeftPress={onBackPress}
            {...(showBackButton ? { leftIcon: "caretLeft", onLeftPress: onBackPress } : {})}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.transparent,
    position: "relative",
})

const $progressWrapper: ViewStyle = {
    flex: 1,
    marginRight: 32,
}

const $giftAbsolute: ViewStyle = {
    position: "absolute",
    right: 0,
    marginRight: 48,
}

const $giftContainer = (theme: any): ViewStyle => ({
    marginLeft: 10,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: theme.colors.palette.neutral100,
})