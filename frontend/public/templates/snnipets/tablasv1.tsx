import React from "react";
import { 
      Div,
      H1,
      Layout,
      P,
      Small,
      Table,
      Tbody,
      Td,
      Th,
      Thead,
      Tr
    } from "@react-pdf-levelup/core";



const COLORS = {
  ink: "#1a1a2e",
  slate: "#5c6079",
  muted: "#94a0b8",
  border: "#e2e5ee",
  headerBg: "#1e3a5f",
  headerText: "#ffffff",
  zebra: "#f7f8fb",
  ok: "#16a34a",
  okBg: "#e9f7ef",
  warn: "#d97706",
  warnBg: "#fdf3e0",
  down: "#dc2626",
  downBg: "#fbe9e9",
};

const ESTADO_COLOR = {
  "Operativo": COLORS.ok,
  "Advertencia": COLORS.warn,
  "Fuera de línea": COLORS.down,
};

const styles = {
  header: {
    wrapper: { marginBottom: 18 },
    eyebrow: { fontSize: 9, color: COLORS.headerBg, letterSpacing: 2 },
    title: { color: COLORS.ink, marginTop: 4, marginBottom: 4 },
    subtitle: { fontSize: 10, color: COLORS.slate },
  },
  th: { fontWeight: "bold" },
  td: {
    id: { color: COLORS.ink },
    componente: { color: COLORS.slate },
    latencia: { color: COLORS.slate },
    estado: (estado: any) => ({
      //@ts-ignore
      color: ESTADO_COLOR[estado] ?? COLORS.slate,
      fontWeight: "bold",
    }),
  },
  legend: {
    row: { marginTop: 16, display: "flex", flexDirection: "row", gap: 16 },
    item: { display: "flex", flexDirection: "row", alignItems: "center", gap: 4 },
    dot: (color: any) => ({ width: 8, height: 8, backgroundColor: color, borderRadius: 4 }),
    label: { color: COLORS.slate, fontSize: 8 },
  },
};

const columns = [
  { key: "id", label: "ID", width: "15%" },
  { key: "componente", label: "Componente", width: "40%" },
  { key: "estado", label: "Estado", width: "25%", align: "center" },
  { key: "latencia", label: "Latencia (ms)", width: "20%", align: "center" },
];

const rows = [
  { id: "SRV-001", componente: "Servidor Web Principal", estado: "Operativo", latencia: "12 ms" },
  { id: "SRV-002", componente: "Base de Datos Primaria", estado: "Operativo", latencia: "8 ms" },
  { id: "SRV-003", componente: "Nodo de Almacenamiento A", estado: "Advertencia", latencia: "45 ms" },
  { id: "SRV-004", componente: "Balanceador de Carga", estado: "Operativo", latencia: "5 ms" },
  { id: "SRV-005", componente: "Servidor de Respaldo", estado: "Fuera de línea", latencia: "N/A" },
  { id: "SRV-006", componente: "Caché Distribuida (Redis)", estado: "Operativo", latencia: "3 ms" },
];

const legendItems = [
  { label: "Operativo", color: COLORS.ok },
  { label: "Advertencia", color: COLORS.warn },
  { label: "Fuera de línea", color: COLORS.down },
];

const ServerStatusTemplate = () => (
  <Layout size="A4" margin="estrecho" meta={{ title: "Estado de Servidores", language: "es-ES" }}>
    <Div style={styles.header.wrapper}>
      <Small style={styles.header.eyebrow}>REPORTE DE INFRAESTRUCTURA</Small>
      <H1 style={styles.header.title}>Estado de Servidores</H1>
      <P style={styles.header.subtitle}>
        Resumen del estado operativo y latencia de los componentes del sistema
      </P>
    </Div>

    <Table
      cellHeight={28}
      borderColor={COLORS.border}
      textColor={COLORS.ink}
      headerBackground={COLORS.headerBg}
      zebraColor={COLORS.zebra}
    >
      <Thead textColor={COLORS.headerText}>
        <Tr>
          {columns.map((col) => (
            <Th key={col.key} width={col.width} textAlign={col.align} style={styles.th}>
              {col.label}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row) => (
          <Tr key={row.id}>
            <Td width={columns[0].width} style={styles.td.id}>{row.id}</Td>
            <Td width={columns[1].width} style={styles.td.componente}>{row.componente}</Td>
            <Td width={columns[2].width} textAlign="center" style={styles.td.estado(row.estado)}>
              {row.estado}
            </Td>
            <Td width={columns[3].width} textAlign="center" style={styles.td.latencia}>
              {row.latencia}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>

    <Div style={styles.legend.row}>
      {legendItems.map((item) => (
        <Div key={item.label} style={styles.legend.item}>
          <Div style={styles.legend.dot(item.color)} />
          <Small style={styles.legend.label}>{item.label}</Small>
        </Div>
      ))}
    </Div>
  </Layout>
);

export default ServerStatusTemplate;