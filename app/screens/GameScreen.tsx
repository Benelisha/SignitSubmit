import { View, ViewStyle, StyleSheet } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { GameStackParamList } from "@/navigators/GameStackNavigator"
import { useAppTheme } from "@/theme/context"
import { Button } from "@/components/UI/Button"
import { GameView } from "@/components/GameView"

type Props = NativeStackScreenProps<GameStackParamList, "GameScreen">

export default function GameScreen({ navigation }: Props) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <GameView />
      <View style={$overlay} pointerEvents="box-none">
        <Button
          text="Go Back"
          onPress={() => navigation.goBack()}
          style={themed($button)}
        />
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
}

const $overlay: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  justifyContent: "flex-end",
  alignItems: "center",
  paddingBottom: 40,
}

const $button: ViewStyle = {
  alignSelf: "center",
}
