import { useMemo } from "react";
import { ChartExample } from "./ChartExample";

export function GettingStartedSection() {
  const simpleData = useMemo(() => {
    // Generate last 7 days of data with timestamps
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    return [
      { x: now - oneDay * 6, y: 42 },
      { x: now - oneDay * 5, y: 58 },
      { x: now - oneDay * 4, y: 35 },
      { x: now - oneDay * 3, y: 67 },
      { x: now - oneDay * 2, y: 52 },
      { x: now - oneDay * 1, y: 78 },
      { x: now, y: 64 },
    ];
  }, []);

  return (
    <ChartExample
      title="Try It Out!"
      description="Here's a simple interactive line chart showing the last 7 days. Try hovering over it or touching it to see the interaction."
      config={{
        data: simpleData,
        hover: {
          enabled: true,
          showDot: true,
          highlightLine: true,
        },
        xAxis: {
          enabled: true,
          isTimeData: true,
          formatter: (value) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          },
        },
        yAxis: {
          enabled: true,
        },
      }}
      height={300}
      code={`import { LineChart } from "expo-skia-charts";

// Generate last 7 days of data with timestamps
const now = Date.now();
const oneDay = 24 * 60 * 60 * 1000;
const data = [
  { x: now - oneDay * 6, y: 42 },
  { x: now - oneDay * 5, y: 58 },
  { x: now - oneDay * 4, y: 35 },
  { x: now - oneDay * 3, y: 67 },
  { x: now - oneDay * 2, y: 52 },
  { x: now - oneDay * 1, y: 78 },
  { x: now, y: 64 },
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
        xAxis: {
          enabled: true,
          isTimeData: true,
          formatter: (value) => {
            const date = new Date(value);
            return \`\${date.getMonth() + 1}/\${date.getDate()}\`;
          },
        },
        yAxis: { enabled: true },
      }}
    />
  );
}`}
    />
  );
}
