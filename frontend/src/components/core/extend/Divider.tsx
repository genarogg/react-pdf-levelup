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
    width?: number | string
    style?: any
}

const Divider: React.FC<DividerProps> = ({
    label,
    variant = "line",
    color = "#d1d5db",
    textColor = "#6b7280",
    fontSize = 9,
    marginVertical = 16,
    width = "100%",
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
                    // width: '100%' explícito es OBLIGATORIO aquí, no cosmético.
                    // Sin esto, dentro de cualquier padre que centre/encoja a
                    // fit-content (p. ej. un wrapper "Center" con
                    // alignItems: 'center' en eje column), este View raíz se
                    // encoge al ancho del <Text>, dejando 0px para repartir
                    // entre las dos líneas con flex: 1 -> líneas invisibles
                    // aunque el texto sí se vea. alignSelf: 'stretch' es un
                    // refuerzo adicional para el caso en que el padre sea un
                    // flex-column que de otro modo también encogería el hijo.
                    // `width` es configurable (default "100%"); si se pasa un
                    // valor fijo (p. ej. 200), alignSelf deja de importar
                    // porque el ancho ya no depende del padre.
                    width,
                    alignSelf: "stretch",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginVertical,
                },
                style,
            ]}
            {...rest}
        >
            <View style={{ flex: 1, minWidth: 0, ...lineStyle }} />
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
            <View style={{ flex: 1, minWidth: 0, ...lineStyle }} />
        </View>
    )
}

export default Divider