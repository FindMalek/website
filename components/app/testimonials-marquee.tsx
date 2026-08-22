import { Recommendation } from "content-collections"

import { TestimonialCard } from "@/components/app/testimonial-card"
import { Marquee } from "@/components/ui/marquee"

/**
 * Landing-page testimonials section -- two rows scrolling in opposite
 * directions, same pattern as ClientsMarquee (see #67/#70) per feedback on
 * this PR ("make them 2 rows, and slightly faster"). Each card links out to
 * its full /recommendations/[slug] page (see #65). Second row only renders
 * once there are enough recommendations to fill it -- with a single
 * placeholder entry, splitting would leave an empty row.
 */
export function TestimonialsMarquee({
  recommendations,
}: {
  recommendations: Recommendation[]
}) {
  if (recommendations.length === 0) {
    return null
  }

  const midpoint = Math.ceil(recommendations.length / 2)
  const firstRow = recommendations.slice(0, midpoint)
  const secondRow = recommendations.slice(midpoint)

  return (
    <div className="flex flex-col gap-2">
      <Marquee pauseOnHover className="[--duration:25s]">
        {firstRow.map((recommendation) => (
          <TestimonialCard
            key={recommendation.href}
            recommendation={recommendation}
          />
        ))}
      </Marquee>
      {secondRow.length > 0 && (
        <Marquee reverse pauseOnHover className="[--duration:25s]">
          {secondRow.map((recommendation) => (
            <TestimonialCard
              key={recommendation.href}
              recommendation={recommendation}
            />
          ))}
        </Marquee>
      )}
    </div>
  )
}
