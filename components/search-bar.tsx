"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch(newQuery)
  }

  const clearSearch = () => {
    setQuery("")
    onSearch("")
    inputRef.current?.focus()
  }

  return (
    <div className="flex-grow">
      <div className="relative flex items-center rounded-lg bg-muted dark:bg-gray-800">
        <input
          ref={inputRef}
          type="text"
          className="w-full px-4 py-2.5 rounded-lg focus:outline-none bg-transparent text-[15px] text-foreground"
          placeholder="Search"
          value={query}
          onChange={handleChange}
        />
        {query && (
          <button
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <div className="bg-muted-foreground/30 rounded-full p-0.5">
              <X className="h-5 w-5 text-background" />
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
