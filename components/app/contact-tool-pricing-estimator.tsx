"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import type { ToolInvocation } from "ai"

import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PricingEstimatorProps {
  toolCall: ToolInvocation
}

export function ContactToolPricingEstimator({
  toolCall,
}: PricingEstimatorProps) {
  const [projectType, setProjectType] = useState("")
  const [features, setFeatures] = useState<string[]>([])
  const [timeline, setTimeline] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [estimate, setEstimate] = useState<number | null>(null)
  const { addToolResult } = useChat()

  const featureOptions = [
    { id: "auth", label: "Authentication" },
    { id: "payment", label: "Payment Processing" },
    { id: "cms", label: "Content Management" },
    { id: "ai", label: "AI Integration" },
    { id: "analytics", label: "Analytics" },
  ]

  const handleFeatureToggle = (featureId: string) => {
    setFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    )
  }

  const calculateEstimate = async () => {
    setIsCalculating(true)

    try {
      // In a real implementation, this would call an API to calculate the estimate
      // For now, we'll use a simple formula
      const basePrice =
        projectType === "website"
          ? 2000
          : projectType === "ecommerce"
            ? 5000
            : projectType === "webapp"
              ? 8000
              : 3000

      const featurePrice = features.length * 1000

      const timelineMultiplier =
        timeline === "urgent" ? 1.5 : timeline === "standard" ? 1 : 0.8

      const calculatedEstimate = Math.round(
        (basePrice + featurePrice) * timelineMultiplier
      )

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setEstimate(calculatedEstimate)
      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: JSON.stringify({
          success: true,
          estimate: calculatedEstimate,
          currency: "USD",
          projectType,
          features,
          timeline,
        }),
      })
    } catch (error) {
      console.error("Error calculating estimate:", error)
      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: JSON.stringify({
          success: false,
          error: "Failed to calculate estimate",
        }),
      })
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">Project Pricing Estimator</h3>

      {estimate !== null ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-green-600">
            <Icons.check className="h-5 w-5" />
            <p className="font-medium">Estimate Generated</p>
          </div>
          <div className="bg-background rounded-md p-4 text-center">
            <p className="text-muted-foreground text-sm">Estimated Price</p>
            <p className="text-3xl font-bold">${estimate.toLocaleString()}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              This is a rough estimate and may vary based on specific
              requirements
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="project-type">Project Type</Label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger id="project-type">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Static Website</SelectItem>
                <SelectItem value="ecommerce">E-commerce Store</SelectItem>
                <SelectItem value="webapp">Web Application</SelectItem>
                <SelectItem value="mobile">Mobile App</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="space-y-2">
              {featureOptions.map((feature) => (
                <div key={feature.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature.id}
                    checked={features.includes(feature.id)}
                    onCheckedChange={() => handleFeatureToggle(feature.id)}
                  />
                  <Label htmlFor={feature.id} className="text-sm font-normal">
                    {feature.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Select value={timeline} onValueChange={setTimeline}>
              <SelectTrigger id="timeline">
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                <SelectItem value="standard">Standard (3-4 weeks)</SelectItem>
                <SelectItem value="relaxed">Relaxed (5+ weeks)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={calculateEstimate}
            disabled={isCalculating || !projectType || !timeline}
            className="w-full"
          >
            {isCalculating ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Icons.calculator className="mr-2 h-4 w-4" />
                Calculate Estimate
              </>
            )}
          </Button>
        </>
      )}
    </div>
  )
}
