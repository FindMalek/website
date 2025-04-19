"use client"

import { type ToolInvocation } from "ai"

import { type PricingEstimatorValues } from "@/config/schemas"
import { usePricingEstimator } from "@/hooks/use-pricing-estimator"

import { ContactToolPricingEstimatorForm } from "@/components/app/contact-tool-pricing-estimator-form"
import { ContactToolPricingEstimatorResult } from "@/components/app/contact-tool-pricing-estimator-result"

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
    <div className="bg-muted/30 space-y-4 overflow-visible rounded-lg border p-4">
      {state.estimate !== null ? (
        <ContactToolPricingEstimatorResult
          estimate={state.estimate}
          projectType={form.getValues("projectType")}
          complexity={form.getValues("complexity")}
          timeframe={form.getValues("timeframe")}
          features={form.getValues("selectedFeatures")}
        />
      ) : (
        <ContactToolPricingEstimatorForm
          form={form}
          featureOptions={featureOptions}
          isCalculating={state.isCalculating}
          onFeatureToggle={toggleFeature}
          onSubmit={onSubmit}
        />
      )}
    </div>
  )
}
