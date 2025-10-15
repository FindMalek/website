import { ModeToggle } from "@/components/shared/mode-toggle"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-secondary-foreground/20 w-full border-t px-2 py-4">
      <div className="container flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          © {currentYear} Malek Gara-Hellal. All rights reserved.
        </p>
        <ModeToggle />
      </div>
    </footer>
  )
}
