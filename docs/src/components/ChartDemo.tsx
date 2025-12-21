import React, { useMemo, useState } from "react";
import { View, Text } from "react-native";
import { LineChart } from "expo-skia-charts";
import type { LineChartConfig } from "expo-skia-charts";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

interface ChartDemoProps {
  config: LineChartConfig;
  height?: number;
  title?: string;
}

function ChartDemoInner({ config, height = 300, title }: ChartDemoProps) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      {title && <h3>{title}</h3>}
      <div
        style={{
          height: `${height}px`,
          border: "1px solid var(--ifm-color-emphasis-300)",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <SkiaChart config={config} />
      </div>
    </div>
  );
}

export default function ChartDemo(props: ChartDemoProps) {
  return (
    <BrowserOnly fallback={<div>Loading chart...</div>}>
      {() => <ChartDemoInner {...props} />}
    </BrowserOnly>
  );
}

function SkiaChart(props: ChartDemoProps) {
  return (
    <WithSkiaWeb
      opts={{
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/canvaskit-wasm@0.40.0/bin/full/${file}`,
      }}
      getComponent={() => Promise.resolve({ default: TestComponent })}
      // getComponent={() =>
      //   Promise.resolve({ default: <LineChart.Chart config={props.config} /> })
      // }
    />
  );
}

function TestComponent() {
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (9 - i));
      const value = Math.random() * 100;
      data.push({ y: value, x: date.getTime() });
    }
    return data;
  }, []);
  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        borderWidth: 5,
        borderColor: "red",
      }}
    >
      <LineChart.Chart
        config={{
          data: chartData,
        }}
      />
    </div>
  );
}
