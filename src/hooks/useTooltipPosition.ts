import type { ViewStyle } from "react-native";
import {
  type AnimatedStyle,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import type { LineChartDataPoint } from "../components/line/types";

interface UseTooltipPositionParams {
  x: SharedValue<number>;
  y: SharedValue<number>;
  dataPoint: SharedValue<LineChartDataPoint | null>;
  snapToPoint: boolean;
  chartWidth: number;
  chartHeight: number;
  tooltipWidth: number;
  tooltipHeight: number;
  offset: { x: number; y: number };
  marginLeft: number;
  marginTop: number;
  data: LineChartDataPoint[];
}

export function useTooltipPosition({
  x,
  y,
  dataPoint,
  snapToPoint,
  chartWidth,
  chartHeight,
  tooltipWidth,
  tooltipHeight,
  offset,
  marginLeft,
  marginTop,
  data,
}: UseTooltipPositionParams): AnimatedStyle<ViewStyle> {
  return useAnimatedStyle(() => {
    "worklet";

    // Hide tooltip if no data point
    if (!dataPoint.value) {
      return {
        opacity: 0,
        transform: [{ translateX: -1000 }, { translateY: -1000 }],
      };
    }

    // Base position (either snapped to data point or smooth follow)
    let baseX: number;
    let baseY: number;

    if (snapToPoint && data.length > 0) {
      // Calculate screen coordinates for the data point
      const xValues = data.map((point) => point.x);
      const yValues = data.map((point) => point.y);
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const minY = Math.min(...yValues);
      const maxY = Math.max(...yValues);

      const point = dataPoint.value;
      // Map data point to screen coordinates
      baseX = ((point.x - minX) / (maxX - minX)) * chartWidth;
      baseY = chartHeight - ((point.y - minY) / (maxY - minY)) * chartHeight;
    } else {
      // Smooth follow cursor
      baseX = x.value;
      baseY = y.value;
    }

    // Apply offset
    let posX = baseX + offset.x + marginLeft;
    let posY = baseY + offset.y + marginTop;

    // Bounds checking and flipping
    // Check if tooltip would extend beyond right edge
    if (posX + tooltipWidth > chartWidth + marginLeft) {
      // Flip to left of cursor
      posX = baseX - tooltipWidth - offset.x + marginLeft;
    }

    // Check if tooltip would extend beyond bottom edge
    if (posY + tooltipHeight > chartHeight + marginTop) {
      // Flip to top of cursor
      posY = baseY - tooltipHeight - offset.y + marginTop;
    }

    // Ensure tooltip doesn't go beyond left edge
    if (posX < marginLeft) {
      posX = marginLeft;
    }

    // Ensure tooltip doesn't go beyond top edge
    if (posY < marginTop) {
      posY = marginTop;
    }

    return {
      position: "absolute",
      opacity: 1,
      transform: [{ translateX: posX }, { translateY: posY }],
    };
  }, [
    dataPoint,
    snapToPoint,
    chartWidth,
    chartHeight,
    tooltipWidth,
    tooltipHeight,
    offset.x,
    offset.y,
    marginLeft,
    marginTop,
    data,
  ]);
}
