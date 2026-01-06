import { generateQRAsBase64 } from "./QRGenerator"

export interface QRV2Options {
  value: string
  width?: number
  height?: number
  image?: string
  dotsOptions?: {
    color?: string
    type?: "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded"
  }
  backgroundOptions?: {
    color?: string
  }
  imageOptions?: {
    crossOrigin?: string
    margin?: number
    imageSize?: number // 0-1 (e.g., 0.4)
  }
  cornersSquareOptions?: {
    type?: "dot" | "square" | "extra-rounded"
    color?: string
  }
  cornersDotOptions?: {
    type?: "dot" | "square"
    color?: string
  }
  // Fallback options
  fallbackColorDark?: string
  fallbackColorLight?: string
  fallbackMargin?: number
  fallbackErrorCorrectionLevel?: "L" | "M" | "Q" | "H"
}

export const generateQRV2AsBase64 = async (options: QRV2Options): Promise<string> => {
  try {
    const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    
    let QRCodeStylingConstructor: any;
    let extraOptions = {};

    if (isBrowser) {
      // Dynamic import for browser
      try {
          const mod = await import('qr-code-styling');
          QRCodeStylingConstructor = mod.default || mod;
      } catch (e) {
          console.error("Failed to load qr-code-styling in browser", e);
          throw e;
      }
    } else {
      // Node environment
      // We use variable names to prevent bundlers (like Vite) from analyzing/bundling these dependencies
      // when building for the browser.
      const jsdomName = "jsdom";
      const canvasName = "canvas";
      const qrCommonName = "qr-code-styling/lib/qr-code-styling.common.js";
      
      try {
        const [jsdomMod, canvasMod, qrCommonMod] = await Promise.all([
            import(/* @vite-ignore */ jsdomName),
            import(/* @vite-ignore */ canvasName),
            import(/* @vite-ignore */ qrCommonName)
        ]);

        const { JSDOM } = jsdomMod;
        // canvas might be default export or named export depending on version/bundling
        const nodeCanvas = canvasMod.default || canvasMod;
        const { QRCodeStyling } = qrCommonMod;

        QRCodeStylingConstructor = QRCodeStyling;
        extraOptions = {
            jsdom: JSDOM,
            nodeCanvas: nodeCanvas
        };
      } catch (e) {
          console.error("Failed to load Node dependencies for QR generation", e);
          throw e;
      }
    }

    const width = typeof options.width === "number" && isFinite(options.width) ? Math.round(options.width) : 300;
    const height = typeof options.height === "number" && isFinite(options.height) ? Math.round(options.height) : 300;
    const hasImage = !!options.image;

    const qrOptions = {
      width,
      height,
      data: options.value,
      image: options.image,
      dotsOptions: options.dotsOptions,
      backgroundOptions: {
          // Default to white background if not specified to prevent transparency issues
          // The "blue stripe" or weird artifacts can happen if the background is transparent or handled incorrectly
          color: options.backgroundOptions?.color || "#ffffff",
          ...options.backgroundOptions
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: typeof options.imageOptions?.margin === "number" && isFinite(options.imageOptions.margin) ? options.imageOptions.margin : 0,
        saveAsBlob: true,
        imageSize: typeof options.imageOptions?.imageSize === "number" && isFinite(options.imageOptions.imageSize)
          ? Math.max(0, Math.min(1, options.imageOptions.imageSize))
          : 0.4,
      },
      cornersSquareOptions: options.cornersSquareOptions,
      cornersDotOptions: options.cornersDotOptions,
    }

    // @ts-ignore
    const qrCodeImage = new QRCodeStylingConstructor({
      type: "png", // Force PNG type
      ...extraOptions,
      ...qrOptions,
    })

    const rawData = await qrCodeImage.getRawData("png")
    
    if (!rawData) throw new Error("Failed to generate raw data from qr-code-styling")

    // Handle Blob (Browser) vs Buffer (Node)
    if (isBrowser) {
        if (rawData instanceof Blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error("Failed to convert blob to base64"));
                }
                };
                reader.onerror = reject;
                reader.readAsDataURL(rawData);
            });
        } else {
             // Sometimes in browser it might return something else if configured differently?
             // But usually Blob.
             console.warn("Unexpected rawData type in browser:", rawData);
        }
    } 
    
    // Node environment usually returns Buffer
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(rawData)) {
       return `data:image/png;base64,${rawData.toString("base64")}`;
    }
    
    // Fallback if type is unexpected
    // Try to handle if it's a blob-like object in Node (unlikely but possible with polyfills)
    throw new Error(`Unexpected raw data type: ${typeof rawData}`);

  } catch (error) {
    console.error("Error generating QR V2, falling back to V1:", error)
    
    // Fallback to existing implementation
    return generateQRAsBase64({
      value: options.value,
      size: options.width,
      colorDark: options.fallbackColorDark || options.dotsOptions?.color,
      colorLight: options.fallbackColorLight || options.backgroundOptions?.color,
      margin: options.fallbackMargin || 0,
      errorCorrectionLevel: options.fallbackErrorCorrectionLevel || "M",
    })
  }
}
