import type { Note } from "./types"
import { getNotes, createNote } from "./notes-service"

// Export a single note as a markdown file
export function exportNoteAsMarkdown(note: Note): void {
  const content = `# ${note.title || "Untitled Note"}\n\n${note.content}`
  const dataUri = `data:text/markdown;charset=utf-8,${encodeURIComponent(content)}`

  const fileName = note.title
    ? `${note.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md`
    : `note-${note.id.slice(0, 8)}.md`

  const linkElement = document.createElement("a")
  linkElement.setAttribute("href", dataUri)
  linkElement.setAttribute("download", fileName)
  linkElement.click()
}

// Export all notes as individual markdown files in a zip
export function exportAllNotesAsMarkdown(): void {
  const notes = getNotes()

  if (notes.length === 0) {
    alert("No notes to export")
    return
  }

  // Export each note individually for now
  // In a real app, we would use a library like JSZip to create a zip file
  notes.forEach((note) => {
    exportNoteAsMarkdown(note)
  })
}

// Import a markdown file as a new note
export async function importMarkdownAsNote(file: File): Promise<{ success: boolean; noteId?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const result = event.target?.result
        if (typeof result !== "string") {
          resolve({ success: false })
          return
        }

        // Try to extract title from first heading
        let title = ""
        let content = result

        // Look for a markdown heading at the start
        const headingMatch = content.match(/^#\s+(.+)(\n|$)/)
        if (headingMatch) {
          title = headingMatch[1].trim()
          // Remove the heading from the content
          content = content.replace(/^#\s+(.+)(\n|$)/, "").trim()
        } else {
          // If no heading, try to use the first line as title
          const lines = content.split("\n")
          if (lines.length > 0) {
            title = lines[0].trim()
            if (title.length <= 100) {
              content = lines.slice(1).join("\n").trim()
            }
          }
        }

        // Create new note
        const noteId = createNote({
          id: crypto.randomUUID(),
          title,
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })

        resolve({ success: true, noteId })
      } catch (error) {
        console.error("Error importing markdown as note:", error)
        resolve({ success: false })
      }
    }

    reader.onerror = () => {
      resolve({ success: false })
    }

    reader.readAsText(file)
  })
}

// Export all notes as a JSON file
export function exportNotesToJSON(): void {
  const notes = getNotes()

  if (notes.length === 0) {
    alert("No notes to export")
    return
  }

  const dataStr = JSON.stringify(notes)
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

  const fileName = "notes.json"

  const linkElement = document.createElement("a")
  linkElement.setAttribute("href", dataUri)
  linkElement.setAttribute("download", fileName)
  linkElement.click()
}
