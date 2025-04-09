"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

import { PAGES } from "@/config/consts"
import { purplePurse } from "@/config/fonts"

function generateSquares(count: number, width: number, height: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    pos: [
      Math.floor((Math.random() * width) / 100),
      Math.floor((Math.random() * height) / 100),
    ],
  }))
}

export function Background() {
  const pathname = usePathname()
  const [pageLabel, setPageLabel] = useState("")
  const [squares, setSquares] = useState(() =>
    generateSquares(20, window.innerWidth, window.innerHeight)
  )

  useEffect(() => {
    const currentPage = Object.values(PAGES).find(
      (page) => page.path === pathname
    )
    setPageLabel(currentPage?.label || PAGES.NOT_FOUND.label)
  }, [pathname])

  const updateSquarePosition = (id: number) => {
    setSquares((currentSquares) =>
      currentSquares.map((sq) =>
        sq.id === id
          ? {
              ...sq,
              pos: [
                Math.floor((Math.random() * window.innerWidth) / 100),
                Math.floor((Math.random() * window.innerHeight) / 100),
              ],
            }
          : sq
      )
    )
  }

  return (
    <div className="fixed left-0 top-0 isolate -z-50 h-full w-full overflow-hidden dark:bg-gray-950">
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-gray-900/10 [mask-image:radial-gradient(110%_120%_at_top_right,white,transparent)] dark:stroke-white/10"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width={100}
            height={100}
            x={-1}
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 100V.5H100" fill="none" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
        />
        <svg x={-1} y={-1} className="overflow-visible">
          {squares.map(({ pos: [x, y], id }, index) => (
            <motion.rect
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{
                duration: 8,
                repeat: 1,
                delay: index * 0.2,
                repeatType: "reverse",
              }}
              onAnimationComplete={() => updateSquarePosition(id)}
              key={`${x}-${y}-${index}`}
              width={99}
              height={99}
              x={x * 100 + 1}
              y={y * 100 + 1}
              fill="currentColor"
              strokeWidth="0"
            />
          ))}
        </svg>
      </svg>
      <div className={purplePurse.className}>
        <h1
          className="fixed -bottom-24 -left-10 -z-40 text-[200px] font-bold text-gray-700/10 dark:text-gray-700/10"
          style={{ userSelect: "none" }}
        >
          {pageLabel}
        </h1>
      </div>

      <div
        className="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
        aria-hidden="true"
      >
        <div
          className="aspect-[1108/502] w-[69.25rem] bg-gradient-to-r from-[#02ff84] to-[#00a6ff] opacity-20"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
        <div
          className="aspect-[200/45] w-[20.25rem] bg-gradient-to-r from-[#3002ff] to-[#00ffff] opacity-90"
          style={{
            clipPath:
              "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
          }}
        />
      </div>
    </div>
  )
}
