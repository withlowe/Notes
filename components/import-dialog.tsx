"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { importNotesFromJSON, importTextAsNote } from "@/lib/import-export"
import { useRouter } from "next/navigation"
import { FileTextIcon as DocumentText, FileJson } from "lucide-react"

interface ImportDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function ImportDialog({ isOpen, onClose }: ImportDialogProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsImporting(true)
    setImportStatus(null)

    const file = files[0]

    try {
      if (file.type === "application/json") {
        const result = await importNotesFromJSON(file)
        if (result.success) {
          setImportStatus({
            message: `Successfully imported ${result.count} note${result.count !== 1 ? "s" : ""}`,
            isError: false,
          })
        } else {
          setImportStatus({
            message: "Failed to import notes. Make sure the file is a valid notes backup.",
            isError: true,
          })
        }
      } else if (file.type === "text/plain") {
        const result = await importTextAsNote(file)
        if (result.success) {
          setImportStatus({
            message: "Successfully imported note",
            isError: false,
          })

          // Navigate to the new note if we have its ID
          if (result.noteId) {
            setTimeout(() => {
              onClose()
              router.push(`/${result.noteId}`)
            }, 1500)
          }
        } else {
          setImportStatus({
            message: "Failed to import note",
            isError: true,
          })
        }
      } else {
        setImportStatus({
          message: "Unsupported file type. Please use .json or .txt files.",
          isError: true,
        })
      }
    } catch (error) {
      setImportStatus({
        message: "An error occurred during import",
        isError: true,
      })
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Import Notes</DialogTitle>
          <DialogDescription className="text-gray-600">
            Import notes from a backup file or create a new note from a text file.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={isImporting}
            />

            <div className="flex space-x-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <FileJson className="h-6 w-6 text-[#007AFF]" />
                </div>
                <span className="text-sm text-gray-600">JSON</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <DocumentText className="h-6 w-6 text-[#007AFF]" />
                </div>
                <span className="text-sm text-gray-600">TXT</span>
              </div>
            </div>

            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-[#007AFF] text-white rounded-full text-sm font-medium cursor-pointer hover:bg-blue-600 transition-colors"
            >
              {isImporting ? "Importing..." : "Select File"}
            </label>

            <p className="mt-2 text-xs text-gray-500">Supports .json backup files or .txt files</p>
          </div>

          {importStatus && (
            <div
              className={`p-3 rounded-lg text-sm ${
                importStatus.isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
              }`}
            >
              {importStatus.message}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-full border-gray-300 text-gray-700">
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
