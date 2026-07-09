import React from "react"
import { Github } from "lucide-react"

const Header: React.FC = () => {
    return (
        <>
            <div className="h-[70px]" />
            <header className="fixed top-0 left-0 right-0 z-50 h-[70px]">
                {/* Fondo con blur y gradiente */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-b border-white/10" />

                {/* Gradiente decorativo superior */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                {/* Gradiente animado de fondo */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50" />

                {/* Efecto de brillo en movimiento */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
                    }}
                />

                <div className="relative z-10 h-full px-4 md:px-6 lg:px-8">
                    {/* Layout Desktop */}
                    <div className="hidden lg:flex justify-between items-center h-full max-w-full">
                        {/* Logo a la izquierda */}
                        <div
                            className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
                        >

                            <h1 className="text-accent text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent whitespace-nowrap uppercase tracking-wide">
                                React PDF Levelup
                            </h1>
                        </div>

                        {/* Enlaces a la derecha */}
                        <div className="flex items-center gap-6">
                            <a
                                href="https://github.com/genarogg/react-pdf-levelup"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 rounded-md px-2 py-1 bg-slate-500/6 hover:bg-slate-500/12"
                            >
                                <span className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-md bg-transparent group-hover:bg-white/5 transition-colors duration-200">
                                    <Github className="w-4 h-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                                </span>
                            </a>
                        </div>
                    </div>

                    {/* Layout Mobile - Grid con columnas asimétricas */}
                    <div className="lg:hidden grid grid-cols-[1fr_auto] items-center h-full gap-3">
                        {/* Columna Izquierda: Logo/Título */}
                        <div
                            className="group flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02] min-w-0"
                        >

                            <h1 className="text-accent font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent truncate uppercase tracking-wide">
                                React PDF Levelup
                            </h1>
                        </div>

                        {/* Columna Derecha: Solo GitHub */}
                        <div className="flex justify-end items-center flex-shrink-0">
                            <a
                                href="https://github.com/genarogg/react-pdf-levelup"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative p-2 text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
                            >
                                <Github className="w-5 h-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Línea inferior decorativa */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </header>
        </>
    )
}

export default React.memo(Header)
