import { Old_Standard_TT, Poppins } from "next/font/google"

import { cn } from "@/lib/utils"

export const purplePurse = Old_Standard_TT({
  weight: ["700"],
  subsets: ["latin"],
})

export const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
})

export const fonts = cn(
  poppins.className,
  purplePurse.className,
  "touch-manipulation font-sans antialiased"
)
