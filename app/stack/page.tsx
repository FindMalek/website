import type { Metadata } from "next"

import { STACK_SECTIONS } from "@/config/stack"

import { StackSection } from "@/components/app/stack-section"
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

      <div className="mt-4 space-y-16">
        {STACK_SECTIONS.map((section, index) => (
          <StackSection key={index} section={section} />
        ))}
      </div>
    </div>
  )
}
