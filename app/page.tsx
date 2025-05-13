"use client"

import { useState } from "react"
import { Plus, Menu } from "lucide-react"
import NotesList from "@/components/notes-list"
import { useRouter } from "next/navigation"
import { createNote } from "@/lib/notes-service"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar"

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()

  const handleAddNote = () => {
    const id = createNote({
      id: crypto.randomUUID(),
      title: "",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    router.push(`/${id}`)
  }

  return (
    <main className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navigation Bar - styled according to HIG */}
        <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border/70">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Large Title with menu icon - Apple HIG style */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 mr-1 text-foreground"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <Menu className="h-7 w-7" />
                  <span className="sr-only">Menu</span>
                </Button>
                <h1 className="text-[30px] font-bold text-foreground py-4">Notes</h1>
              </div>

              {/* Add Note Button in header - larger icon */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 text-primary hover:bg-transparent"
                onClick={handleAddNote}
              >
                <Plus className="h-7 w-7" />
                <span className="sr-only">New Note</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-2 flex-grow overflow-hidden flex flex-col">
          <div className="flex-grow overflow-auto">
            <NotesList />
          </div>
        </div>
      </div>
    </main>
  )
}
