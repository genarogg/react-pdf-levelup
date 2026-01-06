declare module "@babel/standalone" {
  export function transform(
    code: string,
    options: {
      presets?: string[]
      plugins?: string[]
      filename?: string
    },
  ): {
    code: string
    map: any
    ast: any
  }
}

