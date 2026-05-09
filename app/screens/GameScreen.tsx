import { useCallback, useState } from "react"
import { ScrollView, View, ViewStyle } from "react-native"
import { SvgXml } from "react-native-svg"

import { ActionButton } from "@/components/UI/Button"
import { Text } from "@/components/UI/Text"
import { TextField } from "@/components/UI/TextField"
import { useAppTheme } from "@/theme/context"

import { geminiService } from "../services/gemini/geminiService"
import { GeminiProblem } from "../services/gemini/types"

interface GeneratedSvgItem {
  id: string
  prompt: string
  svgMarkup: string
}

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
  const [promptText, setPromptText] = useState("")
  const [generatedSvgs, setGeneratedSvgs] = useState<GeneratedSvgItem[]>([])
  const [errorText, setErrorText] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateSvg = useCallback(async () => {
    // Send the prompt and append one SVG result.
    const promptTrimmed = promptText.trim()
    if (!promptTrimmed) return

    setErrorText(null)
    setIsGenerating(true)

    const result = await geminiService.generateSvg(promptTrimmed)

    if (result.kind === "ok") {
      setGeneratedSvgs((current) => [
        {
          id: `${Date.now()}-${current.length}`,
          prompt: promptTrimmed,
          svgMarkup: result.svgMarkup,
        },
        ...current,
      ])
      setPromptText("")
    } else {
      setErrorText(getGeminiErrorText(result))
    }

    setIsGenerating(false)
  }, [promptText])

  return (
    <View style={themed($container)}>
      <View style={themed($controls)}>
        <TextField
          value={promptText}
          onChangeText={setPromptText}
          placeholder="Describe anything"
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
