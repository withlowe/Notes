"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Share2, Trash2 } from "lucide-react"
import type { Note } from "@/lib/types"
import { deleteNote, getNote, updateNote } from "@/lib/notes-service"
import FormattingToolbar from "@/components/formatting-toolbar"
import { exportNoteAsMarkdown } from "@/lib/import-export"

export default function NotePage() {
  const params = useParams()
  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [showFormatting, setShowFormatting] = useState(false)
  const [activeFormats, setActiveFormats] = useState<string[]>([])
  const titleRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const id = params.id as string

  useEffect(() => {
    const currentNote = getNote(id)
    if (currentNote) {
      setNote(currentNote)
      setTitle(currentNote.title)
      setContent(currentNote.content)
    }

    // Focus the title input when the component mounts
    if (titleRef.current) {
      titleRef.current.focus()
    }
  }, [id])

  const saveNote = (updatedTitle: string, updatedContent: string) => {
    if (!note) return

    const now = new Date()
    const updatedNote = {
      ...note,
      title: updatedTitle,
      content: updatedContent,
      updatedAt: now.toISOString(),
    }

    updateNote(id, updatedNote)
    setNote(updatedNote)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    saveNote(newTitle, content)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    saveNote(title, newContent)
  }

  const handleDelete = () => {
    deleteNote(id)
    router.push("/")
  }

  const handleExportNote = () => {
    if (note) {
      exportNoteAsMarkdown({
        ...note,
        title,
        content,
      })
    }
  }

  const handleFormat = (format: string) => {
    // This is a placeholder for actual formatting functionality
    if (activeFormats.includes(format)) {
      setActiveFormats(activeFormats.filter((f) => f !== format))
    } else {
      setActiveFormats([...activeFormats, format])
    }
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Note not found</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Navigation Bar - styled according to HIG */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:bg-transparent hover:text-primary/90 -ml-2 flex items-center gap-1 px-2"
              onClick={() => router.push("/")}
            >
              <ChevronLeft className="h-7 w-7" />
              <span className="text-[15px] font-medium">Notes</span>
            </Button>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 hover:bg-muted"
                onClick={handleExportNote}
                title="Export Note"
              >
                <Share2 className="h-7 w-7 text-foreground" />
                <span className="sr-only">Export Note</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 hover:bg-muted"
                onClick={handleDelete}
                title="Delete Note"
              >
                <Trash2 className="h-7 w-7 text-destructive" />
                <span className="sr-only">Delete Note</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Formatting Toolbar - conditionally shown */}
      {showFormatting && (
        <div className="sticky top-14 z-10">
          <FormattingToolbar onFormat={handleFormat} activeFormats={activeFormats} />
        </div>
      )}

      <div className="container mx-auto px-4 flex-grow overflow-auto">
        <div className="flex-grow">
          {/* Title input - styled according to HIG */}
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full text-[18px] font-semibold text-foreground mt-4 mb-2 px-2 py-1 focus:outline-none focus:ring-0 rounded-md transition-colors bg-background"
            placeholder="Title"
            aria-label="Note title"
          />

          {/* Text view - styled according to HIG */}
          <div className="relative">
            <textarea
              ref={contentRef}
              value={content}
              onChange={handleContentChange}
              className="w-full h-[calc(100vh-150px)] px-2 py-1 text-[15px] leading-relaxed text-foreground resize-none focus:outline-none focus:ring-0 rounded-md transition-colors bg-background"
              placeholder="Note"
              aria-label="Note content"
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                WebkitFontSmoothing: "antialiased",
              }}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
