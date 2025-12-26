import { DonutChart } from "expo-skia-charts";
import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
  const data = [
    { label: "Design", value: 50000 },
    { label: "Development", value: 25000 },
    { label: "Marketing", value: 10000 },
    { label: "Sales", value: 4000 },
  ];

  const smallData = [
    { label: "Q1", value: 30 },
    { label: "Q2", value: 45 },
    { label: "Q3", value: 25 },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        <ChartWrapper title="Basic Donut Chart">
          <DonutChart
            config={{
              data,
              strokeWidth: 20,
              centerValues: { enabled: true },
              legend: { enabled: true },
              hover: { enabled: true },
            }}
          />
        </ChartWrapper>

        <ChartWrapper title="Without Center Values">
          <DonutChart
            config={{
              data,
              strokeWidth: 20,
              centerValues: { enabled: false },
              legend: { enabled: true },
              hover: { enabled: true },
            }}
          />
        </ChartWrapper>

        <ChartWrapper title="Without Legend">
          <DonutChart
            config={{
              data,
              strokeWidth: 20,
              centerValues: { enabled: true },
              legend: { enabled: false },
              hover: { enabled: true },
            }}
          />
        </ChartWrapper>

        <ChartWrapper title="Custom Colors & Stroke">
          <DonutChart
            config={{
              data: smallData,
              colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
              strokeWidth: 20,
              centerValues: { enabled: true },
              legend: { enabled: true },
              hover: { enabled: true },
              animationDuration: 1500,
            }}
          />
        </ChartWrapper>

        <ChartWrapper title="Minimal (No Interactions)">
          <DonutChart
            config={{
              data: smallData,
              strokeWidth: 20,
              centerValues: { enabled: false },
              legend: { enabled: false },
              hover: { enabled: false },
            }}
          />
        </ChartWrapper>

        <ChartWrapper title="Hover: Animate Opacity">
          <DonutChart
            config={{
              data,
              strokeWidth: 20,
              centerValues: { enabled: true },
              legend: { enabled: true },
              hover: { enabled: true, animateOnHover: true },
            }}
          />
        </ChartWrapper>

        <ChartWrapper title="Hover: Update Center Values">
          <DonutChart
            config={{
              data,
              strokeWidth: 20,
              centerValues: { enabled: true },
              legend: { enabled: true },
              hover: { enabled: true, updateCenterOnHover: true },
            }}
          />
        </ChartWrapper>

        <ChartWrapper title="Hover: Both Effects and Custom Legend">
          <DonutChart
            config={{
              data,
              strokeWidth: 20,
              centerValues: { enabled: true },
              legend: {
                enabled: true,
                renderContent: (segments) => {
                  return segments.map((segment, index) => {
                    return (
                      <View
                        key={index}
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={{ fontSize: 12, color: "#1F2937" }}>
                          {segment.label}
                        </Text>
                        <Text style={{ fontSize: 12, color: "#1F2937" }}>
                          {segment.value}
                        </Text>
                      </View>
                    );
                  });
                },
              },
              hover: {
                enabled: true,
                animateOnHover: true,
                updateCenterOnHover: true,
              },
            }}
          />
        </ChartWrapper>

        <ChartWrapper title="Gap with Rounded Corners">
          <DonutChart
            config={{
              data,
              strokeWidth: 20,
              gap: 5,
              roundedCorners: true,
              centerValues: { enabled: true },
              legend: { enabled: true },
              hover: { enabled: true },
            }}
          />
        </ChartWrapper>

        <ChartWrapper title="Large Gap with Rounded Corners">
          <DonutChart
            config={{
              data: smallData,
              colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
              strokeWidth: 20,
              gap: 12,
              roundedCorners: true,
              centerValues: { enabled: true },
              legend: { enabled: true },
              hover: { enabled: true, updateCenterOnHover: true, animateOnHover: true },
            }}
          />
        </ChartWrapper>

        <ChartWrapper title="Expanded Touch Area (hitSlop: 50)">
          <DonutChart
            config={{
              data,
              strokeWidth: 20,
              centerValues: { enabled: true },
              legend: { enabled: true },
              hover: {
                enabled: true,
                animateOnHover: true,
                updateCenterOnHover: true,
                hitSlop: 50,
              },
            }}
          />
        </ChartWrapper>
      </View>
    </ScrollView>
  );
}

function ChartWrapper({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <View style={styles.chartWrapper}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
  },
  chartWrapper: {
    width: 450,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1F2937",
  },
  chartContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 16,
    height: 350,
  },
});
