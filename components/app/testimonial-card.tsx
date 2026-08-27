import Link from "next/link"
import { Recommendation } from "content-collections"

import { cn, getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface TestimonialCardProps {
  recommendation: Recommendation
  /**
   * Hide the company name when the surrounding page already makes it
   * obvious (e.g. a company-specific work/case-study page).
   */
  hideCompany?: boolean
  className?: string
}

/**
 * Short testimonial excerpt with a link to the full recommendation page.
 * Reused on individual work/case-study pages and in the landing-page
 * testimonials marquee -- one content model, two renderings (see #65).
 */
export function TestimonialCard({
  recommendation,
  hideCompany = false,
  className,
}: TestimonialCardProps) {
  const {
    recommenderName,
    role,
    company,
    photo,
    excerpt,
    href,
    isPlaceholder,
  } = recommendation

  const subtitle = hideCompany ? role : `${role} at ${company}`

  return (
    <div
      className={cn(
        "border-border bg-card flex w-80 shrink-0 flex-col gap-3 rounded-lg border p-4",
        className
      )}
    >
      {isPlaceholder && (
        <Badge variant="outline" className="w-fit text-[10px] uppercase">
          Placeholder -- not a real recommendation
        </Badge>
      )}

      <p className="text-foreground/90 line-clamp-4 text-sm leading-relaxed">
        &ldquo;{excerpt}&rdquo;
      </p>

      <div className="mt-auto flex items-center gap-3">
        <Avatar className="size-9">
          {photo && <AvatarImage src={photo} alt={recommenderName} />}
          <AvatarFallback className="text-xs font-medium">
            {getInitials(recommenderName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{recommenderName}</p>
          <p className="text-muted-foreground truncate text-xs">{subtitle}</p>
        </div>
      </div>

      <Link
        href={href}
        className="text-muted-foreground hover:text-foreground text-xs font-medium underline underline-offset-4 transition-colors"
      >
        Read full recommendation
      </Link>
    </div>
  )
}
