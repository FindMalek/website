import { Recommendation } from "content-collections"

import { TestimonialCard } from "@/components/app/testimonial-card"
import { Marquee } from "@/components/ui/marquee"

/**
 * Landing-page testimonials section -- auto-scrolling row of recommendation
 * excerpts, same Marquee primitive as ClientsMarquee (see #67/#70). Each card
 * links out to its full /recommendations/[slug] page (see #65).
 */
export function TestimonialsMarquee({
  recommendations,
}: {
  recommendations: Recommendation[]
}) {
  if (recommendations.length === 0) {
    return null
  }

  return (
    <Marquee pauseOnHover className="[--duration:35s]">
      {recommendations.map((recommendation) => (
        <TestimonialCard
          key={recommendation.href}
          recommendation={recommendation}
        />
      ))}
    </Marquee>
  )
}
