import { View, Text, ViewStyle, TextStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { HomeTabsParamList } from "@/navigators/HomeTabsNavigator"
import { useAppTheme } from "@/theme/context"
import { Button } from "@/components/UI/Button"

type Props = NativeStackScreenProps<HomeTabsParamList, "Battle">

export default function BattleScreen({ navigation }: Props) {
  const {
    themed,
    theme: { colors },
     } = useAppTheme()

  return (
       <View style={themed($container)}>
          <View style={themed($content)}>
            <Ionicons name="game-controller-outline" size={48} color={colors.tint} />
           <Text style={themed($title)}>Battle</Text>
          </View>
          <Button
            text="Open GameScreen"
            onPress={() => navigation.getParent()?.navigate("GameScreen")}
            style={themed($button)}
          />
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

const $button: ViewStyle = {
  marginTop: 20,
  alignSelf: "center",
}
