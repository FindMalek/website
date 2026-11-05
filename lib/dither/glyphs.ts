export const RAMPS = {
  ascii: " .:-=+*#%@",
  code: " .:;t%S8#@",
  dust: " ·.:;+",
  binary: " 01",
} as const

export type RampName = keyof typeof RAMPS

export function glyphAt(ramp: string, index: number): string {
  return ramp[Math.min(ramp.length - 1, Math.max(0, index))]
}

// Punctuation used while a cell is "in flight" (scattered or not yet resolved).
export const SCATTER = "+*/\\|<>=~^%$#&?!;:"
