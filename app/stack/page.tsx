import type { Metadata } from "next"

import { PageHeading } from "@/components/shared/page-heading"

export const metadata: Metadata = {
  title: "Stack",
}
export default function Stack() {
  return (
    <div className="w-full px-4 pt-20">
      <PageHeading
        title="Stack"
        heading="Tools, technology and apps I use every day."
      />
    </div>
  )
}
