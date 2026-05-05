# 🎨 Singit Solution - Design System & UI/UX Guidelines

**Version:** 1.0.0  
**Last Updated:** May 5, 2026  
**Design Inspiration:** Duolingo - Gamified, Smooth, Engaging  
**Tech Stack:** React Native | Expo | Reanimated | SVG

---

## 🎯 Design Philosophy

Your app follows a **Duolingo-inspired design language** characterized by:

- **Gamified Experience:** Progress tracking, achievements, and interactive elements
- **Smooth Animations:** 60fps animations that provide feedback and delight
- **Playful Microinteractions:** Subtle animations that make the app feel alive
- **Clean & Modern:** Minimalist UI with bold colors and clear hierarchy
- **Accessibility:** High contrast, readable text, and touch-friendly targets

---

## 🎨 Color System

### Primary Color Palette

```typescript
// Neutral Scale - Foundation
neutral100: "#FFFFFF"      // White
neutral200: "#F6FAFF"      // Very Light Blue
neutral300: "#E2ECFA"      // Light Blue
neutral400: "#C7D6EE"      // Medium Light
neutral500: "#8FA1BF"      // Medium
neutral600: "#617393"      // Medium Dark
neutral700: "#33476E"      // Dark
neutral800: "#13244C"      // Very Dark
neutral900: "#091433"      // Black

// Primary Scale - Brand
primary100: "#EAF8FF"      // Lightest
primary200: "#CDEFFF"
primary300: "#9EE2FF"
primary400: "#65CFFF"
primary500: "#34B6F3"      // Bright Blue
primary600: "#1497E6"      // Darker Blue

// Secondary Scale - Accent
secondary100: "#EEF1FF"
secondary200: "#DCE3FF"
secondary300: "#B7C4FF"
secondary400: "#7A92FF"
secondary500: "#5C76F6"    // Primary Action Color

// Accent Scale - Highlights
accent100: "#FFF7D6"       // Light Yellow
accent200: "#FFECA1"
accent300: "#FFDF73"
accent400: "#FFD249"
accent500: "#FFC52C"       // Gold/Yellow

// Feedback Colors
angry100: "#FFE2DE"        // Light Red
angry500: "#D84A3A"        // Error Red
```

### Semantic Colors

```typescript
// Background
background: palette.neutral100

// Text
text: palette.neutral800
textDim: palette.neutral600

// Borders & Separators
border: palette.neutral300
separator: palette.neutral300

// Tints
tint: palette.secondary500
tintInactive: palette.neutral400

// Error States
error: palette.angry500
errorBackground: palette.angry100
```

### Component-Specific Colors

#### Button States

```typescript
// Standard Button
buttonDefaultSurface: "#FFFFFF"
buttonDefaultOutline: "#D8E0E9"
buttonDefaultText: "#211A4C"

buttonSelectedSurface: "#EFF0FF"
buttonSelectedOutline: "#688CF4"
buttonSelectedText: "#688CF4"

buttonDisabledSurface: palette.neutral200
buttonDisabledOutline: palette.neutral400
buttonDisabledText: palette.neutral500

// Action Button (Filled)
buttonFilledSurface: "#688CF4"
buttonFilledOutline: "#4C71D8"
buttonFilledText: "#FFFFFF"
```

#### Progress & Charts

```typescript
stepGradientTop: "#00C1FF"
stepGradientMiddle: "#63D4F8"
stepGradientBottom: palette.neutral100

talkBubbleSurface: palette.neutral100
talkBubbleOutline: "#E6E6E6"
talkBubbleText: "#000E34"
```

---

## 📏 Spacing System

### Spacing Scale

```typescript
xxxs: 2   // Micro spacing
xxs: 4    // Tiny spacing
xs: 8     // Small spacing
sm: 12    // Medium-small
md: 16    // Medium (standard)
lg: 24    // Medium-large
xl: 32    // Large
xxl: 48   // Extra large
xxxl: 64  // XXL
```

### Spacing Guidelines

**Use spacing scale consistently:**
- ✅ `paddingHorizontal: spacing.md` (16px)
- ✅ `marginBottom: spacing.lg` (24px)
- ❌ `paddingHorizontal: 17px` (magic number)

**Component-specific spacing:**
- Button padding: `paddingHorizontal: 16px`, `paddingVertical: 12px`
- Card padding: `paddingHorizontal: spacing.md`, `paddingVertical: spacing.md`
- Screen padding: `paddingHorizontal: spacing.xxl` (32px)

---

## 🔤 Typography

### Font Families

```typescript
// Primary Font: Nunito
nunitoLight: "nunitoLight"
nunitoRegular: "nunitoRegular"
nunitoMedium: "nunitoMedium"
nunitoSemiBold: "nunitoSemiBold"
nunitoBold: "nunitoBold"
nunitoExtraBold: "nunitoExtraBold"

// Secondary Font: Roboto (fallback)
robotoRegular: "robotoRegular"
robotoMedium: "robotoMedium"
robotoBold: "robotoBold"
```

### Type Scale

```typescript
xxl: { fontSize: 34, lineHeight: 40 }  // Headlines
xl: { fontSize: 28, lineHeight: 34 }   // Subheadlines
lg: { fontSize: 22, lineHeight: 28 }   // Cards, Important text
md: { fontSize: 18, lineHeight: 24 }   // Body text (default)
sm: { fontSize: 16, lineHeight: 22 }   // Secondary text
xs: { fontSize: 14, lineHeight: 20 }   // Captions
xxs: { fontSize: 12, lineHeight: 16 }  // Micro text
```

### Typography Usage

```typescript
// Headlines
<Text preset="heading" weight="bold">Major Heading</Text>

// Body
<Text preset="default" weight="medium">Regular body text</Text>

// Subheadings
<Text preset="subheading">Section title</Text>

// Form Labels
<Text preset="formLabel">Label text</Text>

// Form Helpers
<Text preset="formHelper">Helper text</Text>
```

---

## 🎬 Animation System

### Animation Principles

**1. Purpose-Driven Animations**
- Every animation should have a clear purpose (feedback, transition, delight)
- Animations should feel natural and physics-based
- Duration should match the action's importance

**2. Timing Curves**
```typescript
// Quick feedback (300ms)
quick: 300

// Standard transitions (180-260ms)
buttonPress: 180
progressBar: 260
modalOpen: 200
modalClose: 160

// Delight animations (1600-2200ms)
idleBounce: 1600
idleRotate: 2200
```

**3. Easing Functions**
```typescript
// Smooth acceleration/deceleration
Easing.inOut(Easing.sin)    // Sinusoidal
Easing.inOut(Easing.cubic)  // Cubic

// Quick feedback
Easing.out(Easing.sin)      // Out only
Easing.in(Easing.cubic)     // In only
```

### Animation Patterns

#### 1. Button Press Animation

```typescript
const BUTTON_DEPTH = 8
const SHELL_RADIUS = 14
const FACE_RADIUS = 12.5

// 3D press effect with spring physics
const pressOffset = useSharedValue(restingOffset)

const $topFaceAnimatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: pressOffset.value }],
}))

// Handle press with spring physics
const handlePressIn = useCallback((e: any) => {
  if (!isDisabled) {
    pressOffset.value = withTiming(depth, {
      duration: 10,
      easing: Easing.out(Easing.sin),
    })
  }
  onPressIn?.(e)
}, [depth, isDisabled, onPressIn, pressOffset])

const handlePressOut = useCallback((e: any) => {
  pressOffset.value = withSpring(restingOffset, {
    damping: 54,
    stiffness: 820,
  })
  onPressOut?.(e)
}, [onPressOut, pressOffset, restingOffset])
```

#### 2. Progress Bar Animation

```typescript
const clampedProgress = Math.max(0, Math.min(100, progress))
const animatedProgress = useSharedValue(clampedProgress)

useEffect(() => {
  animatedProgress.value = withTiming(clampedProgress, {
    duration: 260,
  })
}, [clampedProgress])

const $fillAnimatedStyle = useAnimatedStyle(() => {
  const width = trackWidth * (animatedProgress.value / 100)
  return { width }
}, [trackWidth])
```

#### 3. Idle Animation (Delight)

```typescript
export function IdleAnimation({ children, style }: IdleAnimationProps) {
  const scale = useSharedValue(1)
  const translateY = useSharedValue(0)
  const rotate = useSharedValue(0)

  useEffect(() => {
    const easing = Easing.inOut(Easing.sin)

    // Gentle bounce
    scale.value = withRepeat(
      withTiming(1.08, { duration: 1600, easing }),
      -1,
      true,
    )

    // Subtle float
    translateY.value = withRepeat(
      withTiming(-3, { duration: 1600, easing }),
      -1,
      true,
    )

    // Slow rotation
    rotate.value = withRepeat(
      withTiming(6, { duration: 2200, easing }),
      -1,
      true,
    )
  }, [])

  const $animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }))

  return <Animated.View style={[style, $animatedStyle]}>{children}</Animated.View>
}
```

#### 4. Fade In/Out Animation

```typescript
export function FadeInFadeOut({
  in: animationIn,
  out: animationOut,
  inDuration = 300,
  inDelay = 0,
  children,
}: FadeInFadeOutProps) {
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: inDuration,
      delay: inDelay,
    })
  }, [in, inDuration, inDelay, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: opacity.value * -8 },
    ],
  }))

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}
```

#### 5. Language Picker Dropdown

```typescript
const progress = useSharedValue(0)

const openDropdown = useCallback(() => {
  progress.value = 0
  setModalVisible(true)
  progress.value = withTiming(1, {
    duration: 200,
    easing: Easing.out(Easing.cubic),
  })
}, [progress])

const $animatedOverlay = useAnimatedStyle(() => ({
  opacity: progress.value,
}))

const $animatedDropdown = useAnimatedStyle(() => ({
  opacity: progress.value,
  transform: [{ translateY: (1 - progress.value) * -12 }],
}))
```

---

## 🎨 Component Design Patterns

### 1. Button Component

**Design Characteristics:**
- 3D press effect with depth
- Rounded corners (14px shell, 12.5px face)
- Smooth spring animations
- Multiple states (default, selected, disabled)

**Implementation:**
```typescript
const BUTTON_DEPTH = 8
const SHELL_RADIUS = 14
const FACE_RADIUS = 12.5

export function Button(props: ButtonProps) {
  const { state = "default", ...rest } = props
  return <InternalButton {...rest} variant="standard" state={state} />
}

export function ActionButton(props: ActionButtonProps) {
  return (
    <InternalButton
      {...rest}
      variant="action"
      state={props.disabled ? "disabled" : "default"}
    />
  )
}
```

**Usage:**
```typescript
<ActionButton
  text="CONTINUE"
  onPress={handleContinue}
  disabled={!canContinue}
  style={$footerButton}
/>
```

### 2. Progress Bar Component

**Design Characteristics:**
- Rounded pill shape
- Smooth fill animation
- Gradient background
- Visual progress feedback

**Implementation:**
```typescript
export function ProgressBar({ progress, duration = 260, style }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress))
  const animatedProgress = useSharedValue(clampedProgress)

  useEffect(() => {
    animatedProgress.value = withTiming(clampedProgress, { duration })
  }, [clampedProgress])

  const $fillAnimatedStyle = useAnimatedStyle(() => ({
    width: trackWidth * (animatedProgress.value / 100),
  }), [trackWidth])

  return (
    <View style={[themed($track), style]} onLayout={handleLayout}>
      <Animated.View style={[themed($fill), $fillAnimatedStyle]} />
    </View>
  )
}
```

**Usage:**
```typescript
<ProgressBar progress={progress} />
```

### 3. Talk Bubble Component

**Design Characteristics:**
- Speech bubble with arrow
- Soft shadows and borders
- Fade-in animation
- Gamified conversation feel

**Implementation:**
```typescript
export function TalkBubble({
  text,
  style,
  arrowPosition = "left",
}: TalkBubbleProps) {
  return (
    <View style={[themed($bubble), style]}>
      <FadeInFadeOut inDelay={120} inDuration={500}>
        <Text text={text} style={themed($text)} />
      </FadeInFadeOut>
      <View style={[themed($arrowBase), getArrowStyle(arrowPosition)]}>
        <BubbleArrow width="100%" height="100%" />
      </View>
    </View>
  )
}
```

**Styling:**
```typescript
const $bubble = (theme: Theme): ViewStyle => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.md,
  backgroundColor: theme.colors.talkBubbleSurface,
  borderWidth: 2.5,
  borderColor: theme.colors.talkBubbleOutline,
  borderRadius: spacing.md,
  shadowColor: "#000000",
  shadowOpacity: 0.08,
  shadowRadius: 22,
  shadowOffset: { width: 0, height: 12 },
  elevation: 10,
})
```

### 4. Chart Component

**Design Characteristics:**
- Visual journey representation
- Animated bubbles along path
- Smooth scaling and transitions
- Interactive elements

**Implementation:**
```typescript
export function Chart({ txTitle, txWhen, txTime, txBubble1, txBubble2, txBubble3 }: ChartProps) {
  const chartWidth = Math.min(Math.max(screenWidth - 64, 0), 340)
  
  return (
    <View style={{ width: chartWidth }}>
      <ChartBG /* SVG path visualization */ />
      <ChartBubble text={txBubble1} arrowPosition="left" />
      <ChartBubble text={txBubble2} arrowPosition="right" />
      <ChartBubble text={txBubble3} arrowPosition="left" />
    </View>
  )
}
```

### 5. Steps Header Component

**Design Characteristics:**
- Transparent background
- Progress indicator
- Animated gift icon (idle animation)
- Language picker
- Back navigation

**Implementation:**
```typescript
export function StepsHeader({ progress, showBackButton = false, onBackPress }: StepsHeaderProps) {
  return (
    <FadeInFadeOut in="top" out="top" style={$headerContainer} inDuration={180} inDelay={300}>
      <Header
        backgroundColor="transparent"
        {...(showBackButton ? { leftIcon: "caretLeft", onLeftPress: onBackPress } : {})}
        RightActionComponent={<LangPicker />}
        titleComponent={
          <View style={themed($content)}>
            <View style={$progressWrapper}>
              <ProgressBar progress={progress} />
            </View>
            <IdleAnimation style={themed($giftContainer)}>
              <GiftSvg width={28} height={28} />
            </IdleAnimation>
          </View>
        }
      />
    </FadeInFadeOut>
  )
}
```

---

## 🎯 UX Principles

### 1. **Progressive Disclosure**
- Show only what's needed at each step
- Reveal content smoothly with animations
- Don't overwhelm users with information

### 2. **Immediate Feedback**
- Button press animations (3D effect)
- Progress bar fills smoothly
- Loading states are clear
- Errors are visible and helpful

### 3. **Delightful Microinteractions**
- Idle animations on icons
- Smooth transitions between states
- Satisfying button press physics
- Visual rewards for completion

### 4. **Accessibility**
- Touch targets: minimum 44x44px
- Color contrast: WCAG AA compliant
- Screen reader support
- Clear visual states

### 5. **Intuitive Navigation**
- Back button always available
- Clear progress indication
- Logical flow between steps
- Smooth transitions

---

## 📐 Layout Guidelines

### Screen Layout

```typescript
const $container: ViewStyle = {
  flex: 1,
}

const $content: ViewStyle = {
  flex: 1,
}

const $footer = (theme: Theme): ViewStyle => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  paddingHorizontal: 24,
  paddingBottom: 40, // Safe area
  paddingTop: 16,
})
```

### Header Layout

```typescript
const $headerContainer: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
}

const $content = (theme: Theme): ViewStyle => ({
  flex: 1,
  width: "100%",
  maxWidth: 620,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: theme.colors.transparent,
  position: "relative",
  paddingLeft: theme.spacing.xxl,
  paddingRight: theme.spacing.xxl,
})
```

### Button Layout

```typescript
const $footerButton: ViewStyle = {
  width: "100%",
  maxHeight: 38,
  maxWidth: 380,
  alignSelf: "center",
}
```

---

## 🎨 Visual Hierarchy

### Priority Levels

**Level 1 - Primary Actions**
- Action buttons (filled, bold)
- Main CTAs
- Progress indicators

**Level 2 - Secondary Actions**
- Standard buttons
- Navigation controls
- Important information

**Level 3 - Tertiary Information**
- Helper text
- Labels
- Decorative elements

### Visual Weight

**Heavy (Bold, Large, Colorful)**
- Headlines
- Primary buttons
- Progress bars

**Medium (SemiBold, Medium)**
- Body text
- Secondary buttons
- Cards

**Light (Regular, Small, Muted)**
- Helper text
- Captions
- Disabled states

---

## 🎯 Component Specifications

### Button Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Height | 56px | Standard |
| Max Width | 380px | Prevent overly wide |
| Border Radius | 14px (shell), 12.5px (face) | Rounded |
| Depth | 8px | 3D effect |
| Padding | 16px horizontal, 12px vertical | Comfortable |
| Animation | Spring (stiffness: 820, damping: 54) | Natural |

### Card/Bubble Specifications

| Property | Value | Notes |
|----------|-------|-------|
| Border Radius | 16px (md) | Soft corners |
| Border Width | 2.5px | Visible |
| Border Color | #E6E6E6 | Subtle |
| Shadow | 22px radius, 0.08 opacity | Soft |
| Elevation | 10 | Android |

### Typography Specifications

| Level | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| XXL | 34px | 40px | Bold | Headlines |
| XL | 28px | 34px | SemiBold | Subheadlines |
| LG | 22px | 28px | Medium | Cards |
| MD | 18px | 24px | Medium | Body |
| SM | 16px | 22px | Regular | Secondary |
| XS | 14px | 20px | Regular | Captions |
| XXS | 12px | 16px | Regular | Micro |

---

## 🎬 Animation Timing Guide

### Quick Reference

```typescript
// Instant (< 10ms)
buttonPressStart: 10ms

// Quick (10-100ms)
buttonRelease: 10ms
springRelease: 10-20ms

// Standard (100-300ms)
buttonPress: 180ms
progressBar: 260ms
modalOpen: 200ms
modalClose: 160ms
fadeAnimation: 300ms

// Delight (1000ms+)
idleBounce: 1600ms
idleRotate: 2200ms
```

### Easing Guide

```typescript
// Smooth acceleration/deceleration
Easing.inOut(Easing.sin)      // Best for: Idle animations
Easing.inOut(Easing.cubic)    // Best for: Modal transitions

// Quick feedback
Easing.out(Easing.sin)        // Best for: Press in
Easing.in(Easing.cubic)       // Best for: Press out

// Spring physics
withSpring({ damping: 54, stiffness: 820 })  // Best for: Button release
```

---

## 🎨 Design Patterns

### 1. **Gamification Pattern**

```typescript
// Progress tracking
<ProgressBar progress={progress} />

// Achievement animation
<IdleAnimation>
  <GiftSvg />
</IdleAnimation>

// Visual journey
<Chart txTitle="..." txBubble1="..." />
```

### 2. **Conversation Pattern**

```typescript
// Talk bubbles
<TalkBubble text="Hello!" arrowPosition="left" />
<TalkBubble text="Hi there!" arrowPosition="right" />
```

### 3. **Selection Pattern**

```typescript
// Button states
<Button state="default" />
<Button state="selected" />
<Button state="disabled" />
```

### 4. **Navigation Pattern**

```typescript
// Steps navigation
<StepsNavigation
  navigationRef={navigationRef}
  initialStepId={activeStepId}
  onIndexChange={handleIndexChange}
/>
```

---

## 📱 Responsive Design

### Screen-Scale Charts

```typescript
const chartWidth = Math.min(
  Math.max(screenWidth - 64, 0),
  340
)

const chartScale = chartWidth / CHART_VIEWBOX_WIDTH

const overlayTransform: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: CHART_VIEWBOX_WIDTH,
  height: CHART_VIEWBOX_HEIGHT,
  transform: [
    { translateX: -(CHART_VIEWBOX_WIDTH * (1 - chartScale)) / 2 },
    { translateY: -(CHART_VIEWBOX_HEIGHT * (1 - chartScale)) / 2 },
    { scale: chartScale },
  ],
}
```

---

## 🎯 Best Practices

### ✅ DO

- Use semantic color names (`theme.colors.background`)
- Use spacing scale (`theme.spacing.md`)
- Add meaningful animations
- Provide immediate feedback
- Keep animations under 300ms for interactions
- Use idle animations for delight
- Maintain consistent spacing
- Follow visual hierarchy

### ❌ DON'T

- Hardcode colors or spacing
- Use animations without purpose
- Make animations too slow (>500ms)
- Overuse animations (can be distracting)
- Ignore accessibility
- Use inconsistent spacing
- Create jarring transitions

---

## 🎨 Color Usage Examples

### Button States

```typescript
// Default state
<buttonDefaultSurface> + <buttonDefaultOutline> + <buttonDefaultText>

// Selected state
<buttonSelectedSurface> + <buttonSelectedOutline> + <buttonSelectedText>

// Disabled state
<buttonDisabledSurface> + <buttonDisabledOutline> + <buttonDisabledText>
```

### Progress Indicator

```typescript
// Track
backgroundColor: theme.colors.palette.secondary200

// Fill
backgroundColor: theme.colors.palette.secondary500
```

### Talk Bubble

```typescript
// Surface
backgroundColor: theme.colors.talkBubbleSurface
borderColor: theme.colors.talkBubbleOutline
color: theme.colors.talkBubbleText
```

---

## 🎬 Animation Implementation Checklist

When adding animations:

- [ ] Define clear purpose
- [ ] Choose appropriate duration
- [ ] Select proper easing function
- [ ] Use Reanimated for 60fps
- [ ] Test on low-end devices
- [ ] Add fallback for reduced motion
- [ ] Ensure accessibility
- [ ] Document the animation

---

## 📚 Resources

- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Expo Design Guidelines](https://docs.expo.dev/)
- [Duolingo Design Analysis](https://www.duolingo.com/)
- [Material Design Motion](https://material.io/design/motion/)

---

**Remember:** Great design is invisible. Users should feel the app is smooth, responsive, and delightful without consciously noticing the details. Every animation, color, and spacing decision should serve the user experience.
