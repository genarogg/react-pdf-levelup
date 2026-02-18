
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { FileText, Github, Play, ArrowUp } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

interface NavProps {

}

const Nav: React.FC<NavProps> = () => {
    const [showTop, setShowTop] = useState(false)
    const { i18n } = useTranslation()

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 300)
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <nav aria-label="acciones rápidas" className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-50">
            <div
                className={`rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/10 shadow-lg px-2 py-1.5 overflow-hidden transition-all duration-300 ease-out md:px-3 md:py-2 ${showTop ? "max-w-[16rem] md:max-w-[28rem]" : "max-w-[14rem] md:max-w-[22rem]"}`}
            >
                <ul className="flex items-center gap-1 md:gap-2">
                    <li>
                        <div className="flex items-center gap-0.5 md:gap-1 rounded-md bg-white/5 p-0.5 md:p-1">
                            <Button
                                size="sm"
                                variant="outline"
                                className={`h-6 md:h-8 px-1.5 md:px-2 text-xs ${i18n.language.startsWith("es") ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-transparent text-gray-300 hover:text-white"}`}
                                aria-label="Cambiar a Español"
                                onClick={() => i18n.changeLanguage("es")}
                            >
                                ES
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className={`h-6 md:h-8 px-1.5 md:px-2 text-xs ${i18n.language.startsWith("en") ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-transparent text-gray-300 hover:text-white"}`}
                                aria-label="Change to English"
                                onClick={() => i18n.changeLanguage("en")}
                            >
                                EN
                            </Button>
                        </div>
                    </li>
                    <li>
                        <Link
                            to="/playground"
                            onClick={() => (null)}
                            className="group flex items-center gap-1 md:gap-2 text-gray-300 hover:text-white transition-all duration-300 rounded-md px-1 md:px-2 py-1 bg-purple-500/5 hover:bg-purple-500/10"
                        >
                            <span className="w-7 md:w-9 h-7 md:h-9 flex items-center justify-center flex-shrink-0 rounded-md bg-transparent group-hover:bg-white/5 transition-colors duration-200">
                                <Play className="w-3.5 md:w-4 h-3.5 md:h-4 transition-transform duration-300 group-hover:scale-110" />
                            </span>
                        </Link>
                    </li>
                    <li>
                        <a
                            href="/docs"
                            onClick={() => (null)}
                            className="group flex items-center gap-1 md:gap-2 text-gray-300 hover:text-white transition-all duration-300 rounded-md px-1 md:px-2 py-1 bg-blue-500/5 hover:bg-blue-500/10"
                        >
                            <span className="w-7 md:w-9 h-7 md:h-9 flex items-center justify-center flex-shrink-0 rounded-md">
                                <FileText className="w-3.5 md:w-4 h-3.5 md:h-4" />
                            </span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://github.com/genarogg/react-pdf-levelup"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => (null)}
                            className="group flex items-center gap-1 md:gap-2 text-gray-300 hover:text-white transition-all duration-300 rounded-md px-1 md:px-2 py-1 bg-slate-500/10 hover:bg-slate-500/20"
                        >
                            <span className="w-7 md:w-9 h-7 md:h-9 flex items-center justify-center flex-shrink-0 rounded-md bg-transparent group-hover:bg-white/5 transition-colors duration-200">
                                <Github className="w-3.5 md:w-4 h-3.5 md:h-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                            </span>
                        </a>
                    </li>
                    <li
                        className={`overflow-hidden transition-all duration-300 ease-out transform ${showTop ? "w-7 md:w-11 opacity-100 scale-100 translate-y-0" : "w-0 opacity-0 scale-90 translate-y-1"}`}
                        aria-hidden={!showTop}
                    >
                        <Button
                            aria-label="Volver arriba"
                            size="lg"
                            className={`rounded-md shadow-lg bg-emerald-600 text-white hover:bg-emerald-700 p-0 transition-all duration-300 ${showTop ? "w-7 md:w-11 h-7 md:h-11" : "w-0 h-0 pointer-events-none"}`}
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                            <ArrowUp className="w-3.5 md:w-5 h-3.5 md:h-5" />
                        </Button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Nav;
