import { Work } from "content-collections"

import { convertWorkType } from "@/config/converter"

import { WorkDateWithTooltip } from "@/components/app/work-date-with-tooltip"
import { Badge } from "@/components/ui/badge"

/** One role inside an expanded company row: title, when, what, and the stack. */
export function WorkPositionItem({ work }: { work: Work }) {
  const { position, type, startDate, endDate, overview, skills } = work

  return (
    <div className="py-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
        <p className="text-sm font-medium">{position}</p>
        <p className="text-muted-foreground text-xs">
          {convertWorkType(type)} ·{" "}
          <WorkDateWithTooltip startDate={startDate} endDate={endDate} />
        </p>
      </div>

      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
        {overview}
      </p>

      {skills && skills.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <li key={skill}>
              <Badge variant="secondary" className="text-xs">
                {skill}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
