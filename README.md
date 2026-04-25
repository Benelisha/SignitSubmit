# Singit — Home Assignment Solution

**Author:** Doron Ben Elisha | April 2026

This is my solution for the Singit frontend interview assignment. The task was to recreate two screens from the Singit onboarding flow UI, based on the provided design and JSON config.

Built with **Expo** (managed workflow) and **React Native**, using the [Ignite](https://github.com/infinitered/ignite) boilerplate as a starting point.

---

## The Task

Recreate the UI for two onboarding screens driven by a dynamic JSON config:

1. A **list-type** question step — single or multi-select options list.
2. A **grid-type** question step — grid of selectable option cards.

The screens consume a JSON response (see `assets/OnboardingResponseFull.json`) and render dynamically based on `componentType`, `content`, and `options` fields.

---

## Tech Stack

- **Expo** (SDK 52, managed workflow)
- **React Native**
- **TypeScript**
- **React Navigation** (native stack)
- **React Context** — step state and language management
- **pnpm** — package manager

---

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm installed (`npm install -g pnpm`)
- For iOS: Xcode installed and a simulator configured

### Install dependencies

```bash
pnpm install
```

### Run on iOS simulator

```bash
pnpm ios
```

### Run on Android emulator

```bash
pnpm android
```

### Run in Expo Go (development build)

```bash
pnpm start
```

Then scan the QR code with the Expo Go app on your device.

---

## Project Structure

```
app/
├── components/
│   └── Steps/          # Step screen components (ListStep, GridStep, etc.)
├── context/
│   ├── StepContext.tsx  # Onboarding state — config, active step, answers
│   └── LangContext.tsx  # Active language
├── navigators/
│   └── StepsNavigation.tsx  # componentType → screen mapping
├── screens/
│   └── StepsScreen.tsx  # Orchestrator — handles CTA logic & navigation
├── services/
│   └── onboarding/     # Network / data fetching layer
assets/
├── OnboardingResponseFull.json      # Full mock API response
└── OnboardingResponseTruncated.json # Truncated version for dev
```

---

## Architecture Notes

See [app/HomeAssigment.md](app/HomeAssigment.md) for the full architecture write-up covering:

- Mobile-first responsive layout strategy
- Dynamic routing and conditional navigation (based on `nextSteps` conditions)
- Step type → component registry pattern
- Template variable resolution (`{{name}}` placeholders)
- Frontend → backend communication design (submit + polling)

---

## Building for Device

```bash
pnpm run build:ios:sim    # iOS simulator build
pnpm run build:ios:device # iOS device build (requires EAS account)
```
