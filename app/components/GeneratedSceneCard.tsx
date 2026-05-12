import { View, ViewStyle, TextStyle, useWindowDimensions } from "react-native"
import { SvgXml } from "react-native-svg"

import { Text } from "@/components/UI/Text"
import {
  GeminiGeneratedScene,
  GeminiSceneAssetDefinition,
  GeminiSceneAssetStage,
  GeminiSceneItem,
} from "@/services/gemini/types"

interface GeneratedSceneCardProps {
  scene: GeminiGeneratedScene
  assetLookup: Record<string, GeminiSceneAssetDefinition>
}

function parseStageViewBox(stageViewBox: string) {
  const parts = stageViewBox.split(/\s+/).map(Number)
  if (parts.length !== 4 || parts.some((value) => Number.isNaN(value))) {
    return { width: 1000, height: 700 }
  }

  return {
    width: parts[2],
    height: parts[3],
  }
}

function getItemTransform(item: GeminiSceneItem) {
  if (!item.placement.rotation) return undefined

  return [{ rotate: `${item.placement.rotation}deg` }]
}

function formatStageLabel(stage?: GeminiSceneAssetStage) {
  switch (stage) {
    case "background":
      return "Building background"
    case "characters":
      return "Adding characters"
    case "objects":
      return "Adding objects"
    case "details":
      return "Adding details"
    default:
      return null
  }
}

export function GeneratedSceneCard({ scene, assetLookup }: GeneratedSceneCardProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions()
  const stageBounds = parseStageViewBox(scene.stageViewBox)
  const scale = Math.min((screenWidth * 0.6) / stageBounds.width, (screenHeight * 0.6) / stageBounds.height)
  const stageWidth = Math.round(stageBounds.width * scale)
  const stageHeight = Math.round(stageBounds.height * scale)
  const cardWidth = stageWidth + 32
  const assetPlanLookup = Object.fromEntries(scene.assetPlans.map((assetPlan) => [assetPlan.assetId, assetPlan]))
  const orderedItems = [...scene.items].sort((left, right) => left.placement.zIndex - right.placement.zIndex)

  return (
    <View style={[$card, { width: cardWidth }] }>
      <View style={$frame}>
        <View style={[$stage, { width: stageWidth, height: stageHeight, backgroundColor: scene.backgroundColor ?? "#EAF8FF" }]}>
          {orderedItems.map((item, index) => {
            const asset = assetLookup[item.assetId]
            const scaledLeft = item.placement.x * scale
            const scaledTop = item.placement.y * scale
            const scaledWidth = item.placement.width * scale
            const scaledHeight = item.placement.height * scale

            if (!asset) {
              if (!scene.pendingAssetIds.includes(item.assetId) && !scene.failedAssetIds.includes(item.assetId)) {
                return null
              }

              return (
                <View
                  key={`${scene.sceneId}-${item.assetId}-${index}`}
                  style={[
                    $pendingItem,
                    {
                      left: scaledLeft,
                      top: scaledTop,
                      width: scaledWidth,
                      height: scaledHeight,
                      zIndex: item.placement.zIndex,
                      transform: getItemTransform(item),
                    },
                  ]}
                >
                  <Text
                    text={
                      scene.failedAssetIds.includes(item.assetId)
                        ? `failed ${assetPlanLookup[item.assetId]?.role ?? item.assetId}`
                        : `building ${assetPlanLookup[item.assetId]?.role ?? item.assetId}`
                    }
                    style={$pendingText}
                    size="xxs"
                  />
                </View>
              )
            }

            return (
              <View
                key={`${scene.sceneId}-${item.assetId}-${index}`}
                style={[
                  $item,
                  {
                    left: scaledLeft,
                    top: scaledTop,
                    width: scaledWidth,
                    height: scaledHeight,
                    zIndex: item.placement.zIndex,
                    transform: getItemTransform(item),
                  },
                ]}
              >
                <SvgXml xml={asset.svgMarkup} width="100%" height="100%" />
              </View>
            )
          })}
        </View>
      </View>

      <Text text={scene.prompt} style={$promptCaption} numberOfLines={2} />
      <Text text={scene.summary} style={$summaryCaption} numberOfLines={2} />
      {!!formatStageLabel(scene.currentStage) && !!scene.pendingAssetIds.length && (
        <Text text={formatStageLabel(scene.currentStage) ?? ""} style={$stageCaption} numberOfLines={1} />
      )}
      {!!scene.pendingAssetIds.length && (
        <Text
          text={`Building ${scene.pendingAssetIds.length} asset${scene.pendingAssetIds.length === 1 ? "" : "s"}...`}
          style={$buildingCaption}
          numberOfLines={1}
        />
      )}
      {!!scene.reusedAssetIds.length && (
        <Text
          text={`Reused: ${scene.reusedAssetIds.join(", ")}`}
          style={$reusedCaption}
          numberOfLines={2}
        />
      )}
    </View>
  )
}

const $card: ViewStyle = {
  alignItems: "center",
}

const $frame: ViewStyle = {
  width: "100%",
  borderWidth: 1,
  borderRadius: 28,
  borderColor: "#F8C25C",
  backgroundColor: "#FFF9E8",
  padding: 12,
  shadowColor: "#D97706",
  shadowOpacity: 0.14,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
}

const $stage: ViewStyle = {
  alignSelf: "center",
  overflow: "hidden",
  position: "relative",
  borderRadius: 20,
}

const $item: ViewStyle = {
  position: "absolute",
}

const $pendingItem: ViewStyle = {
  position: "absolute",
  borderRadius: 18,
  borderWidth: 1,
  borderStyle: "dashed",
  borderColor: "#F8C25C",
  backgroundColor: "rgba(255, 249, 232, 0.92)",
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 8,
}

const $promptCaption: TextStyle = {
  marginTop: 10,
  textAlign: "center",
  color: "#5B4A25",
}

const $summaryCaption: TextStyle = {
  marginTop: 4,
  textAlign: "center",
  color: "#6B7280",
}

const $pendingText: TextStyle = {
  textAlign: "center",
  color: "#8B5E12",
}

const $buildingCaption: TextStyle = {
  marginTop: 4,
  textAlign: "center",
  color: "#A16207",
}

const $stageCaption: TextStyle = {
  marginTop: 4,
  textAlign: "center",
  color: "#2563EB",
}

const $reusedCaption: TextStyle = {
  marginTop: 4,
  textAlign: "center",
  color: "#8B5E12",
}