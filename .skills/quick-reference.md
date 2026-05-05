# ⚡ Singit Solution - Quick Reference Card

**Fast lookup for common patterns and tasks**

---

## 📁 File Locations

| What | Where |
|------|-------|
| New Screen | `app/screens/[Name]Screen.tsx` |
| UI Component | `app/components/UI/[Name].tsx` |
| Step Component | `app/components/Steps/[Name].tsx` |
| Animation | `app/components/Anims/[Name].tsx` |
| Context | `app/context/[Name]Context.tsx` |
| Service | `app/services/[category]/[name].ts` |
| Theme | `app/theme/[type].ts` |
| Utils | `app/utils/[name].ts` |
| Navigation | `app/navigators/[Name]Navigation.tsx` |
| i18n | `app/i18n/[locale].ts` |

---

## 🔤 Import Pattern

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

---

## 🎨 Theme Usage

```typescript
const { themed } = useAppTheme()

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  backgroundColor: theme.colors.background,
  padding: theme.spacing.md,
})

<View style={themed($container)} />
```

---

## 🌍 Translation

```typescript
<Text tx="common.ok" />
<Text tx="loginScreen.logIn" txOptions={{ name }} />
```

Add to: `app/i18n/en.ts`, `app/i18n/ar.ts`, etc.

---

## 💾 Storage

```typescript
import { load, save } from "@/utils/storage"

save("key", { data: "value" })
const data = load<MyType>("key")
```

---

## 🔄 Context

```typescript
// Consumer
const { lang, setLang } = useLang()

// Provider
const value = useMemo(() => ({ lang, setLang }), [lang, setLang])
```

---

## 🎬 Animation

```typescript
const animatedStyle = useAnimatedStyle(() => ({
  opacity: withTiming(0.5),
  transform: [{ scale: withSpring(1.2) }],
}))
```

---

## 📱 Navigation

```typescript
navigation.navigate("screenName", { param: "value" })
navigation.goBack()
```

---

## ✅ Code Requirements

- [ ] 1-line comment for every function/hook
- [ ] Component < 500 lines
- [ ] Use `@/` imports
- [ ] Theme system for styling
- [ ] i18n for user text
- [ ] TypeScript types defined

---

## 🛠️ Commands

```bash
pnpm start       # Dev server
pnpm android     # Run Android
pnpm ios         # Run iOS
pnpm compile     # Type check
pnpm lint        # Fix lint
pnpm test        # Run tests
```

---

## 🎯 Component Template

```typescript
export interface ComponentProps {
  /** Description */
  prop: string
}

/** Brief description */
export function Component(props: ComponentProps) {
  const { prop } = props
  
  return <View>{/* JSX */}</View>
}
```

---

**Keep this handy for quick lookups!**
