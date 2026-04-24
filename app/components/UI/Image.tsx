import { Image as ExpoImage } from "expo-image"
import { ImageStyle, Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import { SvgUri } from "react-native-svg"

type ImageContentFit = "contain" | "cover"

interface ImageProps {
  uri: string
  style?: StyleProp<ViewStyle>
  contentFit?: ImageContentFit
}

export function Image({ uri, style, contentFit = "contain" }: ImageProps) {
  return (
    <View style={style}>
      {Platform.OS === "web" ? (
        <ExpoImage source={uri} style={$imageAsset} contentFit={contentFit} />
      ) : (
        <SvgUri
          uri={uri}
          width="100%"
          height="100%"
          preserveAspectRatio={contentFit === "cover" ? "xMidYMid slice" : "xMidYMid meet"}
        />
      )}
    </View>
  )
}

const $imageAsset: ImageStyle = {
  ...StyleSheet.absoluteFillObject,
}