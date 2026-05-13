/**
 * SHEETS – the content for each page leaf in the book.
 * front / back are hex color strings used as material colors.
 * Replace with textures or React content as needed.
 */
export const SHEETS = [
  { front: "#b5803a", back: "#f2d898" }, // front cover
  { front: "#f8f3ea", back: "#f5f0e5" }, // page spread 1
  { front: "#f5f0e5", back: "#f0eada" }, // page spread 2
  { front: "#f0eada", back: "#d4a853" }, // page spread 3
  { front: "#d4a853", back: "#8c6020" }, // back cover
]

export const pages = SHEETS.map((sheet) => ({
  front: sheet.front,
  back: sheet.back,
}))
