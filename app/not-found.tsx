import type { Metadata } from "next"
import Link from "next/link"

import { Panel } from "@/components/app/panel"
import { AsciiText } from "@/components/dither/ascii-text"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = { title: "Not found" }

export default function NotFound() {
  return (
    <div className="w-full pt-20 md:pt-12">
      <Panel>
        <div className="px-4 pb-8 pt-12 text-center">
          <h1 className="sr-only">404, page not found</h1>
          <AsciiText text="404" ramp="code" decorative className="h-48 w-full sm:h-64" />
          <p className="text-muted-foreground mt-4">That page drifted off the grid.</p>
          <Button asChild className="mt-4">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </Panel>
    </div>
  )
}
