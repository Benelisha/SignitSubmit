import { ApiResponse, ApisauceInstance, create } from "apisauce"

import Config from "@/config"

import { getGeminiProblem } from "./geminiProblem"
import {
  GeminiConfig,
  GeminiGeneratedScene,
  GeminiGenerateContentResponse,
  GeminiSceneAssetDefinition,
  GeminiSceneAssetPlan,
  GeminiSceneAssetStage,
  GeminiSceneGenerationHooks,
  GeminiSceneHistorySummary,
  GeminiScenePlan,
  GeminiSceneRequestContext,
  GeminiSceneResult,
  GeminiSceneItem,
  GeminiSvgResult,
} from "./types"

export const DEFAULT_GEMINI_CONFIG: GeminiConfig = {
  url: Config.GEMINI_BASE_URL,
  apiKey: Config.GEMINI_API_KEY,
  model: Config.GEMINI_MODEL,
  timeout: 20000,
}

const SCENE_STAGES: GeminiSceneAssetStage[] = ["background", "characters", "objects", "details"]

function buildGenerateContentUrl(config: GeminiConfig) {
  const baseUrl = config.url.endsWith("/") ? config.url : `${config.url}/`
  return `${baseUrl}models/${config.model}:generateContent?key=${encodeURIComponent(config.apiKey)}`
}

function buildSvgInstruction(prompt: string) {
  return [
    "Generate SVG markup for this prompt:",
    `Subject: ${prompt}`,
    "",
    "Technical constraints:",
    "- Return only SVG markup.",
    "- Output must begin with <svg and end with </svg>.",
    "- Include width, height, and viewBox on the root svg tag.",
    "- Keep the SVG self-contained with inline shapes only.",
    "- Avoid script, style, foreignObject, external assets, fonts, masks, and clipPath unless absolutely necessary.",
    "- Do not include markdown fences or any explanation.",
  ].join("\n")
}

function summarizeAvailableAssets(assets: GeminiSceneAssetDefinition[]) {
  if (!assets.length) return "None"

  return assets
    .map((asset) => `- ${asset.assetId}: ${asset.role} | ${asset.description}`)
    .join("\n")
}

function summarizeSceneHistory(sceneHistory: GeminiSceneHistorySummary[]) {
  if (!sceneHistory.length) return "None"

  return sceneHistory
    .map(
      (scene) =>
        `- ${scene.sceneId}: ${scene.prompt} | ${scene.summary} | reused: ${scene.reusedAssetIds.join(", ") || "none"}`,
    )
    .join("\n")
}

function buildScenePlanInstruction(context: GeminiSceneRequestContext) {
  return [
    "Plan one dense magical scene as JSON for a beautiful preschool-game illustration inspired mostly by Sago Mini.",
    `Current scene prompt: ${context.prompt}`,
    "The user generates scenes manually, one scene at a time. Maintain strong visual continuity across scenes.",
    "Create a rich scene with 12 to 20 total placed items when the prompt allows it.",
    "Make the composition feel full and alive. Fill most of the stage with content, not tiny scattered objects.",
    "Plan the scene in this order: background first, then characters, then objects, then details.",
    "Background should include sky, clouds, floor, hills, trees, or major environment layers as needed.",
    "Characters should include the main actors and any expressive pose variants.",
    "Objects should include interactive props and goal items.",
    "Details should include flowers, rocks, leaves, tiny stars, or similar finishing touches.",
    "Reuse an exact previous assetId when that object can appear unchanged.",
    "Use mode variant when the same object needs a new pose or emotion but must keep the same palette, proportions, and identity.",
    "Use mode generate only for truly new objects.",
    "Return only JSON. No markdown fences. No explanation.",
    "Use stageViewBox exactly as 0 0 1000 700 and keep placement values inside it.",
    "Each scene item must reference an assetId from either the previous asset list or the assetPlans array.",
    "Do not return shadow or highlight metadata. Depth must be baked into the SVG art itself.",
    "Plan clouds, trees, ground, sky accents, props, and small decorative details so the scene feels premium rather than empty.",
    "JSON shape:",
    '{"sceneId":"scene-2","summary":"...","backgroundColor":"#DDF4FF","stageViewBox":"0 0 1000 700","reusedAssetIds":["sky-1"],"assetPlans":[{"assetId":"sky-clouds-2","role":"clouds","description":"Soft storybook clouds","stage":"background","mode":"generate","prompt":"storybook clouds"},{"assetId":"dog-2","role":"dog","description":"The same brown dog climbing a ladder","stage":"characters","mode":"variant","referenceAssetId":"dog-1","prompt":"same dog climbing confidently"},{"assetId":"ladder-1","role":"ladder","description":"Wooden ladder with warm brown rails","stage":"objects","mode":"generate","prompt":"small ladder"},{"assetId":"flowers-1","role":"flowers","description":"Small garden flowers","stage":"details","mode":"generate","prompt":"tiny flowers"}],"items":[{"assetId":"sky-1","placement":{"x":0,"y":0,"width":1000,"height":700,"zIndex":0}},{"assetId":"dog-2","placement":{"x":320,"y":260,"width":260,"height":260,"zIndex":6}},{"assetId":"ladder-1","placement":{"x":500,"y":160,"width":180,"height":420,"zIndex":5}}]}',
    "Available reusable assets:",
    summarizeAvailableAssets(context.availableAssets),
    "Previous scenes:",
    summarizeSceneHistory(context.sceneHistory),
    "If the prompt mentions the same dog, apple, sky, clouds, or garden, prefer reuse or variant of the previous matching assetId.",
  ].join("\n")
}

function buildRoleArtDirection(role: string) {
  switch (role.toLowerCase()) {
    case "cloud":
    case "clouds":
      return "Use soft off-white, pale blue-gray, and a lighter cream highlight. Avoid pure flat white circles."
    case "tree":
    case "trees":
      return "Use layered greens and a warmer trunk tone so the tree feels painted, not flat."
    case "sky":
      return "Use subtle color variation and simple atmospheric shapes rather than one flat fill."
    case "dog":
    case "character":
      return "Keep the character charming and readable with soft cel-style shading, not harsh contrast."
    default:
      return "Use soft painted depth with restrained highlights and gentle shadow shapes, similar to polished Sago Mini art."
  }
}

function buildAssetGenerationInstruction(
  plan: GeminiSceneAssetPlan,
  scene: GeminiScenePlan,
  referenceAsset?: GeminiSceneAssetDefinition,
) {
  const referenceLines = referenceAsset
    ? [
        `Reference assetId: ${referenceAsset.assetId}`,
        `Reference role: ${referenceAsset.role}`,
        `Reference description: ${referenceAsset.description}`,
        "Reference SVG:",
        referenceAsset.svgMarkup,
      ]
    : ["Reference asset: none"]

  return [
    "Return only valid SVG markup.",
    `Create one premium playful asset for this scene: ${scene.summary}`,
    `Asset role: ${plan.role}`,
    `Asset description: ${plan.description}`,
    `Asset-specific prompt: ${plan.prompt ?? plan.description}`,
    `Mode: ${plan.mode}`,
    `Stage: ${plan.stage}`,
    "Art direction: beautiful magical preschool-game illustration, rich but clean, rounded shapes, charming details, strongly inspired by Sago Mini.",
    "Use soft painted depth and gentle cel-style form modeling.",
    "Use 2 or 3 close color tones per main form: base tone, soft shadow tone, and a restrained highlight where useful.",
    "Avoid harsh glossy highlights, black shadows, dramatic contrast, and over-rendered gradients.",
    buildRoleArtDirection(plan.role),
    "Do not use filters, drop shadows, blur filters, masks, CSS, foreignObject, script, or style tags.",
    "Do not use flat one-color shapes unless they are tiny accent details.",
    "Use transparent background.",
    "Keep the asset self-contained and expressive.",
    "If this is a character variant, preserve the same palette, proportions, silhouette cues, and identity from the reference asset while changing pose or expression to fit the scene.",
    "Output must begin with <svg and end with </svg>.",
    ...referenceLines,
  ].join("\n")
}

function extractJsonObject(rawText: string): string | null {
  const trimmed = rawText.trim()
  if (!trimmed) return null

  const withoutFences = trimmed.replace(/```json|```/gi, "").trim()
  const startIndex = withoutFences.indexOf("{")
  const endIndex = withoutFences.lastIndexOf("}")

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) return null

  return withoutFences.slice(startIndex, endIndex + 1)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function getSanitizedSvgMarkup(svgMarkup: unknown) {
  if (typeof svgMarkup !== "string") return null

  const trimmed = svgMarkup.trim()
  if (!trimmed) return null

  if (!trimmed.includes("viewBox")) return null
  if (trimmed.length > 30000) return null

  return sanitizeSvgMarkup(trimmed)
}

function getSvgViewBox(svgMarkup: string) {
  const viewBoxMatch = svgMarkup.match(/viewBox=("|')([^"']+)("|')/i)
  return viewBoxMatch?.[2] ?? null
}

function parseSceneAssetPlans(value: unknown): GeminiSceneAssetPlan[] | null {
  if (!Array.isArray(value)) return null

  const assetPlans: GeminiSceneAssetPlan[] = []
  for (const item of value) {
    if (!isRecord(item)) return null

    const assetId = typeof item.assetId === "string" ? item.assetId.trim() : ""
    const role = typeof item.role === "string" ? item.role.trim() : ""
    const description = typeof item.description === "string" ? item.description.trim() : ""
    const stage =
      item.stage === "background" ||
      item.stage === "characters" ||
      item.stage === "objects" ||
      item.stage === "details"
        ? item.stage
        : null
    const mode =
      item.mode === "reuse" || item.mode === "generate" || item.mode === "variant"
        ? item.mode
        : null
    const prompt = typeof item.prompt === "string" ? item.prompt.trim() : undefined
    const referenceAssetId =
      typeof item.referenceAssetId === "string" ? item.referenceAssetId.trim() : undefined

    if (!assetId || !role || !description || !stage || !mode) return null
    if ((mode === "generate" || mode === "variant") && !prompt) return null
    if (mode === "variant" && !referenceAssetId) return null

    assetPlans.push({
      assetId,
      role,
      description,
      stage,
      mode,
      referenceAssetId,
      prompt,
    })
  }

  return assetPlans
}

function parseSceneItems(value: unknown): GeminiSceneItem[] | null {
  if (!Array.isArray(value)) return null

  const items: GeminiSceneItem[] = []
  for (const item of value) {
    if (!isRecord(item) || !isRecord(item.placement)) return null

    const assetId = typeof item.assetId === "string" ? item.assetId.trim() : ""
    const placement = item.placement

    if (
      !assetId ||
      typeof placement.x !== "number" ||
      typeof placement.y !== "number" ||
      typeof placement.width !== "number" ||
      typeof placement.height !== "number" ||
      typeof placement.zIndex !== "number"
    ) {
      return null
    }

    items.push({
      assetId,
      placement: {
        x: placement.x,
        y: placement.y,
        width: placement.width,
        height: placement.height,
        rotation: typeof placement.rotation === "number" ? placement.rotation : undefined,
        zIndex: placement.zIndex,
      },
    })
  }

  return items
}

function buildKnownAssetMap(context: GeminiSceneRequestContext, assetPlans: GeminiSceneAssetPlan[]) {
  return new Map(
    [
      ...context.availableAssets.map((asset) => asset.assetId),
      ...assetPlans.map((assetPlan) => assetPlan.assetId),
    ].map((assetId) => [assetId, true]),
  )
}

export function parseGeminiScenePlan(
  rawText: string,
  context: GeminiSceneRequestContext,
): GeminiScenePlan | null {
  const jsonPayload = extractJsonObject(rawText)
  if (!jsonPayload) return null

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonPayload)
  } catch {
    return null
  }

  if (!isRecord(parsed)) return null

  const sceneId = typeof parsed.sceneId === "string" ? parsed.sceneId.trim() : ""
  const summary = typeof parsed.summary === "string" ? parsed.summary.trim() : ""
  const stageViewBox =
    typeof parsed.stageViewBox === "string" && parsed.stageViewBox.trim()
      ? parsed.stageViewBox.trim()
      : "0 0 1000 700"
  const backgroundColor =
    typeof parsed.backgroundColor === "string" && parsed.backgroundColor.trim()
      ? parsed.backgroundColor.trim()
      : undefined
  const assetPlans = parseSceneAssetPlans(parsed.assetPlans)
  const items = parseSceneItems(parsed.items)

  if (!sceneId || !summary || !assetPlans || !items || !items.length) return null

  const knownAssetMap = buildKnownAssetMap(context, assetPlans)
  if (new Set(assetPlans.map((asset) => asset.assetId)).size !== assetPlans.length) return null
  if (items.some((item) => !knownAssetMap.has(item.assetId))) return null
  if (
    assetPlans.some(
      (assetPlan) =>
        assetPlan.mode === "variant" &&
        !context.availableAssets.find((asset) => asset.assetId === assetPlan.referenceAssetId),
    )
  ) {
    return null
  }

  const reusedAssetIds = Array.isArray(parsed.reusedAssetIds)
    ? parsed.reusedAssetIds.filter(
        (assetId): assetId is string =>
          typeof assetId === "string" && !!context.availableAssets.find((asset) => asset.assetId === assetId),
      )
    : []

  return {
    sceneId,
    prompt: context.prompt,
    summary,
    backgroundColor,
    stageViewBox,
    assetPlans,
    items,
    reusedAssetIds,
  }
}

function sanitizeSvgMarkup(svgMarkup: string): string | null {
  let sanitized = svgMarkup
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/<!doctype[\s\S]*?>/gi, "")
    .trim()

  if (/<(script|foreignObject|style)[\s>]/i.test(sanitized)) return null

  const rootMatch = sanitized.match(/<svg\b[^>]*>/i)
  if (!rootMatch) return null

  const rootTag = rootMatch[0]
  const normalizedRootTag = /xmlns=/i.test(rootTag)
    ? rootTag
    : rootTag.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')

  sanitized = `${normalizedRootTag}${sanitized.slice(rootTag.length)}`

  return sanitized
}

export function extractSvgMarkup(rawText: string): string | null {
  const trimmed = rawText.trim()
  if (!trimmed) return null

  const withoutFences = trimmed.replace(/```svg|```/gi, "").trim()
  const match = withoutFences.match(/<svg[\s\S]*?<\/svg>/i)
  if (!match) return null

  const svgMarkup = match[0].trim()
  if (!svgMarkup.includes("viewBox")) return null
  if (svgMarkup.length > 30000) return null

  return sanitizeSvgMarkup(svgMarkup)
}

function buildSceneSnapshot(
  scene: GeminiScenePlan,
  assets: GeminiSceneAssetDefinition[],
  pendingAssetIds: string[],
  failedAssetIds: string[],
  currentStage?: GeminiSceneAssetStage,
): GeminiGeneratedScene {
  return {
    ...scene,
    assets,
    pendingAssetIds,
    failedAssetIds,
    currentStage,
  }
}

function logSceneGeneration(message: string, hooks?: GeminiSceneGenerationHooks, payload?: unknown) {
  console.log(`[GeminiScene] ${message}`, payload ?? "")
  hooks?.onLog?.(payload ? `${message} ${typeof payload === "string" ? payload : JSON.stringify(payload)}` : message)
}

function getGeneratedText(response: ApiResponse<GeminiGenerateContentResponse>) {
  return (
    response.data?.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text ?? "")
      .join("\n") ?? ""
  )
}

function getDefaultGenerationConfig() {
  return {
    thinkingConfig: {
      thinkingBudget: 0,
    },
  }
}

export class GeminiService {
  apisauce: ApisauceInstance
  config: GeminiConfig

  constructor(config: GeminiConfig = DEFAULT_GEMINI_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async generateSvgFromPrompt(prompt: string): Promise<GeminiSvgResult> {
    const promptTrimmed = prompt.trim()
    if (!promptTrimmed) return { kind: "empty-prompt" }
    if (!this.config.apiKey) return { kind: "missing-api-key" }

    const requestUrl = buildGenerateContentUrl(this.config)

    let response: ApiResponse<GeminiGenerateContentResponse>

    try {
      response = await this.apisauce.post(requestUrl, {
        contents: [
          {
            role: "user",
            parts: [{ text: buildSvgInstruction(promptTrimmed) }],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 4096,
          ...getDefaultGenerationConfig(),
        },
      })
    } catch {
      return { kind: "unknown", temporary: true }
    }

    if (!response.ok) {
      const problem = getGeminiProblem(response)
      if (problem) return problem
    }

    const generatedText = getGeneratedText(response)

    const svgMarkup = extractSvgMarkup(generatedText)
    if (!svgMarkup) return { kind: "invalid-svg" }

    return { kind: "ok", svgMarkup }
  }

  private async generateSceneAsset(
    plan: GeminiSceneAssetPlan,
    scene: GeminiScenePlan,
    availableAssets: GeminiSceneAssetDefinition[],
    hooks?: GeminiSceneGenerationHooks,
  ): Promise<GeminiSceneAssetDefinition | null> {
    const requestUrl = buildGenerateContentUrl(this.config)
    const referenceAsset = plan.referenceAssetId
      ? availableAssets.find((asset) => asset.assetId === plan.referenceAssetId)
      : undefined

    let response: ApiResponse<GeminiGenerateContentResponse>

    logSceneGeneration(`starting asset ${plan.assetId} (${plan.stage}/${plan.role})`, hooks, {
      mode: plan.mode,
      prompt: plan.prompt ?? plan.description,
      referenceAssetId: plan.referenceAssetId,
    })

    try {
      response = await this.apisauce.post(requestUrl, {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: buildAssetGenerationInstruction(plan, scene, referenceAsset),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 4096,
          ...getDefaultGenerationConfig(),
        },
      })
    } catch {
      logSceneGeneration(`asset request failed ${plan.assetId}`, hooks)
      return null
    }

    if (!response.ok) {
      logSceneGeneration(`asset response not ok ${plan.assetId}`, hooks, {
        status: response.status,
        problem: response.problem,
      })
      return null
    }

    const generatedText = getGeneratedText(response)
    const svgMarkup = extractSvgMarkup(generatedText)
    if (!svgMarkup) {
      logSceneGeneration(`asset svg invalid ${plan.assetId}`, hooks, generatedText)
      return null
    }

    const viewBox = getSvgViewBox(svgMarkup)
    if (!viewBox) {
      logSceneGeneration(`asset missing viewBox ${plan.assetId}`, hooks, svgMarkup)
      return null
    }

    logSceneGeneration(`asset svg returned ${plan.assetId}`, hooks, svgMarkup)

    return {
      assetId: plan.assetId,
      role: plan.role,
      description: plan.description,
      viewBox,
      svgMarkup,
    }
  }

  async generateSceneFromPrompt(
    context: GeminiSceneRequestContext,
    hooks?: GeminiSceneGenerationHooks,
  ): Promise<GeminiSceneResult> {
    const promptTrimmed = context.prompt.trim()
    if (!promptTrimmed) return { kind: "empty-prompt" }
    if (!this.config.apiKey) return { kind: "missing-api-key" }

    const requestUrl = buildGenerateContentUrl(this.config)

    let response: ApiResponse<GeminiGenerateContentResponse>

    logSceneGeneration("starting scene plan", hooks, {
      prompt: promptTrimmed,
      availableAssetCount: context.availableAssets.length,
      historyCount: context.sceneHistory.length,
    })

    try {
      response = await this.apisauce.post(requestUrl, {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: buildScenePlanInstruction({
                  ...context,
                  prompt: promptTrimmed,
                }),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
          ...getDefaultGenerationConfig(),
        },
      })
    } catch {
      logSceneGeneration("scene plan request failed", hooks)
      return { kind: "unknown", temporary: true }
    }

    if (!response.ok) {
      logSceneGeneration("scene plan response not ok", hooks, {
        status: response.status,
        problem: response.problem,
      })
      const problem = getGeminiProblem(response)
      if (problem) return problem
    }

    const generatedText = getGeneratedText(response)
    logSceneGeneration("scene plan raw response", hooks, generatedText)
    const plannedScene = parseGeminiScenePlan(generatedText, {
      ...context,
      prompt: promptTrimmed,
    })

    if (!plannedScene) {
      logSceneGeneration("scene plan invalid", hooks)
      return { kind: "invalid-scene" }
    }

    logSceneGeneration("scene plan parsed", hooks, {
      sceneId: plannedScene.sceneId,
      summary: plannedScene.summary,
      assetPlans: plannedScene.assetPlans.map((assetPlan) => ({
        assetId: assetPlan.assetId,
        role: assetPlan.role,
        stage: assetPlan.stage,
        mode: assetPlan.mode,
      })),
    })

    const generatedAssets: GeminiSceneAssetDefinition[] = []
    let pendingAssetIds = plannedScene.assetPlans
      .filter((assetPlan) => assetPlan.mode !== "reuse")
      .map((assetPlan) => assetPlan.assetId)
    let failedAssetIds: string[] = []

    hooks?.onScenePlanned?.(
      buildSceneSnapshot(plannedScene, generatedAssets, pendingAssetIds, failedAssetIds),
    )

    for (const stage of SCENE_STAGES) {
      const stageAssets = plannedScene.assetPlans.filter(
        (assetPlan) => assetPlan.stage === stage && assetPlan.mode !== "reuse",
      )
      logSceneGeneration(`stage start ${stage}`, hooks, stageAssets.map((assetPlan) => assetPlan.assetId))
      hooks?.onStageStarted?.(
        stage,
        buildSceneSnapshot(plannedScene, [...generatedAssets], pendingAssetIds, failedAssetIds, stage),
      )

      await Promise.allSettled(
        stageAssets.map(async (assetPlan) => {
          const asset = await this.generateSceneAsset(assetPlan, plannedScene, context.availableAssets, hooks)

          if (asset) {
            generatedAssets.push(asset)
            pendingAssetIds = pendingAssetIds.filter((assetId) => assetId !== asset.assetId)
            hooks?.onAssetGenerated?.(
              asset,
              buildSceneSnapshot(plannedScene, [...generatedAssets], pendingAssetIds, failedAssetIds, stage),
            )
            return
          }

          pendingAssetIds = pendingAssetIds.filter((assetId) => assetId !== assetPlan.assetId)
          failedAssetIds = [...failedAssetIds, assetPlan.assetId]
          hooks?.onAssetFailed?.(
            assetPlan.assetId,
            buildSceneSnapshot(plannedScene, [...generatedAssets], pendingAssetIds, failedAssetIds, stage),
          )
        }),
      )
    }

    logSceneGeneration("scene complete", hooks, {
      sceneId: plannedScene.sceneId,
      generatedAssetIds: generatedAssets.map((asset) => asset.assetId),
      failedAssetIds,
    })

    return {
      kind: "ok",
      scene: buildSceneSnapshot(plannedScene, generatedAssets, pendingAssetIds, failedAssetIds),
    }
  }
}

export const geminiService = new GeminiService()
