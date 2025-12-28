import { DonutChart } from "expo-skia-charts";
import type { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import Animated, { Easing, FadeInDown, FadeOutUp } from "react-native-reanimated";

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
    <GestureHandlerRootView>
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
          <ChartWrapper title="Custom Center Values">
            <DonutChart
              config={{
                data: smallData,
                colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
                strokeWidth: 20,
                gap: 5,
                roundedCorners: true,
                legend: { enabled: true },
                hover: { enabled: true, animateOnHover: true, hitSlop: 100 },
                centerValues: {
                  enabled: true,
                  renderContent: (_segments, total, hoveredSegment) => {
                    const { value, label, color } = hoveredSegment || {
                      value: total,
                      label: "Total",
                      color: "#1F2937",
                    };
                    if (!value || !label || !color) return null;
                    return (
                      <AnimatedCenterValues
                        value={value}
                        label={label}
                        color={color}
                        total={total}
                      />
                    );
                  },
                },
              }}
            />
          </ChartWrapper>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
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

function AnimatedCenterValues({
  value,
  label,
  color,
  total,
}: {
  value: number;
  label: string;
  color: string;
  total: number;
}) {
  return (
    // @ts-expect-error - Reanimated types have issues with children prop
    <Animated.View
      key={`${value}-${label}`}
      entering={FadeInDown.easing(Easing.quad).duration(150).delay(50)}
      exiting={FadeOutUp.easing(Easing.quad).duration(150)}
      style={{ alignItems: "center" }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: color,
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 16, color: "#6B7280", marginTop: 4 }}>{label}</Text>
      <Text
        style={{
          fontSize: 12,
          color: "#9CA3AF",
          marginTop: 2,
          opacity: value !== total ? 1 : 0,
        }}
      >
        {((value / total) * 100).toFixed(0)}% of {total}
      </Text>
    </Animated.View>
  );
}
