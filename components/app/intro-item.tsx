import { cn } from "@/lib/utils"

export function IntroItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-3 font-mono text-sm", className)}
      {...props}
    />
  )
}

export function IntroItemIcon({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-muted-foreground/15 bg-muted flex size-6 shrink-0 items-center justify-center rounded-md border",
        "[&_svg]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

export function IntroItemContent({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("text-balance", className)} {...props} />
}

export function IntroItemLink({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "hover:text-primary underline-offset-4 transition-colors hover:underline",
        className
      )}
      target="_blank"
      rel="noopener"
      {...props}
    />
  )
}
