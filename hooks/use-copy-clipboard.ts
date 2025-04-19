import { useCallback, useEffect, useState } from "react"

interface UseCopyClipboardOptions {
  duration?: number
}

export function useCopyClipboard({
  duration = 2000,
}: UseCopyClipboardOptions = {}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [copied, duration])

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }, [])

  return {
    copied,
    copy,
  }
}
