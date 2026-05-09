import { ApiErrorResponse } from "apisauce"

import { getGeminiProblem } from "./geminiProblem"
import { extractSvgMarkup, parseGeminiScenePlan } from "./geminiService"
import { GeminiSceneRequestContext } from "./types"

const sceneContext: GeminiSceneRequestContext = {
  prompt: "Dog used a ladder and reached the apple.",
  availableAssets: [
    {
      assetId: "dog-1",
      role: "dog",
      description: "Happy brown dog looking up",
      viewBox: "0 0 120 120",
      svgMarkup: '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="40" /></svg>',
    },
    {
      assetId: "apple-1",
      role: "apple",
      description: "Red apple hanging high",
      viewBox: "0 0 80 80",
      svgMarkup: '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="26" /></svg>',
    },
    {
      assetId: "sky-1",
      role: "sky",
      description: "Soft blue sky background",
      viewBox: "0 0 320 220",
      svgMarkup: '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220" viewBox="0 0 320 220"><rect width="320" height="220" fill="#D7F0FF" /></svg>',
    },
  ],
  sceneHistory: [
    {
      sceneId: "scene-1",
      prompt: "Dog trying to reach an apple on the garden, but the apple is too high.",
      summary: "The dog jumps below a high apple in the garden.",
      reusedAssetIds: [],
    },
  ],
}

test("extracts svg from plain content", () => {
  const raw = '<svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" /></svg>'

  expect(extractSvgMarkup(raw)).toContain("<svg")
})

test("extracts svg from fenced markdown", () => {
  const raw = '```svg\n<svg width="10" height="10" viewBox="0 0 10 10"></svg>\n```'

  expect(extractSvgMarkup(raw)).toBe(
    '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"></svg>',
  )
})

test("returns null for non-svg content", () => {
  expect(extractSvgMarkup("apple")).toBeNull()
})

test("returns null when svg misses viewBox", () => {
  const raw = '<svg width="100" height="100"><circle cx="50" cy="50" r="40" /></svg>'

  expect(extractSvgMarkup(raw)).toBeNull()
})

test("returns null for script tags", () => {
  const raw = '<svg viewBox="0 0 10 10"><script>alert(1)</script></svg>'

  expect(extractSvgMarkup(raw)).toBeNull()
})

test("returns null for foreignObject content", () => {
  const raw = '<svg viewBox="0 0 10 10"><foreignObject /></svg>'

  expect(extractSvgMarkup(raw)).toBeNull()
})

test("removes xml preamble before returning markup", () => {
  const raw =
    '<?xml version="1.0"?><svg width="10" height="10" viewBox="0 0 10 10"></svg>'

  expect(extractSvgMarkup(raw)).toBe(
    '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10"></svg>',
  )
})

test("parses structured scene plan with reuse and variants", () => {
  const raw = JSON.stringify({
    sceneId: "scene-2",
    summary: "The dog climbs a ladder and finally reaches the apple.",
    backgroundColor: "#DFF4FF",
    stageViewBox: "0 0 1000 700",
    reusedAssetIds: ["dog-1", "apple-1", "sky-1"],
    assetPlans: [
      {
        assetId: "dog-2",
        role: "dog",
        description: "The same dog climbing the ladder with focus",
        stage: "characters",
        mode: "variant",
        referenceAssetId: "dog-1",
        prompt: "same dog climbing upward",
      },
      {
        assetId: "ladder-1",
        role: "ladder",
        description: "Short wooden ladder leaning to the apple tree",
        stage: "objects",
        mode: "generate",
        referenceAssetId: undefined,
        prompt: "warm wooden ladder",
      },
    ],
    items: [
      {
        assetId: "sky-1",
        placement: { x: 0, y: 0, width: 1000, height: 700, zIndex: 0 },
      },
      {
        assetId: "ladder-1",
        placement: { x: 580, y: 150, width: 180, height: 420, zIndex: 1 },
      },
      {
        assetId: "dog-2",
        placement: { x: 360, y: 260, width: 240, height: 240, zIndex: 2 },
      },
      {
        assetId: "apple-1",
        placement: { x: 640, y: 80, width: 96, height: 96, zIndex: 3 },
      },
    ],
  })

  expect(parseGeminiScenePlan(raw, sceneContext)).toEqual({
    sceneId: "scene-2",
    prompt: "Dog used a ladder and reached the apple.",
    summary: "The dog climbs a ladder and finally reaches the apple.",
    backgroundColor: "#DFF4FF",
    stageViewBox: "0 0 1000 700",
    reusedAssetIds: ["dog-1", "apple-1", "sky-1"],
    assetPlans: [
      {
        assetId: "dog-2",
        role: "dog",
        description: "The same dog climbing the ladder with focus",
        stage: "characters",
        mode: "variant",
        referenceAssetId: "dog-1",
        prompt: "same dog climbing upward",
      },
      {
        assetId: "ladder-1",
        role: "ladder",
        description: "Short wooden ladder leaning to the apple tree",
        stage: "objects",
        mode: "generate",
        prompt: "warm wooden ladder",
      },
    ],
    items: [
      {
        assetId: "sky-1",
        placement: { x: 0, y: 0, width: 1000, height: 700, rotation: undefined, zIndex: 0 },
      },
      {
        assetId: "ladder-1",
        placement: { x: 580, y: 150, width: 180, height: 420, rotation: undefined, zIndex: 1 },
      },
      {
        assetId: "dog-2",
        placement: { x: 360, y: 260, width: 240, height: 240, rotation: undefined, zIndex: 2 },
      },
      {
        assetId: "apple-1",
        placement: { x: 640, y: 80, width: 96, height: 96, rotation: undefined, zIndex: 3 },
      },
    ],
  })
})

test("returns null when a scene item references an unknown asset", () => {
  const raw = JSON.stringify({
    sceneId: "scene-2",
    summary: "Invalid scene.",
    reusedAssetIds: ["dog-1"],
    assetPlans: [],
    items: [
      {
        assetId: "missing-asset",
        placement: { x: 0, y: 0, width: 50, height: 50, zIndex: 1 },
      },
    ],
  })

  expect(parseGeminiScenePlan(raw, sceneContext)).toBeNull()
})

test("returns null when a variant asset plan misses its reference", () => {
  const raw = JSON.stringify({
    sceneId: "scene-2",
    summary: "Broken variant scene.",
    reusedAssetIds: ["dog-1"],
    assetPlans: [
      {
        assetId: "dog-2",
        role: "dog",
        description: "Dog variant without source",
        stage: "characters",
        mode: "variant",
        referenceAssetId: "missing-dog",
        prompt: "same dog but surprised",
      },
    ],
    items: [
      {
        assetId: "dog-2",
        placement: { x: 10, y: 10, width: 60, height: 60, zIndex: 1 },
      },
    ],
  })

  expect(parseGeminiScenePlan(raw, sceneContext)).toBeNull()
})

test("handles rate-limited errors", () => {
  expect(
    getGeminiProblem({ problem: "CLIENT_ERROR", status: 429 } as ApiErrorResponse<null>),
  ).toEqual({
    kind: "rate-limited",
    temporary: true,
  })
})

test("handles timeout errors", () => {
  expect(getGeminiProblem({ problem: "TIMEOUT_ERROR" } as ApiErrorResponse<null>)).toEqual({
    kind: "timeout",
    temporary: true,
  })
})
