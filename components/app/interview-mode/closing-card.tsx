import { CAL_URL, CONTACT_EMAIL, CV_DOWNLOAD_PATH } from "@/data/journey"
import { CalendarDays, Check, Copy, Download, Mail } from "lucide-react"

import { useCopyClipboard } from "@/hooks/use-copy-clipboard"

import { Button } from "@/components/ui/button"

type ClosingCardProps = {
  buildSummary: () => string
}

export function ClosingCard({ buildSummary }: ClosingCardProps) {
  const { copied, copy } = useCopyClipboard()

  return (
    <article aria-labelledby="card-closing" className="space-y-5">
      <h3
        id="card-closing"
        className="font-heading text-xl font-semibold leading-snug sm:text-2xl"
      >
        Take it with you
      </h3>
      <p className="text-sm leading-relaxed sm:text-base">
        That is the short version. Here is how to reach me, or grab a summary
        with links for your notes.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-11 justify-start"
        >
          <a href={CV_DOWNLOAD_PATH} data-autofocus>
            <Download aria-hidden />
            Download my CV
          </a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-11 justify-start"
        >
          <a href={CAL_URL} target="_blank" rel="noopener">
            <CalendarDays aria-hidden />
            Book a call
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-11 justify-start"
        >
          <a href={`mailto:${CONTACT_EMAIL}`}>
            <Mail aria-hidden />
            {CONTACT_EMAIL}
          </a>
        </Button>
        <Button
          size="lg"
          className="h-11 justify-start"
          onClick={() => copy(buildSummary())}
        >
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copied ? "Copied" : "Copy a summary for your notes"}
        </Button>
      </div>
    </article>
  )
}
