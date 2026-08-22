import resumeData from "@/data/resume.json"

import { siteConfig } from "@/config/site"

import { PronounceNameButton } from "@/components/app/pronounce-name-button"
import { RotatingSubtitle } from "@/components/app/rotating-subtitle"
import { Avatar } from "@/components/shared/avatar"

const SUBTITLE_LINES = [
  resumeData.basics.headline,
  "i like listening to music and coding :)",
]

export function Hero() {
  return (
    <section className="screen-line-bottom px-4 pb-6 pt-12">
      <div className="flex items-center gap-3">
        <Avatar large />

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-balance text-2xl font-bold tracking-tight">
              {siteConfig.author.name}
            </h1>
            <PronounceNameButton name={siteConfig.author.name} />
          </div>

          <RotatingSubtitle lines={SUBTITLE_LINES} />
        </div>
      </div>
    </section>
  )
}
