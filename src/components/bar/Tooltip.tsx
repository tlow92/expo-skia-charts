// @ts-nocheck - Temporary workaround for reanimated type instantiation depth issue
import { useState } from "react";
import type { LayoutChangeEvent, ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  type AnimatedStyle,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated";
import type {
  BarChartDataPoint,
  BarChartOrientation,
  BarTooltipConfig,
  HoveredBarInfo,
} from "./types";

interface TooltipProps {
  hoveredBar: SharedValue<HoveredBarInfo | null>;
  config: BarTooltipConfig;
  chartWidth: number;
  chartHeight: number;
  marginLeft: number;
  marginTop: number;
  orientation: BarChartOrientation;
  touchX: SharedValue<number>;
  touchY: SharedValue<number>;
}

export function Tooltip({
  hoveredBar,
  config,
  chartWidth,
  chartHeight,
  marginLeft,
  marginTop,
  orientation,
  touchX,
  touchY,
}: TooltipProps) {
  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });
  const [currentDataPoint, setCurrentDataPoint] = useState<BarChartDataPoint | null>(
    null
  );
  const [currentSeriesId, setCurrentSeriesId] = useState<string | undefined>(undefined);

  const enabled = config.enabled ?? true;
  const offset = config.offset ?? { x: 10, y: -10 };
  const position = config.position ?? "touch";

  // Sync SharedValue to React state for rendering
  useAnimatedReaction(
    () => hoveredBar.value,
    (current) => {
      if (current) {
        runOnJS(setCurrentDataPoint)(current.bar.dataPoint);
        runOnJS(setCurrentSeriesId)(current.bar.seriesId);
      } else {
        runOnJS(setCurrentDataPoint)(null);
        runOnJS(setCurrentSeriesId)(undefined);
      }
    },
    [hoveredBar]
  );

  const animatedStyle: AnimatedStyle<ViewStyle> = useAnimatedStyle(() => {
    const hovered = hoveredBar.value;
    if (!hovered) {
      return {
        opacity: 0,
        transform: [{ translateX: -1000 }, { translateY: -1000 }],
      };
    }

    const bar = hovered.bar;

    let tooltipX: number;
    let tooltipY: number;

    // Determine base position based on positioning strategy
    if (position === "touch") {
      // Position near touch coordinates
      const baseX = touchX.value;
      const baseY = touchY.value;

      tooltipX = marginLeft + baseX + offset.x;
      tooltipY = marginTop + baseY + offset.y;

      // Keep within bounds
      if (tooltipX + tooltipSize.width > marginLeft + chartWidth) {
        tooltipX = marginLeft + baseX - tooltipSize.width - offset.x;
      }
      if (tooltipY + tooltipSize.height > marginTop + chartHeight) {
        tooltipY = marginTop + baseY - tooltipSize.height - offset.y;
      }
      if (tooltipX < marginLeft) tooltipX = marginLeft;
      if (tooltipY < marginTop) tooltipY = marginTop;
    } else if (orientation === "vertical") {
      // Vertical bars
      const centerX = bar.x + bar.width / 2;

      if (position === "start") {
        // Start = bottom of bar for vertical
        const baseY = bar.y + bar.height;
        tooltipX = marginLeft + centerX - tooltipSize.width / 2;
        tooltipY = marginTop + baseY + Math.abs(offset.y);
      } else {
        // 'end' or 'auto' = top of bar for vertical
        const baseY = bar.y;
        tooltipX = marginLeft + centerX - tooltipSize.width / 2;
        tooltipY = marginTop + baseY + offset.y - tooltipSize.height;

        // If tooltip goes above chart (auto mode), flip to bottom
        if (position === "auto" && tooltipY < marginTop) {
          tooltipY = marginTop + bar.y + bar.height + Math.abs(offset.y);
        }
      }

      // Keep horizontally within bounds
      if (tooltipX < marginLeft) {
        tooltipX = marginLeft;
      }
      if (tooltipX + tooltipSize.width > marginLeft + chartWidth) {
        tooltipX = marginLeft + chartWidth - tooltipSize.width;
      }
    } else {
      // Horizontal bars
      const centerY = bar.y + bar.height / 2;

      if (position === "start") {
        // Start = left of bar for horizontal
        const baseX = bar.x;
        tooltipX = marginLeft + baseX - tooltipSize.width - Math.abs(offset.x);
        tooltipY = marginTop + centerY - tooltipSize.height / 2;
      } else {
        // 'end' or 'auto' = right of bar for horizontal
        const baseX = bar.x + bar.width;
        tooltipX = marginLeft + baseX + offset.x;
        tooltipY = marginTop + centerY - tooltipSize.height / 2;

        // If tooltip goes beyond chart (auto mode), flip to left
        if (
          position === "auto" &&
          tooltipX + tooltipSize.width > marginLeft + chartWidth
        ) {
          tooltipX = marginLeft + bar.x - tooltipSize.width - Math.abs(offset.x);
        }
      }

      // Keep vertically within bounds
      if (tooltipY < marginTop) {
        tooltipY = marginTop;
      }
      if (tooltipY + tooltipSize.height > marginTop + chartHeight) {
        tooltipY = marginTop + chartHeight - tooltipSize.height;
      }
    }

    return {
      position: "absolute",
      opacity: 1,
      transform: [{ translateX: tooltipX }, { translateY: tooltipY }],
    };
  }, [
    hoveredBar,
    tooltipSize,
    chartWidth,
    chartHeight,
    marginLeft,
    marginTop,
    offset,
    orientation,
    position,
    touchX,
    touchY,
  ]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setTooltipSize({ width, height });
  };

  if (!enabled) {
    return null;
  }

  return (
    <Animated.View style={animatedStyle} onLayout={onLayout} pointerEvents="none">
      {currentDataPoint && config.renderContent(currentDataPoint, currentSeriesId)}
    </Animated.View>
  );
}
