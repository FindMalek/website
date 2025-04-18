"use client"

import type { ToolInvocation } from "ai"

import { PROJECT_TYPE_OPTIONS } from "@/types/enum"

import { convertProjectType } from "@/config/converter"
import { type PricingEstimatorValues } from "@/config/schemas"
import { usePricingEstimator } from "@/hooks/use-pricing-estimator"

import { Icons } from "@/components/shared/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface PricingEstimatorProps {
  toolCall: ToolInvocation
}

export function ContactToolPricingEstimator({
  toolCall,
}: PricingEstimatorProps) {
  const { form, state, featureOptions, toggleFeature, calculateEstimate } =
    usePricingEstimator(toolCall)

  const onSubmit = (values: PricingEstimatorValues) => {
    calculateEstimate(values)
  }

  return (
    <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">Project Pricing Estimator</h3>

      {state.estimate !== null ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-green-600">
            <Icons.check className="h-5 w-5" />
            <p className="font-medium">Estimate Generated</p>
          </div>
          <Card className="p-4 text-center">
            <p className="text-muted-foreground text-sm">Estimated Price</p>
            <p className="text-3xl font-bold">
              ${state.estimate.toLocaleString()}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              This is a rough estimate and may vary based on specific
              requirements
            </p>
          </Card>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="font-medium">Project Type:</p>
              <p className="text-muted-foreground">
                {convertProjectType(form.getValues("projectType"))}
              </p>
            </div>
            <div>
              <p className="font-medium">Complexity:</p>
              <p className="text-muted-foreground">
                {form.getValues("complexity") < 30
                  ? "Simple"
                  : form.getValues("complexity") < 70
                    ? "Moderate"
                    : "Complex"}
              </p>
            </div>
            <div>
              <p className="font-medium">Timeframe:</p>
              <p className="text-muted-foreground">
                {form.getValues("timeframe") < 30
                  ? "Urgent"
                  : form.getValues("timeframe") < 70
                    ? "Standard"
                    : "Relaxed"}
              </p>
            </div>
            <div>
              <p className="font-medium">Features:</p>
              <p className="text-muted-foreground">
                {form.getValues("selectedFeatures").length} selected
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger id="project-type">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROJECT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {convertProjectType(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="complexity"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Project Complexity</FormLabel>
                    <span className="text-muted-foreground text-sm">
                      {field.value < 30
                        ? "Simple"
                        : field.value < 70
                          ? "Moderate"
                          : "Complex"}
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(values) => field.onChange(values[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeframe"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between">
                    <FormLabel>Timeframe</FormLabel>
                    <span className="text-muted-foreground text-sm">
                      {field.value < 30
                        ? "Urgent"
                        : field.value < 70
                          ? "Standard"
                          : "Relaxed"}
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      value={[field.value]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(values) => field.onChange(values[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="selectedFeatures"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {featureOptions.map((feature) => (
                      <Badge
                        key={feature.id}
                        variant={
                          field.value.includes(feature.id)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => toggleFeature(feature.id)}
                      >
                        {feature.label}
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={state.isCalculating || !form.watch("projectType")}
              className="w-full"
            >
              {state.isCalculating ? (
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
          </form>
        </Form>
      )}
    </div>
  )
}
