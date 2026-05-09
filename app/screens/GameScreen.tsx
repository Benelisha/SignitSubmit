import { useCallback, useEffect, useRef, useState } from "react"
import { View, ViewStyle, StyleSheet, BackHandler, TextStyle, ScrollView } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { useFocusEffect } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"
import { GameStackParamList } from "@/navigators/GameStackNavigator"
import { useAppTheme } from "@/theme/context"
import { ActionButton, Button } from "@/components/UI/Button"

import { TextField } from "@/components/UI/TextField"
import { Text } from "@/components/UI/Text"
import { geminiService } from "@/services/gemini/geminiService"
import { GeminiProblem } from "@/services/gemini/types"

type Props = NativeStackScreenProps<GameStackParamList, "GameScreen">

interface GeneratedSvgItem {
  id: string
  prompt: string
  svgMarkup: string
}

function appendLog(currentLogs: string[], message: string) {
  const nextLogs = [...currentLogs, message.length > 260 ? `${message.slice(0, 260)}...` : message]
  return nextLogs.slice(-18)
}

function getGeminiErrorText(problem: GeminiProblem) {
  switch (problem.kind) {
    case "empty-prompt":
      return "Type a prompt first."
    case "missing-api-key":
      return "Missing Gemini API key. Add it to config.dev/config.prod."
    case "invalid-svg":
      return "Gemini returned an invalid SVG. Try a different prompt."
    case "invalid-scene":
      return "Gemini returned an invalid scene layout. Try again."
    case "timeout":
      return "Request timed out. Please try again."
    case "cannot-connect":
      return "Cannot connect right now. Check network and try again."
    case "rate-limited":
      return "Rate limit reached. Wait a moment and retry."
    case "unauthorized":
      return "Unauthorized request. Check API key and model access."
    case "forbidden":
      return "Request forbidden for this key/model."
    case "not-found":
      return "Gemini model or endpoint was not found. Check the configured model name."
    case "server":
      return "Gemini server error. Please retry."
    case "rejected":
      return "Gemini rejected this request. Try a different prompt."
    case "unknown":
    case "bad-data":
      return "Unexpected response from Gemini."
    default:
      return "Something went wrong."
  }
}

// Render the battle game screen with an SVG prompt workflow over the scene.
export default function GameScreen({ navigation }: Props) {
  const { themed } = useAppTheme()
  const [promptText, setPromptText] = useState("")
  const [generatedSvgs, setGeneratedSvgs] = useState<GeneratedSvgItem[]>([])
  const [generationLogs, setGenerationLogs] = useState<string[]>([])
  const [errorText, setErrorText] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const galleryScrollRef = useRef<ScrollView>(null)
  const previousSceneCountRef = useRef(0)

  // Block Android hardware back presses while this screen is focused.
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener("hardwareBackPress", () => true)
      return () => subscription.remove()
    }, []),
  )

  useEffect(() => {
    if (!generatedSvgs.length || generatedSvgs.length === previousSceneCountRef.current) return

    requestAnimationFrame(() => {
      galleryScrollRef.current?.scrollToEnd({ animated: true })
    })

    previousSceneCountRef.current = generatedSvgs.length
  }, [generatedSvgs.length])

  const handleGenerateSvg = useCallback(async () => {
    const promptTrimmed = promptText.trim()
    if (!promptTrimmed) return

    setErrorText(null)
    setIsGenerating(true)
    setGenerationLogs((current) => appendLog(current, `prompt -> ${promptTrimmed}`))

    const result = await geminiService.generateSvgFromPrompt(promptTrimmed)

    if (result.kind === "ok") {
      setGeneratedSvgs((current) => [
        ...current,
        {
          id: `${Date.now()}-${current.length}`,
          prompt: promptTrimmed,
          svgMarkup: result.svgMarkup,
        },
      ])
      setGenerationLogs((current) => appendLog(current, `svg returned -> ${result.svgMarkup}`))
      setPromptText("")
    } else {
      setGenerationLogs((current) => appendLog(current, `svg error -> ${result.kind}`))
      setErrorText(getGeminiErrorText(result))
    }

    setIsGenerating(false)
  }, [promptText])

  return (
    <View style={themed($container)}>
      <View style={$overlay} pointerEvents="box-none">
        <View style={themed($topLeftContainer)}>
          <Button
            text="<"
            onPress={() => navigation.goBack()}
            style={themed($backButton)}
          />
        </View>

        <View style={themed($centerSection)}>
          <ScrollView
            ref={galleryScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={themed($galleryContent)}
            style={themed($galleryScroll)}
          >
            {generatedSvgs.length ? (
              generatedSvgs.map((item) => (
                <View key={item.id} style={themed($svgCard)}>
                  <View style={themed($svgPreview)}>
                    <SvgXml xml={item.svgMarkup} width="100%" height="100%" />
                  </View>
                  <Text text={item.prompt} style={themed($promptCaption)} numberOfLines={2} />
                </View>
              ))
            ) : (
              <View style={themed($emptyCard)}>
                <Text
                  text="Each generated SVG will appear here. Swipe sideways to review them."
                  style={themed($placeholderText)}
                />
              </View>
            )}
          </ScrollView>
        </View>

        <View style={themed($bottomControls)}>
          <TextField
            value={promptText}
            onChangeText={setPromptText}
            placeholder="Describe one subject, for example: Apple or Dog"
            editable={!isGenerating}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="send"
            onSubmitEditing={() => {
              if (!isGenerating) void handleGenerateSvg()
            }}
            containerStyle={themed($promptField)}
          />

          {!!errorText && <Text text={errorText} style={themed($errorText)} />}

          {!!generationLogs.length && (
            <View style={themed($logsPanel)}>
              <Text text="Generation Log" style={themed($logsTitle)} />
              <ScrollView nestedScrollEnabled style={themed($logsScroll)}>
                {generationLogs.map((logLine, index) => (
                  <Text key={`${index}-${logLine.slice(0, 12)}`} text={logLine} style={themed($logLine)} />
                ))}
              </ScrollView>
            </View>
          )}

          <View style={themed($sendButtonWrap)}>
            <ActionButton
              text={isGenerating ? "Generating..." : "Send"}
              onPress={() => void handleGenerateSvg()}
              disabled={isGenerating || !promptText.trim()}
              style={themed($button)}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
}

const $overlay: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  justifyContent: "space-between",
  paddingTop: 16,
  paddingBottom: 40,
}

const $topLeftContainer: ViewStyle = {
  alignItems: "flex-start",
  paddingHorizontal: 16,
}

const $backButton: ViewStyle = {
  alignSelf: "flex-start",
}

const $bottomControls: ViewStyle = {
  alignItems: "center",
  paddingHorizontal: 16,
  paddingBottom: 24,
}

const $centerSection: ViewStyle = {
  flex: 1,
  justifyContent: "center",
}

const $galleryScroll: ViewStyle = {
  width: "100%",
}

const $galleryContent: ViewStyle = {
  alignItems: "center",
  paddingHorizontal: 16,
  gap: 16,
}

const $svgCard: ViewStyle = {
  width: 320,
  alignItems: "center",
}

const $svgPreview: ViewStyle = {
  width: "100%",
  height: 320,
  borderWidth: 1,
  borderRadius: 28,
  borderColor: "#F8C25C",
  backgroundColor: "#FFF7ED",
  alignItems: "center",
  justifyContent: "center",
  padding: 18,
}

const $emptyCard: ViewStyle = {
  width: 320,
  minHeight: 240,
  borderWidth: 1,
  borderRadius: 28,
  borderColor: "#D1D5DB",
  backgroundColor: "#FFFFFF",
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 20,
}

const $placeholderText: TextStyle = {
  textAlign: "center",
  color: "#6B7280",
}

const $promptCaption: TextStyle = {
  marginTop: 10,
  textAlign: "center",
  color: "#5B4A25",
}

const $promptField: ViewStyle = {
  width: "100%",
}

const $logsPanel: ViewStyle = {
  width: "100%",
  marginTop: 10,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  backgroundColor: "rgba(255,255,255,0.92)",
  padding: 12,
}

const $logsTitle: TextStyle = {
  color: "#5B4A25",
  marginBottom: 6,
}

const $logsScroll: ViewStyle = {
  maxHeight: 120,
}

const $logLine: TextStyle = {
  color: "#4B5563",
  marginBottom: 4,
}

const $errorText: TextStyle = {
  marginTop: 8,
  color: "#B91C1C",
  textAlign: "center",
}

const $sendButtonWrap: ViewStyle = {
  marginTop: 10,
  width: "100%",
  alignItems: "center",
}

const $button: ViewStyle = {
  alignSelf: "center",
}
