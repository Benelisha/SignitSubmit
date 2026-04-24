import {
  Nunito_300Light as nunitoLight,
  Nunito_400Regular as nunitoRegular,
  Nunito_500Medium as nunitoMedium,
  Nunito_600SemiBold as nunitoSemiBold,
  Nunito_700Bold as nunitoBold,
  Nunito_800ExtraBold as nunitoExtraBold,
} from "@expo-google-fonts/nunito"
import {
  Roboto_400Regular as robotoRegular,
  Roboto_500Medium as robotoMedium,
  Roboto_700Bold as robotoBold,
} from "@expo-google-fonts/roboto"

export const customFontsToLoad = {
  nunitoLight,
  nunitoRegular,
  nunitoMedium,
  nunitoSemiBold,
  nunitoBold,
  nunitoExtraBold,
  robotoRegular,
  robotoMedium,
  robotoBold,
}

const fonts = {
  nunito: {
    light: "nunitoLight",
    normal: "nunitoRegular",
    medium: "nunitoMedium",
    semiBold: "nunitoSemiBold",
    bold: "nunitoBold",
    extraBold: "nunitoExtraBold",
  },
  roboto: {
    normal: "robotoRegular",
    medium: "robotoMedium",
    bold: "robotoBold",
  },
}

export const typography = {
  fonts,
  sizes: {
    xxl: { fontSize: 34, lineHeight: 40 },
    xl: { fontSize: 28, lineHeight: 34 },
    lg: { fontSize: 22, lineHeight: 28 },
    md: { fontSize: 18, lineHeight: 24 },
    sm: { fontSize: 16, lineHeight: 22 },
    xs: { fontSize: 14, lineHeight: 20 },
    xxs: { fontSize: 12, lineHeight: 16 },
  },
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.nunito,
  /**
   * Fallback font.
   */
  secondary: fonts.roboto,
}
