import { ApiResponse, ApisauceInstance, create } from "apisauce"

import Config from "@/config"

import { getGeminiProblem } from "./geminiProblem"
import { GeminiConfig, GeminiGenerateContentResponse, GeminiSvgResult } from "./types"

export const DEFAULT_GEMINI_CONFIG: GeminiConfig = {
    url: Config.GEMINI_BASE_URL,
    apiKey: Config.GEMINI_API_KEY,
    model: Config.GEMINI_MODEL,
    timeout: 30000,
}

function buildGenerateContentUrl(config: GeminiConfig) {
    const baseUrl = config.url.endsWith("/") ? config.url : `${config.url}/`
    return `${baseUrl}models/${config.model}:generateContent?key=${encodeURIComponent(config.apiKey)}`
}

function buildSvgPrompt(prompt: string) {
    return [
        `
        `,
        "---",
        `${prompt}`,
    ].join("\n")
}

function getGeneratedText(response: ApiResponse<GeminiGenerateContentResponse>) {
    return (
        response.data?.candidates
            ?.flatMap((candidate) => candidate.content?.parts ?? [])
            .map((part) => part.text ?? "")
            .join("\n") ?? ""
    )
}

function extractSvgMarkup(rawText: string): string | null {
    const trimmed = rawText.trim()
    if (!trimmed) return null

    const withoutFences = trimmed.replace(/```svg|```xml|```/gi, "").trim()
    const directMatch = withoutFences.match(/<svg[\s\S]*?<\/svg>/i)
    if (directMatch?.[0]) return directMatch[0].trim()

    const decoded = withoutFences
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
    const decodedMatch = decoded.match(/<svg[\s\S]*?<\/svg>/i)
    if (decodedMatch?.[0]) return decodedMatch[0].trim()

    const firstTagIndex = withoutFences.indexOf("<")
    const lastTagIndex = withoutFences.lastIndexOf(">")
    if (firstTagIndex === -1 || lastTagIndex === -1 || lastTagIndex <= firstTagIndex) return null

    const candidateBody = withoutFences.slice(firstTagIndex, lastTagIndex + 1).trim()
    if (!candidateBody) return null

    // Wrap partial SVG element output when Gemini forgets the root <svg> tag.
    if (/<(g|path|rect|circle|ellipse|polygon|polyline|line|defs|text|image)\b/i.test(candidateBody)) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">${candidateBody}</svg>`
    }

    return null
}

function buildStrictSvgPrompt(prompt: string) {
    return [
        `${prompt}`,
        "---",
        "Style: Sago Mini x Kurzgesagt x Duolingo.",
        "Return only SVG markup.",
        "Start with <svg and end with </svg>.",
    ].join("\n")
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

    async generateSvg(prompt: string): Promise<GeminiSvgResult> {
        // Generate one SVG from one prompt.
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
                        parts: [{ text: buildSvgPrompt(promptTrimmed) }],
                    },
                ],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 8192,
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

        let svgMarkup = extractSvgMarkup(getGeneratedText(response))

        if (!svgMarkup) {
            try {
                const retryResponse: ApiResponse<GeminiGenerateContentResponse> = await this.apisauce.post(requestUrl, {
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: buildStrictSvgPrompt(promptTrimmed) }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 8192,
                        ...getDefaultGenerationConfig(),
                    },
                })

                if (retryResponse.ok) {
                    svgMarkup = extractSvgMarkup(getGeneratedText(retryResponse))
                }
            } catch {
                // Keep the original invalid-svg flow when retry fails.
            }
        }

        if (!svgMarkup) return { kind: "invalid-svg" }

        return { kind: "ok", svgMarkup }
    }
}

export const geminiService = new GeminiService()
