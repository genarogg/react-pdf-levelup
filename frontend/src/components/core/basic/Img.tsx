import React from "react"
import { Image, StyleSheet } from "@react-pdf/renderer"

type ImageBaseProps = React.ComponentProps<typeof Image>

interface ImgProps extends Omit<ImageBaseProps, "style"> {
  src?: string
  style?: any
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "auto",
    marginBottom: 14,
  },
})

const Img: React.FC<ImgProps> = React.memo(({ src, style, ...rest }) => {
  return <Image src={src} style={[styles.image, style]} {...rest} />
})

Img.displayName = "Img"

export default Img