
import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { FileText, Github, Play, ArrowUp } from "lucide-react"
import { Link } from "react-router-dom"

interface NavProps {

}

const Nav: React.FC<NavProps> = () => {
    const [showTop, setShowTop] = useState(false)

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 300)
        window.addEventListener("scroll", onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <nav aria-label="acciones rápidas" className="fixed bottom-6 right-6 z-50">
            <div
                className={`rounded-2xl bg-neutral-900/60 backdrop-blur-md border border-white/10 shadow-lg px-2 py-2 overflow-hidden transition-all duration-300 ease-out ${showTop ? "max-w-[17rem]" : "max-w-[13rem]"}`}
            >
                <ul className="flex items-center gap-2">
                    <li>
                        <Link
                            to="/playground"
                            onClick={() => (null)}
                            className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 rounded-md px-2 py-1 bg-purple-500/5 hover:bg-purple-500/10"
                        >
                            <span className="w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-md bg-transparent group-hover:bg-white/5 transition-colors duration-200">
                                <Play className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                            </span>
                        </Link>
                    </li>
                    <li>
                        <a
                            href="/docs"
                            onClick={() => (null)}
                            className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 rounded-md px-2 py-1 bg-blue-500/5 hover:bg-blue-500/10"
                        >
                            <span className="w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-md">
                                <FileText className="w-4 h-4" />
                            </span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://github.com/genarogg/react-pdf-levelup"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => (null)}
                            className="group flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 rounded-md px-2 py-1 bg-slate-500/10 hover:bg-slate-500/20"
                        >
                            <span className="w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-md bg-transparent group-hover:bg-white/5 transition-colors duration-200">
                                <Github className="w-4 h-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                            </span>
                        </a>
                    </li>
                    <li
                        className={`overflow-hidden transition-all duration-300 ease-out transform ${showTop ? "w-11 opacity-100 scale-100 translate-y-0" : "w-0 opacity-0 scale-90 translate-y-1"}`}
                        aria-hidden={!showTop}
                    >
                        <Button
                            aria-label="Volver arriba"
                            size="lg"
                            className={`rounded-md shadow-lg bg-emerald-600 text-white hover:bg-emerald-700 p-0 transition-all duration-300 ${showTop ? "w-11 h-11" : "w-0 h-0 pointer-events-none"}`}
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                            <ArrowUp className="w-5 h-5" />
                        </Button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Nav;
