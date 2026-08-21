import resumeData from "@/data/resume.json"

import { siteConfig } from "@/config/site"

import { PronounceNameButton } from "@/components/app/pronounce-name-button"
import { Avatar } from "@/components/shared/avatar"

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

          <p className="text-muted-foreground text-base">
            {resumeData.basics.headline}
          </p>
        </div>
      </div>
    </section>
  )
}
