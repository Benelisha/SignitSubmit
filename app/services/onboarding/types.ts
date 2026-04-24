// ---------------------------------------------------------------------------
// Onboarding domain types — mirroring the API response shape
// ---------------------------------------------------------------------------

export type TranslatedText = Record<string, string>

export interface StepOption {
  _id: string
  stepId: string
  value: string
  imgUrl?: string
  dependencyOptionsId: string[]
  translations: TranslatedText
  optionIndex: number
  isActive: boolean
  created: string
  lastModified: string
  __v: number
}

export interface NextStepCondition {
  stepId: string
  optionId: string
  _id: string
}

export interface NextStep {
  conditions: NextStepCondition[]
  nextStepId: string
  _id: string
}

export interface StepAssets {
  image1?: string
  [key: string]: string | undefined
}

/** Keyed by lang code (en/es/pt/…), each value is a map of text1/text2/… */
export type StepContent = Record<string, TranslatedText>

export interface OnboardingStep {
  _id: string
  stepIndex: number
  trackingOrder: number
  stepType: string
  componentType: string
  optionsSourceType: string
  questionTopic?: string
  skippable: boolean
  assets: StepAssets
  content: StepContent
  selectionLimit: number
  options: StepOption[]
  nextSteps: NextStep[]
  ctaText: TranslatedText
  created: string
  lastModified: string
  __v: number
}

export interface OnboardingFlow {
  _id: string
  defaults: {
    ctaText: TranslatedText
    skipText: TranslatedText
  }
  levelConfig: {
    wordsThreshold: Record<string, number>
    levelThreshold: number
  }
  steps: OnboardingStep[]
  created: string
  lastModified: string
  __v: number
}

export interface UserDetails {
  userId: string
  leadInfoId: string
  systemLanguage: string
}

export interface OnboardingResponse {
  message: string
  status: string
  userDetails: UserDetails
  onboardingFlow: OnboardingFlow
  experimentMetadata?: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// App model (trimmed from raw DTO)
// ---------------------------------------------------------------------------

export type OnboardingStepType = "question" | "transition"

export interface OnboardingOption {
  stepId: string
  value: string
  imgUrl?: string
  translations: TranslatedText
  optionIndex: number
}

export interface OnboardingStepData {
  id: string
  stepType: OnboardingStepType
  selectionLimit: number
  content: StepContent
  options: OnboardingOption[]
}

export interface OnboardingDefaults {
  ctaText: TranslatedText
}

export interface OnboardingType {
  defaults: OnboardingDefaults
  steps: OnboardingStepData[]
}

