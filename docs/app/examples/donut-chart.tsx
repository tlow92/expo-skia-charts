import { DonutChart } from "expo-skia-charts";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DonutChartExamplesScreen() {
  const basicData = useMemo(
    () => [
      { label: "Shopify Payments", value: 50000 },
      { label: "PayPal", value: 25000 },
      { label: "Other", value: 10000 },
      { label: "Amazon Pay", value: 4000 },
    ],
    []
  );

  return (
    <>
      <Text style={styles.h1}>DonutChart Examples</Text>
      <Text style={styles.intro}>
        Interactive donut and pie charts with customizable stroke widths, labels, and
        center values.
      </Text>

      <Text style={styles.h2}>Basic Donut Chart</Text>
      <View style={styles.chartWrapper}>
        <View style={styles.chart}>
          <DonutChart data={basicData} strokeWidth={40} showLabels={false} />
        </View>
      </View>

      <Text style={styles.h2}>With Labels</Text>
      <View style={styles.chartWrapper}>
        <View style={styles.chart}>
          <DonutChart data={basicData} strokeWidth={40} showLabels={true} />
        </View>
      </View>

      <Text style={styles.h2}>With Center Value</Text>
      <View style={styles.chartWrapper}>
        <View style={styles.chart}>
          <DonutChart
            data={basicData}
            strokeWidth={40}
            showLabels={true}
            showCenterValue={true}
          />
        </View>
      </View>

      <Text style={styles.h2}>Thin Stroke</Text>
      <View style={styles.chartWrapper}>
        <View style={styles.chart}>
          <DonutChart
            data={basicData}
            strokeWidth={20}
            showLabels={true}
            showCenterValue={true}
          />
        </View>
      </View>

      <Text style={styles.h2}>Three Segments</Text>
      <View style={styles.chartWrapper}>
        <View style={styles.chart}>
          <DonutChart
            data={[
              { label: "Revenue", value: 75000 },
              { label: "Expenses", value: 45000 },
              { label: "Profit", value: 30000 },
            ]}
            strokeWidth={50}
            showLabels={true}
            showCenterValue={true}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 16,
    color: "#1a1a1a",
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    color: "#374151",
  },
  chartWrapper: {
    marginBottom: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 24,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  chart: {
    height: 400,
    maxWidth: 400,
  },
});
