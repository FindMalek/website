"use client"

import { memo, useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

type Edge = { x0: number; z0: number; x1: number; z1: number }

type LetterGeometry = {
  centerX: number
  frontPath: string
  outline: Edge[]
  topWalls: Edge[]
  rightWalls: Edge[]
}

// Every glyph is edge-connected: diagonals step in runs that share an edge,
// never just a corner, or the extruded solids would look broken apart.
const GLYPHS: Record<string, string[]> = {
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  I: ["###", ".#.", ".#.", ".#.", ".#.", ".#.", "###"],
  N: ["##...#", "###..#", "#.##.#", "#..###", "#...##", "#....#", "#....#"],
  D: ["####.", "#..##", "#...#", "#...#", "#...#", "#..##", "####."],
  M: [
    "##...##",
    "###.###",
    "#.###.#",
    "#..#..#",
    "#.....#",
    "#.....#",
    "#.....#",
  ],
  A: [".###.", "##.##", "#...#", "#...#", "#####", "#...#", "#...#"],
  L: ["#...", "#...", "#...", "#...", "#...", "#...", "####"],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  K: ["#...#", "#..##", "#.##.", "###..", "#.##.", "#..##", "#...#"],
}

const WORD = "FINDMALEK"
const ROWS = 7
const LETTER_GAP = 1
const UNIT = 10
const PAD = 0.5

const DEPTH_ANGLE = (35 * Math.PI) / 180
const DEPTH_X = Math.cos(DEPTH_ANGLE)
const DEPTH_Y = Math.sin(DEPTH_ANGLE)
const REST_DEPTH = 1.1
const PEAK_DEPTH = 2
const POINTER_SPREAD = 6

const SPRING_STIFFNESS = 170
const SPRING_DAMPING = 2 * Math.sqrt(SPRING_STIFFNESS) * 0.75
const SETTLE_EPSILON = 0.001

function mergeRuns(
  keys: number[][],
  makeEdge: (fixed: number, from: number, to: number) => Edge
): Edge[] {
  const byFixed = new Map<number, number[]>()
  for (const [fixed, step] of keys) {
    byFixed.set(fixed, [...(byFixed.get(fixed) ?? []), step])
  }

  const edges: Edge[] = []
  for (const [fixed, steps] of byFixed) {
    steps.sort((a, b) => a - b)
    let start = steps[0]
    for (let i = 1; i <= steps.length; i++) {
      if (steps[i] !== steps[i - 1] + 1) {
        edges.push(makeEdge(fixed, start, steps[i - 1] + 1))
        start = steps[i]
      }
    }
  }
  return edges
}

function buildLetter(rows: string[], offsetX: number): LetterGeometry {
  const cells = new Set<string>()
  const list: [number, number][] = []
  rows.forEach((row, r) => {
    ;[...row].forEach((char, c) => {
      if (char !== "#") return
      const x = offsetX + c
      const z = ROWS - 1 - r
      cells.add(`${x},${z}`)
      list.push([x, z])
    })
  })
  const has = (x: number, z: number): boolean => cells.has(`${x},${z}`)

  const top: number[][] = []
  const bottom: number[][] = []
  const left: number[][] = []
  const right: number[][] = []
  for (const [x, z] of list) {
    if (!has(x, z + 1)) top.push([z + 1, x])
    if (!has(x, z - 1)) bottom.push([z, x])
    if (!has(x - 1, z)) left.push([x, z])
    if (!has(x + 1, z)) right.push([x + 1, z])
  }

  const horizontal = (z: number, a: number, b: number): Edge => ({
    x0: a,
    z0: z,
    x1: b,
    z1: z,
  })
  const vertical = (x: number, a: number, b: number): Edge => ({
    x0: x,
    z0: a,
    x1: x,
    z1: b,
  })

  const topWalls = mergeRuns(top, horizontal).sort((a, b) => a.z0 - b.z0)
  const rightWalls = mergeRuns(right, vertical).sort((a, b) => a.x0 - b.x0)

  return {
    centerX: offsetX + rows[0].length / 2,
    frontPath: list
      .map(([x, z]) => {
        const [px, py] = project(x, z, 0)
        return `M${px} ${py}h${UNIT}v${-UNIT}h${-UNIT}Z`
      })
      .join(""),
    outline: [
      ...topWalls,
      ...mergeRuns(bottom, horizontal),
      ...mergeRuns(left, vertical),
      ...rightWalls,
    ],
    topWalls,
    rightWalls,
  }
}

function project(x: number, z: number, depth: number): [number, number] {
  return [
    (PAD + x + depth * DEPTH_X) * UNIT,
    (PAD + PEAK_DEPTH * DEPTH_Y + ROWS - z - depth * DEPTH_Y) * UNIT,
  ]
}

function buildWord(): { letters: LetterGeometry[]; columns: number } {
  let cursor = 0
  const letters = [...WORD].map((char) => {
    const glyph = GLYPHS[char]
    const letter = buildLetter(glyph, cursor)
    cursor += glyph[0].length + LETTER_GAP
    return letter
  })
  return { letters, columns: cursor - LETTER_GAP }
}

const { letters: LETTERS, columns: COLUMNS } = buildWord()
const VIEW_WIDTH = (COLUMNS + PEAK_DEPTH * DEPTH_X + PAD * 2) * UNIT
const VIEW_HEIGHT = (ROWS + PEAK_DEPTH * DEPTH_Y + PAD * 2) * UNIT

function wallPoints(edge: Edge, depth: number): string {
  return [
    project(edge.x0, edge.z0, 0),
    project(edge.x1, edge.z1, 0),
    project(edge.x1, edge.z1, depth),
    project(edge.x0, edge.z0, depth),
  ]
    .map(([px, py]) => `${px},${py}`)
    .join(" ")
}

function edgePath(edges: Edge[]): string {
  return edges
    .map((edge) => {
      const [ax, ay] = project(edge.x0, edge.z0, 0)
      const [bx, by] = project(edge.x1, edge.z1, 0)
      return `M${ax} ${ay}L${bx} ${by}`
    })
    .join("")
}

// Painter's order holds per letter: walls only ever recede behind the front
// plane, so they go first and the front face covers whatever they overlap.
const Letter = memo(function Letter({
  geometry,
  depth,
}: {
  geometry: LetterGeometry
  depth: number
}) {
  return (
    <g>
      <g className="fill-background stroke-foreground/45">
        {[...geometry.topWalls, ...geometry.rightWalls].map((edge) => (
          <polygon
            key={`${edge.x0},${edge.z0},${edge.x1},${edge.z1}`}
            points={wallPoints(edge, depth)}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />
        ))}
      </g>
      <path d={geometry.frontPath} className="fill-background" />
      <path d={geometry.frontPath} fill="url(#footer-wordmark-hatch)" />
      <path
        d={edgePath(geometry.outline)}
        className="stroke-foreground/90"
        fill="none"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="square"
      />
    </g>
  )
})

function targetDepths(pointerX: number | null): number[] {
  return LETTERS.map((letter) => {
    if (pointerX === null) return REST_DEPTH
    const distance = (letter.centerX - pointerX) / POINTER_SPREAD
    return (
      REST_DEPTH + (PEAK_DEPTH - REST_DEPTH) * Math.exp(-distance * distance)
    )
  })
}

export function FooterWordmark() {
  const reduceMotion = useReducedMotion()
  const [depths, setDepths] = useState<number[]>(() => targetDepths(null))
  const depthsRef = useRef<number[]>(depths)
  const velocitiesRef = useRef<number[]>(LETTERS.map(() => 0))
  const targetsRef = useRef<number[]>(depths)
  const frameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  const aim = useCallback((pointerX: number | null) => {
    targetsRef.current = targetDepths(pointerX)
    if (frameRef.current !== null) return

    function step(time: number): void {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 1 / 30)
      lastTimeRef.current = time

      let settled = true
      const next = depthsRef.current.map((depth, i) => {
        const offset = targetsRef.current[i] - depth
        const velocity =
          velocitiesRef.current[i] +
          (SPRING_STIFFNESS * offset -
            SPRING_DAMPING * velocitiesRef.current[i]) *
            dt
        velocitiesRef.current[i] = velocity
        if (
          Math.abs(offset) > SETTLE_EPSILON ||
          Math.abs(velocity) > SETTLE_EPSILON
        ) {
          settled = false
        }
        return depth + velocity * dt
      })

      depthsRef.current = settled ? targetsRef.current : next
      setDepths(depthsRef.current)
      frameRef.current = settled ? null : requestAnimationFrame(step)
    }

    lastTimeRef.current = performance.now()
    frameRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    const viewX = ((event.clientX - rect.left) / rect.width) * VIEW_WIDTH
    aim(viewX / UNIT - PAD)
  }

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-auto w-full select-none"
      role="img"
      aria-label="FindMalek"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => !reduceMotion && aim(null)}
    >
      <defs>
        <pattern
          id="footer-wordmark-hatch"
          width={2.5}
          height={2.5}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
          className="text-foreground/35"
        >
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={2.5}
            stroke="currentColor"
            strokeWidth={0.4}
          />
        </pattern>
      </defs>
      {LETTERS.map((letter, i) => (
        <Letter key={i} geometry={letter} depth={depths[i]} />
      ))}
    </svg>
  )
}
