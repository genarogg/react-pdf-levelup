"use client"
import React from 'react'
import { useState } from "react"
import { Sidebar } from "../components/docs/sidebar"
import { MainContent } from "../components/docs/main-content"
import { ComponentProvider } from "../components/docs/component-provider"
import { LanguageProvider } from "../components/docs/language-provider"
import Header from '../components/Header'

export default function HomePage() {
  const [selectedComponent, setSelectedComponent] = useState("overview")
  return (
    <LanguageProvider>
      <Header context='docs'/>
      <ComponentProvider>
        <div className="flex h-screen bg-black">
          <Sidebar selectedComponent={selectedComponent} onSelectComponent={setSelectedComponent} />
          <MainContent selectedComponent={selectedComponent} onSelectComponent={setSelectedComponent} />
        </div>
      </ComponentProvider>
    </LanguageProvider>
  )
}
