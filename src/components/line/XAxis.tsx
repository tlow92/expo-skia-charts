import {
  Group,
  Line,
  Paragraph,
  Skia,
  TextAlign,
  useFonts,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { calculateXAxis } from "../../utils/axisCalculations";
import type { AxisConfig, LineChartDataPoint } from "./types";
import { Platform } from "react-native";

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

  const customFontMgr = useFonts({
    Roboto: [
      Platform.OS === "web"
        ? { default: require("../../assets/Roboto-Regular.ttf") }
        : require("../../assets/Roboto-Regular.ttf"),
    ],
  });

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

        if (customFontMgr) {
          try {
            const paragraphStyle = {
              textAlign: TextAlign.Center,
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
            paragraph.layout(100);
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
                x={tick.position - 50}
                y={fontSize + 5}
                width={100}
              />
            )}
          </Group>
        );
      })}
    </Group>
  );
}
