import { Group, Line, Paragraph, Skia, TextAlign } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { calculateXAxis } from "../../utils/axisCalculations";
import { useRobotoFontManager } from "../../utils/useCustomFont";
import type { AxisConfig, LineChartDataPoint } from "./types";

type XAxisProps = {
  data: LineChartDataPoint[];
  width: number;
  height: number;
  config?: AxisConfig;
};

export function XAxis({ data, width, height, config }: XAxisProps) {
  const {
    enabled = true,
    tickCount = 2,
    formatter,
    fontSize = 12,
    color = "#666",
    showGridLines = false,
    gridLineColor = "#e0e0e0",
    isTimeData = false,
  } = config ?? {};

  const robotoFont = useRobotoFontManager();

  const axisData = useMemo(
    () => calculateXAxis(data, width, tickCount, formatter, isTimeData),
    [data, width, tickCount, formatter, isTimeData]
  );

  if (!enabled) return null;

  return (
    <Group>
      {/* Axis line */}
      <Line p1={{ x: 0, y: 0 }} p2={{ x: width, y: 0 }} color={color} strokeWidth={1} />

      {axisData.ticks.map((tick) => {
        let paragraph = null;
        const labelWidth = 100;
        const halfWidth = labelWidth / 2;

        // Determine text alignment and position based on overflow
        let textAlign = TextAlign.Center;
        let labelX = tick.position - halfWidth;

        // Check if label would overflow on the right
        const rightEdge = tick.position + halfWidth;
        if (rightEdge > width) {
          // Right-align the label at the tick position
          textAlign = TextAlign.Right;
          labelX = tick.position - labelWidth;
        }

        // Check if label would overflow on the left
        if (labelX < 0) {
          // Left-align the label at position 0
          textAlign = TextAlign.Left;
          labelX = tick.position;
        }

        if (robotoFont) {
          try {
            const paragraphStyle = {
              textAlign,
            };
            const textStyle = {
              color: Skia.Color(color),
              fontSize,
            };

            const builder = Skia.ParagraphBuilder.Make(paragraphStyle, robotoFont);
            builder.pushStyle(textStyle);
            builder.addText(tick.label);
            builder.pop();
            paragraph = builder.build();
            paragraph.layout(labelWidth);
          } catch (error) {
            console.warn("Failed to build paragraph for XAxis label:", error);
          }
        }

        return (
          <Group key={tick.value}>
            {/* Grid lines */}
            {showGridLines && (
              <Line
                p1={{ x: tick.position, y: 0 }}
                p2={{ x: tick.position, y: -height }}
                color={gridLineColor}
                strokeWidth={1}
                opacity={0.5}
              />
            )}

            {/* Tick mark */}
            <Line
              p1={{ x: tick.position, y: 0 }}
              p2={{ x: tick.position, y: 5 }}
              color={color}
              strokeWidth={1}
            />

            {/* Tick label */}
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
