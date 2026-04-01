import React, { useMemo } from "react"
import { Page, Document, StyleSheet, Text, View, Image } from "@react-pdf/renderer"
import { toPdfOrientation } from "./helper/toPdfOrientation"
import { getMargins, type MarginPreset } from "./helper/getMargins"
import { getPageDimensions, type PageSize, PAGE_DIMENSIONS } from "./helper/getPageDimensions"

// ─── Constantes ────────────────────────────────────────────────────────────────

const CM_TO_POINTS = 28.3465
const LINE_HEIGHT = 20
const FOOTER_PADDING = 10

const VALID_SIZES = Object.keys(PAGE_DIMENSIONS)
const VALID_ORIENTATIONS = ["vertical", "horizontal", "portrait", "landscape", "h", "v"]
const VALID_MARGINS = ["apa", "normal", "estrecho", "ancho"]

// ─── Estilos base ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    page: {
        backgroundColor: "white",
        padding: 30,
        fontSize: 10,
    },
    footer: {
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
    },
    backgroundImage: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
})

// ─── Tipos ─────────────────────────────────────────────────────────────────────

type Orientation = "vertical" | "horizontal" | "h" | "v" | "portrait" | "landscape"

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

// ─── Props globales ────────────────────────────────────────────────────────────

interface LayoutMultiPageProps {
    children: React.ReactNode
    size?: PageSize
    orientation?: Orientation
    pagination?: boolean
    backgroundColor?: string
    backgroundImage?: string
    backgroundImageOpacity?: number
    padding?: number
    margin?: MarginPreset
    footer?: React.ReactNode
    footerLines?: number
    rule?: boolean
    debug?: boolean
    meta?: DocumentMeta
}

// ─── Props que LayoutMultiPage inyecta en cada Page vía cloneElement ───────────
// Se usan internamente — el usuario nunca las escribe a mano

interface InjectedPageProps {
    // Props globales resueltas
    __globalBackgroundColor?: string
    __globalBackgroundImage?: string
    __globalBackgroundImageOpacity?: number
    __globalPadding?: number
    __globalMargin?: MarginPreset
    __globalFooter?: React.ReactNode
    __globalFooterLines?: number
    __globalRule?: boolean
    __globalDebug?: boolean
    __globalPagination?: boolean
    __pageWidth?: number
    __pageHeight?: number
    __safeSize?: PageSize
    __pdfOrientation?: "portrait" | "landscape"
}

// ─── Props públicas del Page (las que escribe el usuario) ─────────────────────

export interface SectionProps extends InjectedPageProps {
    children?: React.ReactNode
    style?: any
    backgroundColor?: string
    backgroundImage?: string
    backgroundImageOpacity?: number
    padding?: number
    margin?: MarginPreset
    footer?: React.ReactNode
    footerLines?: number
    rule?: boolean
    debug?: boolean
    pagination?: boolean
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function resolve<T>(local: T | undefined, global: T): T {
    return local !== undefined ? local : global
}

function getFooterTop(pageHeight: number, footerHeight: number): number {
    return pageHeight - footerHeight - 10
}

// ─── Componente interno que renderiza un Page real ────────────────────────────

const Section: React.FC<SectionProps> = ({
    children,
    style,
    backgroundColor,
    backgroundImage,
    backgroundImageOpacity,
    padding,
    margin,
    footer,
    footerLines,
    rule,
    debug,
    pagination,
    // Inyectadas por LayoutMultiPage
    __globalBackgroundColor = "white",
    __globalBackgroundImage,
    __globalBackgroundImageOpacity = 1,
    __globalPadding = 30,
    __globalMargin = "normal",
    __globalFooter,
    __globalFooterLines,
    __globalRule = false,
    __globalDebug = false,
    __globalPagination = true,
    __pageWidth = 595,
    __pageHeight = 842,
    __safeSize = "A4",
    __pdfOrientation = "portrait",
}) => {
    // ── Resolución individual > global ────────────────────────────────────────

    const resolvedBg = resolve(backgroundColor, __globalBackgroundColor)
    const resolvedBgImage = resolve(backgroundImage, __globalBackgroundImage)
    const resolvedBgOpacity = resolve(backgroundImageOpacity, __globalBackgroundImageOpacity)
    const resolvedPadding = resolve(padding, __globalPadding)
    const resolvedMarginKey = resolve(margin, __globalMargin)
    const resolvedFooter = footer !== undefined ? footer : __globalFooter
    const resolvedFooterLines = resolve(footerLines, __globalFooterLines)
    const resolvedRule = resolve(rule, __globalRule)
    const resolvedDebug = resolve(debug, __globalDebug)
    const resolvedPagination = resolve(pagination, __globalPagination)

    const safeMargin: MarginPreset = VALID_MARGINS.includes(resolvedMarginKey) ? resolvedMarginKey : "normal"

    // ── Footer height ─────────────────────────────────────────────────────────

    const footerHeight = useMemo(
        () => Math.max(1, resolvedFooterLines ?? (resolvedFooter ? 2 : 1)) * LINE_HEIGHT + FOOTER_PADDING,
        [resolvedFooterLines, resolvedFooter]
    )

    const margins = useMemo(() => getMargins(safeMargin, resolvedPadding), [safeMargin, resolvedPadding])
    const footerTop = useMemo(() => getFooterTop(__pageHeight, footerHeight), [__pageHeight, footerHeight])

    // ── Grid ──────────────────────────────────────────────────────────────────

    const grid = useMemo(() => {
        if (!resolvedRule) return null

        const hLines = Array.from({ length: Math.ceil(__pageHeight / CM_TO_POINTS) + 1 }, (_, i) => (
            <View key={`h-${i}`} style={{
                position: "absolute", top: i * CM_TO_POINTS, left: 0, right: 0,
                height: i % 5 === 0 ? 1 : 0.5,
                backgroundColor: i % 5 === 0 ? "rgba(255,0,0,0.8)" : "rgba(100,100,100,0.5)",
            }} />
        ))

        const vLines = Array.from({ length: Math.ceil(__pageWidth / CM_TO_POINTS) + 1 }, (_, i) => (
            <View key={`v-${i}`} style={{
                position: "absolute", left: i * CM_TO_POINTS, top: 0, bottom: 0,
                width: i % 5 === 0 ? 1 : 0.5,
                backgroundColor: i % 5 === 0 ? "rgba(255,0,0,0.8)" : "rgba(100,100,100,0.5)",
            }} />
        ))

        return (
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} fixed>
                {hLines}{vLines}
            </View>
        )
    }, [resolvedRule, __pageWidth, __pageHeight])

    // ── Estilos ───────────────────────────────────────────────────────────────

    const { padding: _p, paddingTop: _pt, paddingRight: _pr, paddingBottom: _pb, paddingLeft: _pl, ...restStyle } = style ?? {}

    const pageStyle = useMemo(() => ({
        ...styles.page,
        backgroundColor: resolvedBg,
        paddingTop: style?.paddingTop ?? style?.padding ?? margins.paddingTop,
        paddingRight: style?.paddingRight ?? style?.padding ?? margins.paddingRight,
        paddingLeft: style?.paddingLeft ?? style?.padding ?? margins.paddingLeft,
        paddingBottom: (style?.paddingBottom ?? style?.padding ?? margins.paddingBottom) + footerHeight,
        ...restStyle,
    }), [resolvedBg, footerHeight, margins, style])

    const footerStyle = useMemo(() => ({
        ...styles.footer,
        top: footerTop,
        height: footerHeight,
        display: "flex" as const,
        flexDirection: "column" as const,
        justifyContent: "center" as const,
        alignItems: "center" as const,
        color: "grey",
    }), [footerTop, footerHeight])

    const bgImageStyle = useMemo(() => ({ ...styles.backgroundImage, opacity: resolvedBgOpacity }), [resolvedBgOpacity])

    const bgImageNode = useMemo(() => {
        if (!resolvedBgImage) return null
        return <Image src={resolvedBgImage} style={bgImageStyle} fixed />
    }, [resolvedBgImage, bgImageStyle])

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <Page debug={resolvedDebug} size={__safeSize as any} orientation={__pdfOrientation} style={pageStyle} wrap>
            {bgImageNode}
            {grid}
            {children}
            <View style={{ paddingBottom: footerHeight }} />
            <View style={footerStyle} fixed>
                {resolvedFooter}
                {resolvedPagination && (
                    <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
                )}
            </View>
        </Page>
    )
}

// ─── Componente principal ──────────────────────────────────────────────────────

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
    footer,
    footerLines,
    rule = false,
    debug = false,
    meta = {},
}) => {
    const { title, author, subject, keywords, creator, producer, language, pageMode, pageLayout } = { ...DEFAULT_META, ...meta }

    const safeSize: PageSize = (typeof size === "string" && VALID_SIZES.includes(size.toUpperCase()))
        ? size.toUpperCase() as PageSize
        : (console.warn(`Tamaño inválido: ${size}. Usando A4.`), "A4")

    const safeOrientation: Orientation = VALID_ORIENTATIONS.includes(orientation?.toLowerCase())
        ? orientation
        : (console.warn(`Orientación inválida: ${orientation}. Usando vertical.`), "vertical")

    const pdfOrientation = toPdfOrientation(safeOrientation)

    const { width: pageWidth, height: pageHeight } = useMemo(
        () => getPageDimensions(safeSize, pdfOrientation),
        [safeSize, pdfOrientation]
    )

    // ── Inyección de props globales en cada <Section> ──────────────────────

    const injected: InjectedPageProps = {
        __globalBackgroundColor: backgroundColor,
        __globalBackgroundImage: backgroundImage,
        __globalBackgroundImageOpacity: backgroundImageOpacity,
        __globalPadding: padding,
        __globalMargin: margin,
        __globalFooter: footer,
        __globalFooterLines: footerLines,
        __globalRule: rule,
        __globalDebug: debug,
        __globalPagination: pagination,
        __pageWidth: pageWidth,
        __pageHeight: pageHeight,
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
            creator={creator} producer={producer} language={language}
            pageMode={pageMode as any} pageLayout={pageLayout as any}
        >
            {pages}
        </Document>
    )
}

export {
    LayoutMultiPage,
    Section
}