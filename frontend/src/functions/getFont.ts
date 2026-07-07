const getFont = async (
  fontPath: string,
  callerImportMetaUrl: string
): Promise<string> => {
  if (isUrl(fontPath)) return fontPath
  if (isAbsolutePath(fontPath)) return fontPath

  const isBrowser = typeof window !== "undefined"
  if (isBrowser) return fontPath

  const path = await import("node:path")
  const { fileURLToPath } = await import("node:url")

  const callerDir = path.dirname(fileURLToPath(callerImportMetaUrl))
  return path.resolve(callerDir, fontPath)
}

function isUrl(fontPath: string): boolean {
  return /^https?:\/\//i.test(fontPath)
}

function isAbsolutePath(fontPath: string): boolean {
  if (/^[a-zA-Z]:[\\/]/.test(fontPath)) return true
  return fontPath.startsWith("/")
}

export default getFont