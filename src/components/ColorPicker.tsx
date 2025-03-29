"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Palette } from "lucide-react"

interface ColorPickerProps {
  onColorSelect?: (color: string) => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState("#3366cc")
  const [recentColors, setRecentColors] = useState<string[]>(["#3366cc", "#dc3545", "#28a745", "#ffc107", "#17a2b8"])
  const [copied, setCopied] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)

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
    "#007bff",
    "#0056b3",
    "#6610f2",
    "#6f42c1",
    "#e83e8c",
    "#dc3545",
    "#fd7e14",
    "#ffc107",
    "#28a745",
    "#20c997",
    "#17a2b8",
  ]

  useEffect(() => {
    // Close color picker when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setSelectedColor(color)
    if (onColorSelect) {
      onColorSelect(color)
    }
  }

  const selectColor = (color: string) => {
    setSelectedColor(color)
    if (onColorSelect) {
      onColorSelect(color)
    }

    // Add to recent colors if not already there
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
    <div className="color-picker-container" ref={colorPickerRef}>
      <button className="color-picker-button" onClick={() => setIsOpen(!isOpen)}>
        <Palette size={20} style={{ color: selectedColor }} />
      </button>

      {isOpen && (
        <div className="color-picker-panel">
          <div className="color-picker-header">
            <h3>Color Picker</h3>
            <div className="selected-color-preview" style={{ backgroundColor: selectedColor }}></div>
          </div>

          <div className="color-input-container">
            <input type="color" value={selectedColor} onChange={handleColorChange} className="color-input" />
            <div className="hex-value-container">
              <input
                type="text"
                value={selectedColor}
                onChange={(e) => selectColor(e.target.value)}
                className="hex-input"
              />
              <button className="copy-button" onClick={copyToClipboard}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="color-section">
            <h4>Recent Colors</h4>
            <div className="color-grid">
              {recentColors.map((color, index) => (
                <div
                  key={`recent-${index}`}
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                  onClick={() => selectColor(color)}
                  title={color}
                ></div>
              ))}
            </div>
          </div>

          <div className="color-section">
            <h4>Color Palette</h4>
            <div className="color-grid">
              {colorPalette.map((color, index) => (
                <div
                  key={`palette-${index}`}
                  className="color-swatch"
                  style={{ backgroundColor: color }}
                  onClick={() => selectColor(color)}
                  title={color}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorPicker

