"use client"

import React, { useEffect, useState } from "react"
import { Image, StyleSheet, View } from "@react-pdf/renderer"
import { generateQRV2AsBase64, type QRV2Options } from "./QRGeneratorV2"

// Define props
export interface QRV2Props {
  value: string
  size?: number
  style?: any
  image?: string
  dotsOptions?: QRV2Options["dotsOptions"]
  backgroundOptions?: QRV2Options["backgroundOptions"]
  imageOptions?: QRV2Options["imageOptions"]
  cornersSquareOptions?: QRV2Options["cornersSquareOptions"]
  cornersDotOptions?: QRV2Options["cornersDotOptions"]
  // Fallback/Compatibility props
  colorDark?: string
  colorLight?: string
  margin?: number
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
}

const styles = StyleSheet.create({
  qrContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
})

const QRV2: React.FC<QRV2Props> = ({
  value,
  size = 300,
  style,
  image,
  dotsOptions,
  backgroundOptions,
  imageOptions,
  cornersSquareOptions,
  cornersDotOptions,
  colorDark,
  colorLight,
  margin,
  errorCorrectionLevel,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")

  useEffect(() => {
    let isMounted = true;
    const generate = async () => {
      // Construct options with intelligent defaults/mapping
      const finalDotsOptions = dotsOptions || (colorDark ? { color: colorDark } : undefined)
      const finalBackgroundOptions = backgroundOptions || (colorLight ? { color: colorLight } : undefined)
      
      const finalImageOptions = {
        ...imageOptions,
        margin: imageOptions?.margin !== undefined ? imageOptions.margin : margin
      }

      try {
        const dataUrl = await generateQRV2AsBase64({
          value,
          width: size,
          height: size,
          image,
          dotsOptions: finalDotsOptions,
          backgroundOptions: finalBackgroundOptions,
          imageOptions: finalImageOptions,
          cornersSquareOptions,
          cornersDotOptions,
          fallbackColorDark: colorDark,
          fallbackColorLight: colorLight,
          fallbackMargin: margin,
          fallbackErrorCorrectionLevel: errorCorrectionLevel,
        })
        
        if (isMounted) {
            setQrDataUrl(dataUrl)
        }
      } catch (err) {
          console.error("QRV2 Generation Error:", err);
      }
    }
    
    // In Node/Server-side rendering context for React-PDF, useEffect might behave differently 
    // depending on how the document is rendered (e.g., renderToStream, renderToString).
    // React-PDF 2.0+ supports useEffect for async operations like loading images.
    generate()
    
    return () => { isMounted = false; }
  }, [
    value,
    size,
    image,
    // JSON.stringify can be expensive, use simpler dependency tracking if possible or keep as is for deep comparison
    JSON.stringify(dotsOptions),
    JSON.stringify(backgroundOptions),
    JSON.stringify(imageOptions),
    JSON.stringify(cornersSquareOptions),
    JSON.stringify(cornersDotOptions),
    colorDark,
    colorLight,
    margin,
    errorCorrectionLevel,
  ])

  // If we don't have a URL yet, we return null.
  // This might be the issue in Node if the render happens before the effect completes.
  // React-PDF usually waits for images to load, but async state updates might be tricky.
  // However, React-PDF renderer waits for all promises in the document to resolve? 
  // No, it waits for *Image src promises* if src is a promise or URL.
  // But here we are setting state asynchronously. 
  
  // CRITICAL FIX: In Node generation, we need to ensure the async operation completes.
  // Since we can't easily pause the render until state updates in a standard React functional component
  // without Suspense (which React-PDF might not fully support for this case), 
  // we might need to verify if generateQRV2AsBase64 can be run synchronously or if we are using the component correctly.
  
  // Actually, for React-PDF in Node, if we use `renderToStream` or `renderToFile`, it renders once.
  // `useEffect` does NOT run in the standard `renderToString` / static rendering flow of React usually,
  // BUT `@react-pdf/renderer` is special. It does execute hooks in its layout engine?
  // 
  // Wait, standard React SSR does NOT run useEffect. 
  // If `react-pdf-levelup` uses `@react-pdf/renderer`'s `renderToStream` or `renderToFile` in Node,
  // it behaves like SSR. useEffect won't run.
  // 
  // The original QR component (QR.tsx) uses useEffect:
  // `useEffect(() => { const generateQR = async () => { ... } ... }, [...])`
  // So if the original QR works, then `react-pdf` MUST be supporting useEffect or re-rendering somehow?
  //
  // Let's check `src/components/core/QR.tsx` again.
  // It uses `useEffect` and `useState`.
  //
  // If the user says "QR normal (el que ya tenia)" works, and it uses `useEffect`, 
  // then maybe the environment where `render` is called is actually supporting it (e.g. client side rendering or some specific react-pdf setup).
  //
  // HOWEVER, if the user is running `tsx ./src/useExample/index.ts` (implied by "tengo un template ... en index.ts"),
  // this is a Node process.
  // In a pure Node process, `useEffect` usually doesn't run during a single-pass render.
  // 
  // But wait, `QR.tsx` implementation:
  // `const [qrDataUrl, setQrDataUrl] = useState<string>("")`
  // `useEffect(...)`
  // `return <Image src={qrDataUrl || fallbackUrl} ... />`
  //
  // `fallbackUrl` is set SYNCHRONOUSLY in `QR.tsx`:
  // `const fallbackUrl = https://api.qrserver.com/...`
  // So `QR.tsx` ALWAYS has a valid `src` (the fallback) on the first render!
  // That is why `QR.tsx` works! It renders the fallback URL immediately.
  // The `useEffect` might run later or never, but the PDF gets the fallback URL.
  //
  // My `QRV2` implementation returns `null` or empty string initially:
  // `{qrDataUrl ? <Image src={qrDataUrl} ... /> : null}`
  // So on first render (SSR/Node), it renders NOTHING.
  //
  // We need to either:
  // 1. Generate the QR synchronously (impossible with qr-code-styling in Node as it's async-ish or we made it async).
  // 2. Provide a synchronous fallback.
  // 3. Or use a mechanism to suspend rendering (Suspense) - but React-PDF support is limited.
  //
  // The best bet is to check if we can make `generateQRV2AsBase64` synchronous or if we should provide a fallback.
  // But the user wants the custom style.
  //
  // If `generateQRV2AsBase64` is async, we are stuck in Node unless we use a "Resource" pattern that React-PDF can wait on.
  // React-PDF `Image` component can accept a Promise as `src`.
  //
  // Let's try passing the Promise directly to `Image src`!
  // `src` prop of `Image` in `@react-pdf/renderer` supports: string | SourceObject | Buffer | Blob | Promise<...>
  
  return (
    <View style={[styles.qrContainer, style]}>
      {/* We pass a function that returns the promise/result or use the state if available. 
          Actually, we can pass the promise directly to src! */}
      <Image 
        style={{ width: size, height: size }} 
        src={generateQRV2AsBase64({
          value,
          width: size,
          height: size,
          image,
          dotsOptions: dotsOptions || (colorDark ? { color: colorDark } : undefined),
          backgroundOptions: backgroundOptions || (colorLight ? { color: colorLight } : undefined),
          imageOptions: {
            ...imageOptions,
            margin: imageOptions?.margin !== undefined ? imageOptions.margin : margin
          },
          cornersSquareOptions,
          cornersDotOptions,
          fallbackColorDark: colorDark,
          fallbackColorLight: colorLight,
          fallbackMargin: margin,
          fallbackErrorCorrectionLevel: errorCorrectionLevel,
        })} 
      />
    </View>
  )
}

export default QRV2
