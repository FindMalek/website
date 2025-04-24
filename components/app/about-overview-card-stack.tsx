import { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"

import type { CardData } from "@/types"

interface CardProps {
  card: CardData
  index: number
  cycleCard: (id: number) => void
  totalCards: number
}

export function AboutOverviewCard({
  card,
  index,
  cycleCard,
  totalCards,
}: CardProps) {
  const zIndex = totalCards - index
  const yOffset = index * -15 // Vertical offset
  const xOffset = index * 30 // Horizontal offset

  // Track drag direction
  const [dragDirection, setDragDirection] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

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
      style={{
        zIndex,
        boxShadow: `0 ${10 + index * 5}px ${30 + index * 10}px rgba(0, 0, 0, 0.3)`,
        backgroundColor: card.backgroundColor,
      }}
      className="absolute left-0 top-0 h-full w-full cursor-grab overflow-hidden rounded-2xl active:cursor-grabbing"
      drag={index === 0} // Allow drag for the top card
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.9}
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
      whileDrag={{
        scale: 1.05,
        boxShadow: `0 ${15 + index * 5}px ${40 + index * 10}px rgba(0, 0, 0, 0.4)`,
      }}
    >
      <div
        className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl"
        style={{ color: card.textColor }}
      >
        {card.type === "image" ? (
          <div className="h-full w-full">
            <Image
              src={card.imageUrl || "/placeholder.svg"}
              alt="Card image"
              className="pointer-events-none h-full w-full object-cover"
              width={400}
              height={400}
            />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
            <h2 className="text-4xl font-bold">{card.text}</h2>
            {card.subtext && (
              <div className="mt-auto pb-8">
                <p className="text-md opacity-80">{card.subtext}</p>
              </div>
            )}
          </div>
        )}

        {/* Drag indicator for the top card */}
        {index === 0 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center">
            <motion.div
              className="h-1 w-10 rounded-full"
              style={{ backgroundColor: `${card.textColor}40` }}
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            />
          </div>
        )}
        {index === 0 && (
          <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />
        )}
      </div>
    </motion.div>
  )
}
