import { Geist, Geist_Mono, Old_Standard_TT, Poppins } from "next/font/google"

import { cn } from "@/lib/utils"

export const purplePurse = Old_Standard_TT({
  weight: ["700"],
  subsets: ["latin"],
})

export const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
})

// Not used as the default body font -- these only expose the --font-heading
// and --font-mono CSS custom properties for specific elements (stack pills,
// footer metadata list, etc.) to opt into via the font-mono utility class.
export const geistHeading = Geist({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fonts = cn(
  poppins.className,
  purplePurse.className,
  "touch-manipulation font-sans antialiased"
)
