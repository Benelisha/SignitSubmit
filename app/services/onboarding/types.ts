// ---------------------------------------------------------------------------
// Onboarding app-model types — parsed from the API response
// ---------------------------------------------------------------------------

/** lang-code → string, e.g. { en: "Continue", es: "Continuar" } */
export type TranslatedText = Record<string, string>

/** lang-code → key/value map, e.g. { en: { text1: "...", text2: "..." } } */
export type StepContent = Record<string, TranslatedText>

export type OnboardingStepType = "question" | "transition"

export interface OnboardingOption {
  id: string
  stepId: string
  value: string
  imgUrl?: string
  translations: TranslatedText
  optionIndex: number
}

export interface OnboardingNextStepCondition {
  stepId: string
  optionId: string
}

export interface OnboardingNextStep {
  id: string
  conditions: OnboardingNextStepCondition[]
  nextStepId: string
}

export interface OnboardingStepData {
  id: string
  stepType: OnboardingStepType
  componentType: string
  selectionLimit: number
  skippable: boolean
  assets: Record<string, string>
  content: StepContent
  options: OnboardingOption[]
  nextSteps: OnboardingNextStep[]
  ctaText: TranslatedText
}

export interface OnboardingDefaults {
  ctaText: TranslatedText
  skipText: TranslatedText
}

export interface OnboardingType {
  defaults: OnboardingDefaults
  steps: OnboardingStepData[]
}

// ---------------------------------------------------------------------------
// Response tracking — answers the user has given per step
// ---------------------------------------------------------------------------

export interface StepResponse {
  stepId: string
  selectedOptionIds: string[]
}

export interface OnboardingResponseType {
  responses: StepResponse[]
}

