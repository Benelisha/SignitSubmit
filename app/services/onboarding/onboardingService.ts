import type {
  OnboardingOption,
  OnboardingNextStep,
  OnboardingStepData,
  OnboardingStepType,
  OnboardingType,
} from "./types"

// ---------------------------------------------------------------------------
// Private DTO types — only used for parsing the raw API response
// ---------------------------------------------------------------------------

interface DtoOption {
  _id: string
  stepId: string
  value: string
  imgUrl?: string
  translations: Record<string, string>
  optionIndex: number
  isActive: boolean
}

interface DtoNextStep {
  _id: string
  conditions: { stepId: string; optionId: string; _id: string }[]
  nextStepId: string
}

interface DtoStep {
  _id: string
  trackingOrder: number
  stepType: string
  componentType: string
  skippable: boolean
  assets: Record<string, string | undefined>
  content: Record<string, Record<string, string>>
  selectionLimit: number
  options: DtoOption[]
  nextSteps: DtoNextStep[]
  ctaText: Record<string, string>
}

interface DtoResponse {
  onboardingFlow: {
    defaults: {
      ctaText: Record<string, string>
      skipText: Record<string, string>
    }
    steps: DtoStep[]
  }
}

// ---------------------------------------------------------------------------
// Local fixture — used until the real API endpoint is wired up
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-var-requires
const LOCAL_FIXTURE: DtoResponse = require("../../../assets/OnboardingResponseTruncated.json")

const ALLOWED_STEP_TYPES = new Set<OnboardingStepType>(["question", "transition"])

function isStepType(value: string): value is OnboardingStepType {
  return ALLOWED_STEP_TYPES.has(value as OnboardingStepType)
}

function parseOptions(options: DtoOption[]): OnboardingOption[] {
  return options
    .filter((o) => o.isActive)
    .sort((a, b) => a.optionIndex - b.optionIndex)
    .map((o) => ({
      id: o._id,
      stepId: o.stepId,
      value: o.value,
      imgUrl: o.imgUrl,
      translations: o.translations,
      optionIndex: o.optionIndex,
    }))
}

function parseNextSteps(nextSteps: DtoNextStep[]): OnboardingNextStep[] {
  return nextSteps.map((ns) => ({
    id: ns._id,
    nextStepId: ns.nextStepId,
    conditions: ns.conditions.map((c) => ({ stepId: c.stepId, optionId: c.optionId })),
  }))
}

function parseStep(step: DtoStep): OnboardingStepData | null {
  if (!isStepType(step.stepType)) return null

  const assets: Record<string, string> = {}
  for (const [key, val] of Object.entries(step.assets)) {
    if (val !== undefined) assets[key] = val
  }

  return {
    id: step._id,
    stepType: step.stepType,
    componentType: step.componentType,
    selectionLimit: step.selectionLimit,
    skippable: step.skippable,
    assets,
    content: step.content,
    options: parseOptions(step.options),
    nextSteps: parseNextSteps(step.nextSteps),
    ctaText: step.ctaText,
  }
}

export function parseOnboardingData(dto: DtoResponse): OnboardingType {
  const steps = dto.onboardingFlow.steps
    .slice()
    .sort((a, b) => a.trackingOrder - b.trackingOrder)
    .map(parseStep)
    .filter((step): step is OnboardingStepData => step !== null)

  return {
    defaults: {
      ctaText: dto.onboardingFlow.defaults.ctaText,
      skipText: dto.onboardingFlow.defaults.skipText,
    },
    steps,
  }
}

/**
 * Returns a parsed onboarding payload trimmed to the app's needs.
 * TODO: replace LOCAL_FIXTURE with a real API call once the endpoint is available.
 */
export async function fetchOnboardingData(): Promise<OnboardingType> {
  return Promise.resolve(parseOnboardingData(LOCAL_FIXTURE))
}
