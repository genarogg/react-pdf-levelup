export type Node =
  | { path: string; name: string; type: 'file' }
  | { path: string; name: string; type: 'folder'; children: Node[] }

export interface StudioState {
  mainFile: string | null
}

export interface GetTreeResponse {
  mainFile: string | null
  tree: Node[]
}

export interface GetFileQuery {
  path: string
}

export interface GetFileResponse {
  path: string
  content: string
  language: string
}

export interface PutFileBody {
  path: string
  content: string
}

export interface PostFileBody {
  path: string
  type: 'file' | 'folder'
}

export interface PatchFileBody {
  path: string
  newPath: string
}

export interface DeleteFileQuery {
  path: string
}

export interface PutMainBody {
  path: string
}
