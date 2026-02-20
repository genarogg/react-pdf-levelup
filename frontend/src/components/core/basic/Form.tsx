import React, { createContext, useContext } from "react"
import { View, Text, StyleSheet } from "@react-pdf/renderer"

/* ================= TYPES ================= */

interface FormProps {
  children: React.ReactNode
  style?: any
  borderColor?: string
  borderRadius?: number
  labelColor?: string
  textColor?: string
}

interface BaseFieldProps {
  label?: string
  required?: boolean
  style?: any
  labelStyle?: any
  width?: string | number
  height?: number
}

interface InputProps extends BaseFieldProps {
  placeholder?: string
}

interface TextAreaProps extends BaseFieldProps {
  placeholder?: string
  height?: number
}

interface CheckboxProps {
  label?: string
  checked?: boolean
  style?: any
  labelStyle?: any
}

/* ================= CONTEXT ================= */

const FormContext = createContext({
  borderColor: "#282828",
  borderRadius: 5,
  labelColor: "#333",
  textColor: "#000",
})

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  form: {
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    padding: 12,
  },

  fieldContainer: {
    marginBottom: 12,
  },

  label: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },

  required: {
    color: "#e74c3c",
  },

  inputBase: {
    fontSize: 11,
    padding: 6,
    borderWidth: 1,
    minHeight: 28,
    justifyContent: "flex-start",
  },

  textArea: {
    textAlignVertical: "top",
    paddingTop: 6,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  checkboxBox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  checkmark: {
    fontSize: 9,
    fontWeight: "bold",
  },

  placeholder: {
    color: "#999",
  },
})

/* ================= FORM ================= */

const Form: React.FC<FormProps> = ({
  children,
  style,
  borderColor = "#282828",
  borderRadius = 5,
  labelColor = "#333",
  textColor = "#000",
}) => (
  <FormContext.Provider
    value={{ borderColor, borderRadius, labelColor, textColor }}
  >
    <View
      style={[
        styles.form,
        {
          borderColor,
          borderRadius,
        },
        style,
      ]}
    >
      {children}
    </View>
  </FormContext.Provider>
)

/* ================= INPUT ================= */

const Input: React.FC<InputProps> = ({
  label,
  placeholder = "",
  required = false,
  width = "100%",
  height,
  style,
  labelStyle,
}) => {
  const { borderColor, borderRadius, labelColor } =
    useContext(FormContext)

  return (
    <View style={[styles.fieldContainer, { width }]}>
      {label && (
        <Text style={[styles.label, { color: labelColor }, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputBase,
          {
            borderColor,
            borderRadius,
            minHeight: height ?? 28,
          },
          style,
        ]}
      >
        <Text style={styles.placeholder}>
          {placeholder}
        </Text>
      </View>
    </View>
  )
}

/* ================= TEXTAREA ================= */

const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder = "",
  required = false,
  width = "100%",
  height = 60,
  style,
  labelStyle,
}) => {
  const { borderColor, borderRadius, labelColor } =
    useContext(FormContext)

  return (
    <View style={[styles.fieldContainer, { width }]}>
      {label && (
        <Text style={[styles.label, { color: labelColor }, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputBase,
          styles.textArea,
          {
            borderColor,
            borderRadius,
            minHeight: height,
          },
          style,
        ]}
      >
        <Text style={styles.placeholder}>
          {placeholder}
        </Text>
      </View>
    </View>
  )
}

/* ================= CHECKBOX ================= */

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  style,
  labelStyle,
}) => {
  const { borderColor, borderRadius, textColor } =
    useContext(FormContext)

  return (
    <View style={[styles.checkboxContainer, style]}>
      <View
        style={[
          styles.checkboxBox,
          {
            borderColor,
            borderRadius: borderRadius / 2,
            backgroundColor: checked ? borderColor : undefined,
          },
        ]}
      >
        {checked && (
          <Text style={[styles.checkmark, { color: "#fff" }]}>
            ✓
          </Text>
        )}
      </View>

      {label && (
        <Text style={[{ fontSize: 10, color: textColor }, labelStyle]}>
          {label}
        </Text>
      )}
    </View>
  )
}

export { Form, Input, TextArea, Checkbox }