export interface DateRange {
  start: number
  end: number
}

const dayCache = new Map<string, LunarDay[]>()

interface LunarDay {
  key: number
  month: string
  day: number
  leap: boolean
}

export function toDayKey(date: Date): number {
  return (
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  )
}

function fromDayKey(key: number): Date {
  return new Date(
    Math.floor(key / 10000),
    Math.floor((key % 10000) / 100) - 1,
    key % 100,
    12
  )
}

export function shiftDayKey(key: number, days: number): number {
  const date = fromDayKey(key)
  date.setDate(date.getDate() + days)
  return toDayKey(date)
}

export function fixedRange(
  year: number,
  from: [month: number, day: number],
  to: [month: number, day: number]
): DateRange {
  const endYear = to[0] < from[0] ? year + 1 : year
  return {
    start: year * 10000 + from[0] * 100 + from[1],
    end: endYear * 10000 + to[0] * 100 + to[1],
  }
}

export function aroundDay(
  key: number,
  before: number,
  after: number
): DateRange {
  return { start: shiftDayKey(key, -before), end: shiftDayKey(key, after) }
}

export function nthWeekdayKey(
  year: number,
  month: number,
  weekday: number,
  nth: number
): number {
  const first = new Date(year, month - 1, 1, 12)
  const offset = (weekday - first.getDay() + 7) % 7
  return year * 10000 + month * 100 + 1 + offset + (nth - 1) * 7
}

// Intl ships the Hijri and Chinese calendars, so these never go stale.
function lunarDays(year: number, calendar: string): LunarDay[] {
  const cacheKey = `${calendar}-${year}`
  const cached = dayCache.get(cacheKey)
  if (cached) return cached

  const formatter = new Intl.DateTimeFormat(`en-u-ca-${calendar}`, {
    month: "numeric",
    day: "numeric",
  })
  const days: LunarDay[] = []
  for (
    let date = new Date(year, 0, 1, 12);
    date.getFullYear() === year;
    date.setDate(date.getDate() + 1)
  ) {
    const parts = formatter.formatToParts(date)
    const month = parts.find((part) => part.type === "month")?.value ?? ""
    const day = parts.find((part) => part.type === "day")?.value ?? ""
    days.push({
      key: toDayKey(date),
      month: month.replace(/^(\d+)\D+$/, "$1"),
      day: Number.parseInt(day, 10),
      leap: /^\d+\D/.test(month),
    })
  }
  dayCache.set(cacheKey, days)
  return days
}

interface LunarSpec {
  calendar: "islamic-umalqura" | "chinese"
  month: string
  fromDay: number
  toDay: number
  before?: number
  after?: number
}

export function lunarRanges(year: number, spec: LunarSpec): DateRange[] {
  const matches = lunarDays(year, spec.calendar).filter(
    (d) =>
      !d.leap &&
      d.month === spec.month &&
      d.day >= spec.fromDay &&
      d.day <= spec.toDay
  )

  const runs: DateRange[] = []
  for (const { key } of matches) {
    const last = runs[runs.length - 1]
    if (last && shiftDayKey(last.end, 1) === key) last.end = key
    else runs.push({ start: key, end: key })
  }

  return runs.map((run) => ({
    start: shiftDayKey(run.start, -(spec.before ?? 0)),
    end: shiftDayKey(run.end, spec.after ?? 0),
  }))
}
