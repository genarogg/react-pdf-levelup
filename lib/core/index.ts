import { View, Text, StyleSheet, Font, renderToStream, renderToFile } from "@react-pdf/renderer"

import Layout from "../../frontend/src/components/core/basic/layout/Layout"
import NextPage from "../../frontend/src/components/core/basic/layout/NextPage"
import Img from "../../frontend/src/components/core/basic/Img"
import ImgBg from "../../frontend/src/components/core/basic/ImgBg"

import { Left, Right, Center } from "../../frontend/src/components/core/basic/Position"
import { P, A, H1, H2, H3, H4, H5, H6, HR, Strong, Em, U, Small, Blockquote, Mark, Span, BR, Div } from "../../frontend/src/components/core/basic/Etiquetas"
import { Table, Thead, Tbody, Tr, Th, Td } from "../../frontend/src/components/core/basic/Tablet"
import { Form, Input, Textarea, Select, Checkbox, Radio, Fieldset, Label } from "../../frontend/src/components/core/basic/Form"
import { Container, Row, Col1, Col2, Col3, Col4, Col5, Col6, Col7, Col8, Col9, Col10, Col11, Col12 } from "../../frontend/src/components/core/basic/Grid"
import { UL, OL, LI } from "../../frontend/src/components/core/basic/Lista"

import decodeBase64Pdf from "../../frontend/src/functions/decodeBase64Pdf"
import generatePDF from "../../frontend/src/functions/generatePDF"

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
    // form
    Form, Input, Textarea, Select, Checkbox, Radio, Fieldset, Label,
    // misc
    Div, HR, Layout, NextPage,

}
