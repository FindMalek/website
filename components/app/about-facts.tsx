import resumeData from "@/data/resume.json"

import { siteConfig, TIMEZONE } from "@/config/site"

import { CurrentLocalTimeItem } from "@/components/app/current-local-time-item"
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "@/components/app/intro-item"
import { CopyText } from "@/components/shared/copy-text"
import { Icons } from "@/components/shared/icons"

export function AboutFacts() {
  return (
    <div className="mb-8 grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
      <IntroItem>
        <IntroItemIcon>
          <Icons.location />
        </IntroItemIcon>
        <IntroItemContent>{resumeData.basics.location}</IntroItemContent>
      </IntroItem>

      <CurrentLocalTimeItem timeZone={TIMEZONE} />

      <IntroItem>
        <IntroItemIcon>
          <Icons.mail />
        </IntroItemIcon>
        <IntroItemContent>
          <CopyText
            text={siteConfig.author.email}
            className="hover:text-primary underline-offset-4 transition-colors hover:underline"
          />
        </IntroItemContent>
      </IntroItem>

      <IntroItem>
        <IntroItemIcon>
          <Icons.globe />
        </IntroItemIcon>
        <IntroItemContent>
          <IntroItemLink href={siteConfig.author.url}>
            {resumeData.basics.website.label}
          </IntroItemLink>
        </IntroItemContent>
      </IntroItem>
    </div>
  )
}
