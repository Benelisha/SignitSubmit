const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F6FAFF",
  neutral300: "#E2ECFA",
  neutral400: "#C7D6EE",
  neutral500: "#8FA1BF",
  neutral600: "#617393",
  neutral700: "#33476E",
  neutral800: "#13244C",
  neutral900: "#091433",

  primary100: "#EAF8FF",
  primary200: "#CDEFFF",
  primary300: "#9EE2FF",
  primary400: "#65CFFF",
  primary500: "#34B6F3",
  primary600: "#1497E6",

  secondary100: "#EEF1FF",
  secondary200: "#DCE3FF",
  secondary300: "#B7C4FF",
  secondary400: "#7A92FF",
  secondary500: "#5C76F6",

  accent100: "#FFF7D6",
  accent200: "#FFECA1",
  accent300: "#FFDF73",
  accent400: "#FFD249",
  accent500: "#FFC52C",

  angry100: "#FFE2DE",
  angry500: "#D84A3A",

  overlay20: "rgba(9, 20, 51, 0.2)",
  overlay50: "rgba(9, 20, 51, 0.5)",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral100,
  /**
   * The default border color.
   */
  border: palette.neutral300,
  /**
   * The main tinting color.
   */
  tint: palette.secondary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral400,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   */
  errorBackground: palette.angry100,
  buttonDefaultSurface: "#FFFFFF",
  buttonDefaultOutline: "#D8E0E9",
  buttonDefaultText: "#211A4C",
  buttonSelectedSurface: "#EFF0FF",
  buttonSelectedOutline: "#688CF4",
  buttonSelectedText: "#688CF4",
  buttonFilledSurface: "#688CF4",
  buttonFilledOutline: "#4C71D8",
  buttonFilledText: "#FFFFFF",
  buttonDisabledSurface: palette.neutral200,
  buttonDisabledOutline: palette.neutral400,
  buttonDisabledText: palette.neutral500,
} as const
