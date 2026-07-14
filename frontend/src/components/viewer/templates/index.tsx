import React from 'react'
import { Link } from "react-router-dom"
import { Table2, BadgeCheck, IdCard } from "lucide-react"
import Layout from "../layout"

interface TemplateSectionCard {
    slug: string
    title: string
    description: string
    icon: React.ReactNode
    /** false = todavía no tiene contenido, se muestra como "próximamente" */
    available: boolean
}

// Registro manual de las secciones "de alto nivel" (tablas / certificados /
// carnet / ...). Esto es solo la portada del directorio: qué componentes
// existen DENTRO de cada sección sí se autodescubre (ver
// lib/useTemplateContent.ts), pero cuáles secciones existen en absoluto es
// una decisión de producto, no algo que tenga sentido inferir del filesystem.
const SECTIONS: TemplateSectionCard[] = [
    {
        slug: "tablas",
        title: "Tablas",
        description: "Componentes de tabla: básicas, con zebra, con totales y variantes de estilo.",
        icon: <Table2 className="w-6 h-6" />,
        available: true,
    },
    {
        slug: "certificados",
        title: "Certificados",
        description: "Plantillas de certificados y diplomas listas para personalizar.",
        icon: <BadgeCheck className="w-6 h-6" />,
        available: false,
    },
    {
        slug: "carnet",
        title: "Carnet",
        description: "Plantillas de carnets e identificaciones.",
        icon: <IdCard className="w-6 h-6" />,
        available: false,
    },
]

const Templates: React.FC = () => {
    return (
        <Layout context="templates">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Templates</h1>
                <p className="text-gray-400 mb-8 max-w-2xl">
                    Explora componentes listos para usar, con su resultado renderizado y el
                    código fuente en react-pdf-levelup y en @react-pdf/renderer.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {SECTIONS.map((section) => {
                        const content = (
                            <>
                                <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                                    {section.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                                    {section.title}
                                    {!section.available && (
                                        <span className="text-[10px] uppercase tracking-wide font-medium text-gray-400 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                                            Próximamente
                                        </span>
                                    )}
                                </h3>
                                <p className="text-sm text-gray-400">{section.description}</p>
                            </>
                        )

                        const baseClass =
                            "rounded-lg border border-white/10 bg-white/[0.02] p-6 transition-all duration-200"

                        return section.available ? (
                            <Link
                                key={section.slug}
                                to={`/templates/${section.slug}`}
                                className={`${baseClass} group hover:border-blue-500/50 hover:bg-white/[0.04]`}
                            >
                                {content}
                            </Link>
                        ) : (
                            <div key={section.slug} className={`${baseClass} opacity-60 cursor-not-allowed`}>
                                {content}
                            </div>
                        )
                    })}
                </div>
            </div>
        </Layout>
    );
}

export default Templates;