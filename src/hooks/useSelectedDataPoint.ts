import type { SharedValue } from "react-native-reanimated";
import { runOnJS, useDerivedValue } from "react-native-reanimated";
import type { LineChartDataPoint } from "../components/line/types";

interface UseSelectedDataPointParams {
  x: SharedValue<number>;
  data: LineChartDataPoint[];
  width: number;
  onHover?: (point: LineChartDataPoint) => void;
}

export function useSelectedDataPoint({
  x,
  data,
  width,
  onHover,
}: UseSelectedDataPointParams) {
  return useDerivedValue(() => {
    "worklet";
    if (!data || data.length === 0) {
      return null;
    }

    // Clamp canvas x to stay within valid range
    let canvasX = x.value;
    if (canvasX < 0) canvasX = 0;
    if (canvasX > width) canvasX = width;

    // Get min and max x from data
    const xValues = data.map((point) => point.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);

    // Convert canvas x back to original data space
    const originalX = (canvasX / width) * (maxX - minX) + minX;

    // Find closest data point
    let closestPoint = data[0];
    let minDistance = Math.abs((closestPoint?.x ?? 0) - originalX);

    for (const point of data) {
      const distance = Math.abs(point.x - originalX);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    }

    // Call onHover callback if defined
    if (closestPoint && onHover) {
      runOnJS(onHover)(closestPoint);
    }

    return closestPoint;
  }, [data, width]);
}
