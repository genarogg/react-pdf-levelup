import { Layout, View, Text, StyleSheet } from "@react-pdf-levelup/core"
import { ChartJS } from "@react-pdf-levelup/chart"

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
  },
})

const Component = () => {
  const data = {
    type: "bar",
    data: {
      labels: ["Enero", "Febrero", "Marzo", "Abril"],
      datasets: [
        {
          label: "Ventas",
          data: [50, 75, 40, 90],
          backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  }

  return (
    <Layout size="A4" showPageNumbers={true}>
      <View style={styles.container}>
        <Text style={styles.title}>Charts con ChartJS</Text>
        <ChartJS data={data} width={500} height={300} />
      </View>
    </Layout>
  )
}

export default Component
