export type Node =
  | { path: string; name: string; type: "file" }
  | { path: string; name: string; type: "folder"; children: Node[] }

export interface TreeResponse {
  mainFile: string | null
  tree: Node[]
}

export interface FileResponse {
  path: string
  content: string
  language: string
}

async function parseJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = data?.error || `Error HTTP ${res.status}`
    throw new Error(message)
  }
  return data
}

export async function fetchTree(): Promise<TreeResponse> {
  const res = await fetch("/api/tree")
  return parseJsonOrThrow(res)
}

/**
 * Devuelve el archivo o `null` si no existe (404), en vez de lanzar.
 * moduleGraph.ts se apoya en este comportamiento para probar extensiones
 * candidatas (.tsx, .ts, .jsx, .js) hasta encontrar la correcta.
 */
export async function fetchFile(path: string): Promise<FileResponse | null> {
  const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`)
  if (res.status === 404) return null
  return parseJsonOrThrow(res)
}

export async function saveFile(path: string, content: string): Promise<{ ok: true }> {
  const res = await fetch("/api/file", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, content }),
  })
  return parseJsonOrThrow(res)
}

export async function createEntry(
  path: string,
  type: "file" | "folder"
): Promise<{ ok: true; path: string; type: "file" | "folder" }> {
  const res = await fetch("/api/file", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, type }),
  })
  return parseJsonOrThrow(res)
}

export async function renameEntry(
  path: string,
  newPath: string
): Promise<{ ok: true; path: string }> {
  const res = await fetch("/api/file", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, newPath }),
  })
  return parseJsonOrThrow(res)
}

export async function deleteEntry(path: string): Promise<{ ok: true }> {
  const res = await fetch(`/api/file?path=${encodeURIComponent(path)}`, {
    method: "DELETE",
  })
  return parseJsonOrThrow(res)
}

export async function setMainFile(path: string): Promise<{ ok: true; mainFile: string }> {
  const res = await fetch("/api/main", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  })
  return parseJsonOrThrow(res)
}
