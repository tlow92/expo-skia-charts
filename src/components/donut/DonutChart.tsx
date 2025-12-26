import { Canvas } from "@shopify/react-native-skia";
import { useMemo, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import { View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { useDonutTouchHandler } from "../../hooks/useDonutTouchHandler";
import type { DonutChartContextType } from "../../providers/DonutChartContextProvider";
import { DonutChartContextProvider } from "../../providers/DonutChartContextProvider";
import { CenterValues } from "./CenterValues";
import { Donut } from "./Donut";
import { Legend } from "./Legend";
import type { DonutChartProps, ProcessedSegment } from "./types";

const DEFAULT_COLORS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#6B7280", // Gray
  "#10B981", // Green
  "#F59E0B", // Amber
];

export function DonutChart({ config }: DonutChartProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [legendHeight, setLegendHeight] = useState(0);
  const hoveredIndex = useSharedValue<number | null>(null);

  const colors = config.colors ?? DEFAULT_COLORS;
  const strokeWidth = config.strokeWidth ?? 30;
  const animationDuration = config.animationDuration ?? 1000;
  const hoverEnabled = config.hover?.enabled ?? false;
  const hitSlop = config.hover?.hitSlop ?? 0;

  // Animation values
  const animationProgress = useSharedValue(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
    // Start animation when layout is complete
    animationProgress.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
  };

  // Calculate chart data with angles and colors
  const chartData = useMemo<ProcessedSegment[]>(() => {
    const total = config.data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) {
      return [];
    }

    const baseGap = config.gap ?? 0;
    const roundedCorners = config.roundedCorners ?? false;

    // Calculate the radius of the donut arc
    const minDimension = Math.min(
      size.width > 0 ? size.width : 300,
      size.height > 0 ? size.height : 300
    );
    const radius = minDimension / 2 - strokeWidth / 2 - 10;

    // When using rounded corners, calculate the additional degrees needed
    // to account for the rounded caps (which extend strokeWidth/2 on each side)
    let gap = baseGap;
    if (roundedCorners && baseGap > 0 && radius > 0) {
      // Each gap needs to accommodate strokeWidth pixels (both caps combined)
      // Convert pixel gap to degrees: degrees = (pixels / radius) * (180 / π)
      const additionalDegrees = (strokeWidth / radius) * (180 / Math.PI);
      gap = baseGap + additionalDegrees;
    }

    const totalGapAngle = gap * config.data.length;

    let currentAngle = -90; // Start from top
    return config.data.map((item, index) => {
      const percentage = item.value / total;
      // Reduce sweep angle to account for gaps
      const sweepAngle = percentage * (360 - totalGapAngle);
      const colorIndex = index % colors.length;
      const fallbackColor = DEFAULT_COLORS[0] || "#3B82F6";
      const segment: ProcessedSegment = {
        ...item,
        percentage,
        startAngle: currentAngle,
        sweepAngle,
        color: colors[colorIndex] ?? fallbackColor,
        index,
      };
      // Move to next segment, adding gap
      currentAngle += sweepAngle + gap;
      return segment;
    });
  }, [
    config.data,
    config.gap,
    config.roundedCorners,
    strokeWidth,
    colors,
    size.width,
    size.height,
  ]);

  // Calculate canvas height by reserving space for legend
  const canvasHeight = size.height - legendHeight;

  // Create context value with adjusted canvas size
  const context = useMemo<DonutChartContextType>(
    () => ({
      size: { width: size.width, height: canvasHeight },
      hoveredIndex,
      config,
      chartData,
      animationProgress,
    }),
    [size.width, canvasHeight, hoveredIndex, config, chartData, animationProgress]
  );

  // Gesture handling - use adjusted canvas size to match rendering
  const gesture = useDonutTouchHandler(
    hoveredIndex,
    { width: size.width, height: canvasHeight },
    strokeWidth,
    chartData,
    hoverEnabled,
    hitSlop
  );

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      {size.width > 0 && size.height > 0 && (
        <>
          <GestureDetector gesture={gesture}>
            {/* @ts-ignore - Canvas accepts children but type definitions are incomplete */}
            <Canvas style={{ width: size.width, height: canvasHeight }}>
              <DonutChartContextProvider value={context}>
                <Donut />
                <CenterValues />
              </DonutChartContextProvider>
            </Canvas>
          </GestureDetector>

          <View onLayout={(e) => setLegendHeight(e.nativeEvent.layout.height)}>
            <DonutChartContextProvider value={context}>
              <Legend />
            </DonutChartContextProvider>
          </View>
        </>
      )}
    </View>
  );
}
