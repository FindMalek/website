import type { Metadata } from "next"

import { PageHeading } from "@/components/shared/page-heading"

export const metadata: Metadata = {
  title: "About",
}
export default function About() {
  return (
    <div className="w-full px-4 pt-20">
      <PageHeading
        title="About"
        heading="I'm a Design Engineer, Founder and professional wanderer."
      />
    </div>
  )
}
