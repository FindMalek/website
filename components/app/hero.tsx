import { siteConfig } from "@/config/site"
import { getResumeData } from "@/lib/get-resume-data"

import { PronounceNameButton } from "@/components/app/pronounce-name-button"
import { RotatingSubtitle } from "@/components/app/rotating-subtitle"
import { DitherGalaxy } from "@/components/dither/dither-galaxy"
import { Avatar } from "@/components/shared/avatar"

export async function Hero() {
  const resumeData = await getResumeData()

  const SUBTITLE_LINES = [
    resumeData.basics.headline,
    "i like listening to music and coding :)",
  ]

  return (
    <section className="screen-line-bottom relative isolate flex min-h-96 flex-col justify-end px-4 pb-8 pt-28 sm:min-h-[28rem] simple:min-h-0 simple:pt-24">
      <div className="absolute -top-4 bottom-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden simple:hidden">
        <DitherGalaxy className="absolute inset-0" />
      </div>

      <div
        data-scene-avoid
        className="flex flex-col items-start gap-4 sm:flex-row sm:items-end"
      >
        <Avatar square className="shrink-0" />

        <div className="scene-text min-w-0 font-mono">
          <div className="flex items-center gap-2">
            <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-4xl">
              <span className="hero-name">{siteConfig.author.name}</span>
            </h1>
            <PronounceNameButton name={siteConfig.author.name} />
          </div>

          <RotatingSubtitle lines={SUBTITLE_LINES} className="text-sm sm:text-base" />
        </div>
      </div>

      <p
        aria-hidden="true"
        className="scene-text text-muted-foreground/70 simple:hidden absolute bottom-2 right-4 hidden font-mono text-xs uppercase tracking-widest sm:block"
      >
        drag to spin · tap to ignite
      </p>
    </section>
  )
}
