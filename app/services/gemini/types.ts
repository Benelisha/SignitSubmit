import { ApiResponse } from "apisauce"

export interface GeminiConfig {
  url: string
  apiKey: string
  model: string
  timeout: number
}

export interface GeminiGenerateContentResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
}

export type GeminiSvgGeneratorKind = "character" | "background" | "object"

export interface SceneAssetPlacement {
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  zIndex: number
}

export interface GeminiSceneAssetDefinition {
  assetId: string
  role: string
  description: string
  viewBox: string
  svgMarkup: string
}

export type GeminiSceneAssetMode = "reuse" | "generate" | "variant"
export type GeminiSceneAssetStage = "background" | "characters" | "objects" | "details"

export interface GeminiSceneAssetPlan {
  assetId: string
  role: string
  description: string
  stage: GeminiSceneAssetStage
  mode: GeminiSceneAssetMode
  referenceAssetId?: string
  prompt?: string
}

export interface GeminiSceneItem {
  assetId: string
  placement: SceneAssetPlacement
}

export interface GeminiSceneHistorySummary {
  sceneId: string
  prompt: string
  summary: string
  reusedAssetIds: string[]
}

export interface GeminiGeneratedScene {
  sceneId: string
  prompt: string
  summary: string
  backgroundColor?: string
  stageViewBox: string
  currentStage?: GeminiSceneAssetStage
  assetPlans: GeminiSceneAssetPlan[]
  assets: GeminiSceneAssetDefinition[]
  items: GeminiSceneItem[]
  reusedAssetIds: string[]
  pendingAssetIds: string[]
  failedAssetIds: string[]
}

export interface GeminiScenePlan {
  sceneId: string
  prompt: string
  summary: string
  backgroundColor?: string
  stageViewBox: string
  currentStage?: GeminiSceneAssetStage
  assetPlans: GeminiSceneAssetPlan[]
  items: GeminiSceneItem[]
  reusedAssetIds: string[]
}

export interface GeminiSceneRequestContext {
  prompt: string
  availableAssets: GeminiSceneAssetDefinition[]
  sceneHistory: GeminiSceneHistorySummary[]
}

export interface GeminiSceneGenerationHooks {
  onScenePlanned?: (scene: GeminiGeneratedScene) => void
  onStageStarted?: (stage: GeminiSceneAssetStage, scene: GeminiGeneratedScene) => void
  onAssetGenerated?: (asset: GeminiSceneAssetDefinition, scene: GeminiGeneratedScene) => void
  onAssetFailed?: (assetId: string, scene: GeminiGeneratedScene) => void
  onLog?: (message: string) => void
}

export type GeminiProblem =
  | { kind: "timeout"; temporary: true }
  | { kind: "cannot-connect"; temporary: true }
  | { kind: "server" }
  | { kind: "unauthorized" }
  | { kind: "forbidden" }
  | { kind: "not-found" }
  | { kind: "rejected" }
  | { kind: "rate-limited"; temporary: true }
  | { kind: "unknown"; temporary: true }
  | { kind: "bad-data" }
  | { kind: "empty-prompt" }
  | { kind: "missing-api-key" }
  | { kind: "invalid-svg" }
  | { kind: "invalid-scene" }

export type GeminiSvgResult = { kind: "ok"; svgMarkup: string } | GeminiProblem

export type GeminiSceneResult = { kind: "ok"; scene: GeminiGeneratedScene } | GeminiProblem

export type GeminiApiResponse = ApiResponse<GeminiGenerateContentResponse>
