"use client"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"

/**
 * Triggers the browser's native print dialog, which on every modern
 * browser also offers "Save as PDF" -- the download/print-to-PDF action
 * the recommendation page needs (see #65). Hidden itself via print:hidden
 * so it never shows up in the printed/PDF output.
 */
export function RecommendationPrintButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="print:hidden"
      onClick={() => window.print()}
    >
      <Icons.download className="size-4" />
      Download / Print PDF
    </Button>
  )
}
