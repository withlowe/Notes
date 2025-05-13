"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FileUp, FileDown, Database, Trash2, Moon, Sun, Info, Laptop, ChevronLeft } from "lucide-react"
import ImportDialog from "@/components/import-dialog"
import { exportNotesToJSON } from "@/lib/import-export"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

interface SettingsPanelProps {
  onBack: () => void
}

export default function SettingsPanel({ onBack }: SettingsPanelProps) {
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
    <div className="flex-grow overflow-auto">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-transparent hover:text-primary/90 -ml-2 flex items-center gap-1 px-2"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </Button>
          <h2 className="text-xl font-semibold text-foreground ml-2">Settings</h2>
        </div>

        <div className="bg-card rounded-lg overflow-hidden shadow-sm mb-6">
          <div className="divide-y divide-border">
            <SettingsItem
              icon={<FileUp className="h-5 w-5 text-primary" />}
              label="Import Notes"
              onClick={() => setIsImportDialogOpen(true)}
            />
            <SettingsItem
              icon={<FileDown className="h-5 w-5 text-primary" />}
              label="Export All Notes"
              onClick={handleExportNotes}
            />
          </div>
        </div>

        <div className="bg-card rounded-lg overflow-hidden shadow-sm mb-6">
          <div className="divide-y divide-border">
            <SettingsItem
              icon={<Database className="h-5 w-5 text-green-600" />}
              label="Storage"
              value="Local Storage"
            />
            <SettingsItem icon={getThemeIcon()} label="Appearance" value={themeLabel} onClick={handleThemeChange} />
          </div>
        </div>

        <div className="bg-card rounded-lg overflow-hidden shadow-sm mb-6">
          <div className="divide-y divide-border">
            <SettingsItem
              icon={<Trash2 className="h-5 w-5 text-destructive" />}
              label="Clear All Notes"
              danger
              disabled
            />
          </div>
        </div>

        <div className="bg-card rounded-lg overflow-hidden shadow-sm">
          <div className="divide-y divide-border">
            <SettingsItem icon={<Info className="h-5 w-5 text-muted-foreground" />} label="About" value="v1.0.0" />
          </div>
        </div>
      </div>

      <ImportDialog isOpen={isImportDialogOpen} onClose={() => setIsImportDialogOpen(false)} />
    </div>
  )
}

interface SettingsItemProps {
  icon: React.ReactNode
  label: string
  value?: string
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
}

function SettingsItem({ icon, label, value, onClick, danger = false, disabled = false }: SettingsItemProps) {
  return (
    <button
      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
        disabled ? "opacity-50 cursor-not-allowed" : onClick ? "hover:bg-muted cursor-pointer" : ""
      } ${danger ? "text-destructive" : "text-foreground"}`}
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
