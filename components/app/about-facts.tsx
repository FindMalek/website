import resumeData from "@/data/resume.json"

import { siteConfig, TIMEZONE } from "@/config/site"

import { CurrentLocalTimeItem } from "@/components/app/current-local-time-item"
import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "@/components/app/intro-item"
import { Icons } from "@/components/shared/icons"

export function AboutFacts() {
  return (
    <div className="mb-8 grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
      <IntroItem className="sm:col-span-2">
        <IntroItemIcon>
          <Icons.briefcase />
        </IntroItemIcon>
        <IntroItemContent>{resumeData.basics.headline}</IntroItemContent>
      </IntroItem>

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
          <IntroItemLink href={`mailto:${siteConfig.author.email}`}>
            {siteConfig.author.email}
          </IntroItemLink>
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

      <IntroItem>
        <IntroItemIcon>
          <Icons.pronouns />
        </IntroItemIcon>
        <IntroItemContent>he/him</IntroItemContent>
      </IntroItem>
    </div>
  )
}
