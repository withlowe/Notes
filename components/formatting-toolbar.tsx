"use client"

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Minus,
} from "lucide-react"
import Toolbar, { ToolbarButton, ToolbarDivider, ToolbarGroup } from "./toolbar"

interface FormattingToolbarProps {
  onFormat: (format: string) => void
  activeFormats?: string[]
  className?: string
}

export default function FormattingToolbar({ onFormat, activeFormats = [], className }: FormattingToolbarProps) {
  return (
    <Toolbar position="top" className={className}>
      <div className="w-full overflow-x-auto flex items-center py-1 scrollbar-thin">
        <ToolbarGroup>
          <ToolbarButton
            icon={<Heading1 className="h-6 w-6" />}
            active={activeFormats.includes("heading")}
            onClick={() => onFormat("heading")}
          />
          <ToolbarButton
            icon={<Heading2 className="h-6 w-6" />}
            active={activeFormats.includes("subheading")}
            onClick={() => onFormat("subheading")}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton
            icon={<Bold className="h-6 w-6" />}
            active={activeFormats.includes("bold")}
            onClick={() => onFormat("bold")}
          />
          <ToolbarButton
            icon={<Italic className="h-6 w-6" />}
            active={activeFormats.includes("italic")}
            onClick={() => onFormat("italic")}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton
            icon={<AlignLeft className="h-6 w-6" />}
            active={activeFormats.includes("left")}
            onClick={() => onFormat("left")}
          />
          <ToolbarButton
            icon={<AlignCenter className="h-6 w-6" />}
            active={activeFormats.includes("center")}
            onClick={() => onFormat("center")}
          />
          <ToolbarButton
            icon={<AlignRight className="h-6 w-6" />}
            active={activeFormats.includes("right")}
            onClick={() => onFormat("right")}
          />
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup>
          <ToolbarButton
            icon={<List className="h-6 w-6" />}
            active={activeFormats.includes("bullet")}
            onClick={() => onFormat("bullet")}
          />
          <ToolbarButton
            icon={<ListOrdered className="h-6 w-6" />}
            active={activeFormats.includes("number")}
            onClick={() => onFormat("number")}
          />
          <ToolbarButton
            icon={<Minus className="h-6 w-6" />}
            active={activeFormats.includes("checklist")}
            onClick={() => onFormat("checklist")}
          />
        </ToolbarGroup>
      </div>
    </Toolbar>
  )
}
