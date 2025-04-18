import { ProjectType } from "@/types/enum"

import { convertProjectType } from "@/config/converter"

import { Icons } from "@/components/shared/icons"
import { Card } from "@/components/ui/card"

interface EstimatorResultProps {
  estimate: number
  projectType: ProjectType
  complexity: number
  timeframe: number
  features: string[]
}

export function ContactToolPricingEstimatorResult({
  estimate,
  projectType,
  complexity,
  timeframe,
  features,
}: EstimatorResultProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-green-600">
        <Icons.check className="h-5 w-5" />
        <p className="font-medium">Estimate Generated</p>
      </div>
      <Card className="p-4 text-center">
        <p className="text-muted-foreground text-sm">Estimated Price</p>
        <p className="text-3xl font-bold">${estimate.toLocaleString()}</p>
        <p className="text-muted-foreground mt-1 text-xs">
          This is a rough estimate and may vary based on specific requirements
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="font-medium">Project Type:</p>
          <p className="text-muted-foreground">
            {convertProjectType(projectType)}
          </p>
        </div>
        <div>
          <p className="font-medium">Complexity:</p>
          <p className="text-muted-foreground">
            {complexity < 30
              ? "Simple"
              : complexity < 70
                ? "Moderate"
                : "Complex"}
          </p>
        </div>
        <div>
          <p className="font-medium">Timeframe:</p>
          <p className="text-muted-foreground">
            {timeframe < 30
              ? "Urgent"
              : timeframe < 70
                ? "Standard"
                : "Relaxed"}
          </p>
        </div>
        <div>
          <p className="font-medium">Features:</p>
          <p className="text-muted-foreground">{features.length} selected</p>
        </div>
      </div>
    </div>
  )
}
