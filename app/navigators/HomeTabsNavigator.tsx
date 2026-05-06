import React from "react"
import { View } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAppTheme } from "@/theme/context"
import { Ionicons } from "@expo/vector-icons"

import ShopScreen from "@/screens/ShopScreen"
import ArmoryScreen from "@/screens/ArmoryScreen"
import BattleScreen from "@/screens/BattleScreen"
import UpgradesScreen from "@/screens/UpgradesScreen"
import HiddenScreen from "@/screens/HiddenScreen"

export type HomeTabsParamList = {
  Shop: undefined
  Armory: undefined
  Battle: undefined
  Upgrades: undefined
  Hidden: undefined
}

const Tab = createBottomTabNavigator<HomeTabsParamList>()

interface CustomTabIconProps {
  focused: boolean
  icon: React.JSX.Element
  pressedIcon: React.JSX.Element
}

const CustomTabIcon: React.FC<CustomTabIconProps> = ({ focused, icon, pressedIcon }) => {
  const { themed } = useAppTheme()

  return (
    <View style={themed({
      alignItems: "center",
      justifyContent: "center",
    })}>
      {focused ? pressedIcon : icon}
    </View>
  )
}

const Icon = {
  from: (name: string) => <Ionicons name={name as any} size={24} color="black" />,
}

export function HomeTabsNavigator() {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: themed({
          backgroundColor: colors.background,
          height: 64 + bottom,
          paddingBottom: bottom,
        }),
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textDim,
        tabBarItemStyle: themed({
          paddingVertical: 4,
        }),
      })}
    >
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icon = <Ionicons name="cart-outline" size={size} color={color} />
            const pressedIcon = <Ionicons name="cart" size={size} color={color} />

            return (
              <CustomTabIcon
                focused={route.path === "shop"}
                icon={icon}
                pressedIcon={pressedIcon}
              />
            )
          },
        })}
      />
      <Tab.Screen
        name="Armory"
        component={ArmoryScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icon = <Ionicons name="shield-outline" size={size} color={color} />
            const pressedIcon = <Ionicons name="shield" size={size} color={color} />

            return (
              <CustomTabIcon
                focused={route.path === "armory"}
                icon={icon}
                pressedIcon={pressedIcon}
              />
            )
          },
        })}
      />
      <Tab.Screen
        name="Battle"
        component={BattleScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icon = <Ionicons name="flash-outline" size={size} color={color} />
            const pressedIcon = <Ionicons name="flash" size={size} color={color} />

            return (
              <CustomTabIcon
                focused={route.path === "battle"}
                icon={icon}
                pressedIcon={pressedIcon}
              />
            )
          },
        })}
      />
      <Tab.Screen
        name="Upgrades"
        component={UpgradesScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icon = <Ionicons name="star-outline" size={size} color={color} />
            const pressedIcon = <Ionicons name="star" size={size} color={color} />

            return (
              <CustomTabIcon
                focused={route.path === "upgrades"}
                icon={icon}
                pressedIcon={pressedIcon}
              />
            )
          },
        })}
      />
      <Tab.Screen
        name="Hidden"
        component={HiddenScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icon = Icon.from("lock-closed")
            const pressedIcon = Icon.from("lock-open")

            return (
              <CustomTabIcon
                focused={route.path === "hidden"}
                icon={icon}
                pressedIcon={pressedIcon}
              />
            )
          },
        })}
      />
    </Tab.Navigator>
  )
}
