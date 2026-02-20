import Layout from "./basic/layout/Layout"
import NextPage from "./basic/layout/NextPage"
import Img from "./basic/Img"
import ImgBg from "./basic/ImgBg"
import { Left, Right, Center } from "./basic/Position"
import { P, A, H1, H2, H3, H4, H5, H6, HR, Strong, Em, U, Small, Blockquote, Mark, Span, BR, Div } from "./basic/Etiquetas"
import { Table, Thead, Tbody, Tr, Th, Td } from "./basic/Tablet"
import { Form, Input, Checkbox, TextArea } from "./basic/Form"
import { Container, Row, Col1, Col2, Col3, Col4, Col5, Col6, Col7, Col8, Col9, Col10, Col11, Col12 } from "./basic/Grid"
import { UL, OL, LI } from "./basic/Lista"

import QR from "./qr/QR"
import QRstyle from "./qr/QRstyle"
import ChartJS from "./charts/ChartJS"

import { View, Text, StyleSheet, Font, renderToStream, Document, Page } from "@react-pdf/renderer"

import { decodeBase64Pdf, generatePDF } from "../../functions"
import Icon from "./icono/Icon"

export {
  ImgBg,
  Layout,
  NextPage,
  Img,
  Left,
  Right,
  Center,
  P,
  A,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Strong,
  Em,
  U,
  Small,
  Blockquote,
  Mark,
  Span,
  BR,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Row,
  Col1,
  Col2,
  Col3,
  Col4,
  Col5,
  Col6,
  Col7,
  Col8,
  Col9,
  Col10,
  Col11,
  Col12,
  QR,
  QRstyle,
  UL,
  OL,
  LI,
  View,
  Text,
  Document,
  Page,
  StyleSheet,
  Font,
  decodeBase64Pdf,
  generatePDF,
  renderToStream,
  Div,
  HR,
  Form, Input, Checkbox, TextArea,
  //Radio, Fieldset, Label,Textarea, Select, 
  Icon,
  ChartJS,
}

