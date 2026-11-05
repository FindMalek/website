import { BAYER, type BayerSize } from "@/lib/dither/bayer"
import { cn } from "@/lib/utils"

const SHADES = [
  "bg-foreground/5",
  "bg-foreground/10",
  "bg-foreground/20",
  "bg-foreground/30",
  "bg-foreground/40",
  "bg-foreground/50",
  "bg-foreground/60",
  "bg-foreground/75",
]

const COLUMNS: Record<BayerSize, string> = {
  2: "grid-cols-2",
  4: "grid-cols-4",
  8: "grid-cols-8",
}

/** A Bayer threshold matrix: each cell is its rank, shaded by that rank. */
export function BayerGrid({ size }: { size: BayerSize }) {
  const matrix = BAYER[size]
  const count = size * size

  return (
    <div
      className={cn(
        "border-line grid w-full max-w-48 overflow-hidden rounded-sm border font-mono",
        COLUMNS[size],
        "text-xs"
      )}
      role="img"
      aria-label={`${size} by ${size} Bayer threshold matrix`}
    >
      {Array.from(matrix, (v, i) => {
        const rank = Math.round(v * count - 0.5)
        return (
          <span
            key={i}
            className={cn(
              "flex aspect-square items-center justify-center",
              SHADES[Math.min(SHADES.length - 1, Math.floor(v * SHADES.length))]
            )}
          >
            {size < 8 && rank}
          </span>
        )
      })}
    </div>
  )
}
