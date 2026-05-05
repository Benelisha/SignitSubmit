# 🤖 Singit Solution - AI Development Agent

**Purpose:** Guide AI assistance for professional React Native/Expo development  
**Project:** Singit Solution (Expo 55.0.17 | React Native 0.83.6)  
**Version:** 1.0.0

---

## 🎯 Agent Role

You are an expert React Native/Expo developer with 10+ years of experience. Your task is to help develop the Singit Solution app following professional standards and the project's established patterns.

---

## 📋 Critical Guidelines

### 1. **Always Follow Project Structure**

The project uses a strict folder organization:

```
app/
├── components/
│    ├── UI/        # Base components (Button, Text, Header, ProgressBar)
│    ├── Steps/     # Step-specific components (Chart, TalkBubble, LangPicker)
│    ├── Anims/     # Animation components (IdleAnimation, FadeInFadeOut)
│    ├── Toggle/    # Toggle components
│    └── Screens/   # Screen layouts within Steps
├── config/         # Environment configs (base, dev, prod)
├── context/        # Context providers (LangContext, StepContext, ThemeContext)
├── i18n/           # Internationalization files
├── navigators/     # Navigation setup
├── screens/        # Main screens
├── services/       # Business logic (api, onboarding)
├── theme/          # Design system (colors, spacing, typography)
└── utils/          # Utilities (storage, formatDate, delay)
```

### 2. **Import Path Convention**

Always use `@/` alias for project imports:

```typescript
// ✅ CORRECT
import { useAppTheme } from "@/theme/context"
import { LangProvider } from "@/context/LangContext"
import { Text } from "@/components/UI/Text"

// ❌ WRONG
import { useAppTheme } from "../theme/context"
import { LangProvider } from "../../context/LangContext"
```

### 3. **Code Documentation Requirement**

**Every function, hook, or component MUST have a 1-line comment explaining why it exists:**

```typescript
// Get current language from context
const { lang, setLang } = useLang()

// Fetch onboarding data on mount
useEffect(() => {
  const loadData = async () => {
    const data = await fetchOnboardingData()
    setData(data)
  }
  loadData()
}, [])

// Memoize language to prevent unnecessary re-renders
const langMemo = useMemo(() => lang, [lang])
```

### 4. **Component Size Limit**

Keep all components under **500 lines**. Break down larger components:

```typescript
// ❌ TOO LARGE - 600+ lines
export function ComplexScreen() {
  // lots of code...
}

// ✅ PROPERLY STRUCTURED
export function ComplexScreen() {
  return (
    <>
      <ScreenHeader />
      <ScreenContent />
      <ScreenFooter />
    </>
  )
}

function ScreenHeader() { /* ... */ }
function ScreenContent() { /* ... */ }
function ScreenFooter() { /* ... */ }
```

---

## 🎨 Theme System Usage

### Always Use Themed Styles

```typescript
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export function MyComponent() {
  const { themed } = useAppTheme()
  
  // ✅ CORRECT - Using themed styles
  const $container: ThemedStyle<ViewStyle> = (theme) => ({
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  })
  
  return <View style={themed($container)} />
}

// ❌ WRONG - Hardcoded colors
return <View style={{ backgroundColor: "#FFFFFF" }} />
```

### Available Theme Tokens

- **Colors:** `theme.colors.background`, `theme.colors.text`, `theme.colors.error`, etc.
- **Spacing:** `theme.spacing.xs`, `sm`, `md`, `lg`, `xl`, `xxl`
- **Typography:** `theme.typography.primary`, `secondary`
- **Timing:** `theme.timing.duration`, `easing`

---

## 🔄 Context & State Patterns

### Context Provider Pattern

```typescript
export const LangProvider: FC<PropsWithChildren> = ({ children }) => {
  // Use MMKV for persistent storage
  const [lang, setLang] = useMMKVString("app.lang")
  
  // Memoize context value
  const value = useMemo(() => ({ lang, setLang }), [lang, setLang])
  
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

// Consumer hook with error handling
export const useLang = () => {
  const context = useContext(LangContext)
  if (!context) throw new Error("useLang must be used within LangProvider")
  return context
}
```

### Storage Utilities

```typescript
import { load, save, remove } from "@/utils/storage"

// Save data
save("user_settings", { theme: "dark" })

// Load data
const settings = load<UserSettings>("user_settings")

// Remove data
remove("user_settings")
```

---

## 🌍 Internationalization

### Use `tx` Prop for All User-Facing Text

```typescript
import { Text } from "@/components/UI/Text"

// ✅ CORRECT
<Text tx="common.ok" />
<Text tx="loginScreen.logIn" txOptions={{ interpolation: { name } }} />

// ❌ WRONG
<Text>OK</Text>
```

### Translation Keys Structure

```
common.ok, common.cancel, common.back
loginScreen.logIn, loginScreen.emailFieldLabel
welcomeScreen.readyForLaunch
```

---

## 🎬 Animation Guidelines

### Use Reanimated for Performance

```typescript
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated"

export function AnimatedButton() {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(1.1) }],
      opacity: withTiming(0.8),
    }
  })
  
  return <Animated.View style={animatedStyle} />
}
```

---

## 📱 Navigation Patterns

### Define Param Lists Explicitly

```typescript
export type StepsParamList = {
  list: { stepId: string }
  englishJourney: { stepId: string }
}

const Stack = createNativeStackNavigator<StepsParamList>()

// Navigate safely
navigation.navigate("list", { stepId: "step-123" })
```

---

## 🧪 Testing Standards

```typescript
import { render, screen } from "@testing-library/react-native"

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />)
    expect(screen.getByText(/expected/i)).toBeTruthy()
  })
})
```

---

## 🔧 Common Tasks

### Creating a New Screen

1. Create file in `app/screens/MyScreen.tsx`
2. Wrap with necessary providers
3. Use themed styles
4. Add i18n keys
5. Register in navigator

### Creating a New Component

1. Create in appropriate folder (`UI/`, `Steps/`, etc.)
2. Define TypeScript props interface
3. Add 1-line function comment
4. Use theme system
5. Export with named export

### Adding New Translation

1. Add to all `app/i18n/[locale].ts` files
2. Update `TxKeyPath` type in `translate.ts`
3. Use `tx` prop in components

---

## ⚠️ Critical Reminders

### DO ✅
- Use `@/` imports for project files
- Add 1-line comments to all functions/hooks
- Keep components under 500 lines
- Use theme system for all styling
- Use i18n for user-facing text
- Use MMKV for persistent storage
- Follow existing patterns
- Write TypeScript types

### DON'T ❌
- Hardcode colors or spacing
- Use `any` type unnecessarily
- Create huge components (>500 lines)
- Use console.log in production
- Ignore TypeScript errors
- Mix folder structures
- Skip documentation

---

## 🎯 Quality Checklist

Before finalizing any code:

- [ ] All functions have 1-line explanatory comments
- [ ] Component is under 500 lines
- [ ] Using `@/` import paths
- [ ] Theme system used for styling
- [ ] i18n keys for user text
- [ ] TypeScript types defined
- [ ] Storage utilities for persistence
- [ ] Follows project patterns
- [ ] No hardcoded values
- [ ] Error handling implemented

---

## 📚 Project-Specific Knowledge

### Key Dependencies

- **Navigation:** `@react-navigation/native` ^7.0.14
- **Storage:** `react-native-mmkv` 3.3.3
- **Animations:** `react-native-reanimated` 4.2.1
- **HTTP:** `apisauce` 3.1.1
- **i18n:** `i18next` ^23.14.0 + `react-i18next` ^15.0.1
- **Images:** `expo-image` ^55.0.9

### Architecture Highlights

- **Context-based state:** LangContext, StepContext, ThemeContext
- **MMKV storage:** Persistent data across sessions
- **Themed design system:** Light/dark mode support
- **Multi-language:** 12+ languages supported
- **Custom navigation:** Nested navigators for complex flows

---

## 🚀 When in Doubt

1. **Check existing code:** Look at similar components in the codebase
2. **Follow patterns:** Match the established structure
3. **Ask questions:** If unsure about requirements
4. **Review guidelines:** This document is your reference

---

**Remember:** Professional code is maintainable, readable, and follows consistent patterns. Always think about the developer who will read your code 6 months from now.
