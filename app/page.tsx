import { GeneralHeroSection } from "@/components/app/general-hero-section"
import { NextPage } from "@/components/shared/next-page"

export default function Home() {
  return (
    <div className="w-full px-4 pt-20">
      <GeneralHeroSection />
      <NextPage />
    </div>
  )
}
