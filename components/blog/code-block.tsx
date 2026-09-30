"use client"

import { useRef } from "react"

import { useCopyClipboard } from "@/hooks/use-copy-clipboard"

import { Icons } from "@/components/shared/icons"

export function CodeBlock(props: React.ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null)
  const { copied, copy } = useCopyClipboard()

  return (
    <div className="group/code relative my-6">
      <pre ref={preRef} {...props} />
      <button
        type="button"
        onClick={() => copy(preRef.current?.textContent ?? "")}
        aria-label={copied ? "Copied" : "Copy code"}
        className="border-line bg-background/80 text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute right-2 top-2 flex size-7 items-center justify-center rounded-md border opacity-0 outline-none backdrop-blur transition-[opacity,color] focus-visible:opacity-100 focus-visible:ring-[3px] group-hover/code:opacity-100 [@media(hover:none)]:opacity-100"
      >
        {copied ? (
          <Icons.check className="size-3.5" aria-hidden />
        ) : (
          <Icons.copy className="size-3.5" aria-hidden />
        )}
      </button>
    </div>
  )
}
