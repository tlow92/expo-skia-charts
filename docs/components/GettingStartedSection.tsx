import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import * as GettingStarted from "../content/getting-started";
import { ChartExample } from "./ChartExample";
import { MarkdownRenderer } from "./MarkdownRenderer";

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

  return (
    <View style={styles.container}>
      <MarkdownRenderer content={GettingStarted.content} />

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

const data = [
  { x: 1, y: 10 },
  { x: 2, y: 25 },
  { x: 3, y: 15 },
  { x: 4, y: 40 },
  { x: 5, y: 30 },
];

function MyChart() {
  return (
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
  );
}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
