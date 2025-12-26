import type { ProcessedSegment } from "expo-skia-charts";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { Easing, FadeInDown, FadeOutUp } from "react-native-reanimated";
import { DonutChartExample } from "../../../components/DonutChartExample";

export default function DonutChartExamplesScreen() {
  const data = useMemo(
    () => [
      { label: "Design", value: 50000 },
      { label: "Development", value: 25000 },
      { label: "Marketing", value: 10000 },
      { label: "Sales", value: 4000 },
    ],
    []
  );

  const smallData = useMemo(
    () => [
      { label: "Q1", value: 30 },
      { label: "Q2", value: 45 },
      { label: "Q3", value: 25 },
    ],
    []
  );

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>DonutChart Examples</Text>
      <Text style={styles.intro}>
        Interactive and highly customizable donut charts with hover effects, custom center
        values, legends, and more.
      </Text>

      <Text style={styles.h2}>Basic Examples</Text>

      <DonutChartExample
        title="Simple Donut Chart"
        description="The most basic donut chart with center values and legend showing data distribution."
        config={{
          data,
          strokeWidth: 25,
          centerValues: { enabled: true },
          legend: { enabled: true },
          hover: { enabled: true },
        }}
        height={400}
        code={`<DonutChart
  config={{
    data,
    strokeWidth: 25,
    centerValues: { enabled: true },
    legend: { enabled: true },
    hover: { enabled: true },
  }}
/>`}
      />

      <DonutChartExample
        title="Custom Colors"
        description="Customize chart colors with a custom palette and longer animation duration."
        config={{
          data: smallData,
          colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
          strokeWidth: 25,
          centerValues: { enabled: true },
          legend: { enabled: true },
          hover: { enabled: true },
          animationDuration: 1500,
        }}
        height={400}
        code={`<DonutChart
  config={{
    data: smallData,
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    strokeWidth: 25,
    centerValues: { enabled: true },
    legend: { enabled: true },
    hover: { enabled: true },
    animationDuration: 1500,
  }}
/>`}
      />

      <Text style={styles.h2}>Styling & Visual Effects</Text>

      <DonutChartExample
        title="Gap with Rounded Corners"
        description="Add visual separation between segments with gaps and smooth rounded corners."
        config={{
          data,
          strokeWidth: 25,
          gap: 5,
          roundedCorners: true,
          centerValues: { enabled: true },
          legend: { enabled: true },
          hover: { enabled: true },
        }}
        height={400}
        code={`<DonutChart
  config={{
    data,
    strokeWidth: 25,
    gap: 5,
    roundedCorners: true,
    centerValues: { enabled: true },
    legend: { enabled: true },
    hover: { enabled: true },
  }}
/>`}
      />

      <Text style={styles.h2}>Interactive Features</Text>

      <DonutChartExample
        title="Hover: Animate Opacity"
        description="Fade other segments when hovering over a specific one for better focus."
        config={{
          data,
          strokeWidth: 25,
          centerValues: { enabled: true },
          legend: { enabled: true },
          hover: {
            enabled: true,
            animateOnHover: true,
            updateCenterOnHover: true,
          },
        }}
        height={400}
        code={`<DonutChart
  config={{
    data,
    strokeWidth: 25,
    centerValues: { enabled: true },
    legend: { enabled: true },
    hover: {
      enabled: true,
      animateOnHover: true,
      updateCenterOnHover: true,
    },
  }}
/>`}
      />

      <DonutChartExample
        title="Expanded Touch Area"
        description="Increase the interactive touch area with hitSlop for easier segment selection."
        config={{
          data,
          strokeWidth: 25,
          centerValues: { enabled: true },
          legend: { enabled: true },
          hover: {
            enabled: true,
            animateOnHover: true,
            updateCenterOnHover: true,
            hitSlop: 50,
          },
        }}
        height={400}
        code={`<DonutChart
  config={{
    data,
    strokeWidth: 25,
    centerValues: { enabled: true },
    legend: { enabled: true },
    hover: {
      enabled: true,
      animateOnHover: true,
      updateCenterOnHover: true,
      hitSlop: 50,
    },
  }}
/>`}
      />

      <Text style={styles.h2}>Advanced Features</Text>

      <DonutChartExample
        title="Custom Center Values with Animation"
        description="Create fully custom center content with React Native components and smooth animations."
        config={{
          data: smallData,
          colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
          strokeWidth: 25,
          gap: 5,
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
        height={400}
        code={`<DonutChart
  config={{
    data: smallData,
    colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    strokeWidth: 25,
    gap: 5,
    roundedCorners: true,
    legend: { enabled: true },
    hover: {
      enabled: true,
      animateOnHover: true,
      hitSlop: 100
    },
    centerValues: {
      enabled: true,
      renderContent: (_segments, total, hoveredSegment) => {
        const { value, label, color } = hoveredSegment || {
          value: total,
          label: "Total",
          color: "#1F2937",
        };

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
/>`}
      />
    </View>
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
  container: {
    flex: 1,
  },
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 48,
    marginBottom: 24,
    color: "#1a1a1a",
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    color: "#374151",
  },
});
