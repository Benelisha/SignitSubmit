import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { useAppTheme } from "@/theme/context"

// Splash Screen - Only handles loading state
export function SplashScreen() {
  const {
    theme: { colors },
  } = useAppTheme()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate async loading for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.centerText, { color: colors.text }]}>Loading...</Text>
      </View>
    )
  }

  // When loading is complete, return null to show the next screen
  return null
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
})
