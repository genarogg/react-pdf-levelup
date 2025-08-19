"use client"
import React from 'react'
import { useComponent } from "./component-provider"
import { useLanguage } from "./language-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { CodeBlock } from "./code-block"
import { Copy } from "lucide-react"


interface ComponentDetailProps {
  componentId: string
}

export function ComponentDetail({ componentId }: ComponentDetailProps) {
  const component = useComponent(componentId)
  const { language, translations } = useLanguage()

  if (!component) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <p className="text-gray-400">{translations.componentNotFound}</p>
      </div>
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="flex-1 bg-black overflow-y-auto"     style={{backgroundColor: "#020817"}}>
      <div className="p-8 pb-20 max-w-6xl mx-auto opacity-100">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-white font-mono">{component.name}</h1>
            <Badge
              variant="secondary"
              className={
                component.category === "Layout"
                  ? "bg-blue-600 text-white"
                  : component.category === "Content"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
              }
            >
              {translations.categories[component.category] || component.category}
            </Badge>
          </div>
          <p className="text-lg text-gray-400 mb-4">{component.description[language]}</p>
          <div className="flex gap-2">
            {component.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-gray-600 text-gray-300 bg-gray-800">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-700">
            <TabsTrigger
              value="overview"
              className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              {translations.overview}
            </TabsTrigger>
            <TabsTrigger
              value="props"
              className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              {translations.props}
            </TabsTrigger>
            <TabsTrigger
              value="examples"
              className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              {translations.examples}
            </TabsTrigger>
            <TabsTrigger
              value="usage"
              className="text-gray-300 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
            >
              {translations.usage}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl font-semibold">{translations.componentOverview}</CardTitle>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  {translations.understandingComponent.replace("{component}", component.name)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-lg max-w-none text-gray-300 leading-relaxed">
                  <p className="text-white font-mono font-normal leading-7 text-sm">{component.overview[language]}</p>
                  {component.features && (
                    <div className="mt-8">
                      <h4 className="font-semibold mb-4 text-white text-lg">{translations.keyFeatures}:</h4>
                      <ul className="space-y-3 ml-4">
                        {component.features[language].map((feature: any, index: any) => (
                          <li key={index} className="flex items-start gap-3 text-base leading-6">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="props" className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl font-semibold">{translations.propsInterface}</CardTitle>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  {translations.allAvailableProps.replace("{component}", component.name)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {component.props.map((prop) => (
                    <div key={prop.name} className="border-l-4 border-blue-600 pl-6 py-3 bg-gray-800/30 rounded-r-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <code className="text-base font-mono bg-gray-800 text-blue-300 px-3 py-2 rounded-md font-medium">
                          {prop.name}
                        </code>
                        <Badge
                          variant={prop.required ? "destructive" : "secondary"}
                          className={
                            prop.required ? "bg-red-600 text-white px-3 py-1" : "bg-gray-700 text-gray-300 px-3 py-1"
                          }
                        >
                          {prop.required ? translations.required : translations.optional}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-400 leading-5">
                          <span className="font-medium">{translations.type}:</span>{" "}
                          <code className="text-sm text-green-400 bg-gray-800 px-2 py-1 rounded">{prop.type}</code>
                        </p>
                        <p className="text-base text-gray-300 leading-6">{prop.description[language]}</p>
                        {prop.default && (
                          <p className="text-sm text-gray-500 leading-5">
                            <span className="font-medium">{translations.default}:</span>{" "}
                            <code className="text-yellow-400 bg-gray-800 px-2 py-1 rounded">{prop.default}</code>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            {component.examples.map((example, index) => (
              <Card key={index} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-white">{example.title[language]}</CardTitle>
                      <CardDescription className="text-gray-400">{example.description[language]}</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(example.code)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {translations.copy}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={example.code} language="tsx" />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-xl font-semibold">{translations.usageGuidelines}</CardTitle>
                <CardDescription className="text-gray-400 text-base leading-relaxed">
                  {translations.bestPractices}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none text-gray-300 leading-relaxed">
                  <div
                    className="space-y-4 text-base leading-7 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-white [&>h3]:mb-3 [&>h4]:text-base [&>h4]:font-medium [&>h4]:text-gray-200 [&>h4]:mb-2 [&>p]:mb-4 [&>ul]:space-y-2 [&>ul]:ml-4 [&>li]:flex [&>li]:items-start [&>li]:gap-2"
                    dangerouslySetInnerHTML={{ __html: component.usage[language] }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
