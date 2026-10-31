import {
  aroundDay,
  fixedRange,
  lunarRanges,
  nthWeekdayKey,
  toDayKey,
  type DateRange,
} from "@/lib/celebration-dates"

export interface Celebration {
  id: string
  name: string
  greeting: string
  emoji: string
  // auto: themes the site for everyone. offer: only shows the avatar badge
  // to visitors from `countries`; the theme turns on when they click it.
  mode: "auto" | "offer"
  countries: readonly string[]
  hue: number
  chroma: number
  glow: readonly [string, string, string, string]
  particles: readonly string[]
  motion: "fall" | "rise"
  ranges: (year: number) => DateRange[]
}

const MUSLIM_COUNTRIES = [
  "TN",
  "DZ",
  "MA",
  "LY",
  "EG",
  "SD",
  "MR",
  "SO",
  "DJ",
  "SN",
  "ML",
  "NE",
  "GM",
  "GN",
  "NG",
  "SA",
  "AE",
  "QA",
  "KW",
  "BH",
  "OM",
  "JO",
  "LB",
  "PS",
  "SY",
  "IQ",
  "YE",
  "TR",
  "PK",
  "BD",
  "AF",
  "IR",
  "ID",
  "MY",
  "BN",
  "MV",
  "AZ",
  "UZ",
  "KZ",
  "KG",
  "TJ",
  "TM",
  "AL",
  "BA",
  "XK",
] as const

const EAST_ASIA_LUNAR = [
  "CN",
  "TW",
  "HK",
  "MO",
  "SG",
  "MY",
  "VN",
  "KR",
  "ID",
  "TH",
  "PH",
  "MM",
] as const
const INDIAN_DIASPORA = [
  "IN",
  "NP",
  "LK",
  "SG",
  "MY",
  "MU",
  "FJ",
  "TT",
  "GY",
  "SR",
] as const

// Hindu festivals follow a lunisolar panchang Intl doesn't ship, so the
// dates are listed. Extend the table when it runs out.
const DIWALI: Record<number, number> = {
  2026: 20261108,
  2027: 20271029,
  2028: 20281017,
  2029: 20291105,
  2030: 20301026,
}
const HOLI: Record<number, number> = {
  2026: 20260304,
  2027: 20270322,
  2028: 20280311,
  2029: 20290228,
  2030: 20300320,
}

function fromTable(
  table: Record<number, number>,
  before: number,
  after: number
) {
  return (year: number): DateRange[] =>
    table[year] ? [aroundDay(table[year], before, after)] : []
}

export const CELEBRATIONS: readonly Celebration[] = [
  {
    id: "eid-al-fitr",
    name: "Eid al-Fitr",
    greeting: "Eid Mubarak! 🌙",
    emoji: "🌙",
    mode: "offer",
    countries: MUSLIM_COUNTRIES,
    hue: 165,
    chroma: 0.12,
    glow: ["#10b981", "#fbbf24", "#34d399", "#fde68a"],
    particles: ["🌙", "✨", "⭐", "🕌"],
    motion: "fall",
    ranges: (year) =>
      lunarRanges(year, {
        calendar: "islamic-umalqura",
        month: "10",
        fromDay: 1,
        toDay: 3,
        before: 1,
        after: 1,
      }),
  },
  {
    id: "eid-al-adha",
    name: "Eid al-Adha",
    greeting: "Eid Mubarak! 🕌",
    emoji: "🕌",
    mode: "offer",
    countries: MUSLIM_COUNTRIES,
    hue: 175,
    chroma: 0.11,
    glow: ["#14b8a6", "#f59e0b", "#5eead4", "#fcd34d"],
    particles: ["🌙", "🕌", "✨", "🐑"],
    motion: "fall",
    ranges: (year) =>
      lunarRanges(year, {
        calendar: "islamic-umalqura",
        month: "12",
        fromDay: 10,
        toDay: 13,
        before: 1,
        after: 1,
      }),
  },
  {
    id: "ramadan",
    name: "Ramadan",
    greeting: "Ramadan Kareem! 🌙",
    emoji: "🌙",
    mode: "auto",
    countries: [],
    hue: 285,
    chroma: 0.12,
    glow: ["#6d28d9", "#fbbf24", "#8b5cf6", "#fde68a"],
    particles: ["🌙", "⭐", "✨", "🏮"],
    motion: "fall",
    ranges: (year) =>
      lunarRanges(year, {
        calendar: "islamic-umalqura",
        month: "9",
        fromDay: 1,
        toDay: 30,
      }),
  },
  {
    id: "lunar-new-year",
    name: "Lunar New Year",
    greeting: "Happy Lunar New Year! 🧧",
    emoji: "🧧",
    mode: "offer",
    countries: EAST_ASIA_LUNAR,
    hue: 25,
    chroma: 0.2,
    glow: ["#ef4444", "#fbbf24", "#f97316", "#fde047"],
    particles: ["🧧", "🏮", "🐉", "✨"],
    motion: "fall",
    ranges: (year) =>
      lunarRanges(year, {
        calendar: "chinese",
        month: "1",
        fromDay: 1,
        toDay: 1,
        before: 1,
        after: 14,
      }),
  },
  {
    id: "mid-autumn",
    name: "Mid-Autumn Festival",
    greeting: "Happy Mid-Autumn Festival! 🥮",
    emoji: "🥮",
    mode: "offer",
    countries: ["CN", "TW", "HK", "MO", "VN", "SG", "MY"],
    hue: 80,
    chroma: 0.13,
    glow: ["#eab308", "#f97316", "#fde047", "#fb923c"],
    particles: ["🥮", "🌕", "🏮", "✨"],
    motion: "rise",
    ranges: (year) =>
      lunarRanges(year, {
        calendar: "chinese",
        month: "8",
        fromDay: 15,
        toDay: 15,
        before: 1,
        after: 1,
      }),
  },
  {
    id: "diwali",
    name: "Diwali",
    greeting: "Happy Diwali! 🪔",
    emoji: "🪔",
    mode: "offer",
    countries: INDIAN_DIASPORA,
    hue: 70,
    chroma: 0.16,
    glow: ["#f59e0b", "#ec4899", "#fbbf24", "#f472b6"],
    particles: ["🪔", "✨", "🎆", "🪔"],
    motion: "rise",
    ranges: fromTable(DIWALI, 2, 2),
  },
  {
    id: "holi",
    name: "Holi",
    greeting: "Happy Holi! 🎨",
    emoji: "🎨",
    mode: "offer",
    countries: ["IN", "NP", "MU", "FJ", "TT", "GY", "SR"],
    hue: 340,
    chroma: 0.19,
    glow: ["#ec4899", "#22d3ee", "#a3e635", "#facc15"],
    particles: ["🎨", "🌸", "💜", "💛"],
    motion: "fall",
    ranges: fromTable(HOLI, 1, 1),
  },
  {
    id: "songkran",
    name: "Songkran",
    greeting: "Happy Songkran! 💦",
    emoji: "💦",
    mode: "offer",
    countries: ["TH", "LA", "KH", "MM"],
    hue: 220,
    chroma: 0.15,
    glow: ["#0ea5e9", "#22d3ee", "#38bdf8", "#facc15"],
    particles: ["💦", "🌸", "🐘", "💧"],
    motion: "fall",
    ranges: (year) => [fixedRange(year, [4, 13], [4, 15])],
  },
  {
    id: "nowruz",
    name: "Nowruz",
    greeting: "Nowruz Mubarak! 🌷",
    emoji: "🌷",
    mode: "offer",
    countries: ["IR", "AF", "AZ", "TJ", "UZ", "TM", "KG", "KZ", "IQ"],
    hue: 150,
    chroma: 0.14,
    glow: ["#22c55e", "#f472b6", "#86efac", "#fbbf24"],
    particles: ["🌷", "🌱", "🐟", "✨"],
    motion: "rise",
    ranges: (year) => [fixedRange(year, [3, 19], [3, 22])],
  },
  {
    id: "thanksgiving",
    name: "Thanksgiving",
    greeting: "Happy Thanksgiving! 🦃",
    emoji: "🦃",
    mode: "offer",
    countries: ["US"],
    hue: 45,
    chroma: 0.13,
    glow: ["#b45309", "#f97316", "#d97706", "#fbbf24"],
    particles: ["🍂", "🦃", "🥧", "🍁"],
    motion: "fall",
    ranges: (year) => [aroundDay(nthWeekdayKey(year, 11, 4, 4), 2, 3)],
  },
  {
    id: "halloween",
    name: "Halloween",
    greeting: "Happy Halloween! 🎃",
    emoji: "🎃",
    mode: "auto",
    countries: [],
    hue: 55,
    chroma: 0.17,
    glow: ["#ff7a18", "#7c3aed", "#f97316", "#a855f7"],
    particles: ["🎃", "🦇", "👻", "🕸️"],
    motion: "fall",
    ranges: (year) => [fixedRange(year, [10, 24], [11, 1])],
  },
  {
    id: "christmas",
    name: "Christmas",
    greeting: "Merry Christmas! 🎄",
    emoji: "🎄",
    mode: "auto",
    countries: [],
    hue: 25,
    chroma: 0.17,
    glow: ["#dc2626", "#16a34a", "#ef4444", "#4ade80"],
    particles: ["❄️", "🎄", "⭐", "🎁"],
    motion: "fall",
    ranges: (year) => [fixedRange(year, [12, 18], [12, 26])],
  },
  {
    id: "new-year",
    name: "New Year",
    greeting: "Happy New Year! 🎉",
    emoji: "🎉",
    mode: "auto",
    countries: [],
    hue: 85,
    chroma: 0.14,
    glow: ["#fbbf24", "#a855f7", "#fde047", "#ec4899"],
    particles: ["🎉", "✨", "🥂", "🎆"],
    motion: "fall",
    ranges: (year) => [fixedRange(year, [12, 29], [1, 3])],
  },
  {
    id: "valentine",
    name: "Valentine's Day",
    greeting: "Happy Valentine's Day! 💘",
    emoji: "💘",
    mode: "auto",
    countries: [],
    hue: 5,
    chroma: 0.18,
    glow: ["#ff4d8d", "#ff9a9e", "#fb7185", "#fda4af"],
    particles: ["💖", "💘", "🌹", "💕"],
    motion: "rise",
    ranges: (year) => [fixedRange(year, [2, 10], [2, 15])],
  },
]

export function findCelebrationById(id: string): Celebration | undefined {
  return CELEBRATIONS.find((c) => c.id === id)
}

function isWithin(celebration: Celebration, day: number): boolean {
  const year = Math.floor(day / 10000)
  return [year - 1, year].some((y) =>
    celebration.ranges(y).some((r) => day >= r.start && day <= r.end)
  )
}

// Country-specific offers win over the global auto themes.
export function findActiveCelebration(
  now: Date,
  country: string | null
): Celebration | null {
  const day = toDayKey(now)
  const active = CELEBRATIONS.filter((c) => isWithin(c, day))
  return (
    active.find(
      (c) =>
        c.mode === "offer" && country !== null && c.countries.includes(country)
    ) ??
    active.find((c) => c.mode === "auto") ??
    null
  )
}
