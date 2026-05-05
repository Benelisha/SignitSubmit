import { View, Text, ViewStyle, TextStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAppTheme } from "@/theme/context"

export default function UpgradesScreen() {
  const {
    themed,
    theme: { colors },
     } = useAppTheme()

  return (
      <View style={themed($container)}>
        <View style={themed($content)}>
          <Ionicons name="rocket-outline" size={48} color={colors.tint} />
          <Text style={themed($title)}>Upgrades</Text>
        </View>
      </View>
    )
}

const $container: ViewStyle = {
  flex: 1,
}

const $content: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $title: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
}
