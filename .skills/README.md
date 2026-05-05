# 🚀 Singit Solution - Complete Development Guide

**Version:** 1.0.0  
**Last Updated:** May 5, 2026  
**Tech Stack:** Expo 55.0.17 | React Native 0.83.6 | React 19.2.0 | TypeScript

---

## 📚 Table of Contents

1. [Frontend Development](./frontend-development-guide.md)
2. [Design System](./design-system.md)
3. [AI Development Agent](./ai-development-agent.md)
4. [Design Agent](./design-agent.md)
5. [Quick Reference](./quick-reference.md)

---

## 🎯 Overview

This is your **complete reference** for developing the Singit Solution app - a Duolingo-inspired, gamified React Native application with smooth animations and engaging UX.

---

## 🏗️ Project Structure

```
app/
├── components/
│   ├── UI/              # Base components (Button, Text, Header, ProgressBar)
│   ├── Steps/           # Step-specific (Chart, TalkBubble, LangPicker)
│   ├── Anims/           # Animation components (IdleAnimation, FadeInFadeOut)
│   ├── Toggle/          # Toggle components
│   └── ChartSvg.tsx     # SVG chart visualization
├── config/             # Environment configs
├── context/            # Context providers (LangContext, StepContext, ThemeContext)
├── i18n/               # Internationalization (en, ar, es, fr, etc.)
├── navigators/         # Navigation (AppNavigation, StepsNavigation)
├── screens/            # Main screens (StepsScreen)
├── services/           # Business logic (api, onboarding)
├── theme/              # Design system (colors, spacing, typography, timing)
└── utils/              # Utilities (storage, formatDate, delay)
```

---

## 🎨 Design Philosophy

**Duolingo-inspired principles:**
- ✅ Gamified experience with progress tracking
- ✅ Smooth 60fps animations
- ✅ Delightful microinteractions
- ✅ Clean, modern UI
- ✅ Accessibility-first

---

## 🎯 Quick Start

### Creating a New Screen

```typescript
// 1. Create file: app/screens/NewScreen.tsx
import { View } from "react-native"
import { useAppTheme } from "@/theme/context"

/**
 * NewScreen - Description of what this screen does.
 */
export function NewScreen() {
  const { themed } = useAppTheme()
  
  return <View style={themed($container)} />
}

const $container = (theme): ViewStyle => ({
  flex: 1,
  backgroundColor: theme.colors.background,
})
```

### Creating a New Component

```typescript
// 2. Create: app/components/UI/NewComponent.tsx
import { View } from "react-native"
import { useAppTheme } from "@/theme/context"

export interface NewComponentProps {
  /** Description of prop */
  propName: string
}

/**
 * NewComponent - Brief description.
 */
export function NewComponent({ propName }: NewComponentProps) {
  const { themed } = useAppTheme()
  
  return <View style={themed($container)} />
}

const $container = (theme): ViewStyle => ({
  padding: theme.spacing.md,
})
```

### Adding Navigation

```typescript
// 3. Update: app/navigators/AppNavigation.tsx
export type AppStackParamList = {
  NewScreen: undefined
  // ... other routes
}

// Navigate
navigation.navigate("NewScreen")
```

---

## 📝 Essential Patterns

### Import Pattern

```typescript
// React/React Native
import { useState } from "react"
import { View } from "react-native"

// Third-party
import { NavigationContainer } from "@react-navigation/native"

// Project (use @/)
import { useAppTheme } from "@/theme/context"
import { useLang } from "@/context/LangContext"
```

### Theme Usage

```typescript
const { themed } = useAppTheme()

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.background,
  padding: theme.spacing.md,
})

<View style={themed($container)} />
```

### Translation

```typescript
<Text tx="common.ok" />
<Text tx="loginScreen.logIn" txOptions={{ name }} />
```

### Storage

```typescript
import { load, save } from "@/utils/storage"

save("key", { data: "value" })
const data = load<MyType>("key")
```

---

## 🎨 Design System

### Colors

```typescript
// Primary
secondary500: "#5C76F6"       // Main action
neutral100: "#FFFFFF"         // Background
neutral800: "#13244C"         // Text

// Button states
buttonDefaultSurface: "#FFFFFF"
buttonSelectedSurface: "#EFF0FF"
buttonFilledSurface: "#688CF4"
```

### Spacing

```typescript
xxxs: 2, xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48
```

### Typography

```typescript
xxl: 34px/40, xl: 28px/34, lg: 22px/28, md: 18px/24, sm: 16px/22
```

---

## 🎬 Animation System

### Button Press

```typescript
const pressOffset = useSharedValue(0)

const handlePressIn = () => {
  pressOffset.value = withTiming(8, { duration: 10 })
}

const handlePressOut = () => {
  pressOffset.value = withSpring(0, { damping: 54, stiffness: 820 })
}
```

### Progress Bar

```typescript
const animatedProgress = useSharedValue(0)

useEffect(() => {
  animatedProgress.value = withTiming(progress, { duration: 260 })
}, [progress])
```

### Idle Animation

```typescript
const scale = useSharedValue(1)

useEffect(() => {
  scale.value = withRepeat(
    withTiming(1.08, { duration: 1600 }),
     -1,
    true
   )
}, [])
```

---

## ✅ Code Requirements

- [ ] 1-line comment for every function/hook
- [ ] Component < 500 lines
- [ ] Use `@/` imports
- [ ] Theme system for styling
- [ ] i18n for user text
- [ ] TypeScript types defined
- [ ] Follow project patterns

---

## 🛠️ Commands

```bash
pnpm start        # Dev server
pnpm android      # Run Android
pnpm ios          # Run iOS
pnpm compile      # Type check
pnpm lint         # Fix lint
pnpm test         # Run tests
```

---

## 📚 Full Guides

For complete details, see:

- **[Frontend Development Guide](./frontend-development-guide.md)** - Code standards, architecture, patterns
- **[Design System](./design-system.md)** - Colors, spacing, typography, animations, components
- **[AI Development Agent](./ai-development-agent.md)** - AI assistance guidelines
- **[Design Agent](./design-agent.md)** - Design-specific AI guidance
- **[Quick Reference](./quick-reference.md)** - Fast lookup card

---

## 🎯 Key Principles

### 1. Code Clarity
- Every function has a 1-line comment
- Descriptive names self-document
- No magic numbers or strings

### 2. Component Size
- Keep under 500 lines
- Break into smaller components
- Single responsibility

### 3. Project Structure
- Follow established folder structure
- Use `@/` imports
- Match existing patterns

### 4. Type Safety
- TypeScript strictly
- Define proper interfaces
- No `any` unless necessary

### 5. Design Excellence
- Use theme system
- Add purposeful animations
- Gamified experience
- Accessibility-first

---

## 🎨 Design Highlights

**Duolingo-inspired:**
- Progress tracking
- Smooth animations
- Delightful interactions
- Clean UI
- Gamification

**Technical:**
- 60fps Reanimated
- Semantic colors
- Spacing scale
- Typography system
- Responsive design

---

## 🚀 Getting Started

1. **Read the guides** - Start with frontend-development-guide.md
2. **Study the patterns** - Look at existing components
3. **Follow the rules** - 1-line comments, theme system, etc.
4. **Test thoroughly** - Check animations, accessibility, performance

---

**Remember:** Professional code is maintainable, readable, and follows consistent patterns. Every decision should serve the user experience and future developers.

**Your Goal:** Create a Duolingo-like experience that feels smooth, gamified, and delightful in every interaction.
