"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const MIN_SELECTION_LENGTH = 20

interface HighlightSelection {
  text: string
  rect: DOMRect
}

/**
 * Selection-listener for highlight-to-ask, scoped to [data-ask-enabled]
 * content (see components/app/article-content.tsx). Only case-study pages
 * (/work/[slug], /projects/[slug]) render that wrapper, and this hook
 * gates on the route too rather than relying on DOM-query timing alone.
 */
export function useHighlightToAsk() {
  const pathname = usePathname()
  const enabled = /^\/(work|projects)\/.+/.test(pathname)
  const [selection, setSelection] = useState<HighlightSelection | null>(null)

  const evaluateSelection = useCallback(() => {
    const sel = window.getSelection()

    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setSelection(null)
      return
    }

    const text = sel.toString().trim()
    if (text.length < MIN_SELECTION_LENGTH) {
      setSelection(null)
      return
    }

    const anchorNode = sel.anchorNode
    const container =
      anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement

    if (!container?.closest("[data-ask-enabled]")) {
      setSelection(null)
      return
    }

    setSelection({ text, rect: sel.getRangeAt(0).getBoundingClientRect() })
  }, [])

  useEffect(() => {
    if (!enabled) return

    // mouseup (desktop drag-select) and touchend (mobile long-press-select)
    // -- not selectionchange, which fires continuously mid-drag and would
    // recompute bounding rects far more often than needed.
    document.addEventListener("mouseup", evaluateSelection)
    document.addEventListener("touchend", evaluateSelection)

    return () => {
      document.removeEventListener("mouseup", evaluateSelection)
      document.removeEventListener("touchend", evaluateSelection)
      setSelection(null)
    }
  }, [enabled, evaluateSelection])

  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges()
    setSelection(null)
  }, [])

  return { selection, clearSelection }
}
