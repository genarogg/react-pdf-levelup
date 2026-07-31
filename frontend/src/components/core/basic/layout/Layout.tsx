import React from "react"
import { Page, Document, Text, View } from "@react-pdf/renderer"
import { useLayoutResolution, validateOrientation, type Orientation } from "./useLayoutResolution"
import type { MarginInput } from "./helper/getMargins"
import type { PageSizeInput } from "./helper/getPageDimensions"
import { toPdfOrientation } from "./helper/toPdfOrientation"

// ─── Metadatos del documento ─────────────────────────────────────────────────

export type PdfVersion = "1.3" | "1.4" | "1.5" | "1.6" | "1.7" | "1.7ext3"

export interface DocumentPermissions {
    // Ausente = impresión no permitida. Presente = permitida, en la resolución indicada.
    printing?: "lowResolution" | "highResolution"
    modifying?: boolean
    copying?: boolean
    annotating?: boolean
    fillingForms?: boolean
    contentAccessibility?: boolean
    documentAssembly?: boolean
}

export interface DocumentMeta {
    title?: string
    author?: string
    subject?: string
    keywords?: string
    creator?: string
    producer?: string
    pdfVersion?: PdfVersion
    language?: string
    pageMode?: string
    pageLayout?: string
    creationDate?: Date
    modificationDate?: Date
    ownerPassword?: string
    userPassword?: string
    permissions?: DocumentPermissions
    onRender?: (props: { blob?: Blob }) => any
}

const DEFAULT_META: DocumentMeta = {
    creator: "react-pdf-levelup",
    producer: "react-pdf-levelup",
}

// ─── Props públicas ──────────────────────────────────────────────────────────

interface LayoutProps {
    children: React.ReactNode
    size?: PageSizeInput
    orientation?: Orientation
    backgroundColor?: string
    backgroundImage?: string
    backgroundImageOpacity?: number
    padding?: number
    margin?: MarginInput
    style?: any
    pagination?: boolean
    footerLines?: number
    rule?: boolean
    debug?: boolean
    meta?: DocumentMeta
    dpi?: number
    id?: string
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
    footerLines,
    rule = false,
    debug = false,
    meta = {},
    dpi,
    id,
}) => {
    const {
        title, author, subject, keywords, creator, producer, pdfVersion, language,
        pageMode, pageLayout, creationDate, modificationDate,
        ownerPassword, userPassword, permissions, onRender,
    } = { ...DEFAULT_META, ...meta }

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
            pdfVersion={pdfVersion}
            language={language}
            pageMode={pageMode as any}
            pageLayout={pageLayout as any}
            creationDate={creationDate}
            modificationDate={modificationDate}
            ownerPassword={ownerPassword}
            userPassword={userPassword}
            permissions={permissions}
            onRender={onRender}
        >
            <Page
                debug={debug}
                size={safeSize as any}
                orientation={pdfOrientation}
                style={pageStyle}
                dpi={dpi}
                id={id}
                wrap
            >
                {bgImageNode}
                {grid}
                {children}

                <View style={footerStyle} fixed>
                    {pagination && (
                        <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                    )}
                </View>
            </Page>
        </Document>
    )
}

export default Layout