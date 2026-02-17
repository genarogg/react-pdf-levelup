
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
        <nav>
            <ul>
                <li>
                    <Link
                        to="/playground"
                        onClick={() => (null)}
                        className="group relative flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 rounded-md px-2 py-1 bg-purple-500/5 hover:bg-purple-500/10">
                        <span className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-md bg-transparent group-hover:bg-white/5 transition-colors duration-200">
                            <Play className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                        </span>
                    </Link>
                </li>
                <li>
                    <a
                        href="/docs"
                        onClick={() => (null)}
                        className="group relative flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-md px-2 py-1 bg-blue-500/5 hover:bg-blue-500/10"
                    >
                        <span className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-md">
                            <FileText className="w-4 h-4" />
                        </span>
                    </a>
                </li>
                <li>
                    <a
                        href="https://github.com/genarogg/react-pdf-levelup"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => (/* noop, external link */ null)}
                        className="group relative flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 rounded-md px-2 py-1 bg-slate-500/6 hover:bg-slate-500/12"
                    >

                        <span className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-md bg-transparent group-hover:bg-white/5 transition-colors duration-200">
                            <Github className="w-4 h-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                        </span>

                    </a>
                </li>
                {showTop && (
                    <li>

                        <div className="fixed bottom-6 right-6 z-50">
                            <Button
                                size="lg"
                                className="shadow-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                <ArrowUp />
                            </Button>
                        </div>
                    </li>
                )}
            </ul>
        </nav >
    );
}

export default Nav;