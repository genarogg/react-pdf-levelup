import React from "react"
import { Page, Document, Text, View } from "@react-pdf/renderer"
import {
    useLayoutResolution,
    resolve,
    validateSize,
    validateOrientation,
    type Orientation,
} from "./useLayoutResolution"
import type { MarginInput } from "./helper/getMargins"
import type { PageSizeInput } from "./helper/getPageDimensions"
import { toPdfOrientation } from "./helper/toPdfOrientation"
import type { DocumentMeta } from "./Layout"

// ─── Metadatos del documento ─────────────────────────────────────────────────
// DocumentMeta (y DocumentPermissions) se define una sola vez en Layout.tsx
// y se reusa acá — misma fuente de verdad para ambos entry points.

const DEFAULT_META: DocumentMeta = {
    creator: "react-pdf-levelup",
    producer: "react-pdf-levelup",
}

// ─── Props globales ──────────────────────────────────────────────────────────

interface LayoutMultiPageProps {
    children: React.ReactNode
    size?: PageSizeInput
    orientation?: Orientation
    pagination?: boolean
    backgroundColor?: string
    backgroundImage?: string
    backgroundImageOpacity?: number
    padding?: number
    margin?: MarginInput
    footerLines?: number
    rule?: boolean
    debug?: boolean
    meta?: DocumentMeta
}

// ─── Props inyectadas por LayoutMultiPage en cada Section vía cloneElement ──

interface InjectedPageProps {
    __globalBackgroundColor?: string
    __globalBackgroundImage?: string
    __globalBackgroundImageOpacity?: number
    __globalPadding?: number
    __globalMargin?: MarginInput
    __globalFooterLines?: number
    __globalRule?: boolean
    __globalDebug?: boolean
    __globalPagination?: boolean
    __safeSize?: PageSizeInput
    __pdfOrientation?: "portrait" | "landscape"
}

// ─── Props públicas de Section ───────────────────────────────────────────────

export interface SectionProps extends InjectedPageProps {
    children?: React.ReactNode
    style?: any
    backgroundColor?: string
    backgroundImage?: string
    backgroundImageOpacity?: number
    padding?: number
    margin?: MarginInput
    footerLines?: number
    rule?: boolean
    debug?: boolean
    pagination?: boolean
    dpi?: number
    id?: string
}

// ─── Section: renderiza un Page real dentro de LayoutMultiPage ─────────────
// La resolución local > global sigue viviendo acá (es lo que permite
// personalizar cada página); el cálculo de estilos ahora vive en el hook
// compartido con Layout.tsx.

const Section: React.FC<SectionProps> = ({
    children,
    style,
    backgroundColor,
    backgroundImage,
    backgroundImageOpacity,
    padding,
    margin,
    footerLines,
    rule,
    debug,
    pagination,
    dpi,
    id,
    __globalBackgroundColor = "white",
    __globalBackgroundImage,
    __globalBackgroundImageOpacity = 1,
    __globalPadding = 30,
    __globalMargin = "normal",
    __globalFooterLines,
    __globalRule = false,
    __globalDebug = false,
    __globalPagination = true,
    __safeSize = "A4",
    __pdfOrientation = "portrait",
}) => {
    const resolvedBackgroundColor = resolve(backgroundColor, __globalBackgroundColor)
    const resolvedBackgroundImage = resolve(backgroundImage, __globalBackgroundImage)
    const resolvedBackgroundImageOpacity = resolve(backgroundImageOpacity, __globalBackgroundImageOpacity)
    const resolvedPadding = resolve(padding, __globalPadding)
    const resolvedMargin = resolve(margin, __globalMargin)
    const resolvedFooterLines = resolve(footerLines, __globalFooterLines)
    const resolvedRule = resolve(rule, __globalRule)
    const resolvedDebug = resolve(debug, __globalDebug)
    const resolvedPagination = resolve(pagination, __globalPagination)

    const { pageStyle, footerStyle, grid, bgImageNode } = useLayoutResolution({
        size: __safeSize,
        orientation: __pdfOrientation,
        backgroundColor: resolvedBackgroundColor,
        backgroundImage: resolvedBackgroundImage,
        backgroundImageOpacity: resolvedBackgroundImageOpacity,
        padding: resolvedPadding,
        margin: resolvedMargin,
        footerLines: resolvedFooterLines,
        rule: resolvedRule,
        style,
    })

    return (
        <Page
            debug={resolvedDebug}
            size={__safeSize as any}
            orientation={__pdfOrientation}
            style={pageStyle}
            dpi={dpi}
            id={id}
            wrap
        >
            {bgImageNode}
            {grid}
            {children}

            <View style={footerStyle} fixed>
                {resolvedPagination && (
                    <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                )}
            </View>
        </Page>
    )
}

// ─── LayoutMultiPage: orquestador ────────────────────────────────────────────
// Sigue siendo el único responsable de inyectar props globales en cada
// Section vía cloneElement. Eso no cambia — es lo que le da la capacidad de
// personalizar página por página.

const LayoutMultiPage: React.FC<LayoutMultiPageProps> = ({
    children,
    size = "A4",
    orientation = "vertical",
    pagination = true,
    backgroundColor = "white",
    backgroundImage,
    backgroundImageOpacity = 1,
    padding = 30,
    margin = "normal",
    footerLines,
    rule = false,
    debug = false,
    meta = {},
}) => {
    const {
        title, author, subject, keywords, creator, producer, pdfVersion, language,
        pageMode, pageLayout, creationDate, modificationDate,
        ownerPassword, userPassword, permissions, onRender,
    } = { ...DEFAULT_META, ...meta }

    const safeSize = validateSize(size)
    const safeOrientationKey = validateOrientation(orientation)
    const pdfOrientation = toPdfOrientation(safeOrientationKey)

    const injected: InjectedPageProps = {
        __globalBackgroundColor: backgroundColor,
        __globalBackgroundImage: backgroundImage,
        __globalBackgroundImageOpacity: backgroundImageOpacity,
        __globalPadding: padding,
        __globalMargin: margin,
        __globalFooterLines: footerLines,
        __globalRule: rule,
        __globalDebug: debug,
        __globalPagination: pagination,
        __safeSize: safeSize,
        __pdfOrientation: pdfOrientation,
    }

    const pages = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child as React.ReactElement<InjectedPageProps>, injected)
    })

    return (
        <Document
            title={title} author={author} subject={subject} keywords={keywords}
            creator={creator} producer={producer} pdfVersion={pdfVersion} language={language}
            pageMode={pageMode as any} pageLayout={pageLayout as any}
            creationDate={creationDate} modificationDate={modificationDate}
            ownerPassword={ownerPassword} userPassword={userPassword}
            permissions={permissions} onRender={onRender}
        >
            {pages}
        </Document>
    )
}

export {
    LayoutMultiPage,
    Section
}