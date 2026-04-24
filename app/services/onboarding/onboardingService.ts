import type {
  OnboardingResponse,
  OnboardingStep,
  OnboardingOption,
  OnboardingStepData,
  OnboardingStepType,
  OnboardingType,
} from "./types"

// ---------------------------------------------------------------------------
// Local fixture — used until the real API endpoint is wired up
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LOCAL_FIXTURE: OnboardingResponse = require("../../../assets/OnboardingResponseTruncated.json")

const ALLOWED_STEP_TYPES = new Set<OnboardingStepType>(["question", "transition"])

function isStepType(stepType: string): stepType is OnboardingStepType {
  return ALLOWED_STEP_TYPES.has(stepType as OnboardingStepType)
}

function parseStepOption(step: OnboardingStep): OnboardingOption[] {
  return step.options
    .filter((option) => option.isActive)
    .sort((a, b) => a.optionIndex - b.optionIndex)
    .map((option) => ({
      stepId: option.stepId,
      value: option.value,
      imgUrl: option.imgUrl,
      translations: option.translations,
      optionIndex: option.optionIndex,
    }))
}

function parseStep(step: OnboardingStep): OnboardingStepData | null {
  if (!isStepType(step.stepType)) return null

  return {
    id: step._id,
    stepType: step.stepType,
    selectionLimit: step.selectionLimit,
    content: step.content,
    options: parseStepOption(step),
  }
}

export function parseOnboardingData(dto: OnboardingResponse): OnboardingType {
  const steps = dto.onboardingFlow.steps
    .slice()
    .sort((a, b) => a.trackingOrder - b.trackingOrder)
    .map(parseStep)
    .filter((step): step is OnboardingStepData => step !== null)

  return {
    defaults: {
      ctaText: dto.onboardingFlow.defaults.ctaText,
    },
    steps,
  }
}

/**
 * Returns a parsed onboarding payload trimmed to the app needs.
 */
export async function fetchOnboardingData(): Promise<OnboardingType> {
  // TODO: replace LOCAL_FIXTURE with API response once endpoint is available.
  return Promise.resolve(parseOnboardingData(LOCAL_FIXTURE))
}
