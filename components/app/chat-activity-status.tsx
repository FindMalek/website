"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { Icons } from "@/components/shared/icons"

export function ChatActivityStatus({ label }: { label: string | null }) {
  const reducedMotion = useReducedMotion()
  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      <AnimatePresence initial={false} mode="wait">
        {label && (
          <motion.div
            key={label}
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reducedMotion ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.12 }}
            className="text-muted-foreground flex min-h-7 items-center gap-2 text-xs"
          >
            <Icons.spinner
              aria-hidden="true"
              className="size-3.5 animate-spin motion-reduce:animate-none"
            />
            <span>{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
