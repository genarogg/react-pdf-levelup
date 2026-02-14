import React from "react"
import { View, Text, StyleSheet } from "@react-pdf/renderer"

interface FormProps {
  children: React.ReactNode
  style?: any
}

interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  type?: "text" | "email" | "number" | "date" | "tel"
  width?: string | number
  height?: number
  style?: any
  labelStyle?: any
  required?: boolean
}

interface TextareaProps {
  label?: string
  placeholder?: string
  value?: string
  width?: string | number
  height?: number
  rows?: number
  style?: any
  labelStyle?: any
  required?: boolean
}

interface SelectProps {
  label?: string
  value?: string
  options?: string[]
  width?: string | number
  height?: number
  style?: any
  labelStyle?: any
  required?: boolean
}

interface CheckboxProps {
  label?: string
  checked?: boolean
  style?: any
  labelStyle?: any
}

interface RadioProps {
  label?: string
  checked?: boolean
  style?: any
  labelStyle?: any
}

interface FieldsetProps {
  legend?: string
  children: React.ReactNode
  style?: any
  legendStyle?: any
}

const styles = StyleSheet.create({
  form: {
    width: "100%",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  required: {
    color: "#e74c3c",
    marginLeft: 2,
  },
  input: {
    fontSize: 11,
    padding: 6,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 3,
    backgroundColor: "#fff",
    minHeight: 28,
  },
  textarea: {
    fontSize: 11,
    padding: 6,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 3,
    backgroundColor: "#fff",
    minHeight: 60,
  },
  select: {
    fontSize: 11,
    padding: 6,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 3,
    backgroundColor: "#fff",
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectArrow: {
    fontSize: 10,
    color: "#666",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 2,
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#3498db",
    borderColor: "#3498db",
  },
  checkmark: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  radio: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 7,
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  radioChecked: {
    borderColor: "#3498db",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3498db",
  },
  checkboxLabel: {
    fontSize: 10,
    color: "#333",
  },
  fieldset: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  legend: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    position: "absolute",
    top: -8,
    left: 8,
  },
  placeholder: {
    color: "#999",
  },
})

// Componente Form
const Form: React.FC<FormProps> = ({ children, style }) => {
  return <View style={[styles.form, style]}>{children}</View>
}

// Componente Input
const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  type = "text",
  width = "100%",
  height,
  style,
  labelStyle,
  required = false,
}) => {
  return (
    <View style={[styles.inputContainer, { width }]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[styles.input, { height }, style]}>
        <Text style={value ? {} : styles.placeholder}>
          {value || placeholder || ""}
        </Text>
      </View>
    </View>
  )
}

// Componente Textarea
const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  width = "100%",
  height,
  rows = 3,
  style,
  labelStyle,
  required = false,
}) => {
  const calculatedHeight = height || rows * 20
  
  return (
    <View style={[styles.inputContainer, { width }]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[styles.textarea, { height: calculatedHeight }, style]}>
        <Text style={value ? {} : styles.placeholder}>
          {value || placeholder || ""}
        </Text>
      </View>
    </View>
  )
}

// Componente Select
const Select: React.FC<SelectProps> = ({
  label,
  value,
  options = [],
  width = "100%",
  height,
  style,
  labelStyle,
  required = false,
}) => {
  return (
    <View style={[styles.inputContainer, { width }]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <View style={[styles.select, { height }, style]}>
        <Text style={value ? {} : styles.placeholder}>
          {value || "Seleccionar..."}
        </Text>
        <Text style={styles.selectArrow}>▼</Text>
      </View>
    </View>
  )
}

// Componente Checkbox
const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  style,
  labelStyle,
}) => {
  return (
    <View style={[styles.checkboxContainer, style]}>
      <View style={[styles.checkbox, checked ? styles.checkboxChecked : {}]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      {label && <Text style={[styles.checkboxLabel, labelStyle]}>{label}</Text>}
    </View>
  )
}

// Componente Radio
const Radio: React.FC<RadioProps> = ({
  label,
  checked = false,
  style,
  labelStyle,
}) => {
  return (
    <View style={[styles.radioContainer, style]}>
      <View style={[styles.radio, checked ? styles.radioChecked : {}]}>
        {checked && <View style={styles.radioDot} />}
      </View>
      {label && <Text style={[styles.checkboxLabel, labelStyle]}>{label}</Text>}
    </View>
  )
}

// Componente Fieldset
const Fieldset: React.FC<FieldsetProps> = ({
  legend,
  children,
  style,
  legendStyle,
}) => {
  return (
    <View style={[styles.fieldset, style]}>
      {legend && <Text style={[styles.legend, legendStyle]}>{legend}</Text>}
      <View style={{ marginTop: legend ? 8 : 0 }}>{children}</View>
    </View>
  )
}

// Componente Label (para usar de forma independiente)
const Label: React.FC<{ children: React.ReactNode; style?: any; required?: boolean }> = ({
  children,
  style,
  required = false,
}) => {
  return (
    <Text style={[styles.label, style]}>
      {children}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  )
}

export { Form, Input, Textarea, Select, Checkbox, Radio, Fieldset, Label }