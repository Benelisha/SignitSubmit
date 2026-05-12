import { useCallback, useMemo, useState } from "react"
import { ScrollView, TouchableOpacity, View, ViewStyle } from "react-native"
import { SvgXml } from "react-native-svg"

import { ActionButton } from "@/components/UI/Button"
import { Text } from "@/components/UI/Text"
import { TextField } from "@/components/UI/TextField"
import { useAppTheme } from "@/theme/context"

import { geminiService } from "../services/gemini/geminiService"
import { GeminiProblem, GeminiSvgGeneratorKind } from "../services/gemini/types"

interface GeneratedSvgItem {
  id: string
  prompt: string
  svgMarkup: string
}

interface GeneratorTabDefinition {
  kind: GeminiSvgGeneratorKind
  label: string
  description: string
  placeholder: string
}

const GENERATOR_TABS: GeneratorTabDefinition[] = [
  {
    kind: "character",
    label: "Character",
    description: "Focused character generator. This is the tab we will tune first with your reference SVGs.",
    placeholder: "Describe the character to generate",
  },
  {
    kind: "background",
    label: "Background",
    description: "Background generator scaffold. We will inject background SVG examples after the character pass.",
    placeholder: "Describe the background to generate",
  },
  {
    kind: "object",
    label: "Objects",
    description: "Object generator scaffold for standalone props and items.",
    placeholder: "Describe the object to generate",
  },
]

function getGeminiErrorText(problem: GeminiProblem) {
  switch (problem.kind) {
    case "empty-prompt":
      return "Type a prompt first."
    case "missing-api-key":
      return "Missing Gemini API key."
    case "invalid-svg":
      return "Gemini did not return a valid SVG."
    case "timeout":
      return "Request timed out."
    case "cannot-connect":
      return "Cannot connect right now."
    case "rate-limited":
      return "Rate limit reached."
    case "unauthorized":
      return "Unauthorized request."
    case "forbidden":
      return "Request forbidden."
    case "not-found":
      return "Model or endpoint not found."
    case "server":
      return "Gemini server error."
    case "rejected":
      return "Gemini rejected this request."
    case "unknown":
    case "bad-data":
      return "Unexpected Gemini response."
    default:
      return "Something went wrong."
  }
}

export default function GameScreen() {
  const { themed } = useAppTheme()
  const [activeGenerator, setActiveGenerator] = useState<GeminiSvgGeneratorKind>("character")
  const [promptByGenerator, setPromptByGenerator] = useState<Record<GeminiSvgGeneratorKind, string>>({
    character: "",
    background: "",
    object: "",
  })
  const [generatedSvgsByGenerator, setGeneratedSvgsByGenerator] = useState<Record<GeminiSvgGeneratorKind, GeneratedSvgItem[]>>({
    character: [],
    background: [],
    object: [],
  })
  const [errorText, setErrorText] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const activeTab = useMemo(
    () => GENERATOR_TABS.find((tab) => tab.kind === activeGenerator) ?? GENERATOR_TABS[0],
    [activeGenerator],
  )

  const promptText = promptByGenerator[activeGenerator]
  const generatedSvgs = generatedSvgsByGenerator[activeGenerator]

  const handleGenerateSvg = useCallback(async () => {
    // Send the prompt and append one SVG result.
    const promptTrimmed = promptText.trim()
    if (!promptTrimmed) return

    setErrorText(null)
    setIsGenerating(true)

    const result = await geminiService.generateSvg(promptTrimmed, activeGenerator)

    if (result.kind === "ok") {
      setGeneratedSvgsByGenerator((current) => ({
        ...current,
        [activeGenerator]: [
          {
            id: `${Date.now()}-${current[activeGenerator].length}`,
            prompt: promptTrimmed,
            svgMarkup: result.svgMarkup,
          },
          ...current[activeGenerator],
        ],
      }))
      setPromptByGenerator((current) => ({
        ...current,
        [activeGenerator]: "",
      }))
    } else {
      setErrorText(getGeminiErrorText(result))
    }

    setIsGenerating(false)
  }, [activeGenerator, promptText])

  return (
    <View style={themed($container)}>
      <View style={themed($controls)}>
        <View style={themed($tabRow)}>
          {GENERATOR_TABS.map((tab) => {
            const isActive = tab.kind === activeGenerator

            return (
              <TouchableOpacity
                key={tab.kind}
                onPress={() => {
                  setActiveGenerator(tab.kind)
                  setErrorText(null)
                }}
                style={themed([$tabButton, isActive && $tabButtonActive])}
                activeOpacity={0.85}
              >
                <Text text={tab.label} style={themed([$tabButtonText, isActive && $tabButtonTextActive])} />
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={themed($tabIntro)}>
          <Text text={activeTab.label} style={themed($tabTitle)} />
          <Text text={activeTab.description} style={themed($tabDescription)} />
        </View>

        <TextField
          value={promptText}
          onChangeText={(text) => {
            setPromptByGenerator((current) => ({
              ...current,
              [activeGenerator]: text,
            }))
          }}
          placeholder={activeTab.placeholder}
          editable={!isGenerating}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="send"
          onSubmitEditing={() => {
            if (!isGenerating) void handleGenerateSvg()
          }}
          containerStyle={themed($promptField)}
        />

        <ActionButton
          text={isGenerating ? "Generating..." : "Send"}
          onPress={() => void handleGenerateSvg()}
          disabled={isGenerating || !promptText.trim()}
          style={themed($button)}
        />

        {!!errorText && <Text text={errorText} />}
      </View>

      <ScrollView contentContainerStyle={themed($grid)}>
        {generatedSvgs.map((item) => (
          <View key={item.id} style={themed($card)}>
            <SvgXml xml={item.svgMarkup} width="100%" height="100%" />
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: "#FFF8E7",
}

const $controls: ViewStyle = {
  padding: 16,
  gap: 10,
}

const $tabRow: ViewStyle = {
  flexDirection: "row",
  gap: 8,
}

const $tabButton: ViewStyle = {
  flex: 1,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  backgroundColor: "#FFFFFF",
  paddingVertical: 10,
  paddingHorizontal: 12,
  alignItems: "center",
  justifyContent: "center",
}

const $tabButtonActive: ViewStyle = {
  borderColor: "#F59E0B",
  backgroundColor: "#FEF3C7",
}

const $tabButtonText: ViewStyle = {}

const $tabButtonTextActive: ViewStyle = {}

const $tabIntro: ViewStyle = {
  borderRadius: 16,
  backgroundColor: "#FFFDF7",
  borderWidth: 1,
  borderColor: "#FDE68A",
  padding: 12,
  gap: 4,
}

const $tabTitle: ViewStyle = {}

const $tabDescription: ViewStyle = {}

const $promptField: ViewStyle = {
  width: "100%",
}

const $button: ViewStyle = {
  alignSelf: "stretch",
}

const $grid: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
  paddingHorizontal: 16,
  paddingBottom: 24,
}

const $card: ViewStyle = {
  width: "48%",
  aspectRatio: 1,
  borderWidth: 1,
  borderRadius: 14,
  borderColor: "#E5E7EB",
  backgroundColor: "#FFFFFF",
  padding: 8,
}
