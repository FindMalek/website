"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "password"
}

const INPUT_CLASS =
  "border-input bg-background placeholder:text-muted-foreground hover:border-border-strong text-copy-14 flex h-10 w-full rounded-md border px-3 py-2 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50"

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    const toggleVisibility = () => setIsVisible((prev) => !prev)

    if (variant === "password") {
      return (
        <div className="relative">
          <input
            type={isVisible ? "text" : "password"}
            className={cn(
              INPUT_CLASS + " pe-9",
              className
            )}
            ref={ref}
            {...props}
          />
          <button
            className="text-muted-foreground hover:text-foreground absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-colors focus:z-10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      )
    }

    return (
      <input
        type={type}
        className={cn(
          INPUT_CLASS,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }