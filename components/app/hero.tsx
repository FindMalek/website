import resumeData from "@/data/resume.json"

import { siteConfig } from "@/config/site"

import { AbstractMark } from "@/components/app/abstract-mark"
import { PronounceNameButton } from "@/components/app/pronounce-name-button"
import { VerifiedIcon } from "@/components/app/verified-icon"
import { Avatar } from "@/components/shared/avatar"

export function Hero() {
  return (
    <section className="screen-line-bottom px-4 pt-12 pb-6">
      <AbstractMark size="lg" caption="FIG_001" className="mb-6" />

      <div className="flex items-center gap-3">
        <Avatar large />

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-balance">
              {siteConfig.author.name}
            </h1>
            <VerifiedIcon className="text-primary size-4.5 shrink-0" />
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
