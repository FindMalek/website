// Procedural Web Audio sound design for the Introduction Journey.
// Zero external audio files — every tick, detent, and harmonic is synthesized
// in real time with slight organic randomness so nothing ever sounds looped.

let audioContext: AudioContext | null = null
let lastTickAt = 0

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null
  audioContext ??= new AudioContext()
  if (audioContext.state === "suspended") {
    void audioContext.resume().catch(() => {})
  }
  return audioContext
}

export function playJourneyTick(charIndex = 0) {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  // Throttle to at most ~28 ticks/sec so fast typewriters feel tactile, not buzzy
  if (now - lastTickAt < 0.034) return
  lastTickAt = now

  const osc = ctx.createOscillator()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  // Subtle pentatonic-ish micro-variation + organic jitter
  const baseFreq = 520 + ((charIndex * 17) % 140) + (Math.random() * 24 - 12)
  osc.type = "triangle"
  osc.frequency.setValueAtTime(baseFreq, now)
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.018)

  filter.type = "bandpass"
  filter.frequency.setValueAtTime(1450, now)
  filter.Q.value = 1.8

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.linearRampToValueAtTime(0.022, now + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022)

  osc.connect(filter).connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.024)
}

export function playJourneyStep(direction: "next" | "prev" = "next") {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  const startHz = direction === "next" ? 220 : 185
  const endHz = direction === "next" ? 330 : 140

  osc.type = "sine"
  osc.frequency.setValueAtTime(startHz, now)
  osc.frequency.exponentialRampToValueAtTime(endHz, now + 0.065)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.linearRampToValueAtTime(0.055, now + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075)

  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.08)
}

export function playJourneyExpand() {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const notes = [330, 440]

  notes.forEach((freq, idx) => {
    const start = now + idx * 0.045
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(freq, start)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.02, start + 0.14)

    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.linearRampToValueAtTime(0.04, start + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16)

    osc.connect(gain).connect(ctx.destination)
    osc.start(start)
    osc.stop(start + 0.17)
  })
}

export function playJourneyOpen() {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const chord = [196, 293.66, 392] // G3, D4, G4 warm fifth

  chord.forEach((freq, idx) => {
    const start = now + idx * 0.035
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sine"
    osc.frequency.setValueAtTime(freq * 0.98, start)
    osc.frequency.exponentialRampToValueAtTime(freq, start + 0.24)

    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.linearRampToValueAtTime(0.035 / (idx + 1), start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32)

    osc.connect(gain).connect(ctx.destination)
    osc.start(start)
    osc.stop(start + 0.34)
  })
}

export function playJourneyClose() {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = "sine"
  osc.frequency.setValueAtTime(260, now)
  osc.frequency.exponentialRampToValueAtTime(110, now + 0.12)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.linearRampToValueAtTime(0.04, now + 0.006)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13)

  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.14)
}
