"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ToolbarProps {
  children: ReactNode
  position?: "top" | "bottom"
  className?: string
}

export default function Toolbar({ children, position = "bottom", className }: ToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-2 py-1 bg-background/90 backdrop-blur-md border-border/80",
        position === "top" ? "border-b" : "border-t",
        className,
      )}
    >
      <div className="flex items-center justify-between w-full max-w-3xl">{children}</div>
    </div>
  )
}

interface ToolbarButtonProps {
  icon: ReactNode
  label?: string // Made optional
  onClick?: () => void
  active?: boolean
  disabled?: boolean
  className?: string
  labelClassName?: string
  showLabel?: boolean // Added to control label visibility
}

export function ToolbarButton({
  icon,
  label,
  onClick,
  active = false,
  disabled = false,
  className = "",
  labelClassName = "",
  showLabel = false, // Default to not showing labels
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center px-3 py-1 rounded-md transition-colors",
        active ? "text-primary" : "text-muted-foreground",
        disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-muted/50",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        className,
      )}
      aria-label={label}
    >
      <div className="h-6 w-6 flex items-center justify-center">{icon}</div>
      {showLabel && label && <span className={cn("text-[10px] mt-0.5 font-medium", labelClassName)}>{label}</span>}
    </button>
  )
}

interface ToolbarDividerProps {
  vertical?: boolean
}

export function ToolbarDivider({ vertical = true }: ToolbarDividerProps) {
  return <div className={cn("bg-border", vertical ? "h-8 w-px mx-1" : "w-full h-px my-1")} role="separator" />
}

interface ToolbarGroupProps {
  children: ReactNode
  align?: "left" | "center" | "right"
}

export function ToolbarGroup({ children, align = "center" }: ToolbarGroupProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center",
      )}
    >
      {children}
    </div>
  )
}
