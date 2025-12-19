import {
  Group,
  Line,
  Paragraph,
  Skia,
  TextAlign,
  useFonts,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { calculateYAxis } from "../../utils/axisCalculations";
import type { AxisConfig, LineChartDataPoint } from "./types";
import { Platform } from "react-native";

type YAxisProps = {
  data: LineChartDataPoint[];
  width: number;
  height: number;
  config?: AxisConfig;
};

export function YAxis({ data, width, height, config }: YAxisProps) {
  const {
    enabled = true,
    tickCount = 2,
    formatter,
    fontSize = 12,
    color = "#666",
    showGridLines = false,
    gridLineColor = "#e0e0e0",
  } = config ?? {};

  const customFontMgr = useFonts({
    Roboto: [
      Platform.OS === "web"
        ? { default: require("../../assets/Roboto-Regular.ttf") }
        : require("../../assets/Roboto-Regular.ttf"),
    ],
  });

  const axisData = useMemo(
    () => calculateYAxis(data, height, tickCount, formatter),
    [data, height, tickCount, formatter]
  );

  if (!enabled) return null;

  return (
    <Group>
      {/* Axis line */}
      <Line p1={{ x: 0, y: 0 }} p2={{ x: 0, y: height }} color={color} strokeWidth={1} />

      {axisData.ticks.map((tick) => {
        let paragraph = null;

        if (customFontMgr) {
          try {
            const paragraphStyle = {
              textAlign: TextAlign.Right,
            };
            const textStyle = {
              color: Skia.Color(color),
              fontSize,
            };

            const builder = Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr);
            builder.pushStyle(textStyle);
            builder.addText(tick.label);
            builder.pop();
            paragraph = builder.build();
            paragraph.layout(45);
          } catch (error) {
            console.warn("Failed to build paragraph for YAxis label:", error);
          }
        }

        return (
          <Group key={tick.value}>
            {/* Grid lines */}
            {showGridLines && (
              <Line
                p1={{ x: 0, y: tick.position }}
                p2={{ x: width, y: tick.position }}
                color={gridLineColor}
                strokeWidth={1}
                opacity={0.5}
              />
            )}

            {/* Tick mark */}
            <Line
              p1={{ x: 0, y: tick.position }}
              p2={{ x: -5, y: tick.position }}
              color={color}
              strokeWidth={1}
            />

            {/* Tick label */}
            {paragraph && (
              <Paragraph
                paragraph={paragraph}
                x={-50}
                y={tick.position - fontSize / 2}
                width={45}
              />
            )}
          </Group>
        );
      })}
    </Group>
  );
}
