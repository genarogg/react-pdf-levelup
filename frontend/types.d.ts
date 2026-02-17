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

declare module "*.pdf" {
  const content: string;
  export default content;
}

