"use client"

import React from "react"
import { Image, StyleSheet, View, Text } from "@react-pdf/renderer"
import { useEffect, useState } from "react"

// Define the props for the CustomQR component
interface CustomQRProps {
  url: string
  size?: number
  colorData?: string
  colorDataBG?: string
  logo?: string
  logoWidth?: number
  logoHeight?: number
  margin?: number
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
  style?: any
  dotType?: "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded"
  cornerSquareType?: "square" | "dot" | "extra-rounded"
  cornerDotType?: "square" | "dot"
  cornerSquareColor?: string
  cornerDotColor?: string
  logoBG?: string
  logoText?: string
  moveText?: number
  textColor?: string
  fontSize?: number
  fontFamily?: string
  textBackgroundColor?: string
  textPadding?: number
  textBold?: boolean
}

const styles = StyleSheet.create({
  qrContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    position: "relative",
  },
  qrText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
})

// Generate QR URL using external services that support customization
const generateCustomQRUrl = (options: CustomQRProps): string => {
  const {
    url,
    size = 200,
    colorData = "#000000",
    colorDataBG = "#ffffff",
    margin = 0,
    errorCorrectionLevel = "H",
    logo,
  } = options

  try {
    // Clean colors (remove # if present)
    const cleanColorData = colorData.replace("#", "")
    const cleanColorDataBG = colorDataBG.replace("#", "")
    
    // Base URL with basic customization
    let qrUrl = `https://api.qrserver.com/v1/create-qr-code/`
    const params = new URLSearchParams({
      data: url,
      size: `${size}x${size}`,
      color: cleanColorData,
      bgcolor: cleanColorDataBG,
      margin: margin.toString(),
      ecc: errorCorrectionLevel,
    })

    // Add logo if provided (some services support this)
    if (logo) {
      // For services that support logo overlay
      params.append('logo', logo)
    }

    return `${qrUrl}?${params.toString()}`
    
  } catch (error) {
    console.error("Error generating QR URL:", error)
    // Ultimate fallback
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=${size}x${size}`
  }
}

// Alternative QR service with more customization options
const generateAdvancedQRUrl = (options: CustomQRProps): string => {
  const {
    url,
    size = 200,
    colorData = "#000000",
    colorDataBG = "#ffffff",
    margin = 0,
    errorCorrectionLevel = "H",
    dotType = "square",
    cornerSquareType = "square",
  } = options

  try {
    // Using QR-Server.com with advanced options
    const baseUrl = "https://qr-server.com/api/v1/create-qr-code/"
    
    const params = new URLSearchParams({
      data: url,
      size: `${size}x${size}`,
      color: colorData.replace("#", ""),
      bgcolor: colorDataBG.replace("#", ""),
      margin: margin.toString(),
      ecc: errorCorrectionLevel.toLowerCase(),
    })

    // Add style parameters if supported
    if (dotType !== "square") {
      params.append("style", dotType)
    }

    return `${baseUrl}?${params.toString()}`
    
  } catch (error) {
    console.error("Error generating advanced QR URL:", error)
    return generateCustomQRUrl(options)
  }
}

// Generate SVG-based QR for better customization (server-side compatible)
const generateSVGQRUrl = (options: CustomQRProps): string => {
  const {
    url,
    size = 200,
    colorData = "#000000",
    colorDataBG = "#ffffff",
    margin = 0,
    errorCorrectionLevel = "H",
  } = options

  try {
    // Some services provide SVG format for better customization
    const baseUrl = "https://api.qrserver.com/v1/create-qr-code/"
    
    const params = new URLSearchParams({
      data: url,
      size: `${size}x${size}`,
      color: colorData.replace("#", ""),
      bgcolor: colorDataBG.replace("#", ""),
      margin: margin.toString(),
      ecc: errorCorrectionLevel,
      format: "svg", // SVG format for scalability
    })

    return `${baseUrl}?${params.toString()}`
    
  } catch (error) {
    console.error("Error generating SVG QR URL:", error)
    return generateCustomQRUrl(options)
  }
}

// Server-side compatible QR generator using multiple fallback services
const getBestQRUrl = (options: CustomQRProps): string => {
  const {
    dotType,
    cornerSquareType,
    cornerDotType,
    logo,
  } = options

  // Determine best service based on required features
  if (logo || dotType !== "square" || cornerSquareType !== "square" || cornerDotType !== "square") {
    // Try advanced service first
    return generateAdvancedQRUrl(options)
  } else {
    // Use standard service
    return generateCustomQRUrl(options)
  }
}

// Generate data URL for logo overlay (server-side compatible approach)
const getLogoOverlayUrl = (qrUrl: string, logo: string, logoWidth: number, logoHeight: number): string => {
  try {
    // Using a service that can overlay images
    const overlayService = "https://api.overlay.example.com/v1/overlay"
    const params = new URLSearchParams({
      base: qrUrl,
      overlay: logo,
      width: logoWidth.toString(),
      height: logoHeight.toString(),
      position: "center",
    })
    
    return `${overlayService}?${params.toString()}`
  } catch (error) {
    console.error("Error generating logo overlay:", error)
    