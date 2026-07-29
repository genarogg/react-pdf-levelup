import Layout from "./basic/layout/Layout"
import { LayoutMultiPage, Section } from "./basic/layout/LayoutMultiPage"
import NextPage from "./basic/layout/NextPage"
import Img from "./basic/Img"
import ImgBg from "./basic/ImgBg"
import { Left, Right, Center } from "./basic/Position"
import { P, A, H1, H2, H3, H4, H5, H6, HR, Strong, Em, U, Small, Blockquote, Mark, Span, BR, Div } from "./basic/Etiquetas"
import { Table, Thead, Tbody, Tr, Th, Td } from "./basic/tabla"
import { Form, Input, Checkbox, TextArea } from "./basic/Form"

// extens
import { Container, Row, Col1, Col2, Col3, Col4, Col5, Col6, Col7, Col8, Col9, Col10, Col11, Col12 } from "./extend/Grid"
import { UL, OL, LI } from "./basic/Lista"
import Gradiant from "./extend/Gradiant"
import Button from "./basic/Button"
import Badge from "./extend/Badges"
import Divider from "./extend/Divider"
import Graph from "./extend/Graph"


// plugins
import ChartJS from "./plugins/charts/ChartJS"
import { QR, QRstyle } from "./plugins/qr"
import Icon from "./plugins/icono/Icon"
import CodeBar from "./plugins/codeBar/CodeBar"

import {
  Note, Svg, PDFViewer, Document, Page, Text,
  View, Image, Link, Canvas, Defs, Rect,
  LinearGradient, RadialGradient, Stop,
  G, Polygon, Polyline, ClipPath, Line, Path,
  Circle, Ellipse, Tspan, PDFDownloadLink,
  BlobProvider, StyleSheet, Font
} from "@react-pdf/renderer"

export {
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
  // extend
  Gradiant,
  Button,
  Badge,
  Divider,
  Graph,

  // plugins
  ChartJS,
  QR, QRstyle,
  Icon,
  CodeBar,

  // herencia de react-pdf
  Note, Svg, PDFViewer, Document, Page, Text,
  View, Image, Link, Canvas, Defs, Rect,
  LinearGradient, RadialGradient, Stop,
  G, Polygon, Polyline, ClipPath, Line, Path,
  Circle, Ellipse, Tspan, PDFDownloadLink,
  BlobProvider, StyleSheet, Font
}

