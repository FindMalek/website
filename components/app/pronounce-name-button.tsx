"use client"

import { useRef } from "react"

import { cn } from "@/lib/utils"

import { Icons } from "@/components/shared/icons"

interface PronounceNameButtonProps {
  name: string
  className?: string
}

const AUDIO_SRC = "/audio/name-pronunciation.mp3"

function speakFallback(name: string) {
  if (!("speechSynthesis" in window)) return
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(name))
}

export function PronounceNameButton({
  name,
  className,
}: PronounceNameButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleClick = () => {
    const audio = audioRef.current
    if (!audio) {
      speakFallback(name)
      return
    }

    audio.currentTime = 0
    // play() returns a rejectable promise (autoplay policies, network
    // failure loading the file, etc.) -- fall back to speechSynthesis
    // rather than leaving the click silently do nothing.
    audio.play().catch(() => speakFallback(name))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Pronounce ${name}`}
      className={cn(
        "text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors",
        className
      )}
    >
      <audio ref={audioRef} src={AUDIO_SRC} preload="none" />
      <Icons.volume className="size-4.5" aria-hidden />
    </button>
  )
}
