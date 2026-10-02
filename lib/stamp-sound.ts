// Synthesized rather than sampled: no audio files to load or license, and a
// little randomness per play keeps a run of stamp drops from sounding looped.

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined" || !("AudioContext" in window)) return null
  audioContext ??= new AudioContext()
  // Browsers start the context suspended until a user gesture; every caller
  // here runs inside a pointer handler, so resuming is allowed.
  if (audioContext.state === "suspended") void audioContext.resume()
  return audioContext
}

// Mostly quiet hiss with sparse loud samples: through a band-pass this reads
// as adhesive crackle instead of plain white noise.
function createCrackleBuffer(
  context: AudioContext,
  seconds: number,
  density: number
): AudioBuffer {
  const length = Math.ceil(context.sampleRate * seconds)
  const buffer = context.createBuffer(1, length, context.sampleRate)
  const samples = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    samples[i] = Math.random() < density ? white : white * 0.12
  }
  return buffer
}

function playNoise(
  context: AudioContext,
  output: AudioNode,
  {
    at,
    duration,
    density,
    filter,
    fromHz,
    toHz,
    peak,
  }: {
    at: number
    duration: number
    density: number
    filter: BiquadFilterType
    fromHz: number
    toHz: number
    peak: number
  }
) {
  const source = context.createBufferSource()
  source.buffer = createCrackleBuffer(context, duration, density)

  const shaping = context.createBiquadFilter()
  shaping.type = filter
  shaping.Q.value = 0.9
  shaping.frequency.setValueAtTime(fromHz, at)
  shaping.frequency.exponentialRampToValueAtTime(toHz, at + duration)

  const gain = context.createGain()
  gain.gain.setValueAtTime(0.0001, at)
  gain.gain.exponentialRampToValueAtTime(
    peak,
    at + Math.min(0.012, duration / 4)
  )
  gain.gain.exponentialRampToValueAtTime(0.0001, at + duration)

  source.connect(shaping).connect(gain).connect(output)
  source.start(at)
  source.stop(at + duration)
}

function playThump(
  context: AudioContext,
  output: AudioNode,
  at: number,
  strength: number
) {
  const oscillator = context.createOscillator()
  oscillator.type = "sine"
  oscillator.frequency.setValueAtTime(140 + Math.random() * 40, at)
  oscillator.frequency.exponentialRampToValueAtTime(52, at + 0.08)

  const gain = context.createGain()
  gain.gain.setValueAtTime(0.0001, at)
  gain.gain.linearRampToValueAtTime(0.55 * strength, at + 0.004)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.11)

  oscillator.connect(gain).connect(output)
  oscillator.start(at)
  oscillator.stop(at + 0.12)
}

function createOutput(context: AudioContext, volume: number): GainNode {
  const output = context.createGain()
  output.gain.value = volume
  output.connect(context.destination)
  return output
}

// Peeling a stamp off its backing: a short rising crackle.
export function playStampPeel() {
  const context = getAudioContext()
  if (!context) return
  const output = createOutput(context, 0.35)
  const duration = 0.18 + Math.random() * 0.06

  playNoise(context, output, {
    at: context.currentTime,
    duration,
    density: 0.07,
    filter: "bandpass",
    fromHz: 700,
    toHz: 3600 + Math.random() * 600,
    peak: 0.9,
  })
}

// Sticking it down: a soft paper smack, then the thumb pressing it flat.
export function playStampStick() {
  const context = getAudioContext()
  if (!context) return
  const output = createOutput(context, 0.45)
  const now = context.currentTime

  playNoise(context, output, {
    at: now,
    duration: 0.035,
    density: 0.3,
    filter: "lowpass",
    fromHz: 2400,
    toHz: 900,
    peak: 0.7,
  })
  playThump(context, output, now, 1)
  playThump(context, output, now + 0.07 + Math.random() * 0.02, 0.5)
  playNoise(context, output, {
    at: now + 0.08,
    duration: 0.05,
    density: 0.04,
    filter: "bandpass",
    fromHz: 2600,
    toHz: 1800,
    peak: 0.25,
  })
}
