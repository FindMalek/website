import { formatWorkDuration } from "@/lib/utils"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface WorkDateWithTooltipProps {
  startDate: string
  endDate: string
}

export function WorkDateWithTooltip({
  startDate,
  endDate,
}: WorkDateWithTooltipProps) {
  const duration = formatWorkDuration(startDate, endDate)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{`${startDate} — ${endDate}`}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{duration}</p>
      </TooltipContent>
    </Tooltip>
  )
}
