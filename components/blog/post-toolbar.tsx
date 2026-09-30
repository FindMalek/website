"use client"

import Link from "next/link"
import {
  SiClaude,
  SiGithub,
  SiMarkdown,
  SiOpenai,
} from "@icons-pack/react-simple-icons"
import { ArrowLeft, ArrowRight, Share } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useCopyClipboard } from "@/hooks/use-copy-clipboard"

import { Icons } from "@/components/shared/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AdjacentPost {
  href: string
  title: string
}

interface PostToolbarProps {
  title: string
  markdown: string
  postUrl: string
  markdownPath: string
  markdownUrl: string
  sourceUrl: string
  previous?: AdjacentPost
  next?: AdjacentPost
}

const ICON_BUTTON_CLASS_NAME =
  "bg-muted/60 hover:bg-muted dark:bg-muted/60 dark:hover:bg-muted text-foreground size-8 border-transparent shadow-none dark:border-transparent"

export function PostToolbar({
  title,
  markdown,
  postUrl,
  markdownPath,
  markdownUrl,
  sourceUrl,
  previous,
  next,
}: PostToolbarProps) {
  const { copied, copy } = useCopyClipboard()
  const prompt = `Read ${markdownUrl}, I want to ask questions about it.`
  const encodedPrompt = encodeURIComponent(prompt)

  const openLinks = [
    { label: "View as Markdown", href: markdownPath, Icon: SiMarkdown },
    { label: "Open in GitHub", href: sourceUrl, Icon: SiGithub },
    {
      label: "Open in ChatGPT",
      href: `https://chatgpt.com/?hints=search&q=${encodedPrompt}`,
      Icon: SiOpenai,
    },
    {
      label: "Open in Claude",
      href: `https://claude.ai/new?q=${encodedPrompt}`,
      Icon: SiClaude,
    },
  ]

  const handleShare = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url: postUrl })
      } catch {
        // Dismissing the native share sheet rejects; nothing to report.
      }
      return
    }

    try {
      await navigator.clipboard.writeText(postUrl)
      toast.success("Link copied")
    } catch {
      toast.error("Couldn't copy the link")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <ButtonGroup>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copy(markdown)}
          aria-label="Copy page as Markdown"
          className={cn(ICON_BUTTON_CLASS_NAME, "w-auto gap-1.5 px-2.5")}
        >
          {copied ? <Icons.check aria-hidden /> : <Icons.copy aria-hidden />}
          <span className="hidden sm:inline">
            {copied ? "Copied" : "Copy page"}
          </span>
        </Button>
        <ButtonGroupSeparator className="bg-foreground/10 my-1.5" />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              aria-label="More page options"
              className={cn(ICON_BUTTON_CLASS_NAME, "w-7")}
            >
              <Icons.chevronDown aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-52">
            <DropdownMenuItem onSelect={() => copy(markdown)}>
              <Icons.copy aria-hidden />
              Copy page as Markdown
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {openLinks.map(({ label, href, Icon }) => (
              <DropdownMenuItem key={label} asChild>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Icon className="size-4" aria-hidden />
                  {label}
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleShare}
            aria-label="Share this post"
            className={ICON_BUTTON_CLASS_NAME}
          >
            <Share aria-hidden />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Share</TooltipContent>
      </Tooltip>

      <div className="flex items-center gap-1">
        <AdjacentPostButton post={previous} direction="previous" />
        <AdjacentPostButton post={next} direction="next" />
      </div>
    </div>
  )
}

function AdjacentPostButton({
  post,
  direction,
}: {
  post?: AdjacentPost
  direction: "previous" | "next"
}) {
  const Icon = direction === "previous" ? ArrowLeft : ArrowRight
  const label = direction === "previous" ? "Previous post" : "Next post"

  if (!post) {
    return (
      <span
        aria-hidden
        className={cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          ICON_BUTTON_CLASS_NAME,
          "pointer-events-none opacity-40"
        )}
      >
        <Icon />
      </span>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={post.href}
          aria-label={`${label}: ${post.title}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "icon-sm" }),
            ICON_BUTTON_CLASS_NAME
          )}
        >
          <Icon aria-hidden />
        </Link>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
