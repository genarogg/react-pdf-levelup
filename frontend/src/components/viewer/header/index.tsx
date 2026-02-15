"use client"
import React, { useState, useCallback, Suspense, lazy } from "react"
import { Github, FileText, Play, Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

const TemplateSelector = lazy(() => import("./TemplateSelector"))

interface HeaderProps {
    code?: any
    context?: "playgroud" | "docs" | "home"
}

// Configuración de enlaces de navegación
const NAV_LINKS = [
    { href: "#", label: "Inicio" },
    { href: "#features", label: "Por qué" },
    { href: "#templates", label: "Plantillas" },
    { href: "#como-funciona", label: "Cómo funciona" },
    { href: "#api", label: "API" },
    { href: "#hoja-de-ruta", label: "Roadmap" },
    { href: "#casos-uso", label: "Casos de uso" },
    { href: "#support", label: "Soporte" },
    { href: "#faq", label: "FAQ" },
]

// Componente de navegación reutilizable
<<<<<<< HEAD
const Navigation: React.FC<{ className?: string }> = ({ className = "" }) => (
=======
const Navigation: React.FC<{ className?: string, onNavigate?: () => void }> = ({ className = "", onNavigate }) => (
>>>>>>> funcional
    <nav className={className}>
        {NAV_LINKS.map((link, index) => (
            <a 
                key={link.href} 
                href={link.href} 
<<<<<<< HEAD
=======
                onClick={() => onNavigate?.()}
>>>>>>> funcional
                className="group relative text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium tracking-wide"
                style={{ animationDelay: `${index * 50}ms` }}
            >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </a>
        ))}
    </nav>
)

<<<<<<< HEAD
// Componente de enlaces de acción reutilizable
=======

// Componente de enlaces de acción reutilizable (mejor soporte responsive)
>>>>>>> funcional
const ActionLinks: React.FC<{ 
    showPlayground?: boolean
    showDocs?: boolean
    className?: string
    variant?: "default" | "mobile"
<<<<<<< HEAD
=======
    onActionClick?: () => void
>>>>>>> funcional
}> = ({ 
    showPlayground = true, 
    showDocs = true,
    className = "",
    variant = "default"
<<<<<<< HEAD
}) => (
    <div className={`flex items-center ${variant === "mobile" ? "gap-3" : "gap-4"} ${className}`}>
        {showDocs && (
            <a 
                href="/docs" 
                className="group relative text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2 text-sm font-medium"
            >
                {variant === "mobile" && <FileText className="w-4 h-4" />}
                <span>Documentación</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </a>
        )}
        {showPlayground && (
            <Link 
                to="/playground" 
                className="group relative p-2 text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
            >
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                {variant === "mobile" && <span className="ml-2">Playground</span>}
            </Link>
        )}
        <a
            href="https://github.com/genarogg/react-pdf-levelup"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-2 text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
        >
            <Github className="w-4 h-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
            {variant === "mobile" && <span className="ml-2">GitHub</span>}
        </a>
    </div>
)
=======
}) => {
    const isMobile = variant === "mobile"

    return (
        <div className={`flex items-center min-w-0 ${isMobile ? "gap-3" : "gap-4"} ${className}`}>
            {showDocs && (
                <a
                    href="/docs"
                    onClick={() => (/* noop, let parent override if needed */ null)}
                    className="group relative flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-300 rounded-md px-2 py-1 bg-blue-500/5 hover:bg-blue-500/10"
                >
                    {!isMobile && (
                        <span className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-md">
                            <FileText className="w-4 h-4" />
                        </span>
                    )}
                    <span className="truncate whitespace-nowrap">Documentación</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
                </a>
            )}

            {showPlayground && (
                <Link
                    to="/playground"
                    onClick={() => (/* noop, parent may close menu via onActionClick prop */ null)}
                    className="group relative flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 rounded-md px-2 py-1 bg-purple-500/5 hover:bg-purple-500/10"
                >
                    {!isMobile && (
                        <span className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-md bg-transparent group-hover:bg-white/5 transition-colors duration-200">
                            <Play className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                        </span>
                    )}
                    {isMobile && <span className="truncate whitespace-nowrap">Playground</span>}
                </Link>
            )}

            <a
                href="https://github.com/genarogg/react-pdf-levelup"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => (/* noop, external link */ null)}
                className="group relative flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 rounded-md px-2 py-1 bg-slate-500/6 hover:bg-slate-500/12"
            >
                {!isMobile && (
                    <span className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-md bg-transparent group-hover:bg-white/5 transition-colors duration-200">
                        <Github className="w-4 h-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                    </span>
                )}
                {isMobile && <span className="truncate whitespace-nowrap">GitHub</span>}
            </a>
        </div>
    )
}
>>>>>>> funcional

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
<<<<<<< HEAD
                            <div className="relative w-10 h-10">
                                {/* Glow effect exterior */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00d4ff] via-[#0099ff] to-[#0066ff] blur-md opacity-75"></div>
                                {/* Borde con gradiente */}
                                <div className="relative rounded-xl bg-gradient-to-br from-[#00d4ff] via-[#0099ff] to-[#0066ff] p-[2px] shadow-lg shadow-blue-500/50 group-hover:shadow-xl group-hover:shadow-blue-400/70 transition-all duration-300">
                                    <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center p-1">
                                        <img 
                                            src="/iconos/favicon-192x192.png" 
                                            alt="@react-pdf-levelup/core"
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent whitespace-nowrap">
                                React PDF Levelup
                            </h1>
                        </Link>

                        {/* Enlaces a la derecha */}
                        <div className="flex items-center gap-6">
                            {isPlayground && (
                                <a 
                                    href="/docs" 
                                    className="group relative p-2 text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
                                >
                                    <FileText className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                </a>
                            )}

=======
                           
                            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent whitespace-nowrap uppercase tracking-wide">
                                React PDF Levelup
                            </h1>
                        </Link>

                        {/* Enlaces a la derecha */}
                        <div className="flex items-center gap-6">
                            {/* {isPlayground && (
                                <a 
                                    href="/docs" 
                                    className="group relative p-2 text-gray-300 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
                                >
                                    <FileText className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                </a>
                            )} */}

>>>>>>> funcional
                            {isHome && (
                                <Navigation className="flex items-center gap-8" />
                            )}
                            
                            <ActionLinks />

                            {isPlayground && (
                                <Suspense fallback={
                                    <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
                                }>
                                    <TemplateSelector />
                                </Suspense>
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
                                            className={`absolute inset-0 transition-all duration-300 ${
                                                mobileOpen 
                                                    ? 'opacity-0 rotate-90 scale-0' 
                                                    : 'opacity-100 rotate-0 scale-100'
                                            }`} 
                                        />
                                        <X 
                                            className={`absolute inset-0 transition-all duration-300 ${
                                                mobileOpen 
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
<<<<<<< HEAD
                            <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                                {/* Glow effect exterior */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00d4ff] via-[#0099ff] to-[#0066ff] blur-md opacity-75"></div>
                                {/* Borde con gradiente */}
                                <div className="relative rounded-xl bg-gradient-to-br from-[#00d4ff] via-[#0099ff] to-[#0066ff] p-[2px] shadow-lg shadow-blue-500/50 group-hover:shadow-xl group-hover:shadow-blue-400/70 transition-all duration-300">
                                    <div className="w-full h-full bg-black rounded-[9px] flex items-center justify-center p-1">
                                        <img 
                                            src="/iconos/favicon-192x192.png" 
                                            alt="@react-pdf-levelup/core"
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            </div>
                            <h1 className="text-xs xs:text-sm sm:text-base font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent truncate">
=======
                          
                            <h1 className="font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent truncate uppercase tracking-wide">
>>>>>>> funcional
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
                    className={`lg:hidden fixed top-[70px] left-0 right-0 z-40 transition-all duration-500 ease-out ${
                        mobileOpen 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
                >
                    <div className="bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
                        {/* Gradiente decorativo */}
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
                        
                        <div className="relative px-4 py-6 max-w-7xl mx-auto">
<<<<<<< HEAD
                            <Navigation className="flex flex-col gap-4 mb-6" />
                            
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                            
                            <ActionLinks variant="mobile" className="justify-start" />
=======
                            <Navigation className="flex flex-col gap-4 mb-6" onNavigate={() => setMobileOpen(false)} />
                            
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                            
                            <ActionLinks variant="mobile" className="justify-start" onActionClick={() => setMobileOpen(false)} />
>>>>>>> funcional
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