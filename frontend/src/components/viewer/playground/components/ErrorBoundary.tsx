import * as React from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage: string | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, errorMessage: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log real del error de render (Babel/eval no lo capturan porque
    // ocurre durante el render de React, no en la fase de compilación).
    console.error("PDFPreview: error al renderizar el documento", error, info.componentStack)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Al no forzar remount por `key` desde afuera, esta instancia persiste
    // entre compilaciones, así que este reset sí se ejecuta de verdad
    // cuando llega un nuevo `Component` (children) tras un error.
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, errorMessage: null })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            background: "#fff5f5",
          }}
        >
          <h3 style={{ color: "#ff0000", marginBottom: 8 }}>
            Error al renderizar el PDF
          </h3>
          {this.state.errorMessage && (
            <p style={{ color: "#666", fontSize: 13 }}>
              {this.state.errorMessage}
            </p>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
