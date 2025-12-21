import React from "react";
import CodeBlock from "@theme/CodeBlock";
import ChartDemo from "./ChartDemo";
import type { LineChartConfig } from "expo-skia-charts";

interface ChartExampleProps {
  title: string;
  description?: string;
  config: LineChartConfig;
  height?: number;
}

export default function ChartExample({
  title,
  description,
  config,
  height,
}: ChartExampleProps) {
  // Format config for display (replace large data arrays)
  const configForDisplay = {
    ...config,
    data: config.data ? `[...${config.data.length} data points]` : undefined,
    series: config.series?.map((s) => ({
      ...s,
      data: `[...${s.data.length} data points]`,
    })),
  };

  const configString = JSON.stringify(configForDisplay, null, 2).replace(
    /"(\[\.\.\..*?\])"/g,
    "$1"
  );

  return (
    <div style={{ marginBottom: "3rem" }}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <div style={{ flex: 1 }}>
          <ChartDemo config={config} height={height} />
        </div>
        <div style={{ flex: 1 }}>
          <CodeBlock language="typescript" title="config">
            {configString}
          </CodeBlock>
        </div>
      </div>
    </div>
  );
}
