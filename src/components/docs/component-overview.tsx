"use client"
import React from 'react'
import { useLanguage } from "./language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { FileText, Zap, Code, Palette, ArrowRight } from "lucide-react"

interface ComponentOverviewProps {
  onSelectComponent?: (component: string) => void
}

export function ComponentOverview({ onSelectComponent }: ComponentOverviewProps) {
  const { translations } = useLanguage()

  return (
    <div className="flex-1 overflow-auto bg-black" >
      <div className="p-8 max-w-4xl mx-auto" >
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-serif mb-4 text-white">{translations.pdfComponentsDocumentation}</h1>
          <p className="text-xl text-gray-400 mb-6">{translations.comprehensiveCollection}</p>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
              React PDF
            </Badge>
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
              TypeScript
            </Badge>
            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
              {translations.interactive}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-blue-500" />
                {translations.tenComponents}
              </CardTitle>
              <CardDescription className="text-gray-400">{translations.completeSetDescription}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-yellow-500" />
                {translations.interactiveExamples}
              </CardTitle>
              <CardDescription className="text-gray-400">{translations.liveCodeExamples}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Code className="h-5 w-5 text-green-500" />
                {translations.typescriptSupport}
              </CardTitle>
              <CardDescription className="text-gray-400">{translations.fullTypescriptDefinitions}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Palette className="h-5 w-5 text-purple-500" />
                {translations.professionalDesign}
              </CardTitle>
              <CardDescription className="text-gray-400">{translations.cleanModernInterface}</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{translations.quickStart}</CardTitle>
            <CardDescription className="text-gray-400">{translations.getStartedMinutes}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <code className="text-sm text-gray-300">npm install react-pdf-levelup</code>
              </div>
              <p className="text-sm text-gray-400">{translations.importAnyComponent}</p>
              <Button
                onClick={() => onSelectComponent?.("implementation")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              >
                Ver Implementación
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
