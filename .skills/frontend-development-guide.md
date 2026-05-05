# 🚀 Singit Solution - Professional Frontend Development Guidelines

**Version:** 1.0.0  
**Last Updated:** May 5, 2026  
**Tech Stack:** Expo 55.0.17 | React Native 0.83.6 | React 19.2.0 | TypeScript

---

## 📋 Overview

This document serves as the **single source of truth** for writing professional, production-grade code in the Singit Solution project. These guidelines are crafted from 10+ years of React Native/Expo expertise and reflect the project's established patterns, architecture, and best practices.

---

## 🎯 Core Principles

### 1. **Code Clarity & Documentation**
- Every function, hook, and component must have a **1-line comment** explaining its purpose
- Use descriptive names that self-document the code
- Avoid magic numbers and strings - extract them to constants

### 2. **Component Size & Readability**
- Keep components under **500 lines** maximum
- Break down large components into smaller, focused sub-components
- Each component should have a single responsibility

### 3. **Project Structure Adherence**
- Follow the established folder structure strictly
- Import paths use `@/` alias for clean imports
- Match existing patterns for services, components, and utilities

### 4. **Type Safety First**
- Use TypeScript strictly - no `any` unless absolutely necessary
- Define proper interfaces for all props and state
- Leverage TypeScript's type system for compile-time safety

### 5. **Navigation & Tab Bar Best Practices**
- Use custom tab bar icons with IonIcons or custom components
- Implement icon switching between focused/unfocused states using animated transitions
- Apply themed styles from the app's theme context for consistency
- Use `CustomTabIcon` component pattern for consistent tab icon rendering
- Always delay button press callbacks (300ms) to allow animations to complete

---

## 🏗️ Project Architecture

### Folder Structure

```
app/
├── components/           # Reusable UI components
│   ├── UI/             # Base UI components (Button, Text, Header, etc.)
│   ├── Steps/          # Step-specific components
│   ├── Anims/          # Animation components
│   └── Toggle/         # Toggle components
├── config/             # Environment-specific configurations
│   ├── config.base.ts
│   ├── config.dev.ts
│   └── config.prod.ts
├── context/            # React Context providers (LangContext, StepContext, ThemeContext)
├── i18n/               # Internationalization (en.ts, ar.ts, es.ts, etc.)
├── navigators/         # React Navigation setup (AppNavigation, StepsNavigation)
├── screens/            # Screen components (StepsScreen, etc.)
├── services/           # API and business logic services
│   ├── api/
│   └── onboarding/
├── theme/              # Design system (colors, spacing, typography, timing)
└── utils/              # Utility functions and helpers
    └── storage/        # MMKV storage utilities
```

### Key Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **Expo** | Development framework | 55.0.17 |
| **React Native** | Mobile framework | 0.83.6 |
| **React Navigation** | Navigation | ^7.0.14 |
| **React Native Reanimated** | Animations | 4.2.1 |
| **React Native MMKV** | Storage | 3.3.3 |
| **TypeScript** | Type safety | Latest |
| **i18next** | Internationalization | ^23.14.0 |
| **APIsauce** | HTTP client | 3.1.1 |

---

## 📝 Coding Standards

### File Naming Conventions

- **Components:** PascalCase (e.g., `StepsScreen.tsx`, `ActionButton.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useLang.tsx`, `useStepContext.ts`)
- **Utils:** camelCase (e.g., `formatDate.ts`, `delay.ts`)
- **Types:** PascalCase with descriptive names (e.g., `LangContextType.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `BUTTON_DEPTH`, `STEPS_HEADER_BAR_HEIGHT`)

### Import Organization

```typescript
// 1. React/React Native imports
import { useState, useEffect } from "react"
import { View, TextStyle } from "react-native"

// 2. Third-party libraries
import { NavigationContainer } from "@react-navigation/native"
import { useMMKVString } from "react-native-mmkv"

// 3. Project imports (use @/ alias)
import { useAppTheme } from "@/theme/context"
import { LangProvider } from "@/context/LangContext"

// 4. Local imports
import { Button } from "./Button"
```

### Component Structure Template

```typescript
// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------
export interface MyComponentProps {
  /** Description of prop */
  propName: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MY_CONSTANT = "value"

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
/**
 * Brief description of what this component does.
 * @param props - The component props.
 * @returns The rendered component.
 */
export function MyComponent(props: MyComponentProps) {
  // Hook declarations
  const { data } = useSomeHook()
  
  // Memoized values
  const processedData = useMemo(() => {
    return data.map(...)
  }, [data])
  
  // Effects
  useEffect(() => {
    // Side effect logic
  }, [data])
  
  // Render
  return <View>{/* JSX */}</View>
}
```

---

## 🎨 Theme System

### Using the Theme System

The project uses a sophisticated theming system with support for light/dark modes:

```typescript
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export function ThemedComponent() {
  const { themed, theme } = useAppTheme()
  
  // Themed styles
  const $container: ThemedStyle<ViewStyle> = (theme) => ({
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  })
  
  // Usage
  return <View style={themed($container)} />
}
```

### Theme Access Patterns

- **Light mode colors:** `theme.colors.background`, `theme.colors.text`
- **Spacing:** `theme.spacing.xs`, `theme.spacing.sm`, `theme.spacing.md`, `theme.spacing.lg`, `theme.spacing.xl`, `theme.spacing.xxl`
- **Typography:** `theme.typography.primary`, `theme.typography.secondary`
- **Timing:** `theme.timing.duration`, `theme.timing.easing`

---

## 🔄 State Management

### Context Usage

The project uses React Context for global state management:

```typescript
// Context Provider (in provider file)
export const LangProvider: FC<PropsWithChildren> = ({ children }) => {
  const [lang, setLang] = useMMKVString("app.lang")
  
  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])
  
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

// Consuming context
export const useLang = () => {
  const context = useContext(LangContext)
  if (!context) throw new Error("useLang must be used within LangProvider")
  return context
}

// Usage in component
const { lang, setLang } = useLang()
```

### Storage Patterns

Use the `storage` utilities for persistent data:

```typescript
import { load, save, remove, clear } from "@/utils/storage"

// Save data
save("user_preferences", { theme: "dark", language: "en" })

// Load data
const preferences = load<UserPreferences>("user_preferences")

// Remove data
remove("user_preferences")
```

---

## 🌍 Internationalization (i18n)

### Translation Usage

```typescript
import { useTranslation } from "react-i18next"
import { Text } from "@/components/UI/Text"

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <Text 
      tx="common.ok"  // Reference to i18n key
      preset="default"
    />
  )
}
```

### Adding New Translations

1. Add key to `app/i18n/[locale].ts` files
2. Define type in `app/i18n/translate.ts`
3. Use in components via `tx` prop

---

## 🎬 Animations

### Reanimated Patterns

```typescript
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated"

function AnimatedComponent() {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(0.5, { duration: 300 }),
      transform: [{ scale: withTiming(1.2) }],
    }
  })
  
  return <Animated.View style={animatedStyle} />
}
```

---

## 🧪 Testing

### Component Testing

```typescript
import { render, screen } from "@testing-library/react-native"
import { MyComponent } from "./MyComponent"

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />)
    expect(screen.getByText(/expected text/i)).toBeTruthy()
  })
})
```

---

## 📦 Navigation Patterns

### Navigation Structure

**IMPORTANT:** Each screen should be in its own file. Navigators should be in the `navigators/` folder.

**Example Structure:**
```
app/
├── navigators/
│   ├── AppNavigation.tsx        # Main app navigation
│   ├── HomeTabsNavigator.tsx    # Tab navigator for home tabs
│   └── GameStackNavigator.tsx  # Stack navigator for game screens
├── screens/
│   ├── SplashScreen.tsx         # Loading splash screen
│   ├── ShopScreen.tsx           # Shop tab screen
│   ├── ArmoryScreen.tsx         # Armory tab screen
│   ├── BattleScreen.tsx         # Battle tab screen
│   ├── UpgradesScreen.tsx       # Upgrades tab screen
│   ├── HiddenScreen.tsx         # Hidden tab screen
│   └── GameScreen.tsx           # Game screen (stack)
```

### Tab Navigator Example

```typescript
// navigators/HomeTabsNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useAppTheme } from "@/theme/context"
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

export function HomeTabsNavigator() {
  const {
    theme: { colors },
     } = useAppTheme()

  return (
     <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
           },
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textDim,
        style: {
          backgroundColor: colors.background,
           },
        })}
      >
        <Tab.Screen name="Shop" component={ShopScreen} />
        <Tab.Screen name="Armory" component={ArmoryScreen} />
        <Tab.Screen name="Battle" component={BattleScreen} />
        <Tab.Screen name="Upgrades" component={UpgradesScreen} />
        <Tab.Screen name="Hidden" component={HiddenScreen} />
      </Tab.Navigator>
    )
}
```

### Stack Navigator Example

```typescript
// navigators/GameStackNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { HomeTabsParamList } from "./HomeTabsNavigator"
import { useAppTheme } from "@/theme/context"
import { HomeTabsNavigator } from "./HomeTabsNavigator"
import GameScreen from "@/screens/GameScreen"

export type GameStackParamList = {
  HomeTabs: undefined
  GameScreen: undefined
}

const Stack = createNativeStackNavigator<GameStackParamList>()

export function GameStackNavigator() {
  const {
    theme: { colors },
     } = useAppTheme()

  return (
     <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
           },
        }}
      initialRouteName="HomeTabs"
      >
       <Stack.Screen name="HomeTabs" component={HomeTabsNavigator} />
       <Stack.Screen name="GameScreen" component={GameScreen} />
      </Stack.Navigator>
    )
}
```

### Navigation Between Tab and Stack

**From Tab to Stack:**
```typescript
// In BattleScreen (inside tab navigator)
navigation.getParent()?.navigate("GameScreen") // Navigate to parent stack
```

**From Stack to Tab:**
```typescript
// In GameScreen (inside stack navigator)
navigation.goBack() // Go back to tab navigator
```

### Splash Screen Pattern

```typescript
// screens/SplashScreen.tsx
import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import { useAppTheme } from "@/theme/context"

export function SplashScreen() {
  const {
    theme: { colors },
     } = useAppTheme()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate async loading
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

  // Return null when loading completes to show next screen
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
```

### React Navigation Setup

```typescript
// Define param list
export type AppStackParamList = {
  Home: undefined
  Details: { itemId: string }
}

// Create stack
const Stack = createNativeStackNavigator<AppStackParamList>()

// Navigate
navigation.navigate("Details", { itemId: 123 })
navigation.goBack()
```

---

## 🎨 Icon Guidelines

**Use Ionicons from `@expo/vector-icons`:**

```typescript
import { Ionicons } from "@expo/vector-icons"

// Example usage
<Ionicons name="storefront-outline" size={48} color={colors.tint} />
<Ionicons name="shield-outline" size={48} color={colors.tint} />
<Ionicons name="game-controller-outline" size={48} color={colors.tint} />
<Ionicons name="rocket-outline" size={48} color={colors.tint} />
<Ionicons name="eye-off-outline" size={48} color={colors.tint} />
```

**Common Ionicons:**
- `storefront-outline` - Shop
- `shield-outline` - Armory
- `game-controller-outline` - Battle/Game
- `rocket-outline` - Upgrades
- `eye-off-outline` - Hidden
- `home-outline` - Home
- `settings-outline` - Settings
- `person-outline` - Profile

---

## 🧵 Button & UI Guidelines

**Avoid using `TouchableOpacity` directly.** Use the `Button` component from `@/components/UI/Button`:

```typescript
import { Button } from "@/components/UI/Button"

// Basic button
<Button
  text="Click Me"
  onPress={() => console.log("Pressed!")}
  style={themed($buttonStyle)}
/>
```

**Button with Accessories:**
```typescript
<Button
  text="Submit"
  onPress={handleSubmit}
  LeftAccessory={(props) => <Ionicons name="checkmark" size={20} color={colors.text} />}
  style={themed($buttonStyle)}
/>
```

**Style Definitions:**
```typescript
const $buttonStyle: ViewStyle = {
  marginTop: 20,
  alignSelf: "center",
}
```

---

## 📝 Screen File Structure

**Each screen should follow this pattern:**

```typescript
import { View, Text, ViewStyle, TextStyle } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAppTheme } from "@/theme/context"
import { Button } from "@/components/UI/Button"

export default function ScreenName() {
  const {
    themed,
    theme: { colors },
     } = useAppTheme()

  return (
      <View style={themed($container)}>
        <View style={themed($content)}>
           <Ionicons name="icon-name" size={48} color={colors.tint} />
           <Text style={themed($title)}>Screen Name</Text>
         </View>
          <Button
          text="Button Text"
          onPress={() => { /* action */ }}
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
```

---

## 🚫 What NOT to Do

1. **Don't nest NavigationContainer** - Only one NavigationContainer at the root
2. **Don't use TouchableOpacity** - Use the `Button` component instead
3. **Don't hardcode colors** - Always use theme colors
4. **Don't put screens in navigators** - Each screen should be in its own file
5. **Don't use any type** - Use proper TypeScript types

---

## 🔒 Error Handling

### Error Boundary

```typescript
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"

// Wrap critical sections
<ErrorBoundary catchErrors={Config.catchErrors}>
  <AppContent />
</ErrorBoundary>
```

---

## 🚀 Performance Best Practices

1. **Memoization:** Use `useMemo` and `useCallback` for expensive computations and event handlers
2. **Lazy Loading:** Load heavy components lazily when needed
3. **Image Optimization:** Use `expo-image` for optimized image loading
4. **Avoid Re-renders:** Use `React.memo` for components with stable props
5. **Animation Performance:** Use `react-native-reanimated` for 60fps animations

---

## 📋 Code Review Checklist

Before submitting code, ensure:

- [ ] All functions have 1-line explanatory comments
- [ ] Component is under 500 lines
- [ ] TypeScript types are properly defined
- [ ] Theme is used for all styling (no hardcoded colors)
- [ ] i18n keys are used for user-facing text
- [ ] Storage utilities are used for persistent data
- [ ] Follows existing project patterns
- [ ] No console.log() in production code
- [ ] Proper error handling implemented
- [ ] Tests written for new features

---

## 🛠️ Development Commands

```bash
# Development
pnpm start              # Start Expo dev server
pnpm android            # Run on Android
pnpm ios               # Run on iOS
pnpm web               # Run on web

# Build
pnpm build:ios:prod    # Build iOS production
pnpm build:android:prod # Build Android production

# Quality
pnpm compile           # TypeScript check
pnpm lint              # ESLint with fix
pnpm lint:check        # ESLint without fix
pnpm test              # Run tests
```

---

## 🎯 Professional Standards

### Code Quality

1. **Self-documenting code:** Names should make comments minimal
2. **Consistent formatting:** Follow Prettier and ESLint rules
3. **Clean architecture:** Separate concerns (UI, logic, data)
4. **Error resilience:** Handle errors gracefully
5. **Accessibility:** Support screen readers and accessibility features

### Documentation

1. **JSDoc comments:** For complex functions and public APIs
2. **Inline comments:** Explain "why", not "what"
3. **README updates:** Keep documentation current
4. **Type definitions:** Comprehensive TypeScript types

### Maintainability

1. **DRY principle:** Don't repeat yourself
2. **Single responsibility:** Each component does one thing
3. **Testability:** Code should be easy to test
4. **Performance:** Consider mobile device limitations
5. **Future-proof:** Design for extensibility

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Ignite CLI Docs](https://docs.infinite.red/ignite-cli/)

---

## 🤝 Contributing

When adding new features:

1. Follow existing patterns in the codebase
2. Use the established folder structure
3. Write clear, descriptive code
4. Include comprehensive tests
5. Update this document if patterns change

---

**Remember:** Professional code is not just about functionality—it's about readability, maintainability, and creating a codebase that future developers (including yourself) will thank you for.
