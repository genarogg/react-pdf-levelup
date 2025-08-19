"use client"

import React, { useState } from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Grid3X3,
  List,
  Layout,
  Tablet,
  Home,
  Type,
  ImageIcon,
  QrCode,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { useLanguage } from "./language-provider"
import { LanguageSelector } from "./language-selector"

interface SidebarProps {
  selectedComponent: string
  onSelectComponent: (component: string) => void
}

export function Sidebar({ selectedComponent, onSelectComponent }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { t } = useLanguage()

  const components = [
    {
      id: "overview",
      name: t("overview"),
      icon: Home,
      description: t("getting.started.desc"),
      category: t("getting.started"),
    },
    {
      id: "implementation",
      name: t("implementation"),
      icon: FileText,
      description: t("backend.frontend.usage"),
      category: t("getting.started"),
    },

    // Content Components
    {
      id: "etiquetas",
      name: t("text.elements"),
      icon: Type,
      description: t("typography.components"),
      category: t("content"),
    },
    { id: "lista", name: t("lists"), icon: List, description: t("list.components"), category: t("content") },

    // Layout Components
    { id: "tablet", name: t("tablet"), icon: Tablet, description: t("table.component"), category: t("layout") },
    { id: "grid", name: t("grid.system"), icon: Grid3X3, description: t("bootstrap.like.grid"), category: t("layout") },
    { id: "position", name: t("position"), icon: Layout, description: t("positioning.wrapper"), category: t("layout") },
    { id: "layoutpdf", name: t("layout.pdf"), icon: FileText, description: t("pdf.layout"), category: t("layout") },

    // Media Components
    { id: "img", name: t("image"), icon: ImageIcon, description: t("image.display"), category: t("media") },
    { id: "img-bg", name: t("imgbg"), icon: ImageIcon, description: t("background.images"), category: t("media") },
    { id: "qr", name: t("qr.code"), icon: QrCode, description: t("qr.code.display"), category: t("media") },
  ]

  const groupedComponents = components.reduce(
    (acc, component) => {
      const category = component.category || "Other"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(component)
      return acc
    },
    {} as Record<string, typeof components>,
  )

  return (
    <div
      className={cn(
        "bg-black border-r border-gray-800 transition-all duration-300 flex flex-col h-full max-h-[calc(100vh-70px)]",
        isCollapsed ? "w-16" : "w-80",
      )} 

      style={{backgroundColor: "#020817"}}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-white font-mono">{t("pdf.components")}</h1>
            <p className="text-sm text-gray-400">{t("interactive.documentation")}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-gray-800"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-4 border-b border-gray-800 flex-shrink-0">
          <LanguageSelector />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-4">
          {Object.entries(groupedComponents).map(([category, categoryComponents]) => (
            <div key={category}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">{category}</h3>
              )}
              <div className="space-y-1">
                {categoryComponents.map((component) => {
                  const Icon = component.icon
                  const isSelected = selectedComponent === component.id

                  return (
                    <Button
                      key={component.id}
                      variant={isSelected ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-auto p-3 transition-colors",
                        isSelected
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-white hover:bg-gray-700 hover:text-white",
                        isCollapsed && "justify-center",
                      )}
                      onClick={() => onSelectComponent(component.id)}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 text-left">
                          <div className="font-medium">{component.name}</div>
                          <div className="text-xs opacity-70">{component.description}</div>
                        </div>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
              v1.0.0
            </Badge>
            <span>{t("react.pdf.components")}</span>
          </div>
        </div>
      )}
    </div>
  )
}
