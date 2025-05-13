"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FileUp, FileDown, Database, Trash2, Moon, Sun, Info, Laptop, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import ImportDialog from "@/components/import-dialog"
import { exportNotesToJSON } from "@/lib/import-export"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [themeLabel, setThemeLabel] = useState("System")

  useEffect(() => {
    if (theme === "light") setThemeLabel("Light")
    else if (theme === "dark") setThemeLabel("Dark")
    else setThemeLabel("System")
  }, [theme])

  const handleExportNotes = () => {
    exportNotesToJSON()
  }

  const handleThemeChange = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="h-5 w-5 text-orange-500" />
    if (theme === "dark") return <Moon className="h-5 w-5 text-purple-500" />
    return <Laptop className="h-5 w-5 text-blue-500" />
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center">
              <Settings className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-xl font-semibold text-foreground">Settings</h2>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={onClose}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-grow overflow-auto p-4">
            <div className="space-y-6">
              <div className="bg-background rounded-lg overflow-hidden shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground px-4 py-2 bg-muted/50">Notes</h3>
                <div className="divide-y divide-border">
                  <SidebarItem
                    icon={<FileUp className="h-5 w-5 text-primary" />}
                    label="Import Notes"
                    onClick={() => setIsImportDialogOpen(true)}
                  />
                  <SidebarItem
                    icon={<FileDown className="h-5 w-5 text-primary" />}
                    label="Export All Notes"
                    onClick={handleExportNotes}
                  />
                </div>
              </div>

              <div className="bg-background rounded-lg overflow-hidden shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground px-4 py-2 bg-muted/50">Preferences</h3>
                <div className="divide-y divide-border">
                  <SidebarItem
                    icon={<Database className="h-5 w-5 text-green-600" />}
                    label="Storage"
                    value="Local Storage"
                  />
                  <SidebarItem
                    icon={getThemeIcon()}
                    label="Appearance"
                    value={themeLabel}
                    onClick={handleThemeChange}
                  />
                </div>
              </div>

              <div className="bg-background rounded-lg overflow-hidden shadow-sm">
                <h3 className="text-sm font-medium text-muted-foreground px-4 py-2 bg-muted/50">Danger Zone</h3>
                <div className="divide-y divide-border">
                  <SidebarItem
                    icon={<Trash2 className="h-5 w-5 text-destructive" />}
                    label="Clear All Notes"
                    danger
                    disabled
                  />
                </div>
              </div>

              <div className="bg-background rounded-lg overflow-hidden shadow-sm">
                <div className="divide-y divide-border">
                  <SidebarItem icon={<Info className="h-5 w-5 text-muted-foreground" />} label="About" value="v1.0.0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <ImportDialog isOpen={isImportDialogOpen} onClose={() => setIsImportDialogOpen(false)} />
    </>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  value?: string
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
}

function SidebarItem({ icon, label, value, onClick, danger = false, disabled = false }: SidebarItemProps) {
  return (
    <button
      className={cn(
        "w-full flex items-center justify-between px-4 py-3 text-left transition-colors",
        disabled ? "opacity-50 cursor-not-allowed" : onClick ? "hover:bg-muted cursor-pointer" : "",
        danger ? "text-destructive" : "text-foreground",
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      <div className="flex items-center">
        <div className="mr-3">{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
      {value && <span className="text-muted-foreground text-sm">{value}</span>}
    </button>
  )
}
