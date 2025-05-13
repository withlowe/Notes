"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createNote } from "@/lib/notes-service"

export default function NewNotePage() {
  const router = useRouter()

  useEffect(() => {
    const id = createNote({
      id: crypto.randomUUID(),
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    router.push(`/${id}`)
  }, [router])

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500">Creating new note...</p>
      </div>
    </div>
  )
}
