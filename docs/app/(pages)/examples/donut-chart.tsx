import { DonutChart } from "expo-skia-charts";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DonutChartExamplesScreen() {
  return (
    <>
      <Text style={styles.h1}>DonutChart Examples</Text>
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
