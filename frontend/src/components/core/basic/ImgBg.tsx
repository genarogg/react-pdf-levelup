import React from "react"
import { Image, StyleSheet, View } from "@react-pdf/renderer"

interface ImgBgProps {
    src: string
    width?: number | string
    height?: number | string
    opacity?: number
    children?: React.ReactNode
    style?: any
    fixed?: boolean
    objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
    objectPosition?: "center" | "top" | "left" | "right" | "bottom"
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "100%",
        height: "100%",
    },
    background: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        position: "relative",
    },
})

const ImgBg: React.FC<ImgBgProps> = ({
    src,
    width = "100%",
    height = "100%",
    opacity = 0.2,
    children,
    style,
    fixed = false,
    objectFit = "cover",
    objectPosition = "center",
}) => {
    return (
        <View style={[styles.container, style]} >
            <Image
                src={src}
                style={[
                    styles.background,
                    { width, height, opacity, objectFit, objectPosition },
                ]}
                fixed={fixed}
            />
            <View style={styles.content}>{children}</View>
        </View>
    )
}

export default ImgBg
