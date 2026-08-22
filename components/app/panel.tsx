import { cn } from "@/lib/utils"

interface PanelProps extends React.ComponentProps<"section"> {
  id?: string
}

/**
 * Full-bleed-hairline section wrapper (screen-line-top/bottom draw a
 * viewport-width border regardless of the content column's max-width).
 * When `id` is set it goes on this same element alongside scroll-margin-top,
 * so anchor-scroll offset under the sticky header keeps working exactly as
 * it did before this wrapper existed -- never move `id` to a child element.
 */
export function Panel({ id, className, ...props }: PanelProps) {
  return (
    <section
      id={id}
      className={cn(
        "screen-line-top screen-line-bottom border-line border-x",
        id && "group/panel [scroll-margin-top:var(--header-height,6rem)]",
        className
      )}
      {...props}
    />
  )
}

export function PanelHeader({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      className={cn("screen-line-bottom px-4 py-4", className)}
      {...props}
    />
  )
}

export function PanelTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-balance text-2xl font-bold leading-tight tracking-tight",
        className
      )}
      {...props}
    />
  )
}

export function PanelTitleSup({
  className,
  ...props
}: React.ComponentProps<"sup">) {
  return (
    <sup
      className={cn(
        "text-muted-foreground top-[-0.75em] ml-2.5 text-sm font-medium tracking-normal",
        className
      )}
      {...props}
    />
  )
}

export function PanelDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground mt-2 text-base", className)}
      {...props}
    />
  )
}

export function PanelContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("p-4", className)} {...props} />
}
