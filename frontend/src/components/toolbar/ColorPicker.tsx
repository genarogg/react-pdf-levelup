"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Palette, Copy, Check } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  onColorSelect?: (color: string) => void
}

// Predefined color palette
const colorPalette = [
  "#000000",
  "#343a40",
  "#495057",
  "#6c757d",
  "#adb5bd",
  "#ced4da",
  "#dee2e6",
  "#e9ecef",
  "#f8f9fa",
  "#ffffff",
  "#3b82f6",
  "#2563eb",
  "#7c3aed",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#0ea5e9",
]

export default function ColorPicker({ onColorSelect }: ColorPickerProps) {
  const [open, setOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#3366cc")
  const [recentColors, setRecentColors] = useState<string[]>(["#3366cc", "#dc3545", "#28a745", "#ffc107", "#17a2b8"])
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setSelectedColor(color)
    onColorSelect?.(color)
  }

  const selectColor = (color: string) => {
    setSelectedColor(color)
    onColorSelect?.(color)

    if (!recentColors.includes(color)) {
      setRecentColors((prev) => [color, ...prev.slice(0, 4)])
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedColor)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        className="h-9 w-9 flex items-center justify-center text-gray-300 hover:text-white transition-colors duration-200"
        title="Color Picker"
        onClick={() => setOpen(!open)}
      >
        <Palette className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-xl z-[9999]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-200">Color Picker</h3>
            <div className="h-7 w-7 rounded border border-gray-600" style={{ backgroundColor: selectedColor }} />
          </div>

          {/* Native Color Input */}
          <div className="mb-4">
            <input
              type="color"
              value={selectedColor}
              onChange={handleColorChange}
              className="w-full h-10 rounded cursor-pointer border-0"
            />
          </div>

          {/* Hex Input with Copy */}
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              value={selectedColor}
              onChange={(e) => selectColor(e.target.value)}
              className="flex-1 bg-gray-700 border-gray-600 text-gray-200 font-mono text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-2 bg-gray-600 text-gray-200 border border-gray-500 rounded hover:bg-gray-500 transition-colors duration-200"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>

          {/* Recent Colors */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-400 mb-2">Recent Colors</h4>
            <div className="flex flex-wrap gap-1.5">
              {recentColors.map((color, index) => (
                <button
                  key={`recent-${index}`}
                  className="h-6 w-6 rounded cursor-pointer border border-white/20 transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  onClick={() => selectColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <h4 className="text-xs font-medium text-gray-400 mb-2">Color Palette</h4>
            <div className="flex flex-wrap gap-1.5">
              {colorPalette.map((color, index) => (
                <button
                  key={`palette-${index}`}
                  className="h-6 w-6 rounded cursor-pointer border border-white/20 transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  onClick={() => selectColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
