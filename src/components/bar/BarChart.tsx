import { Canvas, Group } from "@shopify/react-native-skia";
import { useMemo, useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";
import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { useBarTouchHandler } from "../../hooks/useBarTouchHandler";
import type { BarChartContextType } from "../../providers/BarChartContextProvider";
import { BarChartContextProvider } from "../../providers/BarChartContextProvider";
import type { LineChartDataPoint } from "../line/types";
import { XAxis } from "../line/XAxis";
import { YAxis } from "../line/YAxis";
import { Bar } from "./Bar";
import { CategoricalAxis } from "./CategoricalAxis";
import { Tooltip } from "./Tooltip";
import type {
  BarChartDataPoint,
  BarChartProps,
  BarLayout,
  HoveredBarInfo,
} from "./types";
import { calculateBarLayout, calculateGroupedBars, calculateStackedBars } from "./utils";

const DEFAULT_COLORS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#10B981", // Green
  "#F59E0B", // Amber
  "#6B7280", // Gray
];

export function BarChart({ config }: BarChartProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const hoveredBar = useSharedValue<HoveredBarInfo | null>(null);
  const animationProgress = useSharedValue(0);
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);

  const {
    mode = "single",
    orientation = "vertical",
    colors = DEFAULT_COLORS,
    style = {},
    animationDuration = 1000,
  } = config;

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });

    // Start animation when layout is complete
    animationProgress.value = 0;
    animationProgress.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
  };

  // Calculate margins for axes
  const MARGIN_LEFT = config.yAxis?.enabled ? 50 : 0;
  const MARGIN_RIGHT = 10;
  const MARGIN_TOP = 10;
  const MARGIN_BOTTOM = config.xAxis?.enabled ? 30 : 0;
  const chartWidth = size.width - MARGIN_LEFT - MARGIN_RIGHT;
  const chartHeight = size.height - MARGIN_BOTTOM - MARGIN_TOP;

  // Calculate bar layouts based on mode
  const bars = useMemo<BarLayout[]>(() => {
    if (chartWidth <= 0 || chartHeight <= 0) return [];

    if (mode === "single" && config.data) {
      // Single series mode
      return calculateBarLayout(
        config.data,
        chartWidth,
        chartHeight,
        orientation,
        style,
        colors
      );
    }

    if (mode === "grouped" && config.series) {
      // Grouped mode - flatten all series into single array
      const groupedMap = calculateGroupedBars(
        config.series,
        chartWidth,
        chartHeight,
        orientation,
        style
      );

      const allBars: BarLayout[] = [];
      for (const [, seriesBars] of groupedMap) {
        allBars.push(...seriesBars);
      }
      return allBars;
    }

    if (mode === "stacked" && config.series) {
      // Stacked mode
      return calculateStackedBars(
        config.series,
        chartWidth,
        chartHeight,
        orientation,
        style
      );
    }

    return [];
  }, [
    config.data,
    config.series,
    mode,
    chartWidth,
    chartHeight,
    orientation,
    style,
    colors,
  ]);

  // Gesture handling for hover/touch
  const onHoverCallback = useMemo(() => {
    if (!config.hover?.onHover) return undefined;
    return (bar: BarLayout) => {
      config.hover?.onHover?.(bar.dataPoint, bar.seriesId);
    };
  }, [config.hover]);

  const gesture = useBarTouchHandler(
    hoveredBar,
    bars,
    MARGIN_LEFT,
    MARGIN_TOP,
    config.hover?.enabled ?? false,
    onHoverCallback,
    touchX,
    touchY
  );

  // Calculate data for numeric axes (convert to LineChartDataPoint format)
  const numericAxisData = useMemo<LineChartDataPoint[]>(() => {
    let barData: BarChartDataPoint[] = [];
    if (config.data) {
      barData = config.data;
    } else if (config.series) {
      // Flatten all series data for axis calculation
      barData = config.series.flatMap((s) => s.data);
    }

    // Convert BarChartDataPoint to LineChartDataPoint for axis rendering
    // Use index as x value, and actual value as y
    return barData.map((d, index) => ({
      x: d.x ?? index,
      y: d.value,
    }));
  }, [config.data, config.series]);

  const context = useMemo<BarChartContextType>(
    () => ({
      size: { width: chartWidth, height: chartHeight },
      config,
      bars,
      hoveredBar,
      animationProgress,
    }),
    [chartWidth, chartHeight, config, bars, hoveredBar, animationProgress]
  );

  return (
    <GestureHandlerRootView>
      <View onLayout={onLayout} style={{ flex: 1 }}>
        {size.width > 0 && size.height > 0 && (
          <>
            <GestureDetector gesture={gesture}>
              {/* @ts-ignore - Canvas accepts children but type definitions are incomplete */}
              <Canvas style={{ width: size.width, height: size.height }}>
                <BarChartContextProvider value={context}>
                  <Group>
                    {orientation === "vertical" ? (
                      <>
                        {/* Y-Axis (numeric, values) */}
                        {config.yAxis?.enabled && (
                          <Group
                            transform={[
                              { translateX: MARGIN_LEFT },
                              { translateY: MARGIN_TOP },
                            ]}
                          >
                            <YAxis
                              data={numericAxisData}
                              width={chartWidth}
                              height={chartHeight}
                              config={config.yAxis}
                            />
                          </Group>
                        )}

                        {/* X-Axis (categorical, labels) */}
                        {config.xAxis?.enabled && (
                          <Group
                            transform={[
                              { translateX: MARGIN_LEFT },
                              { translateY: chartHeight + MARGIN_TOP },
                            ]}
                          >
                            <CategoricalAxis
                              bars={bars}
                              width={chartWidth}
                              height={chartHeight}
                              config={config.xAxis}
                              orientation={orientation}
                              axisType="x"
                            />
                          </Group>
                        )}
                      </>
                    ) : (
                      <>
                        {/* X-Axis (numeric, values) */}
                        {config.xAxis?.enabled && (
                          <Group
                            transform={[
                              { translateX: MARGIN_LEFT },
                              { translateY: MARGIN_TOP },
                            ]}
                          >
                            <XAxis
                              data={numericAxisData}
                              width={chartWidth}
                              height={chartHeight}
                              config={config.xAxis}
                            />
                          </Group>
                        )}

                        {/* Y-Axis (categorical, labels) */}
                        {config.yAxis?.enabled && (
                          <Group
                            transform={[
                              { translateX: MARGIN_LEFT },
                              { translateY: MARGIN_TOP },
                            ]}
                          >
                            <CategoricalAxis
                              bars={bars}
                              width={chartWidth}
                              height={chartHeight}
                              config={config.yAxis}
                              orientation={orientation}
                              axisType="y"
                            />
                          </Group>
                        )}
                      </>
                    )}

                    {/* Chart Bars */}
                    <Group
                      transform={[
                        { translateX: MARGIN_LEFT },
                        { translateY: MARGIN_TOP },
                      ]}
                    >
                      <Bar />
                    </Group>
                  </Group>
                </BarChartContextProvider>
              </Canvas>
            </GestureDetector>

            {/* Tooltip */}
            {config.hover?.tooltip && (
              <Tooltip
                hoveredBar={hoveredBar}
                config={config.hover.tooltip}
                chartWidth={chartWidth}
                chartHeight={chartHeight}
                marginLeft={MARGIN_LEFT}
                marginTop={MARGIN_TOP}
                orientation={orientation}
                touchX={touchX}
                touchY={touchY}
              />
            )}
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
}
