import type { Note } from "./types"

const STORAGE_KEY = "apple-notes-app"

// Initialize localStorage if running in browser
function initializeStorage() {
  if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  }
}

// Get all notes
export function getNotes(): Note[] {
  if (typeof window === "undefined") return []

  initializeStorage()

  const notesJson = localStorage.getItem(STORAGE_KEY)
  if (!notesJson) return []

  try {
    const notes = JSON.parse(notesJson) as Note[]
    return notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  } catch (error) {
    console.error("Failed to parse notes:", error)
    return []
  }
}

// Search notes by title or content
export function searchNotes(query: string): Note[] {
  const notes = getNotes()
  if (!query.trim()) return notes

  const lowerQuery = query.toLowerCase().trim()

  // First, find notes where the title matches (prioritize these)
  const titleMatches = notes.filter((note) => note.title.toLowerCase().includes(lowerQuery))

  // Then, find notes where only the content matches (but title doesn't)
  const contentMatches = notes.filter(
    (note) => !note.title.toLowerCase().includes(lowerQuery) && note.content.toLowerCase().includes(lowerQuery),
  )

  // Combine both results, with title matches first
  return [...titleMatches, ...contentMatches]
}

// Get a single note by ID
export function getNote(id: string): Note | null {
  const notes = getNotes()
  return notes.find((note) => note.id === id) || null
}

// Create a new note
export function createNote(note: Note): string {
  if (typeof window === "undefined") return note.id

  initializeStorage()

  const notes = getNotes()
  const newNotes = [...notes, note]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes))
  return note.id
}

// Update an existing note
export function updateNote(id: string, updatedNote: Note): void {
  if (typeof window === "undefined") return

  initializeStorage()

  const notes = getNotes()
  const newNotes = notes.map((note) => (note.id === id ? updatedNote : note))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes))
}

// Delete a note
export function deleteNote(id: string): void {
  if (typeof window === "undefined") return

  initializeStorage()

  const notes = getNotes()
  const newNotes = notes.filter((note) => note.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes))
}

// Clear all notes
export function clearAllNotes(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
}
