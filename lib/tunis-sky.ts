import { TIMEZONE } from "@/config/site"
import { BRAND_STOPS } from "@/lib/wordmark-canvas"

export type SkyPhase = "dawn" | "day" | "dusk" | "night"

export type TunisSky = {
  phase: SkyPhase
  stops: string[]
  time: string
}

type Stops = readonly [string, string, string, string]

// Every keyframe stays inside the brand's green → cyan → blue → violet range,
// so the sky shifts mood without ever leaving the site's palette.
const SKY_PALETTES: Record<SkyPhase, Stops> = {
  dawn: ["#e3ff9e", "#02ff84", "#2ef0c6", "#00c8ff"],
  day: [BRAND_STOPS[0], BRAND_STOPS[1], BRAND_STOPS[2], BRAND_STOPS[3]],
  dusk: ["#00a6ff", "#3002ff", "#7a2cff", "#e040fb"],
  night: ["#22d3ee", "#3a4bd8", "#4b2fd6", "#6a35ff"],
}

// Rough Tunis daylight (36.8°N): sunrise ~05:50 / sunset ~19:30 in June,
// ~07:25 / ~17:10 in December. A cosine over the year is accurate enough.
const SUNRISE_MEAN = 6.6
const SUNRISE_SWING = 0.85
const SUNSET_MEAN = 18.2
const SUNSET_SWING = 1.15
const WINTER_SOLSTICE_DAY = 355

const NIGHT_TO_DAWN = 1.25
const DAWN_TO_DAY = 1.75
const DAY_TO_DUSK = 1.5
const DUSK_TO_NIGHT = 1.25

const TUNIS_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
})

type TunisClock = { hour: number; minute: number; dayOfYear: number }

function readTunisClock(date: Date): TunisClock {
  const parts: Record<string, number> = {}
  for (const part of TUNIS_PARTS.formatToParts(date)) {
    if (part.type !== "literal") parts[part.type] = Number(part.value)
  }
  const startOfYear = Date.UTC(parts.year, 0, 1)
  const today = Date.UTC(parts.year, parts.month - 1, parts.day)
  return {
    hour: parts.hour % 24,
    minute: parts.minute,
    dayOfYear: Math.round((today - startOfYear) / 86_400_000) + 1,
  }
}

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")}`
}

function smoothstep(value: number): number {
  const t = Math.min(1, Math.max(0, value))
  return t * t * (3 - 2 * t)
}

function blendStops(from: Stops, to: Stops, amount: number): string[] {
  const t = smoothstep(amount)
  return from.map((stop, i) => {
    const a = hexToRgb(stop)
    const b = hexToRgb(to[i])
    return rgbToHex([
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ])
  })
}

export function getTunisDaylight(dayOfYear: number): {
  sunrise: number
  sunset: number
} {
  const season = Math.cos(
    (2 * Math.PI * (dayOfYear - WINTER_SOLSTICE_DAY)) / 365
  )
  return {
    sunrise: SUNRISE_MEAN + SUNRISE_SWING * season,
    sunset: SUNSET_MEAN - SUNSET_SWING * season,
  }
}

function skyStops(hour: number, sunrise: number, sunset: number): string[] {
  const { dawn, day, dusk, night } = SKY_PALETTES
  if (hour < sunrise - NIGHT_TO_DAWN) return [...night]
  if (hour < sunrise) {
    return blendStops(night, dawn, 1 - (sunrise - hour) / NIGHT_TO_DAWN)
  }
  if (hour < sunrise + DAWN_TO_DAY) {
    return blendStops(dawn, day, (hour - sunrise) / DAWN_TO_DAY)
  }
  if (hour < sunset - DAY_TO_DUSK) return [...day]
  if (hour < sunset) {
    return blendStops(day, dusk, 1 - (sunset - hour) / DAY_TO_DUSK)
  }
  if (hour < sunset + DUSK_TO_NIGHT) {
    return blendStops(dusk, night, (hour - sunset) / DUSK_TO_NIGHT)
  }
  return [...night]
}

function skyPhase(hour: number, sunrise: number, sunset: number): SkyPhase {
  if (hour < sunrise - NIGHT_TO_DAWN / 2) return "night"
  if (hour < sunrise + DAWN_TO_DAY / 2) return "dawn"
  if (hour < sunset - DAY_TO_DUSK / 2) return "day"
  if (hour < sunset + DUSK_TO_NIGHT / 2) return "dusk"
  return "night"
}

export function getTunisSky(date: Date = new Date()): TunisSky {
  const { hour, minute, dayOfYear } = readTunisClock(date)
  const { sunrise, sunset } = getTunisDaylight(dayOfYear)
  const fractionalHour = hour + minute / 60
  return {
    phase: skyPhase(fractionalHour, sunrise, sunset),
    stops: skyStops(fractionalHour, sunrise, sunset),
    time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  }
}
