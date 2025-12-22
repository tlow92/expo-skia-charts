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
  const hoveredIndex = useSharedValue<number | null>(null);

  const colors = config.colors ?? DEFAULT_COLORS;
  const strokeWidth = config.strokeWidth ?? 40;
  const animationDuration = config.animationDuration ?? 1000;
  const hoverEnabled = config.hover?.enabled ?? false;

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

    let currentAngle = -90; // Start from top
    return config.data.map((item, index) => {
      const percentage = item.value / total;
      const sweepAngle = percentage * 360;
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
      currentAngle += sweepAngle;
      return segment;
    });
  }, [config.data, colors]);

  // Create context value
  const context = useMemo<DonutChartContextType>(
    () => ({
      size,
      hoveredIndex,
      config,
      chartData,
      animationProgress,
    }),
    [size, hoveredIndex, config, chartData, animationProgress]
  );

  // Gesture handling
  const gesture = useDonutTouchHandler(
    hoveredIndex,
    size,
    strokeWidth,
    chartData,
    hoverEnabled
  );

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      {size.width > 0 && size.height > 0 && (
        <>
          <GestureDetector gesture={gesture}>
            {/* @ts-ignore - Canvas accepts children but type definitions are incomplete */}
            <Canvas style={{ width: size.width, height: size.height }}>
              <DonutChartContextProvider value={context}>
                <Donut />
                <CenterValues />
              </DonutChartContextProvider>
            </Canvas>
          </GestureDetector>

          <DonutChartContextProvider value={context}>
            <Legend />
          </DonutChartContextProvider>
        </>
      )}
    </View>
  );
}
