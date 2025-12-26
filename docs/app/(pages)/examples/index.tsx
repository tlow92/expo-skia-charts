import { Link } from "expo-router";
import type { ProcessedSegment } from "expo-skia-charts";
import { DonutChart, LineChart } from "expo-skia-charts";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { Easing, FadeInDown, FadeOutUp } from "react-native-reanimated";

export default function ExamplesIndexScreen() {
  // Generate sample data for LineChart
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (29 - i));
      const value = 50 + Math.sin(i / 5) * 25 + Math.random() * 10;
      data.push({ y: value, x: date.getTime() });
    }
    return data;
  }, []);

  const donutData = useMemo(
    () => [
      { label: "Q1", value: 30 },
      { label: "Q2", value: 45 },
      { label: "Q3", value: 25 },
    ],
    []
  );

  return (
    <>
      <Text style={styles.h1}>Examples</Text>
      <Text style={styles.intro}>
        Explore interactive chart examples showcasing different features and use cases.
        Choose a chart type to see live examples.
      </Text>

      <View style={styles.cardContainer}>
        {/* @ts-ignore - asChild prop is valid but type definitions are incomplete */}
        <Link href="/examples/line-chart" asChild>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>LineChart Examples</Text>
            <Text style={styles.cardDescription}>
              Explore single and multi-line charts with hover interactions, axes, grid
              lines, custom tooltips, and more.
            </Text>

            <View style={styles.exampleChart}>
              <LineChart
                config={{
                  series: [
                    {
                      id: "series1",
                      label: "Revenue",
                      data: chartData,
                      colors: {
                        highlightColor: "#3E63DD",
                        lineBase: "#9EB1FF",
                        dotBase: "#0090FF",
                      },
                    },
                    {
                      id: "series2",
                      label: "Expenses",
                      data: chartData.map((point) => ({
                        x: point.x,
                        y: point.y * 0.7 + 10,
                      })),
                      colors: {
                        highlightColor: "#E5484D",
                        lineBase: "#FFBDBD",
                        dotBase: "#E5484D",
                      },
                    },
                    {
                      id: "series3",
                      label: "Profit",
                      data: chartData.map((point) => ({
                        x: point.x,
                        y: point.y * 0.3 - 5,
                      })),
                      colors: {
                        highlightColor: "#30A46C",
                        lineBase: "#B4E5C9",
                        dotBase: "#30A46C",
                      },
                    },
                  ],
                  hover: {
                    enabled: true,
                    showDot: true,
                    highlightLine: true,
                  },
                  xAxis: {
                    enabled: true,
                    isTimeData: true,
                    showGridLines: true,
                  },
                  yAxis: {
                    enabled: true,
                    showGridLines: true,
                  },
                }}
              />
            </View>

            <Text style={styles.cardLink}>View All Examples →</Text>
          </TouchableOpacity>
        </Link>

        {/* @ts-ignore - asChild prop is valid but type definitions are incomplete */}
        <Link href="/examples/donut-chart" asChild>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>DonutChart Examples</Text>
            <Text style={styles.cardDescription}>
              Interactive donut and pie charts with labels, center values, and custom
              styling options.
            </Text>

            <View style={styles.exampleChart}>
              <DonutChart
                config={{
                  data: donutData,
                  colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
                  strokeWidth: 15,
                  gap: 8,
                  roundedCorners: true,
                  legend: { enabled: true },
                  hover: { enabled: true, animateOnHover: true, hitSlop: 100 },
                  centerValues: {
                    enabled: true,
                    renderContent: (
                      _segments: ProcessedSegment[],
                      total: number,
                      hoveredSegment: ProcessedSegment | null
                    ) => {
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
            </View>

            <Text style={styles.cardLink}>View All Examples →</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

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

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    color: "#374151",
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    color: "#6b7280",
  },
  exampleChart: {
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  cardLink: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3b82f6",
  },
});
