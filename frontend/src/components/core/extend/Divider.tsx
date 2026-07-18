import React from "react"
import { View, Text } from "@react-pdf/renderer"

type ViewBaseProps = React.ComponentProps<typeof View>

type DividerVariant = "line" | "dashed" | "dotted"

interface DividerProps extends Omit<ViewBaseProps, "style"> {
    label: string
    variant?: DividerVariant
    color?: string
    textColor?: string
    fontSize?: number
    marginVertical?: number
    style?: any
}

const Divider: React.FC<DividerProps> = ({
    label,
    variant = "line",
    color = "#d1d5db",
    textColor = "#6b7280",
    fontSize = 9,
    marginVertical = 16,
    style,
    ...rest
}) => {
    const lineStyle: any =
        variant === "line"
            ? { height: 1, backgroundColor: color }
            : {
                borderTopWidth: 1,
                borderTopColor: color,
                borderTopStyle: variant === "dashed" ? "dashed" : "dotted",
            }

    return (
        <View
            style={[
                {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginVertical,
                },
                style,
            ]}
            {...rest}
        >
            <View style={{ flex: 1, ...lineStyle }} />
            <Text
                style={{
                    fontSize,
                    fontWeight: 500,
                    letterSpacing: 0.5,
                    color: textColor,
                    textTransform: "uppercase",
                }}
            >
                {label}
            </Text>
            <View style={{ flex: 1, ...lineStyle }} />
        </View>
    )
}

export default Divider