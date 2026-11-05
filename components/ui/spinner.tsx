import { cn } from "@/lib/utils"

/** A glyph ramp cycling in place (. : - = + * # %), animated in CSS. */
function Spinner({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "glyph-spinner inline-flex size-4 items-center justify-center font-mono text-sm leading-none",
        className
      )}
      {...props}
    />
  )
}

export { Spinner }
