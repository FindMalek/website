import type { Metadata } from "next"

import { AboutMusic } from "@/components/app/about-music"
import { AboutOverview } from "@/components/app/about-overview"
import { PageHeading } from "@/components/shared/page-heading"

import { getUserPlaylists } from "@/actions/spotify"

export const metadata: Metadata = {
  title: "About",
}

export default async function About() {
  const playlists = await getUserPlaylists(20, 0)

  return (
    <div className="w-full px-4 pt-20">
      <PageHeading
        title="About"
        heading="I'm a Design Engineer, Founder and professional wanderer."
      />
      <AboutOverview />
      <AboutMusic playlists={playlists.items} />
    </div>
  )
}
