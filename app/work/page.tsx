import type { Metadata } from "next"

import { PageHeading } from "@/components/shared/page-heading"

export const metadata: Metadata = {
  title: "Work",
}
export default function Work() {
  return (
    <div className="w-full px-4 pt-20">
      <PageHeading
        title="Work"
        heading="I've been fortunate to work with some amazing companies and people."
      />
    </div>
  )
}
