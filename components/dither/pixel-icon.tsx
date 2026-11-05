import { BAYER } from "@/lib/dither/bayer"
import { cn } from "@/lib/utils"

type Px = { x: number; y: number }

const W = 15
const H = 12

/**
 * Pixel icons are built from a grid, and the "soft" parts are dithered with
 * the same Bayer matrix as everything else: a coverage of 1 is solid, 0.5 is a
 * checkerboard, and so on. That is what makes them read as part of the system.
 */
function arc(cx: number, cy: number, r0: number, r1: number, coverage: number): Px[] {
  const out: Px[] = []
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x + 0.5 - cx
      const dy = y + 0.5 - cy
      const d = Math.hypot(dx, dy)
      if (d < r0 || d > r1 || dx < 0.5) continue
      if (Math.abs(Math.atan2(dy, dx)) > 0.95) continue
      if (coverage >= 1 || (BAYER[4][(y & 3) * 4 + (x & 3)] ?? 0) < coverage) out.push({ x, y })
    }
  }
  return out
}

const BODY: Px[] = (() => {
  const out: Px[] = []
  for (let y = 4; y <= 7; y++) for (let x = 0; x <= 2; x++) out.push({ x, y })
  for (let x = 3; x <= 5; x++) {
    const reach = x - 2
    for (let y = 4 - reach; y <= 7 + reach; y++) out.push({ x, y })
  }
  return out
})()

const WAVE_NEAR = arc(5.5, 6, 3.6, 5.2, 0.8)
const WAVE_FAR = arc(5.5, 6, 6.6, 8.4, 0.45)

/**
 * A speaker with dithered sound waves. While `playing`, the waves step on and
 * off in turn (pure CSS, `.pixel-wave-*` in dither.css).
 */
export function SoundIcon({
  playing = false,
  className,
}: {
  playing?: boolean
  className?: string
}) {
  const rect = (p: Px) => <rect key={`${p.x}-${p.y}`} x={p.x} y={p.y} width={1} height={1} />
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      shapeRendering="crispEdges"
      fill="currentColor"
      data-playing={playing || undefined}
      className={cn("pixel-icon h-4 w-5", className)}
    >
      <g>{BODY.map(rect)}</g>
      <g className="pixel-wave-near">{WAVE_NEAR.map(rect)}</g>
      <g className="pixel-wave-far">{WAVE_FAR.map(rect)}</g>
    </svg>
  )
}

/** Draw any small bitmap as crisp pixels: `#` is on, anything else is off. */
export function PixelBitmap({
  rows,
  className,
}: {
  rows: string[]
  className?: string
}) {
  return (
    <svg
      viewBox={`0 0 ${rows[0].length} ${rows.length}`}
      aria-hidden="true"
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className}
    >
      {rows.flatMap((row, y) =>
        Array.from(row, (ch, x) =>
          ch === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null
        )
      )}
    </svg>
  )
}

const CHEVRON = ["#.....#", ".#...#.", "..#.#..", "...#..."]
const CLOSE = ["#.....#", ".#...#.", "..#.#..", "...#...", "..#.#..", ".#...#.", "#.....#"]

export const ChevronDownIcon = ({ className }: { className?: string }) => (
  <PixelBitmap rows={CHEVRON} className={cn("h-auto w-3", className)} />
)

export const CloseIcon = ({ className }: { className?: string }) => (
  <PixelBitmap rows={CLOSE} className={cn("size-4", className)} />
)
