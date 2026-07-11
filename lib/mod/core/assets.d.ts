// Imágenes (jpg, jpeg, png, gif, webp, svg) importadas como módulo.
// El valor por defecto es un string: en el navegador, la URL/data-URL
// resuelta por el bundler o por el runtime que la sirve.
declare module "*.jpg" {
  const content: string
  export default content
}
declare module "*.jpeg" {
  const content: string
  export default content
}
declare module "*.png" {
  const content: string
  export default content
}
declare module "*.gif" {
  const content: string
  export default content
}
declare module "*.webp" {
  const content: string
  export default content
}
declare module "*.svg" {
  const content: string
  export default content
}

// Fuentes (ttf) importadas como módulo.
// El bundler devolverá la URL estática del archivo para usar con React-PDF.
declare module "*.ttf" {
  const content: string
  export default content
}
