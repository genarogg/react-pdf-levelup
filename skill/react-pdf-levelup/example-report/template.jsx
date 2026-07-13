import React from 'react';
import {
  Layout,
  H1,
  H2,
  P,
  Table,
  Tbody,
  Tr,
  Td,
  Th,
  Thead,
  ChartJS,
  Div,
} from '@react-pdf-levelup/core';
import { Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
  family: 'Inter',
  src: 'https://github.com/google/fonts/raw/main/ofl/inter/Inter-Regular.ttf',
  fontWeight: 'normal',
});
Font.register({
  family: 'Inter',
  src: 'https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf',
  fontWeight: 'bold',
});

/* -------------------- Sample Data -------------------- */
const sampleData = [
  { month: 'Jan', product: 'A', sales: 12000, qty: 200 },
  { month: 'Feb', product: 'B', sales: 9000,   qty: 150 },
  { month: 'Mar', product: 'A', sales: 15000, qty: 180 },
  { month: 'Apr', product: 'B', sales: 11000, qty: 160 },
  { month: 'May', product: 'A', sales: 19000, qty: 190 },
];

/* -------------------- ChartJS Config -------------------- */
const barChart = {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Product A',
        data: [12000, 15000, 13000, 17000, 19000],
        backgroundColor: '#2563EB',
      },
      {
        label: 'Product B',
        data: [8000, 9000, 11000, 12000, 14000],
        backgroundColor: '#38B2AC',
      },
    ],
  },
  options: {
    animation: false,
    responsive: false,
    plugins: { legend: { display: true } },
    scales: {
      y: { beginAtZero: true },
    },
  },
};

/* -------------------- PDF Template Component -------------------- */
export const ReportTemplate = ({ title, author, data }) => (
  <Layout size="A4" style={{fontFamily: 'Inter', fontSize: 12}}>
    <H1 textAlign="center">{title}</H1>
    <P textAlign="center">Author: {author}</P>

    {/* Chart Section */}
    <Div style={{marginVertical: 12}}>
      <H2>Monthly Sales Chart</H2>
      <ChartJS data={barChart} />
    </Div>

    {/* Table Section */}
    <Div style={{marginVertical: 12}}>
      <H2>Sales Table</H2>
      <Table
        textColor="#000"
        fontSize="12"
        cellHeight={24}
        borderColor="#000"
        header={true}
        className="border-collapse"
      >
        <Thead>
          <Tr>
            <Th align="left">Month</Th>
            <Th align="left">Product</Th>
            <Th numeric align="right">Sales</Th>
            <Th numeric align="right">Qty</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row) => (
            <Tr key={row.month}>
              <Td>{row.month}</Td>
              <Td>{row.product}</Td>
              <Td align="right">{row.sales.toLocaleString()}</Td>
              <Td align="right">{row.qty}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Div>

    {/* Insights Section */}
    <Div style={{marginTop: 24}}>
      <H2>Key Insights</H2>
      <P>
        • Product A outperformed Product B by 15% in March.<br/>
        • Highest sales month: May.<br/>
        • Overall revenue upward trend across the five‑month period.
      </P>
    </Div>
  </Layout>
);