import React from "react";
import { View, StyleSheet, type ViewProps } from "@react-pdf/renderer";

type Align = "left" | "right" | "center";

type _ViewStyleRaw = NonNullable<ViewProps["style"]>;
type ViewStyle = Exclude<_ViewStyleRaw, _ViewStyleRaw[]>;

interface PositionProps extends ViewProps {
  children: React.ReactNode;
  vertical?: boolean;
}

const styles = StyleSheet.create({
  left: {
    alignItems: "flex-start",
    textAlign: "left",
  },
  right: {
    alignItems: "flex-end",
    textAlign: "right",
  },
  center: {
    alignItems: "center",
    textAlign: "center",
  },
  vertical: {
    justifyContent: "center",
  },
});

const mergeStyles = (
  ...entries: Array<ViewStyle | ViewStyle[] | false | undefined>
): ViewStyle[] =>
  entries.flatMap((entry) =>
    entry ? (Array.isArray(entry) ? entry : [entry]) : []
  );

/* ================= INTERNO ================= */

const Position: React.FC<PositionProps & { align: Align }> = ({
  children,
  style,
  vertical,
  align,
  ...rest
}) => {
  return (
    <View
      style={mergeStyles(styles[align], vertical && styles.vertical, style)}
      {...rest}
    >
      {children}
    </View>
  );
};

/* ================= PÚBLICOS ================= */

const Left: React.FC<PositionProps> = (props) => <Position {...props} align="left" />;
const Right: React.FC<PositionProps> = (props) => <Position {...props} align="right" />;
const Center: React.FC<PositionProps> = (props) => <Position {...props} align="center" />;

export { Left, Right, Center };