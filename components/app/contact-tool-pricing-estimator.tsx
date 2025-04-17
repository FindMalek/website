"use client"

import { useEffect, useState } from "react"
import { useChat } from "@ai-sdk/react"
import type { ToolInvocation } from "ai"

import { Icons } from "@/components/shared/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
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

interface FeatureOption {
  id: string
  label: string
  value: number
}

export function ContactToolPricingEstimator({
  toolCall,
}: PricingEstimatorProps) {
  const [projectType, setProjectType] = useState("")
  const [complexity, setComplexity] = useState(50)
  const [timeframe, setTimeframe] = useState(50)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [isCalculating, setIsCalculating] = useState(false)
  const [estimate, setEstimate] = useState<number | null>(null)
  const [askingForProject, setAskingForProject] = useState(true)
  const { addToolResult, setInput, handleSubmit: chatSubmit } = useChat()

  const featureOptions: FeatureOption[] = [
    { id: "auth", label: "Authentication", value: 1000 },
    { id: "payment", label: "Payment Processing", value: 1500 },
    { id: "cms", label: "Content Management", value: 1200 },
    { id: "ai", label: "AI Integration", value: 2000 },
    { id: "analytics", label: "Analytics", value: 800 },
    { id: "responsive", label: "Responsive Design", value: 500 },
    { id: "seo", label: "SEO Optimization", value: 600 },
  ]

  // Start by asking about project type
  useEffect(() => {
    if (askingForProject) {
      setInput("What type of project are you looking to price?")
      chatSubmit()
      setAskingForProject(false)
    }
  }, [askingForProject, setInput, chatSubmit])

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    )
  }

  const calculateEstimate = async () => {
    setIsCalculating(true)

    try {
      // Base price by project type
      const basePrice =
        projectType === "website"
          ? 2000
          : projectType === "ecommerce"
            ? 5000
            : projectType === "webapp"
              ? 8000
              : 3000

      // Calculate feature costs
      const featureCost = selectedFeatures.reduce((sum, featureId) => {
        const feature = featureOptions.find((f) => f.id === featureId)
        return sum + (feature?.value || 0)
      }, 0)

      // Complexity multiplier (0.8 to 1.5)
      const complexityMultiplier = 0.8 + (complexity / 100) * 0.7

      // Timeframe multiplier (0.9 to 1.3)
      const timeframeMultiplier = 0.9 + ((100 - timeframe) / 100) * 0.4

      const calculatedEstimate = Math.round(
        (basePrice + featureCost) * complexityMultiplier * timeframeMultiplier
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
          complexity: complexity,
          timeframe: timeframe,
          features: selectedFeatures,
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
              <p className="text-muted-foreground">{
                projectType === "website" ? "Static Website" :
                projectType === "ecommerce" ? "E-commerce Store" :
                projectType === "webapp" ? "Web Application" :
                projectType === "mobile" ? "Mobile App" : "Custom Project"
              }</p>
            </div>
            <div>
              <p className="font-medium">Complexity:</p>
              <p className="text-muted-foreground">{
                complexity < 30 ? "Simple" :
                complexity < 70 ? "Moderate" : "Complex"
              }</p>
            </div>
            <div>
              <p className="font-medium">Timeframe:</p>
              <p className="text-muted-foreground">{
                timeframe < 30 ? "Urgent" :
                timeframe < 70 ? "Standard" : "Relaxed"
              }</p>
            </div>
            <div>
              <p className="font-medium">Features:</p>
              <p className="text-muted-foreground">{selectedFeatures.length} selected</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
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
            <div className="flex justify-between">
              <Label>Project Complexity</Label>
              <span className="text-muted-foreground text-sm">
                {complexity < 30 ? "Simple" : 
                 complexity < 70 ? "Moderate" : "Complex"}
              </span>
            </div>
            <Slider
              value={[complexity]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => setComplexity(values[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Timeframe</Label>
              <span className="text-muted-foreground text-sm">
                {timeframe < 30 ? "Urgent" : 
                 timeframe < 70 ? "Standard" : "Relaxed"}
              </span>
            </div>
            <Slider
              value={[timeframe]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => setTimeframe(values[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <Label>Features</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {featureOptions.map((feature) => (
                <Badge
                  key={feature.id}
                  variant={selectedFeatures.includes(feature.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleFeature(feature.id)}
                >
                  {feature.label}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={calculateEstimate}
            disabled={isCalculating || !projectType}
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
        </div>
      )}
    </div>
  )
}
