import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"

import type { CardData } from "@/types"

import { cn } from "@/lib/utils"

const FLIP_SPRING = { stiffness: 140, damping: 17, mass: 1 }
const POINTER_SPRING = { stiffness: 220, damping: 24 }
const MAX_TILT_DEG = 7

interface CardProps {
  card: CardData
  index: number
  cycleCard: (id: number) => void
  totalCards: number
  isFlipped: boolean
  onFlipChange?: (isFlipped: boolean) => void
}

function CardSheen({
  glare,
  glareOpacity,
  shade,
}: {
  glare: MotionValue<string>
  glareOpacity: MotionValue<number>
  shade: MotionValue<number>
}) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-black"
        style={{ opacity: shade }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: glare, opacity: glareOpacity }}
      />
    </>
  )
}

function DragIndicator({
  color,
  animate,
}: {
  color: string
  animate: boolean
}) {
  return (
    <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center">
      <motion.div
        className="h-1 w-10 rounded-full"
        style={{ backgroundColor: `${color}40` }}
        animate={animate ? { y: [0, 5, 0] } : undefined}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
      />
    </div>
  )
}

export function AboutOverviewCard({
  card,
  index,
  cycleCard,
  totalCards,
  isFlipped,
  onFlipChange,
}: CardProps) {
  const zIndex = totalCards - index
  const yOffset = index * -15 // Vertical offset
  const xOffset = index * 30 // Horizontal offset

  // Track drag direction
  const [dragDirection, setDragDirection] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const canFlip = index === 0 && card.type === "image"
  const prefersReducedMotion = useReducedMotion()

  const flip = useSpring(0, FLIP_SPRING)
  const pointerX = useSpring(0, POINTER_SPRING)
  const pointerY = useSpring(0, POINTER_SPRING)
  const hover = useSpring(0, POINTER_SPRING)
  const lift = useSpring(0, POINTER_SPRING)

  useEffect(() => {
    const target = isFlipped ? 180 : 0
    if (prefersReducedMotion) flip.jump(target)
    else flip.set(target)
  }, [flip, isFlipped, prefersReducedMotion])

  const tiltX = useTransform(
    pointerY,
    [-0.5, 0.5],
    [MAX_TILT_DEG, -MAX_TILT_DEG]
  )
  const tiltY = useTransform(
    pointerX,
    [-0.5, 0.5],
    [-MAX_TILT_DEG, MAX_TILT_DEG]
  )

  const flipSin = useTransform(flip, (deg) => Math.sin((deg * Math.PI) / 180))
  // 0 when a face points at the viewer, 1 when the card is edge-on.
  const edgeOn = useTransform(flipSin, Math.abs)

  // The shadow lives on a flat plate under the card so it can narrow and slide
  // like a real silhouette while the card turns, instead of rotating with it.
  const shadowX = useTransform(() => flipSin.get() * 18 - pointerX.get() * 14)
  const shadowY = useTransform(
    () =>
      10 + index * 5 + edgeOn.get() * 10 + lift.get() * 8 - pointerY.get() * 10
  )
  const shadowScaleX = useTransform(flip, (deg) =>
    Math.max(0.15, Math.abs(Math.cos((deg * Math.PI) / 180)))
  )
  const shadowOpacity = useTransform(
    () => 0.32 - edgeOn.get() * 0.12 + lift.get() * 0.1
  )
  const shadowBlur = useTransform(
    () => 18 + index * 6 + edgeOn.get() * 14 + lift.get() * 10
  )
  const shadowFilter = useMotionTemplate`blur(${shadowBlur}px)`

  const glareX = useTransform(
    () => 50 + pointerX.get() * 90 - flipSin.get() * 70
  )
  const glareXMirrored = useTransform(glareX, (x) => 100 - x)
  const glareY = useTransform(() => 30 + pointerY.get() * 90)
  const frontGlare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.6), rgba(255,255,255,0) 60%)`
  const backGlare = useMotionTemplate`radial-gradient(circle at ${glareXMirrored}% ${glareY}%, rgba(255,255,255,0.6), rgba(255,255,255,0) 60%)`
  const glareOpacity = useTransform(() =>
    Math.min(1, hover.get() * 0.55 + edgeOn.get() * 0.9)
  )
  const shade = useTransform(edgeOn, [0, 1], [0, 0.45])

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
    hover.set(0)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 100, x: xOffset }}
      animate={{
        opacity: 1,
        y: yOffset,
        x: xOffset,
        scale: 1 - index * 0.04,
        rotateZ: index * -3, // Slight rotation for each card
      }}
      exit={{
        opacity: 0,
        x: dragDirection.x * 200,
        y: dragDirection.y * 200,
        transition: { duration: 0.5 },
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 50,
        mass: 1,
      }}
      style={{ zIndex, perspective: "1000px" }}
      className="absolute left-0 top-0 h-full w-full cursor-grab active:cursor-grabbing"
      drag={index === 0} // Allow drag for the top card
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.9}
      onPointerMove={(event) => {
        if (index !== 0 || prefersReducedMotion) return
        if (event.pointerType !== "mouse") return
        const rect = event.currentTarget.getBoundingClientRect()
        pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
        pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
        hover.set(1)
      }}
      onPointerLeave={resetPointer}
      onDragStart={() => {
        resetPointer()
        lift.set(1)
      }}
      onDrag={(_, info) => {
        if (index === 0) {
          // Track drag direction for exit animation
          setDragDirection({
            x: Math.abs(info.offset.x) > 10 ? Math.sign(info.offset.x) : 0,
            y: Math.abs(info.offset.y) > 10 ? Math.sign(info.offset.y) : 0,
          })
        }
      }}
      onDragEnd={(_, info) => {
        lift.set(0)
        if (index === 0) {
          const distance = Math.sqrt(
            Math.pow(info.offset.x, 2) + Math.pow(info.offset.y, 2)
          )
          if (distance > 100) {
            // Lower threshold to make swiping easier
            cycleCard(card.id)
          }
        }
      }}
      whileDrag={{ scale: 1.05 }}
      onTap={(event) => {
        if (!canFlip || !onFlipChange) return
        if ((event.target as HTMLElement)?.closest("a")) return
        onFlipChange(!isFlipped)
      }}
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-2xl bg-black"
        style={{
          x: shadowX,
          y: shadowY,
          scaleX: shadowScaleX,
          opacity: shadowOpacity,
          filter: shadowFilter,
        }}
      />

      <motion.div
        className="relative h-full w-full"
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          transformStyle: "preserve-3d",
          color: card.textColor,
        }}
      >
        {card.type === "image" ? (
          <motion.div
            className="relative h-full w-full"
            style={{ rotateY: flip, transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                backgroundColor: card.backgroundColor,
              }}
            >
              <Image
                src={card.imageUrl || "/placeholder.svg"}
                alt="Card image"
                className="pointer-events-none h-full w-full object-cover"
                width={400}
                height={400}
              />
              <CardSheen
                glare={frontGlare}
                glareOpacity={glareOpacity}
                shade={shade}
              />
              {index === 0 && (
                <DragIndicator
                  color={card.textColor}
                  animate={!prefersReducedMotion}
                />
              )}
            </div>
            <div
              className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl p-8 text-center"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                backgroundColor: card.backgroundColor,
              }}
            >
              <CardSheen
                glare={backGlare}
                glareOpacity={glareOpacity}
                shade={shade}
              />
              <p className="relative text-lg">{card.story}</p>
              {card.storyLink && (
                <Link
                  href={card.storyLink.href}
                  target="_blank"
                  className="relative mt-4 font-semibold underline underline-offset-2"
                  onClick={(event) => event.stopPropagation()}
                >
                  {card.storyLink.label}
                </Link>
              )}
            </div>
          </motion.div>
        ) : (
          <div
            className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl p-8 text-center"
            style={{ backgroundColor: card.backgroundColor }}
          >
            <CardSheen
              glare={frontGlare}
              glareOpacity={glareOpacity}
              shade={shade}
            />
            <h2 className="relative text-4xl font-bold">{card.text}</h2>
            {card.subtext && (
              <div className="relative mt-auto pb-8">
                <p className="text-md opacity-80">{card.subtext}</p>
              </div>
            )}
            {index === 0 && (
              <DragIndicator
                color={card.textColor}
                animate={!prefersReducedMotion}
              />
            )}
          </div>
        )}
      </motion.div>

      {index === 0 && (
        <div
          className={cn(
            "absolute inset-0 z-10 cursor-grab active:cursor-grabbing",
            isFlipped && "pointer-events-none"
          )}
        />
      )}
    </motion.div>
  )
}
