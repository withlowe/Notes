import type { Note } from "./types"
import { getNotes, createNote, updateNote } from "./notes-service"

// Export all notes as a JSON file
export function exportNotesToJSON(): void {
  const notes = getNotes()

  if (notes.length === 0) {
    alert("No notes to export")
    return
  }

  const dataStr = JSON.stringify(notes, null, 2)
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

  const exportFileDefaultName = `notes-backup-${new Date().toISOString().slice(0, 10)}.json`

  const linkElement = document.createElement("a")
  linkElement.setAttribute("href", dataUri)
  linkElement.setAttribute("download", exportFileDefaultName)
  linkElement.click()
}

// Export a single note as a text file
export function exportNoteAsText(note: Note): void {
  const content = `${note.title}\n\n${note.content}`
  const dataUri = `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`

  const fileName = note.title
    ? `${note.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.txt`
    : `note-${note.id.slice(0, 8)}.txt`

  const linkElement = document.createElement("a")
  linkElement.setAttribute("href", dataUri)
  linkElement.setAttribute("download", fileName)
  linkElement.click()
}

// Import notes from a JSON file
export async function importNotesFromJSON(file: File): Promise<{ success: boolean; count: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const result = event.target?.result
        if (typeof result !== "string") {
          resolve({ success: false, count: 0 })
          return
        }

        const importedNotes = JSON.parse(result) as Note[]

        if (!Array.isArray(importedNotes)) {
          resolve({ success: false, count: 0 })
          return
        }

        let importCount = 0
        const existingNotes = getNotes()
        const existingIds = new Set(existingNotes.map((note) => note.id))

        importedNotes.forEach((note) => {
          // Validate note structure
          if (!note.id || typeof note.title !== "string" || typeof note.content !== "string") {
            return
          }

          if (existingIds.has(note.id)) {
            // Update existing note
            updateNote(note.id, {
              ...note,
              updatedAt: new Date().toISOString(), // Update the timestamp
            })
          } else {
            // Create new note with the imported data but new ID
            createNote({
              ...note,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })
          }
          importCount++
        })

        resolve({ success: true, count: importCount })
      } catch (error) {
        console.error("Error importing notes:", error)
        resolve({ success: false, count: 0 })
      }
    }

    reader.onerror = () => {
      resolve({ success: false, count: 0 })
    }

    reader.readAsText(file)
  })
}

// Import a text file as a new note
export async function importTextAsNote(file: File): Promise<{ success: boolean; noteId?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const result = event.target?.result
        if (typeof result !== "string") {
          resolve({ success: false })
          return
        }

        // Try to extract title from first line
        const lines = result.split("\n")
        let title = ""
        let content = result

        if (lines.length > 0) {
          title = lines[0].trim()
          // If first line is short enough, use it as title and remove from content
          if (title.length <= 100) {
            content = lines.slice(1).join("\n").trim()
            // If there's an empty line after title, remove it
            if (content.startsWith("\n")) {
              content = content.slice(1)
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
        console.error("Error importing text as note:", error)
        resolve({ success: false })
      }
    }

    reader.onerror = () => {
      resolve({ success: false })
    }

    reader.readAsText(file)
  })
}
