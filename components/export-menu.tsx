"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { FileDown, FileText } from "lucide-react"
import { exportAllNotesAsMarkdown, exportNoteAsMarkdown } from "@/lib/import-export"
import type { Note } from "@/lib/types"

interface ExportMenuProps {
  note?: Note // Optional - if provided, enables single note export
}

export default function ExportMenu({ note }: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleExportAllNotes = async () => {
    setIsExporting(true)
    try {
      await exportAllNotesAsMarkdown()
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
      setIsOpen(false)
    }
  }

  const handleExportCurrentNote = () => {
    if (note) {
      exportNoteAsMarkdown(note)
    }
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-gray-100">
          <FileDown className="h-5 w-5 text-gray-700" />
          <span className="sr-only">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl">
        <div className="px-2 py-1.5 text-sm font-medium text-gray-500">Export Options</div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleExportAllNotes}
          className="flex items-center gap-2 cursor-pointer"
          disabled={isExporting}
        >
          <FileDown className="h-4 w-4 text-[#007AFF]" />
          <span>{isExporting ? "Exporting..." : "Export All Notes (ZIP)"}</span>
        </DropdownMenuItem>

        {note && (
          <DropdownMenuItem onClick={handleExportCurrentNote} className="flex items-center gap-2 cursor-pointer">
            <FileText className="h-4 w-4 text-[#007AFF]" />
            <span>Export This Note</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
