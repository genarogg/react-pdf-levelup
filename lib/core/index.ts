import { View, Text, StyleSheet, Font, renderToStream, renderToFile } from "@react-pdf/renderer"

// funciones
import { decodeBase64Pdf, generatePDF } from "../../frontend/src/functions"

import {
    // imgs
    Img, ImgBg,
    // alignment
    Left, Right, Center,
    // headings
    H1, H2, H3, H4, H5, H6,
    // text
    P, A, Strong, Em, U, Small, Blockquote, Mark, Span, BR,
    //tables
    Table, Thead, Tbody, Tr, Th, Td,
    // grid
    Container, Row, Col1, Col2, Col3, Col4, Col5, Col6, Col7, Col8, Col9, Col10, Col11, Col12,
    // lists
    UL, OL, LI,
    // misc
    Div, HR, Header, Layout
} from "../../frontend/src/components/core"

export {
    // react pdf renderer
    View, Text, StyleSheet, Font, renderToStream, renderToFile,
    // funciones
    decodeBase64Pdf, generatePDF,
    // imgs
    Img, ImgBg,
    // alignment
    Left, Right, Center,
    // headings
    H1, H2, H3, H4, H5, H6,
    // text
    P, A, Strong, Em, U, Small, Blockquote, Mark, Span, BR,
    //tables
    Table, Thead, Tbody, Tr, Th, Td,
    // grid
    Container, Row, Col1, Col2, Col3, Col4, Col5, Col6, Col7, Col8, Col9, Col10, Col11, Col12,
    // lists
    UL, OL, LI,
    // misc
    Div, HR, Header, Layout
}