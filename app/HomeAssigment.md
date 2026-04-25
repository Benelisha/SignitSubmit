Dynamic Onboarding Module — Architecture Design
Author: Doron Ben Elisha | April 2026


PART A — FRONTEND ARCHITECTURE


1. Mobile-First Responsive Experience

- Single-column layout, content capped at max-width (420–650px) and centered on larger screens.
- Breakpoints via useWindowDimensions (e.g. 720px threshold) adjust component layout and asset sizing.
- Safe-area insets prevent content from hiding behind notches or home bars on any device.
- Sticky footer holds the CTA button; absolutely-positioned header holds the progress bar —
  both overlay the scrollable content area without shrinking it.
- RTL languages (Arabic, Hebrew) flip layout direction automatically via direction-aware style utilities.


2. Codebase Structure — Four Layers

  Service     services/onboarding/onboardingService.ts
              All network logic lives here. Nothing else in the app calls fetch.

  State       context/StepContext.tsx + LangContext.tsx
              Owns the raw config JSON, active step ID, user answers, and active language.

  Navigation  navigators/StepsNavigation.tsx
              Maps componentType strings from the JSON to concrete React screen components.

  UI          components/Steps/Screens/*.tsx
              Pure rendering. Each screen reads its step data from context via stepId in route params.


3. Separation of Concerns

- UI components render only — no navigation, no routing decisions.
- StepsScreen (orchestrator) evaluates nextSteps conditions on CTA press and dispatches navigation.
- StepContext owns the raw JSON, activeStepId, user answer mutations, and loading state.
- onboardingService owns all network calls — the rest of the app never calls fetch directly.
- LangContext owns the active language; switching it re-renders all content instantly since
  every component reads content[lang] from the step data at render time.


4. Dynamic Routing and Conditional Navigation

- Each step has a nextSteps array. Each entry has conditions (optionId matches) and a nextStepId.
- On Continue press, StepsScreen finds the matching nextStepId and dispatches a push (question steps)
  or stack reset (transition steps — no back history) to the inner navigator.
- UI components never call navigate() themselves.

  Pseudo-code:
      step = findStepById(activeStepId)
      nextEntry = step.nextSteps.find(e => e.conditions.includes(step.__selectedOption))
      navigationRef.dispatch( push(nextStep.componentType, { stepId: nextStep._id }) )


5. Step Type to Component Mapping and Unsupported Steps

- A STEP_REGISTRY maps each componentType string to a React screen component:
      "list" -> ListStep,  "grid" -> GridStep,  "input" -> InputStep,
      "englishJourney" -> JourneyStep,  "artistsGrid" -> ArtistsGridStep,
      "wordsCollection" -> WordsCollectionStep,  "planLoader" -> PlanLoaderStep,
      "travel", "work", "education", "fun", etc. -> generic TransitionStep

- Unknown componentTypes: skipped automatically — engine advances via nextSteps to the next
  known type. If somehow reached, a FallbackStep renders a neutral screen so the user is never
  blocked. Unknown types are logged to analytics/crash reporting without throwing.


6. Progress, Back Navigation, and Answer Changes

- Progress = (currentStep.trackingOrder / maxTrackingOrder) * 100, updated on every navigation event.
  trackingOrder is used instead of stepIndex because it reflects intended display order correctly.
- Back button calls navigationRef.goBack(); onStateChange syncs activeStepId to the visible screen.
- Changing an answer updates __selectedOption in context. Continue re-evaluates conditions
  and pushes the correct new path forward.
- selectionLimit = 1: stores single ID, replaces on re-tap.
  selectionLimit = -1: stores an array of selected IDs.


7. Template Variables

- Variables like {{name}} in content strings are resolved at render time via a pure utility:
      resolveContent(text, templateVars) replaces {{key}} with the value in the templateVars map.
- When a step with a templateVariable field is completed, its answer is saved into templateVars
  in context. Going back and changing an answer updates the map immediately across all screens.
  The raw JSON config is never mutated.


================================================================


PART B — FRONTEND TO BACKEND COMMUNICATION


1. What the Frontend Sends (on final step completion)

  Single POST to /onboarding/submit with:
      userId, leadInfoId, flowId (onboardingFlow._id), flowVersion (__v),
      experimentGroup (experimentMetadata.groupName), lang,
      answers: [ { questionTopic, value } ]  — one entry per completed question step.

  flowId + flowVersion allow the backend to match answers to the exact config version served,
  supporting A/B test analysis via experimentMetadata.


2. What the Frontend Expects Back

  - Immediate HTTP 202 with a jobId.
  - Frontend polls GET /personalization/status/{jobId} every ~2 seconds.
  - Poll response: { jobId, status: "pending|in_progress|completed|failed", progress: 0-100, message }


3. Processing States and Display

  idle        User still in onboarding flow.
  submitting  POST in flight — CTA disabled with loading indicator.
  polling     planLoader screen shown with animation; progress value drives the animation.
  completed   Auto-navigate to planReady screen.
  failed      Error + Retry button shown. Answers preserved — no re-onboarding needed.

  Pseudo-code:
      set state "submitting"
      { jobId } = POST /onboarding/submit
      set state "polling"
      loop every 2s:
          { status, progress } = GET /personalization/status/{jobId}
          if completed  →  navigate to planReady, stop
          if failed or retries >= 3  →  show error + retry, stop
