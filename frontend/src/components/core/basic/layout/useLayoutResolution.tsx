import { useMemo } from "react"
import { StyleSheet, View, Image } from "@react-pdf/renderer"
import { type PdfOrientation } from "./helper/toPdfOrientation"
import { getMargins, type MarginPreset, type MarginInput } from "./helper/getMargins"
import {
    getPageDimensions,
    isCustomPageSize,
    type PageSize,
    type PageSizeInput,
    PAGE_DIMENSIONS,
} from "./helper/getPageDimensions"

// ─── Constantes compartidas ─────────────────────────────────────────────────
// Únicas en todo el proyecto. Layout y Section ya no mantienen copias propias.

export const CM_TO_POINTS = 28.3465
export const LINE_HEIGHT = 20
export const FOOTER_PADDING = 10

export const VALID_SIZES = Object.keys(PAGE_DIMENSIONS)
export const VALID_ORIENTATIONS = ["vertical", "horizontal", "portrait", "landscape", "h", "v"]
export const VALID_MARGINS: MarginPreset[] = ["apa", "normal", "estrecho", "ancho"]

export type Orientation = "vertical" | "horizontal" | "h" | "v" | "portrait" | "landscape"

// ─── Estilos base ────────────────────────────────────────────────────────────

export const styles = StyleSheet.create({
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

// ─── Validadores únicos ──────────────────────────────────────────────────────
// Antes existían duplicados en Layout.tsx y LayoutMultiPage.tsx con reglas
// ligeramente distintas (uno emitía console.warn, el otro no). Ahora hay una
// sola fuente de verdad para cada validación.

export function validateSize(size: unknown): PageSizeInput {
    // Tamaño custom: { width, height } en puntos.
    if (isCustomPageSize(size)) {
        if (size.width > 0 && size.height > 0) return size
        console.warn(`Tamaño custom inválido: ${JSON.stringify(size)}. Usando A4.`)
        return "A4"
    }
    if (typeof size === "string" && VALID_SIZES.includes(size.toUpperCase())) {
        return size.toUpperCase() as PageSize
    }
    console.warn(`Tamaño inválido: ${String(size)}. Usando A4.`)
    return "A4"
}

export function validateOrientation(orientation: unknown): Orientation {
    if (typeof orientation === "string" && VALID_ORIENTATIONS.includes(orientation.toLowerCase())) {
        return orientation as Orientation
    }
    console.warn(`Orientación inválida: ${String(orientation)}. Usando vertical.`)
    return "vertical"
}

export function validateMargin(margin: unknown): MarginInput {
    // Número directo en puntos.
    if (typeof margin === "number") {
        if (margin >= 0) return margin
        console.warn(`Margen inválido: ${String(margin)}. Usando normal.`)
        return "normal"
    }
    if (typeof margin === "string" && VALID_MARGINS.includes(margin as MarginPreset)) {
        return margin as MarginPreset
    }
    console.warn(`Margen inválido: ${String(margin)}. Usando normal.`)
    return "normal"
}

export function validateBackgroundColor(backgroundColor: unknown): string {
    if (typeof backgroundColor === "string") return backgroundColor
    console.warn(`Color de fondo inválido: ${String(backgroundColor)}. Usando white.`)
    return "white"
}

// ─── Input del hook ──────────────────────────────────────────────────────────
// Representa valores YA resueltos (local > global). La resolución local vs.
// global sigue siendo responsabilidad de quien llama al hook (Layout o
// Section), no del hook en sí — así Section conserva su capacidad de
// personalizar por página sin que el hook necesite saber que eso existe.
//
// `orientation` es siempre PdfOrientation ("portrait" | "landscape"), ya
// normalizado por quien llama (Layout o LayoutMultiPage). La orientación es
// una propiedad de documento completo — no existe por Section — así que el
// único punto de conversión (validateOrientation + toPdfOrientation) vive
// en Layout.tsx y en LayoutMultiPage.tsx, no acá adentro. Esto evita una
// doble validación/conversión redundante y elimina la ambigüedad de tipos
// que antes permitía pasar tanto la clave cruda ("vertical"/"horizontal")
// como el valor ya normalizado.

export interface LayoutResolutionInput {
    size: PageSizeInput
    orientation: PdfOrientation
    backgroundColor?: string
    backgroundImage?: string
    backgroundImageOpacity?: number
    padding: number
    margin: MarginInput
    footerLines?: number
    rule?: boolean
    style?: any
}

export interface LayoutResolutionResult {
    pageStyle: Record<string, any>
    footerStyle: Record<string, any>
    grid: React.ReactNode
    bgImageNode: React.ReactNode
    safeSize: PageSizeInput
    pdfOrientation: PdfOrientation
    footerHeight: number
}

// ─── Helper de resolución local > global ────────────────────────────────────
// Se exporta porque tanto Section como (opcionalmente) Layout la necesitan
// para mezclar props propias con las heredadas del padre.

export function resolve<T>(local: T | undefined, global: T): T {
    return local !== undefined ? local : global
}

// ─── Hook principal ──────────────────────────────────────────────────────────

export function useLayoutResolution(input: LayoutResolutionInput): LayoutResolutionResult {
    // Nota: cuando `input.size` es un objeto custom, se reconstruye una key
    // estable (JSON) para las dependencias de useMemo, ya que un objeto nuevo
    // en cada render rompería la memoización por referencia.
    const sizeDepKey = isCustomPageSize(input.size) ? JSON.stringify(input.size) : input.size

    const safeSize = useMemo(() => validateSize(input.size), [sizeDepKey])
    // orientation ya llega normalizado (PdfOrientation) desde Layout/LayoutMultiPage;
    // no se revalida ni se reconvierte acá — ver comentario en LayoutResolutionInput.
    const pdfOrientation = input.orientation
    const safeMargin = useMemo(() => validateMargin(input.margin), [input.margin])
    const safeBackgroundColor = useMemo(
        () => validateBackgroundColor(input.backgroundColor ?? "white"),
        [input.backgroundColor]
    )

    const { width: pageWidth, height: pageHeight } = useMemo(
        () => getPageDimensions(safeSize, pdfOrientation),
        [safeSize, pdfOrientation]
    )

    const footerHeight = useMemo(
        () => Math.max(1, input.footerLines ?? 1) * LINE_HEIGHT + FOOTER_PADDING,
        [input.footerLines]
    )

    const margins = useMemo(
        () => getMargins(safeMargin, input.padding),
        [safeMargin, input.padding]
    )

    const footerTop = useMemo(
        () => pageHeight - footerHeight - 10,
        [pageHeight, footerHeight]
    )

    // ── Grid / regla ───────────────────────────────────────────────────────

    const grid = useMemo(() => {
        if (!input.rule) return null

        const hLines = Array.from({ length: Math.ceil(pageHeight / CM_TO_POINTS) + 1 }, (_, i) => (
            <View key={`h-${i}`} style={{
                position: "absolute", top: i * CM_TO_POINTS, left: 0, right: 0,
                height: i % 5 === 0 ? 1 : 0.5,
                backgroundColor: i % 5 === 0 ? "rgba(255,0,0,0.8)" : "rgba(100,100,100,0.5)",
            }} />
        ))

        const vLines = Array.from({ length: Math.ceil(pageWidth / CM_TO_POINTS) + 1 }, (_, i) => (
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
    }, [input.rule, pageWidth, pageHeight])

    // ── Estilo de página ────────────────────────────────────────────────────
    // Regla única de "explicitBottom": antes Layout.tsx y Section (dentro de
    // LayoutMultiPage.tsx) tenían criterios distintos para decidir si sumar
    // footerHeight al paddingBottom. Acá queda una sola regla, la de Layout.tsx
    // (más completa: contempla tanto paddingBottom como padding genérico).

    const pageStyle = useMemo(() => {
        const style = input.style ?? {}
        const { padding: _p, paddingTop: _pt, paddingRight: _pr, paddingBottom: _pb, paddingLeft: _pl, ...restStyle } = style

        const paddingTop = style.paddingTop ?? style.padding ?? margins.paddingTop
        const paddingRight = style.paddingRight ?? style.padding ?? margins.paddingRight
        const paddingLeft = style.paddingLeft ?? style.padding ?? margins.paddingLeft

        const explicitBottom = style.paddingBottom != null || style.padding != null
        const basePaddingBottom = style.paddingBottom ?? style.padding ?? margins.paddingBottom
        const paddingBottom = explicitBottom ? basePaddingBottom : basePaddingBottom + footerHeight

        return {
            ...styles.page,
            backgroundColor: safeBackgroundColor,
            paddingTop,
            paddingRight,
            paddingLeft,
            paddingBottom,
            ...restStyle,
        }
    }, [safeBackgroundColor, footerHeight, margins, input.style])

    // ── Footer ───────────────────────────────────────────────────────────────

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

    // ── Imagen de fondo ────────────────────────────────────────────────────

    const bgImageStyle = useMemo(
        () => ({ ...styles.backgroundImage, opacity: input.backgroundImageOpacity ?? 1 }),
        [input.backgroundImageOpacity]
    )

    const bgImageNode = useMemo(() => {
        if (!input.backgroundImage) return null
        return <Image src={input.backgroundImage} style={bgImageStyle} fixed />
    }, [input.backgroundImage, bgImageStyle])

    return { pageStyle, footerStyle, grid, bgImageNode, safeSize, pdfOrientation, footerHeight }
}