import { Group, Line, Paragraph, Skia, TextAlign } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { useRobotoFontManager } from "../../utils/useCustomFont";
import type { BarLayout, XAxisConfig, YAxisConfig } from "./types";

type CategoricalAxisProps = {
  bars: BarLayout[];
  width: number;
  height: number;
  config?: XAxisConfig | YAxisConfig;
  orientation: "horizontal" | "vertical";
  axisType: "x" | "y";
};

export function CategoricalAxis({
  bars,
  width,
  height,
  config,
  axisType,
}: CategoricalAxisProps) {
  const {
    enabled = true,
    fontSize = 12,
    color = "#666",
    showGridLines = false,
    gridLineColor = "#e0e0e0",
  } = config ?? {};

  const robotoFont = useRobotoFontManager();

  // Extract unique labels and their positions
  const labelData = useMemo(() => {
    const seen = new Set<string>();
    const labels: Array<{ label: string; position: number }> = [];

    for (const bar of bars) {
      if (!seen.has(bar.dataPoint.label)) {
        seen.add(bar.dataPoint.label);

        if (axisType === "x") {
          // X-axis: position at center of bar horizontally
          const centerX = bar.x + bar.width / 2;
          labels.push({ label: bar.dataPoint.label, position: centerX });
        } else {
          // Y-axis: position at center of bar vertically
          const centerY = bar.y + bar.height / 2;
          labels.push({ label: bar.dataPoint.label, position: centerY });
        }
      }
    }

    return labels;
  }, [bars, axisType]);

  if (!enabled) return null;

  if (axisType === "x") {
    // X-axis (bottom of chart for vertical bars)
    return (
      <Group>
        {/* Axis line */}
        <Line p1={{ x: 0, y: 0 }} p2={{ x: width, y: 0 }} color={color} strokeWidth={1} />

        {labelData.map((item, index) => {
          let paragraph = null;
          const labelWidth = 100;
          const halfWidth = labelWidth / 2;

          // Center the label at the bar position
          let textAlign = TextAlign.Center;
          let labelX = item.position - halfWidth;

          // Check if label would overflow on the right
          const rightEdge = item.position + halfWidth;
          if (rightEdge > width) {
            textAlign = TextAlign.Right;
            labelX = item.position - labelWidth;
          }

          // Check if label would overflow on the left
          if (labelX < 0) {
            textAlign = TextAlign.Left;
            labelX = item.position;
          }

          if (robotoFont) {
            try {
              const paragraphStyle = { textAlign };
              const textStyle = {
                color: Skia.Color(color),
                fontSize,
              };

              const builder = Skia.ParagraphBuilder.Make(paragraphStyle, robotoFont);
              builder.pushStyle(textStyle);
              builder.addText(item.label);
              builder.pop();
              paragraph = builder.build();
              paragraph.layout(labelWidth);
            } catch (error) {
              console.warn("Failed to build paragraph for categorical label:", error);
            }
          }

          return (
            <Group key={`cat-x-${index}-${item.label}`}>
              {/* Grid lines */}
              {showGridLines && (
                <Line
                  p1={{ x: item.position, y: 0 }}
                  p2={{ x: item.position, y: -height }}
                  color={gridLineColor}
                  strokeWidth={1}
                  opacity={0.5}
                />
              )}

              {/* Tick mark */}
              <Line
                p1={{ x: item.position, y: 0 }}
                p2={{ x: item.position, y: 5 }}
                color={color}
                strokeWidth={1}
              />

              {/* Label */}
              {paragraph && (
                <Paragraph
                  paragraph={paragraph}
                  x={labelX}
                  y={fontSize + 5}
                  width={labelWidth}
                />
              )}
            </Group>
          );
        })}
      </Group>
    );
  }

  // Y-axis (left of chart for horizontal bars)
  return (
    <Group>
      {/* Axis line */}
      <Line p1={{ x: 0, y: 0 }} p2={{ x: 0, y: height }} color={color} strokeWidth={1} />

      {labelData.map((item, index) => {
        let paragraph = null;
        const labelWidth = 80;

        if (robotoFont) {
          try {
            const paragraphStyle = { textAlign: TextAlign.Right };
            const textStyle = {
              color: Skia.Color(color),
              fontSize,
            };

            const builder = Skia.ParagraphBuilder.Make(paragraphStyle, robotoFont);
            builder.pushStyle(textStyle);
            builder.addText(item.label);
            builder.pop();
            paragraph = builder.build();
            paragraph.layout(labelWidth);
          } catch (error) {
            console.warn("Failed to build paragraph for categorical label:", error);
          }
        }

        return (
          <Group key={`cat-y-${index}-${item.label}`}>
            {/* Grid lines */}
            {showGridLines && (
              <Line
                p1={{ x: 0, y: item.position }}
                p2={{ x: width, y: item.position }}
                color={gridLineColor}
                strokeWidth={1}
                opacity={0.5}
              />
            )}

            {/* Tick mark */}
            <Line
              p1={{ x: 0, y: item.position }}
              p2={{ x: -5, y: item.position }}
              color={color}
              strokeWidth={1}
            />

            {/* Label */}
            {paragraph && (
              <Paragraph
                paragraph={paragraph}
                x={-labelWidth - 10}
                y={item.position - fontSize / 2}
                width={labelWidth}
              />
            )}
          </Group>
        );
      })}
    </Group>
  );
}
