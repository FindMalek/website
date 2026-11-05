import { Geist, Geist_Mono, Old_Standard_TT } from "next/font/google"

export const purplePurse = Old_Standard_TT({
  weight: ["700"],
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
