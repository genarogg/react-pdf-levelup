/// <reference path="./assets.d.ts" />



import {
    // core
    Layout, LayoutMultiPage, Section, NextPage, // layout
    Img, ImgBg, // imágenes
    UL, OL, LI, // lista

    P, A, H1, H2, H3, H4, H5, H6, HR, Strong, U, // etiquetas de texto
    Small, Blockquote, Mark, Span, BR, Div, Em, // etiquetas de texto

    Container, Row, Col1, Col2, Col3, Col4, Col5, // grid
    Col6, Col7, Col8, Col9, Col10, Col11, Col12, // grid

    Table, Thead, Tbody, Tr, Th, Td, // tabla
    Form, Input, Checkbox, TextArea, // form
    Left, Right, Center, // alignment

    Pass,
    // extend
    Gradiant,
    Button,
    Badge,
    Divider,
    Graph,

    // herencia de react-pdf
    Note, Svg, PDFViewer, Document, Page, Text,
    View, Image, Link, Canvas, Defs, Rect,
    LinearGradient, RadialGradient, Stop,
    G, Polygon, Polyline, ClipPath, Line, Path,
    Circle, Ellipse, Tspan, PDFDownloadLink,
    BlobProvider, StyleSheet, Font
} from "../../../frontend/src/components/core"

import {
    decodePDF,
    generatePDF,
    getFont,
    pdf,
    renderToStream,
    renderToBuffer,
    renderToFile,
    usePDF
} from "../../../frontend/src/functions"

export {
    // funciones
    decodePDF, generatePDF, getFont,
    // funciones heredadas
    pdf, renderToStream, renderToBuffer,
    renderToFile, usePDF,
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
    // form
    Form, Input, TextArea, Checkbox,
    // misc
    Div, HR, Layout, NextPage,
    LayoutMultiPage, Section,
    Pass,
    // extend
    Gradiant,
    Button,
    Badge,
    Divider,
    Graph,

    // react pdf renderer
    Note, Svg, PDFViewer, Document, Page, Text,
    View, Image, Link, Canvas, Defs, Rect,
    LinearGradient, RadialGradient, Stop,
    G, Polygon, Polyline, ClipPath, Line, Path,
    Circle, Ellipse, Tspan, PDFDownloadLink,
    BlobProvider, StyleSheet, Font,
}

