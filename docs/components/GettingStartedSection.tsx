import { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { ChartExample } from "./ChartExample";
import { MarkdownRenderer } from "./MarkdownRenderer";
import * as GettingStarted from "../content/getting-started";

export function GettingStartedSection() {
  const simpleData = useMemo(() => {
    return [
      { x: 1, y: 10 },
      { x: 2, y: 25 },
      { x: 3, y: 15 },
      { x: 4, y: 40 },
      { x: 5, y: 30 },
    ];
  }, []);

  // Split the content to insert chart example after "Chart Types" section
  const parts = GettingStarted.content.split("## Quick Start");
  const beforeQuickStart = parts[0] || "";
  const afterQuickStart = parts[1] ? `## Quick Start${parts[1]}` : "";

  return (
    <View style={styles.container}>
      <MarkdownRenderer content={beforeQuickStart} />

      <ChartExample
        title="Try It Out!"
        description="Here's a simple interactive line chart. Try hovering over it or touching it to see the interaction."
        config={{
          data: simpleData,
          hover: {
            enabled: true,
            showDot: true,
            highlightLine: true,
          },
          xAxis: {
            enabled: true,
          },
          yAxis: {
            enabled: true,
          },
        }}
        height={300}
        code={`import { LineChart } from "expo-skia-charts";
import { View } from "react-native";

const data = [
  { x: 1, y: 10 },
  { x: 2, y: 25 },
  { x: 3, y: 15 },
  { x: 4, y: 40 },
  { x: 5, y: 30 },
];

function MyChart() {
  return (
    <View style={{ height: 300 }}>
      <LineChart.Chart
        config={{
          data: data,
          hover: {
            enabled: true,
            showDot: true,
            highlightLine: true,
          },
          xAxis: { enabled: true },
          yAxis: { enabled: true },
        }}
      />
    </View>
  );
}`}
      />

      <MarkdownRenderer content={afterQuickStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
