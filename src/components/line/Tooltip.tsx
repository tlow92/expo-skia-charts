// @ts-nocheck - Temporary workaround for reanimated type instantiation depth issue
import { useState } from "react";
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
    data,
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
