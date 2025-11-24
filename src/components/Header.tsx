'use client'
import React from 'react'

import { Github, Download, Coffee } from "lucide-react"
import TemplateSelector from "./TemplateSelector"
import ColorPicker from "./ColorPicker"


interface HeaderProps {
    code?: any
    context?: "playgroud" | "docs"
}



const Header: React.FC<HeaderProps> = ({ code, context }) => {

    const handleColorSelect = (color: string) => {
        console.log("Color seleccionado:", color)
    }

    const downloadTemplate = (templateCode: string) => {
        // Add necessary imports to the template
        const importsSection = `import React from "react";
import { 
      LayoutPDF, 
      Container, 
      Row, 
      Col1, Col2, Col3, Col4, Col5, Col6, Col7, Col8, Col9, Col10, Col11, Col12,
      P, H1, H2, H3, H4, H5, H6, Strong, Em, U, Small, Blockquote, Mark, Span, BR, A,
      Table, Thead, Tbody, Tr, Th, Td,
      Left, Right, Center,
      Img, QR,
      Header, Footer,
      UL, OL, LI,
      View, Text, StyleSheet, Font,
      ImgBg,
      Div,
    } from "react-pdf-levelup";

`

        // Create the full template content with imports
        const fullTemplateContent = importsSection + templateCode

        // Create a blob with the content
        const blob = new Blob([fullTemplateContent], { type: "text/plain" })
        const url = URL.createObjectURL(blob)

        // Create a temporary link element to trigger the download
        const a = document.createElement("a")
        a.href = url
        a.download = "template.tsx"
        document.body.appendChild(a)
        a.click()

        // Clean up
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }


    return (
        <>
            <header className="relative bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800/50 px-2.5 py-3 shadow-2xl backdrop-blur-sm h-[70px]">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 via-gray-700/20 to-gray-800/10 animate-pulse"></div>

                <div className="flex justify-between items-center relative z-10 h-full w-full">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">📄</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-clip-text text-transparent">
                            React PDF Editor
                        </h1>
                    </div>

                    <div className="flex items-center gap-1.5">


                        {context === "playgroud" ? (
                            <>
                                <div className="bg-gray-800/30 backdrop-blur-md rounded-lg p-1">
                                    <TemplateSelector />
                                </div>
                                <a
                                    href="/docs"
                                    className="group flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-200 px-3 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-500/25 hover:scale-105 border border-gray-600/50"
                                >
                                    <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="hidden sm:inline font-medium text-sm">Docs</span>
                                </a>
                            </>
                        ) : null}

                        {context === "docs" ? (
                            <a
                                href="/"
                                className="group flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-200 px-3 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-500/25 hover:scale-105 border border-gray-600/50"
                            >
                                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span className="hidden sm:inline font-medium text-sm">playground</span>
                            </a>
                        ) : null}

                        {code && (<button
                            className="group flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-3 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-500/25 hover:scale-105 border border-gray-500/50"
                            onClick={() => downloadTemplate(code)}
                        >
                            <Download size={16} className="group-hover:animate-bounce" />
                            <span className="hidden sm:inline font-medium text-sm">Download</span>
                        </button>
                        )}
                        <a
                            href="https://www.paypal.com/paypalme/genaroggpaypal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-700 hover:from-amber-500 hover:to-yellow-600 text-white px-3 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-600/25 hover:scale-105 border border-yellow-600/50"
                        >
                            <Coffee size={16} className="group-hover:animate-pulse" />
                            <span className="hidden sm:inline font-medium text-sm">Support</span>
                        </a>

                        <a
                            href="https://github.com/genarogg/react-pdf-levelup"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-800 text-gray-200 px-3 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-gray-700/25 hover:scale-105 border border-gray-700/50"
                        >
                            <Github size={16} className="group-hover:rotate-12 transition-transform" />
                            <span className="hidden sm:inline font-medium text-sm">GitHub</span>
                        </a>
                        {context === "playgroud" ? (
                            <>
                                <div className="hidden md:flex items-center gap-2 bg-gray-800/30 backdrop-blur-md rounded-lg p-1 border border-gray-700/50">
                                    <ColorPicker onColorSelect={handleColorSelect} />
                                </div>
                            </>
                        ) : null}

                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </header>
            <div className="flex md:hidden items-center justify-center gap-3 py-2 bg-gray-800 border-b border-gray-700">
                <ColorPicker onColorSelect={handleColorSelect} />
                <TemplateSelector />
            </div>
        </>
    );
}

export default Header;