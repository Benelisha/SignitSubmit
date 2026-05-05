import { View, Text, ViewStyle, TextStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { GameStackParamList } from "@/navigators/GameStackNavigator"
import { useAppTheme } from "@/theme/context"
import { Button } from "@/components/UI/Button"

type Props = NativeStackScreenProps<GameStackParamList, "GameScreen">

export default function GameScreen({ navigation }: Props) {
  const {
    themed,
    theme: { colors },
     } = useAppTheme()

  return (
      <View style={themed($container)}>
        <View style={themed($content)}>
          <Ionicons name="game-controller-outline" size={48} color={colors.tint} />
          <Text style={themed($title)}>Game</Text>
        </View>
          <Button
          text="Go Back"
          onPress={() => navigation.goBack()}
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
