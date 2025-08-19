"use client"
import React from 'react'
import { ComponentOverview } from "./component-overview"
import { ComponentDetail } from "./component-detail"

interface MainContentProps {
  selectedComponent: string
  onSelectComponent: (component: string) => void
}

export function MainContent({ selectedComponent, onSelectComponent }: MainContentProps) {
  if (selectedComponent === "overview") {
    return <ComponentOverview onSelectComponent={onSelectComponent}  />
  }

  return <ComponentDetail componentId={selectedComponent} />
}
