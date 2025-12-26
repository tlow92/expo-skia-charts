import { Canvas, Group } from "@shopify/react-native-skia";
import { useMemo, useState } from "react";
import { type LayoutChangeEvent, View } from "react-native";
import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { useLineTouchHandler } from "../../hooks/useLineTouchHandler";
import { useSelectedDataPoint } from "../../hooks/useSelectedDataPoint";
import {
  LineChartContextProvider,
  type LineChartContextType,
} from "../../providers/LineChartContextProvider";
import { Line } from "./Line";
import { MultiLine } from "./MultiLine";
import { Tooltip } from "./Tooltip";
import type { LineChartDataPoint, LineChartProps } from "./types";
import { XAxis } from "./XAxis";
import { YAxis } from "./YAxis";

export function LineChart({ config }: LineChartProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const x = useSharedValue(Infinity);
  const y = useSharedValue(Infinity);
  const selectedDataPoint = useSharedValue<LineChartDataPoint | null>(null);

  // Detect multi-line mode
  const isMultiLine = !!config.series;
  const chartData = config.data ?? config.series?.[0]?.data ?? [];

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  // Calculate margins for axes
  const MARGIN_LEFT = config.yAxis?.enabled
    ? 50
    : (config.hover?.dotSize ?? config.hover?.showDot)
      ? 6
      : 0;
  const MARGIN_RIGHT = config.xAxis?.enabled
    ? 14
    : (config.hover?.dotSize ?? config.hover?.showDot)
      ? 6
      : 0; // X-axis labels are 100px wide, centered
  const MARGIN_TOP = config.yAxis?.enabled ? 10 : 0; // Prevent Y-axis label clipping
  const MARGIN_BOTTOM = config.xAxis?.enabled ? 30 : 0;
  const chartWidth = size.width - MARGIN_LEFT - MARGIN_RIGHT;
  const chartHeight = size.height - MARGIN_BOTTOM - MARGIN_TOP;

  const gesture = useLineTouchHandler(
    x,
    y,
    MARGIN_LEFT,
    MARGIN_TOP,
    config.hover?.enabled ?? false,
    true
  );

  const context = useMemo<LineChartContextType>(
    () => ({
      size: { width: chartWidth, height: chartHeight },
      x,
      y,
      config,
    }),
    [chartWidth, chartHeight, x, y, config]
  );

  // Track selected data point and trigger onHover callback
  // For multi-line mode, we use the first series for now
  // TODO: Update to support multiple series hover
  useSelectedDataPoint({
    x,
    data: chartData,
    width: chartWidth,
    onHover: config.hover?.onHover,
    selectedPoint: selectedDataPoint,
  });

  return (
    <GestureHandlerRootView>
      <View onLayout={onLayout} style={{ flex: 1 }}>
        {size.width > 0 && size.height > 0 && (
          <>
            <GestureDetector gesture={gesture}>
              {/* @ts-ignore - Canvas accepts children but type definitions are incomplete */}
              <Canvas style={{ width: size.width, height: size.height }}>
                <LineChartContextProvider value={context}>
                  <Group>
                    {/* Y-Axis */}
                    {config.yAxis?.enabled && (
                      <Group
                        transform={[
                          { translateX: MARGIN_LEFT },
                          { translateY: MARGIN_TOP },
                        ]}
                      >
                        <YAxis
                          data={chartData}
                          width={chartWidth}
                          height={chartHeight}
                          config={config.yAxis}
                        />
                      </Group>
                    )}

                    {/* X-Axis */}
                    {config.xAxis?.enabled && (
                      <Group
                        transform={[
                          { translateX: MARGIN_LEFT },
                          { translateY: chartHeight + MARGIN_TOP },
                        ]}
                      >
                        <XAxis
                          data={chartData}
                          width={chartWidth}
                          height={chartHeight}
                          config={config.xAxis}
                        />
                      </Group>
                    )}

                    {/* Chart Line(s) */}
                    <Group
                      transform={[
                        { translateX: MARGIN_LEFT },
                        { translateY: MARGIN_TOP },
                      ]}
                    >
                      {isMultiLine && config.series ? (
                        <MultiLine series={config.series} />
                      ) : (
                        <Line />
                      )}
                    </Group>
                  </Group>
                </LineChartContextProvider>
              </Canvas>
            </GestureDetector>

            {/* Tooltip */}
            {config.hover?.tooltip && (
              <Tooltip
                x={x}
                y={y}
                dataPoint={selectedDataPoint}
                config={config.hover.tooltip}
                chartWidth={chartWidth}
                chartHeight={chartHeight}
                marginLeft={MARGIN_LEFT}
                marginTop={MARGIN_TOP}
                data={chartData}
              />
            )}
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
}
