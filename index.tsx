import "@expo/metro-runtime"
import { registerRootComponent } from "expo"
import { SplashScreen } from "expo-splash-screen"
import { App } from "@/app"

registerRootComponent(App)

async function initSplash() {
  // Prevent automatic hide only if the method exists
  if (SplashScreen?.preventAutomaticHideAsync) {
    try {
      await SplashScreen.preventAutomaticHideAsync()
    } catch (e) {
      console.warn("Failed to prevent automatic hide:", e)
    }
  }

  // Simulate async work (2 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Hide splash
  if (SplashScreen?.hideAsync) {
    try {
      await SplashScreen.hideAsync()
    } catch (e) {
      console.warn("Failed to hide splash:", e)
    }
  }
}

initSplash().catch(console.warn)
