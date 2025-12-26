// @ts-nocheck - Temporary workaround for reanimated type instantiation depth issue
import { useMemo, useState } from "react";
import type { LayoutChangeEvent, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  type AnimatedStyle,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import { useTooltipPosition } from "../../hooks/useTooltipPosition";
import type { LineChartDataPoint, TooltipConfig } from "./types";

interface TooltipProps {
  x: SharedValue<number>;
  y: SharedValue<number>;
  dataPoint: SharedValue<LineChartDataPoint | null>;
  config: TooltipConfig;
  chartWidth: number;
  chartHeight: number;
  marginLeft: number;
  marginTop: number;
  data: LineChartDataPoint[];
}

export function Tooltip({
  x,
  y,
  dataPoint,
  config,
  chartWidth,
  chartHeight,
  marginLeft,
  marginTop,
  data,
}: TooltipProps) {
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });
  const [currentDataPoint, setCurrentDataPoint] = useState<LineChartDataPoint | null>(
    null
  );

  const enabled = config.enabled ?? true;
  const snapToPoint = config.snapToPoint ?? true;
  const offset = config.offset ?? { x: 10, y: -10 };

  // Calculate data bounds without spread operators (iOS performance issue)
  const dataBounds = useMemo(() => {
    if (data.length === 0) {
      return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
    }

    let minX = data[0]!.x;
    let maxX = data[0]!.x;
    let minY = data[0]!.y;
    let maxY = data[0]!.y;

    for (let i = 1; i < data.length; i++) {
      const point = data[i]!;
      if (point.x < minX) minX = point.x;
      if (point.x > maxX) maxX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.y > maxY) maxY = point.y;
    }

    return { minX, maxX, minY, maxY };
  }, [data]);

  // Sync SharedValue to React state for rendering
  useAnimatedReaction(
    () => dataPoint.value,
    (current) => {
      runOnJS(setCurrentDataPoint)(current);
    },
    [dataPoint]
  );

  const animatedStyle: AnimatedStyle<ViewStyle> = useTooltipPosition({
    x,
    y,
    dataPoint,
    snapToPoint,
    chartWidth,
    chartHeight,
    tooltipWidth: tooltipSize.width,
    tooltipHeight: tooltipSize.height,
    offset,
    marginLeft,
    marginTop,
    dataBounds,
  });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setTooltipSize({ width, height });
  };

  if (!enabled) {
    return null;
  }

  return (
    <Animated.View style={animatedStyle} onLayout={onLayout} pointerEvents="none">
      {currentDataPoint && config.renderContent(currentDataPoint)}
    </Animated.View>
  );
}
