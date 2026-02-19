"use client"
import React, { useState, useCallback, Suspense, lazy } from "react"
import { Github, FileText, Play, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

const TemplateSelector = lazy(() => import("./TemplateSelector"))

interface HeaderProps {
    code?: any
    context?: String
}

// Configuración base de enlaces de navegación (sin etiquetas, se traducen en render)
const NAV_BASE = [
    { href: "#", key: "home" },
    { href: "#features", key: "why" },
    { href: "#templates", key: "templates" },
    { href: "#como-funciona", key: "how" },
    { href: "#api", key: "api" },
    { href: "#hoja-de-ruta", key: "roadmap" },
    { href: "#casos-uso", key: "usecases" },
    { href: "#support", key: "support" },
    { href: "#faq", key: "faq" },
]

// Componente de navegación reutilizable
const Navigation: React.FC<{ className?: string, onNavigate?: () => void }> = ({ className = "", onNavigate }) => {
    const { t } = useTranslation()
    const links = NAV_BASE.map(l => ({ ...l, label: t(`nav.${l.key}`) }))
    return (
        <nav className={className}>
            {links.map((link, index) => (
                <a
                    key={link.href}
                    href={link.href}
                    onClick={() => onNavigate?.()}
                    className="group relative text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium tracking-wide"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    <span className="relative z-10">{link.label}</span>
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
            ))}
        </nav>
    )
}

const Header: React.FC<HeaderProps> = ({ context }) => {
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleMenuToggle = useCallback(() => {
        setMobileOpen(prev => !prev)
    }, [])

    const isHome = context === "home"
    const isPlayground = context === "playgroud"

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
                        <Link
                            to="/"
                            className="group flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]"
                        >

                            <h1 className="text-accent text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent whitespace-nowrap uppercase tracking-wide">
                                React PDF Levelup
                            </h1>
                        </Link>

                        {/* Enlaces a la derecha */}
                        <div className="flex items-center gap-6">


                            {isHome && (
                                <Navigation className="flex items-center gap-8" />
                            )}


                            {isPlayground && (
                                <>
                                    <a
                                        href="/docs/es/get-started"
                                        onClick={() => (null)}
                                        className="group relative flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-md px-2 py-1 bg-blue-500/5 hover:bg-blue-500/10"
                                    >

                                        <span className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-md">
                                            <FileText className="w-4 h-4" />

                                        </span>
                                        <span>documentacion</span>

                                    </a>



                                    <Suspense fallback={
                                        <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
                                    }>
                                        <TemplateSelector />
                                    </Suspense>
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
                                </>
                            )}
                        </div>
                    </div>

                    {/* Layout Mobile - Grid con columnas asimétricas */}
                    <div className="lg:hidden grid grid-cols-[auto_1fr_auto] items-center h-full gap-3">
                        {/* Columna Izquierda: Menú Hamburguesa */}
                        <div className="flex justify-start">
                            {isHome && (
                                <button
                                    className="relative p-2 text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5 group"
                                    aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
                                    onClick={handleMenuToggle}
                                >
                                    <div className="relative w-5 h-5">
                                        <Menu
                                            className={`absolute inset-0 transition-all duration-300 ${mobileOpen
                                                ? 'opacity-0 rotate-90 scale-0'
                                                : 'opacity-100 rotate-0 scale-100'
                                                }`}
                                        />
                                        <X
                                            className={`absolute inset-0 transition-all duration-300 ${mobileOpen
                                                ? 'opacity-100 rotate-0 scale-100'
                                                : 'opacity-0 -rotate-90 scale-0'
                                                }`}
                                        />
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Columna Centro: Logo/Título - Ocupa todo el espacio disponible */}
                        <Link
                            to="/"
                            className="group flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-[1.02] min-w-0"
                        >

                            <h1 className="text-accent font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent truncate uppercase tracking-wide">
                                React PDF Levelup
                            </h1>
                        </Link>

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

            {/* Menú móvil mejorado */}
            {isHome && (
                <aside
                    className={`lg:hidden fixed top-[70px] left-0 right-0 z-40 transition-all duration-500 ease-out ${mobileOpen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-4 pointer-events-none'
                        }`}
                >
                    <div className="bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
                        {/* Gradiente decorativo */}
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />

                        <div className="relative px-4 py-6 max-w-7xl mx-auto">
                            <Navigation className="flex flex-col gap-4 mb-6" onNavigate={() => setMobileOpen(false)} />

                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                            {/* <ActionLinks variant="mobile" className="justify-start" onActionClick={() => setMobileOpen(false)} /> */}
                        </div>
                    </div>
                </aside>
            )}

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                nav a {
                    animation: slideIn 0.5s ease-out backwards;
                }
            `}</style>
        </>
    )
}

export default React.memo(Header)
