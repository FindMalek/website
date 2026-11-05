"use client"

import { useCopyClipboard } from "@/hooks/use-copy-clipboard"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"

export function CopySnippet({ children }: { children: string }) {
  const { copied, copy } = useCopyClipboard()

  return (
    <div className="bg-muted/40 border-line relative rounded-lg border">
      <pre className="overflow-x-auto p-3 pr-12 font-mono text-xs leading-relaxed">
        <code>{children}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute right-1.5 top-1.5"
        aria-label={copied ? "Copied" : "Copy snippet"}
        onClick={() => copy(children)}
      >
        {copied ? <Icons.check className="size-3.5" /> : <Icons.copy className="size-3.5" />}
      </Button>
    </div>
  )
}
