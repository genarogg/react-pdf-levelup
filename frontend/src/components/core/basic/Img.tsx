import React from "react"
import { Image, StyleSheet } from "@react-pdf/renderer"

type ImageBaseProps = React.ComponentProps<typeof Image>

interface ImgProps extends Omit<ImageBaseProps, "style"> {
  src?: string;
  style?: any;
  width?: string | number;
  height?: string | number;
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "auto",
   
  },
})

const Img: React.FC<ImgProps> = React.memo(({ src, style, width, height, ...rest }) => {
  return <Image src={src} style={[styles.image, style, width && { width }, height && { height }]} {...rest} />
})

Img.displayName = "Img"

export default Img