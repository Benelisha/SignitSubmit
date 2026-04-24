import { useCallback, useState } from "react"
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from "react-native"
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated"
import { Image } from "expo-image"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"

import { LANG_OPTIONS, LangCode, LangOption, useLang } from "@/context/LangContext"
import { useAppTheme } from "@/theme/context"

const BUTTON_SIZE = 38
const FLAG_SIZE = 48
const ANIM_IN_DURATION = 200
const ANIM_OUT_DURATION = 160

export function LangPicker() {
    const { lang, langOption, setLang } = useLang()
    const { theme } = useAppTheme()
    const [modalVisible, setModalVisible] = useState(false)

    const progress = useSharedValue(0) // 0 = closed, 1 = open

    const openDropdown = useCallback(() => {
        progress.value = 0
        setModalVisible(true)
        progress.value = withTiming(1, {
            duration: ANIM_IN_DURATION,
            easing: Easing.out(Easing.cubic),
        })
    }, [progress])

    const closeDropdown = useCallback(() => {
        progress.value = withTiming(
            0,
            { duration: ANIM_OUT_DURATION, easing: Easing.in(Easing.cubic) },
            (finished) => {
                if (finished) runOnJS(setModalVisible)(false)
            },
        )
    }, [progress])

    const handleSelect = (code: LangCode) => {
        setLang(code)
        closeDropdown()
    }

    const $animatedOverlay = useAnimatedStyle(() => ({
        opacity: progress.value,
    }))

    const $animatedDropdown = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [{ translateY: (1 - progress.value) * -12 }],
    }))

    return (
        <>
            {/* Circle flag button */}
            <TouchableOpacity
                onPress={openDropdown}
                style={[$button, { backgroundColor: theme.colors.palette.neutral100 }]}
                accessibilityLabel={`Language: ${langOption.label}`}
                accessibilityRole="button"
            >
                {langOption.flagUrl ? (
                    <Image source={{ uri: langOption.flagUrl }} style={$flag} contentFit="cover" />
                ) : (
                    <Text style={$fallbackText}>{lang.toUpperCase()}</Text>
                )}
            </TouchableOpacity>

            {/* Dropdown modal — animationType="none" so only Reanimated controls visuals */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="none"
                onRequestClose={closeDropdown}
                statusBarTranslucent
            >
                <Animated.View style={[$overlayBase, $animatedOverlay]}>
                    <Pressable style={StyleSheet.absoluteFillObject} onPress={closeDropdown} />
                    <SafeAreaInsetsContext.Consumer>
                        {(insets) => (
                            <Animated.View
                                style={[
                                    $dropdown,
                                    { backgroundColor: theme.colors.background, marginTop: (insets?.top ?? 0) + 44 },
                                    $animatedDropdown,
                                ]}
                                onStartShouldSetResponder={() => true}
                            >
                                <FlatList<LangOption>
                                    data={LANG_OPTIONS}
                                    keyExtractor={(item) => item.code}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) => {
                                        const isSelected = item.code === lang
                                        return (
                                            <TouchableOpacity
                                                onPress={() => handleSelect(item.code)}
                                                style={[
                                                    $row,
                                                    isSelected && { backgroundColor: theme.colors.palette.neutral200 },
                                                ]}
                                                accessibilityRole="button"
                                                accessibilityState={{ selected: isSelected }}
                                            >
                                                <View style={$rowFlag}>
                                                    {item.flagUrl ? (
                                                        <Image
                                                            source={{ uri: item.flagUrl }}
                                                            style={$rowFlagImage}
                                                            contentFit="cover"
                                                        />
                                                    ) : (
                                                        <Text style={$fallbackText}>{item.code.toUpperCase()}</Text>
                                                    )}
                                                </View>
                                                <Text
                                                    style={[
                                                        $rowLabel,
                                                        { color: theme.colors.text },
                                                        isSelected && { fontWeight: "700" },
                                                    ]}
                                                >
                                                    {item.label}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </Animated.View>
                        )}
                    </SafeAreaInsetsContext.Consumer>
                </Animated.View>
            </Modal>
        </>
    )
}

const $button: ViewStyle = {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginRight: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
}

const $flag: ImageStyle = {
    width: FLAG_SIZE,
    height: FLAG_SIZE,
    borderRadius: FLAG_SIZE / 2,
}

const $fallbackText: TextStyle = {
    fontSize: 10,
    fontWeight: "700",
}

const $overlayBase: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "flex-end",
    justifyContent: "flex-start",
}

const $dropdown: ViewStyle = {
    marginTop: 44,
    marginRight: 34,
    borderRadius: 12,
    paddingVertical: 6,
    width: 180,
    maxHeight: 340,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
}

const $row: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 10,
}

const $rowFlag: ViewStyle = {
    width: 28,
    height: 28,
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
}

const $rowFlagImage: ImageStyle = {
    width: 28,
    height: 28,
}

const $rowLabel: TextStyle = {
    fontSize: 13,
    lineHeight: 18,
}
