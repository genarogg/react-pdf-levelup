import React from "react"
import { Page, Document, Text, View } from "@react-pdf/renderer"
import { useLayoutResolution, validateOrientation, type Orientation } from "./useLayoutResolution"
import type { MarginPreset } from "./helper/getMargins"
import type { PageSize } from "./helper/getPageDimensions"
import { toPdfOrientation } from "./helper/toPdfOrientation"

// ─── Metadatos del documento ─────────────────────────────────────────────────

interface DocumentMeta {
    title?: string
    author?: string
    subject?: string
    keywords?: string
    creator?: string
    producer?: string
    language?: string
    pageMode?: string
    pageLayout?: string
}

const DEFAULT_META: DocumentMeta = {
    creator: "react-pdf-levelup",
    producer: "react-pdf-levelup",
}

// ─── Props públicas ──────────────────────────────────────────────────────────

interface LayoutProps {
    children: React.ReactNode
    size?: PageSize
    orientation?: Orientation
    backgroundColor?: string
    backgroundImage?: string
    backgroundImageOpacity?: number
    padding?: number
    margin?: MarginPreset
    style?: any
    pagination?: boolean
    footer?: React.ReactNode
    footerLines?: number
    rule?: boolean
    debug?: boolean
    meta?: DocumentMeta
}

// ─── Componente ──────────────────────────────────────────────────────────────
// Renderiza un único Page. Toda la lógica de estilos/validación vive ahora en
// useLayoutResolution, compartida con Section (LayoutMultiPage.tsx).

const Layout: React.FC<LayoutProps> = ({
    children,
    size = "A4",
    orientation = "vertical",
    backgroundColor = "white",
    backgroundImage,
    backgroundImageOpacity = 1,
    padding = 30,
    margin = "normal",
    style = {},
    pagination = true,
    footer,
    footerLines,
    rule = false,
    debug = false,
    meta = {},
}) => {
    const { title, author, subject, keywords, creator, producer, language, pageMode, pageLayout } =
        { ...DEFAULT_META, ...meta }

    // Único punto de conversión de la clave cruda ("vertical"/"horizontal"/...)
    // a PdfOrientation ("portrait"/"landscape"). El mismo punto que usa
    // LayoutMultiPage.tsx para Section — así el hook recibe siempre el
    // mismo contrato (PdfOrientation ya resuelto) sin importar quién lo llame.
    const safeOrientationKey = validateOrientation(orientation)
    const pdfOrientation = toPdfOrientation(safeOrientationKey)

    const { pageStyle, footerStyle, grid, bgImageNode, safeSize } = useLayoutResolution({
        size,
        orientation: pdfOrientation,
        backgroundColor,
        backgroundImage,
        backgroundImageOpacity,
        padding,
        margin,
        footer,
        footerLines,
        rule,
        style,
    })

    return (
        <Document
            title={title}
            author={author}
            subject={subject}
            keywords={keywords}
            creator={creator}
            producer={producer}
            language={language}
            pageMode={pageMode as any}
            pageLayout={pageLayout as any}
        >
            <Page debug={debug} size={safeSize as any} orientation={pdfOrientation} style={pageStyle} wrap>
                {bgImageNode}
                {grid}
                {children}

                <View style={footerStyle} fixed>
                    {footer}
                    {pagination && (
                        <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                    )}
                </View>
            </Page>
        </Document>
    )
}

export default Layout
