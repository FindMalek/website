"use client"

import { useCopyClipboard } from "@/hooks/use-copy-clipboard"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"

/**
 * print:hidden -- these buttons have nothing to do once the page is
 * actually being printed/exported; the print stylesheet (globals.css +
 * app/layout.tsx) is what makes window.print() produce a clean PDF.
 */
export function ResumeActions() {
  const { copied, copy } = useCopyClipboard()

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 sm:mb-8 print:hidden">
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Icons.download className="mr-1.5 size-4" />
        Download PDF
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => copy(window.location.href)}
      >
        {copied ? (
          <>
            <Icons.check className="mr-1.5 size-4 text-green-500" />
            Copied
          </>
        ) : (
          <>
            <Icons.link className="mr-1.5 size-4" />
            Copy Link
          </>
        )}
      </Button>
    </div>
  )
}
