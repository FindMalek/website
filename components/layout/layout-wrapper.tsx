"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { CelebrationProvider } from "@/providers/celebration-provider"

import { ThemeProvider } from "@/components/layout/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system">
        <CelebrationProvider>
          <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
        </CelebrationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
