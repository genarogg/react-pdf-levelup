"use client"
import React, { useState, useCallback, useMemo, Suspense, lazy } from "react"
import { Github, Coffee, FileText, Play, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

const TemplateSelector = lazy(() => import("./TemplateSelector"))

interface HeaderProps {
    code?: any
    context?: "playgroud" | "docs" | "home"
}

const linkStyles =
    "text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-1.5 text-sm font-medium"
const iconStyles = "w-4 h-4"

const Header: React.FC<HeaderProps> = ({ context }) => {
    const [mobileOpen, setMobileOpen] = useState(false)
    const handleMenuToggle = useCallback(() => {
        setMobileOpen(prev => !prev)
    }, [])
    return (
        <>
            <div className="h-[70px]"></div>
            <header className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800/50 px-2.5 py-3 shadow-2xl backdrop-blur-sm h-[70px] fixed top-0 left-0 right-0 z-50 will-change-auto">
                {/* Gradiente de fondo con fixed para mejor rendimiento */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/5 via-gray-700/10 to-gray-800/5 pointer-events-none" style={{ willChange: 'auto' }}></div>

                <div className="flex justify-between items-center relative z-10 h-full w-full">
                    <div className="flex items-center gap-2">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8from-gray-600 rounded-lg flex items-center justify-center shadow-lg">
                                <img src="/iconos/favicon-192x192.png" alt="@react-pdf-levelup/core" />
                            </div>

                            <h1 className="text-xl md:text-2xl font-bold ">
                                React PDF Levelup
                            </h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">



                        {context === "playgroud" ? (
                            <a href="/docs" className={linkStyles}>
                                <FileText className={iconStyles} />
                            </a>
                        ) : null}

                        {context === "home" ? (
                            <nav className="hidden md:flex items-center gap-4">
                                <a href="#" className={linkStyles}>inicio</a>
                                <a href="#features" className={linkStyles}>Porque</a>
                                <a href="#templates" className={linkStyles}>Plantillas</a>
                                <a href="#como-funciona" className={linkStyles}>funcionamiento</a>
                                <a href="#api" className={linkStyles}>API</a>
                                <a href="#hoja-de-ruta" className={linkStyles}>Hoja de ruta</a>
                                <a href="#casos-uso" className={linkStyles}>Casos de uso</a>
                                <a href="#support" className={linkStyles}>suporte</a>
                                <a href="#faq" className={linkStyles}>FAQ</a>
                                {/* <a href="#comparacion" className={linkStyles}>Comparación</a> */}
                                {/* <a href="#por-que-levelup" className={linkStyles}>vs</a> */}
                            </nav>
                        ) : null}
                        <a href="/docs" className={linkStyles}>
                            
                            <span>Documentación</span>
                        </a>
                        <Link to="/playground" className={linkStyles}>
                            <Play className={iconStyles} />
                        </Link>
                        <a
                            href="https://github.com/genarogg/react-pdf-levelup"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkStyles}
                        >
                            <Github className={iconStyles} />

                        </a>


                        {/* <a
                            href="https://www.paypal.com/paypalme/genaroggpaypal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" hover:text-amber-300 transition-colors duration-200 flex items-center gap-1.5 text-sm font-medium"
                        >
                            <Coffee className={iconStyles} />

                        </a> */}
                        {context === "playgroud" ? (
                            <Suspense fallback={<div className="w-4 h-4" />}>
                                <TemplateSelector />
                            </Suspense>
                        ) : null}

                        {context === "home" ? (
                            <button
                                className="md:hidden text-gray-300 hover:text-white transition-colors"
                                aria-label="Abrir menú"
                                onClick={handleMenuToggle}
                            >
                                {mobileOpen ? <X className={iconStyles} /> : <Menu className={iconStyles} />}
                            </button>
                        ) : null}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </header>
            {context === "home" && mobileOpen ? (
                <aside className="md:hidden bg-black/80 border-t border-gray-800/50 px-3 py-4">
                    <nav className="flex flex-col gap-2">
                        <a href="#" className={linkStyles}>inicio</a>
                        <a href="#features" className={linkStyles}>Porque</a>
                        <a href="#templates" className={linkStyles}>Plantillas</a>
                        <a href="#como-funciona" className={linkStyles}>funcionamiento</a>
                        <a href="#api" className={linkStyles}>API</a>
                        <a href="#hoja-de-ruta" className={linkStyles}>Hoja de ruta</a>
                        <a href="#casos-uso" className={linkStyles}>Casos de uso</a>
                        <a href="#support" className={linkStyles}>suporte</a>
                        <a href="#faq" className={linkStyles}>FAQ</a>
                    </nav>
                    <div className="mt-3 flex items-center gap-3">
                        <a href="https://github.com/genarogg/react-pdf-levelup" target="_blank" rel="noopener noreferrer" className={linkStyles}>
                            <Github className={iconStyles} />
                            <span>GitHub</span>
                        </a>

                        <a href="/playground" className={linkStyles}>
                            <Play className={iconStyles} />
                            <span className="hidden sm:inline">Playground</span>
                        </a>

                        <a href="/docs" className={linkStyles}>
                          
                            <span>Documentación</span>
                        </a>
                    </div>
                </aside>
            ) : null}
        </>
    )
}

export default React.memo(Header)
