import type { Metadata } from "next"

import { PageHeading } from "@/components/shared/page-heading"

export const metadata: Metadata = {
  title: "Projects",
}
export default function Projects() {
  return (
    <div className="w-full px-4 pt-20">
      <PageHeading
        title="Projects"
        heading="I love shipping products and open source software."
      />
    </div>
  )
}
