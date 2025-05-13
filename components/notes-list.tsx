"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { Note } from "@/lib/types"
import { getNotes, searchNotes } from "@/lib/notes-service"
import SearchBar from "./search-bar"
import { Calendar, ChevronRight, Search } from "lucide-react"

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const fetchNotes = () => {
      if (searchQuery) {
        setIsSearching(true)
        const filteredNotes = searchNotes(searchQuery)
        setNotes(filteredNotes)
      } else {
        setIsSearching(false)
        const allNotes = getNotes()
        setNotes(allNotes)
      }
    }

    fetchNotes()

    // Set up an interval to refresh notes every second
    const interval = setInterval(fetchNotes, 1000)

    return () => clearInterval(interval)
  }, [searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()

    // If it's today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // If it's this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }

    // Otherwise show full date
    return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })
  }

  if (notes.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex flex-col items-center justify-center flex-grow py-16 text-muted-foreground">
          {isSearching ? (
            <>
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-muted">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-1">No Results</p>
              <p className="text-sm text-muted-foreground/70">No notes match "{searchQuery}"</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-muted">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium mb-1">No Notes</p>
              <p className="text-sm text-muted-foreground/70">Create a new note to get started</p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {isSearching && (
        <div className="px-2 py-1 mb-3 text-sm text-muted-foreground">
          {notes.length} {notes.length === 1 ? "result" : "results"} for "{searchQuery}"
        </div>
      )}

      {/* Apple-style list view with light grey background */}
      <div className="bg-muted dark:bg-gray-800/50 rounded-lg overflow-hidden mb-6 w-full">
        <ul className="divide-y divide-border/50">
          {notes.map((note) => (
            <li key={note.id} className="group">
              <Link href={`/${note.id}`} className="flex items-center px-4 py-3 hover:bg-card/50 transition-colors">
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-[17px] text-foreground truncate pr-2">
                      {note.title || "Untitled Note"}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-7 w-7 text-muted-foreground/50 ml-2" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
