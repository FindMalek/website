"use client"

import { useEffect, useState, type CSSProperties, type ReactNode } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"

import { purplePurse } from "@/config/fonts"
import { cn } from "@/lib/utils"

// Hole centers sit exactly on the edges because every stamp size is a multiple
// of the 8px tile; the solid inner layer fills everything but the edge bites.
const PERFORATED_EDGE =
  "radial-gradient(circle at center, transparent 2.6px, black 3.1px) -4px -4px / 8px 8px round, linear-gradient(black, black) center / calc(100% - 7px) calc(100% - 7px) no-repeat"

const INK = "#d4512c"

type Jitter = { x: number; y: number; rotate: number }

function StampPaper({
  width,
  height,
  children,
}: {
  width: number
  height: number
  children: ReactNode
}) {
  return (
    <div className="drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.22)]">
      <div
        className="bg-[#fbf8f1] p-[7px] dark:bg-[#ddd6c6]"
        style={{
          width,
          height,
          mask: PERFORATED_EDGE,
          WebkitMask: PERFORATED_EDGE,
        }}
      >
        <div className="relative h-full w-full overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

function PhotoStamp({
  src,
  caption,
  value,
}: {
  src: string
  caption: string
  value: string
}) {
  return (
    <StampPaper width={72} height={88}>
      <Image
        src={src}
        alt=""
        fill
        sizes="72px"
        className="object-cover saturate-[.7] sepia-[.2]"
      />
      <span
        className={cn(
          purplePurse.className,
          "absolute right-1 top-0.5 text-[11px] leading-none text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]"
        )}
      >
        {value}
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-[#fbf8f1]/85 py-0.5 text-center text-[6px] font-semibold uppercase leading-none tracking-[0.18em] text-neutral-800">
        {caption}
      </span>
    </StampPaper>
  )
}

function TypeStamp() {
  return (
    <StampPaper width={64} height={72}>
      <div
        className="flex h-full w-full flex-col items-center justify-between py-1.5 text-[#fbf8f1]"
        style={{ backgroundColor: INK }}
      >
        <span className="text-[5.5px] font-semibold uppercase tracking-[0.2em]">
          Monastir
        </span>
        <span className={cn(purplePurse.className, "text-2xl leading-none")}>
          500
        </span>
        <span className="text-[5.5px] font-semibold uppercase tracking-[0.2em]">
          millimes
        </span>
      </div>
    </StampPaper>
  )
}

function Postmark() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      stroke="currentColor"
      className="text-neutral-700/45 dark:text-neutral-300/35"
    >
      <circle cx="28" cy="28" r="25" strokeWidth="1.4" />
      <circle cx="28" cy="28" r="17" strokeWidth="0.8" />
      <path id="postmark-arc" d="M 7 28 A 21 21 0 0 1 49 28" stroke="none" />
      <text
        fill="currentColor"
        stroke="none"
        fontSize="5.5"
        fontWeight="600"
        letterSpacing="1.2"
      >
        <textPath href="#postmark-arc" startOffset="50%" textAnchor="middle">
          FINDMALEK
        </textPath>
      </text>
      <text
        x="28"
        y="31"
        fill="currentColor"
        stroke="none"
        fontSize="7"
        fontWeight="700"
        textAnchor="middle"
      >
        TN
      </text>
    </svg>
  )
}

const STAMPS: Array<{ style: CSSProperties; rotate: number; node: ReactNode }> =
  [
    {
      style: { left: "-13%", top: "-12%" },
      rotate: -9,
      node: (
        <PhotoStamp
          src="/about/cappadocia-balloon-jobflow.jpg"
          caption="Kapadokya"
          value="25"
        />
      ),
    },
    {
      style: { left: "-12%", bottom: "4%" },
      rotate: 11,
      node: <TypeStamp />,
    },
    {
      style: { right: "-9%", bottom: "-17%" },
      rotate: 6,
      node: (
        <PhotoStamp
          src="/about/jbal-rsas-summit.jpg"
          caption="Jbal Rsas"
          value="795"
        />
      ),
    },
    {
      style: { left: "-18%", top: "8%" },
      rotate: -14,
      node: <Postmark />,
    },
  ]

function randomJitter(): Jitter {
  return {
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10,
    rotate: (Math.random() - 0.5) * 8,
  }
}

export function AboutOverviewStamps() {
  const prefersReducedMotion = useReducedMotion()
  const [jitter, setJitter] = useState<Jitter[] | null>(null)

  useEffect(() => {
    // Math.random() during render would differ between server and client, so
    // the per-load scatter is applied after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJitter(STAMPS.map(randomJitter))
  }, [])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {STAMPS.map(({ style, rotate, node }, index) => {
        const offset = jitter?.[index]
        return (
          <motion.div
            key={index}
            className="absolute"
            style={style}
            initial={{ opacity: 0, scale: 0.92, rotate }}
            animate={
              offset
                ? {
                    opacity: 1,
                    scale: 1,
                    x: offset.x,
                    y: offset.y,
                    rotate: rotate + offset.rotate,
                  }
                : undefined
            }
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.3 + index * 0.08,
                  }
            }
          >
            {node}
          </motion.div>
        )
      })}
    </div>
  )
}
