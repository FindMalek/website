"use client"

import { useState, type PointerEvent as ReactPointerEvent } from "react"
import Image from "next/image"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react"

import { playJourneyOpen } from "@/lib/journey-sound"
import { cn } from "@/lib/utils"

import { useIntroductionJourneyStart } from "@/components/app/introduction-journey-provider"

export function AvatarIntroTrigger({
  large = false,
  className,
}: {
  large?: boolean
  className?: string
}) {
  const { start } = useIntroductionJourneyStart()
  const prefersReducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, { stiffness: 280, damping: 22, mass: 0.5 })
  const springY = useSpring(rawY, { stiffness: 280, damping: 22, mass: 0.5 })

  const handlePointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    rawX.set((e.clientX - centerX) * 0.18)
    rawY.set((e.clientY - centerY) * 0.18)
  }

  const handlePointerLeave = () => {
    setIsHovered(false)
    rawX.set(0)
    rawY.set(0)
  }

  const handleLaunch = () => {
    playJourneyOpen()
    start()
  }

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <motion.button
        type="button"
        onClick={handleLaunch}
        onPointerEnter={() => setIsHovered(true)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onFocus={() => setIsHovered(true)}
        onBlur={handlePointerLeave}
        style={{
          x: prefersReducedMotion ? 0 : springX,
          y: prefersReducedMotion ? 0 : springY,
        }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
        aria-label="Want to experience something cool? Play the interactive introduction"
        className={cn(
          "group pointer-events-auto relative cursor-pointer rounded-full outline-none",
          "focus-visible:ring-ring focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2"
        )}
      >
        {/* Ambient glow ring */}
        <span
          aria-hidden
          className={cn(
            "bg-primary/30 absolute -inset-1.5 rounded-full blur-md transition-all duration-500",
            isHovered ? "bg-primary/55 scale-110 opacity-100" : "opacity-65"
          )}
        />

        {/* Precision rotating orbital ring */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          className={cn(
            "pointer-events-none absolute -inset-1.5 size-[calc(100%+12px)] transition-transform duration-700",
            !prefersReducedMotion && "animate-[spin_16s_linear_infinite]",
            isHovered ? "text-primary opacity-100" : "text-primary/50 opacity-75"
          )}
        >
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />
        </svg>

        <Image
          src="/about/author.png"
          alt="Malek Gara-Hellal avatar"
          sizes={large ? "4rem" : "2.25rem"}
          className={cn(
            "bg-background ring-border relative rounded-full object-cover ring-1",
            "transition-transform duration-300 ease-out group-hover:scale-[1.04] motion-reduce:transition-none",
            large
              ? "size-12 sm:size-12 md:size-16 xl:size-16"
              : "size-9 sm:size-9 md:size-9 lg:size-10 xl:size-10"
          )}
          width={300}
          height={300}
          priority
        />

        {/* Corner tactile play badge — visible on both mobile and desktop */}
        <span
          aria-hidden
          className={cn(
            "bg-foreground text-background ring-background absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full shadow-md ring-2 transition-transform duration-300",
            "group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110"
          )}
        >
          <svg
            viewBox="0 0 12 12"
            fill="currentColor"
            className="ml-0.5 size-2.5"
          >
            <path d="M2.5 1.75L10 6L2.5 10.25V1.75Z" />
          </svg>
        </span>
      </motion.button>

      {/* Bespoke editorial hover invitation */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            role="tooltip"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: -8, scale: 0.96, filter: "blur(4px)" }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: -6, scale: 0.96, filter: "blur(4px)" }
            }
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            onClick={handleLaunch}
            className={cn(
              "bg-popover/95 text-popover-foreground border-border/80 pointer-events-auto absolute top-1/2 left-[calc(100%+0.75rem)] z-50 -translate-y-1/2 cursor-pointer",
              "flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 shadow-xl backdrop-blur-md whitespace-nowrap"
            )}
          >
            {/* Animated mini equalizer bars */}
            <span aria-hidden className="flex h-3 items-end gap-0.5">
              <span className="bg-primary h-2 w-0.5 animate-[pulse_0.9s_ease-in-out_infinite] rounded-full" />
              <span className="bg-primary h-3 w-0.5 animate-[pulse_0.7s_ease-in-out_0.15s_infinite] rounded-full" />
              <span className="bg-primary h-1.5 w-0.5 animate-[pulse_1.1s_ease-in-out_0.3s_infinite] rounded-full" />
            </span>

            <span className="flex flex-col text-left leading-none">
              <span className="text-xs font-medium tracking-tight">
                want to experience something cool?
              </span>
              <span className="text-muted-foreground mt-0.5 font-mono text-[9px] tracking-[0.2em] uppercase">
                click to play · 2m intro
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
