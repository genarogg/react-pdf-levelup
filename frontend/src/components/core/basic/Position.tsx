import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";

interface PositionProps {
  children: React.ReactNode;
  style?: any;

  // opcional -> centra vertical también
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

/* ================= LEFT ================= */

const Left: React.FC<PositionProps> = ({
  children,
  style,
  vertical,
}) => {
  return (
    <View style={[styles.left, vertical && styles.vertical, style]}>
      {children}
    </View>
  );
};

/* ================= RIGHT ================= */

const Right: React.FC<PositionProps> = ({
  children,
  style,
  vertical,
}) => {
  return (
    <View style={[styles.right, vertical && styles.vertical, style]}>
      {children}
    </View>
  );
};

/* ================= CENTER ================= */

const Center: React.FC<PositionProps> = ({
  children,
  style,
  vertical,
}) => {
  return (
    <View style={[styles.center, vertical && styles.vertical, style]}>
      {children}
    </View>
  );
};

export { Left, Right, Center };