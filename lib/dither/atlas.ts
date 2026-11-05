export type GlyphAtlas = {
  /** Blit one glyph, centred on (x, y) in CSS px. Sprites are drawn lazily. */
  draw: (
    ctx: CanvasRenderingContext2D,
    ch: string,
    color: number,
    x: number,
    y: number
  ) => void
}

type AtlasOptions = {
  font: string
  cellW: number
  cellH: number
  dpr: number
  chars: string[]
  /** CSS colours; `draw` takes an index into this list. */
  colors: string[]
}

const COLUMNS = 32

/**
 * A lazily filled sprite sheet of (glyph, colour) pairs. Drawing a glyph is
 * then a drawImage blit instead of a fillText, which is far cheaper when a
 * frame places hundreds of them.
 */
export function createGlyphAtlas(o: AtlasOptions): GlyphAtlas {
  const sw = Math.ceil(o.cellW * o.dpr)
  const sh = Math.ceil(o.cellH * o.dpr)
  const n = o.chars.length
  const slots = n * o.colors.length
  const canvas = document.createElement("canvas")
  canvas.width = COLUMNS * sw
  canvas.height = Math.ceil(slots / COLUMNS) * sh
  const actx = canvas.getContext("2d")
  if (actx) {
    actx.font = o.font.replace(/[\d.]+px/, `${(sh / 1.18).toFixed(2)}px`)
    actx.textAlign = "center"
    actx.textBaseline = "middle"
  }
  const drawn = new Uint8Array(slots)
  const index = new Map(o.chars.map((c, i) => [c, i]))

  return {
    draw(ctx, ch, color, x, y) {
      const ci = index.get(ch)
      if (ci === undefined || !actx) return
      const slot = color * n + ci
      const sx = (slot % COLUMNS) * sw
      const sy = Math.floor(slot / COLUMNS) * sh
      if (!drawn[slot]) {
        drawn[slot] = 1
        actx.fillStyle = o.colors[color]
        actx.fillText(ch, sx + sw / 2, sy + sh / 2)
      }
      ctx.drawImage(canvas, sx, sy, sw, sh, x - o.cellW / 2, y - o.cellH / 2, o.cellW, o.cellH)
    },
  }
}
