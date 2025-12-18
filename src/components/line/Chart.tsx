import { Canvas, Group } from "@shopify/react-native-skia";
import { useMemo, useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { useLineTouchHandler } from "../../hooks/useLineTouchHandler";
import { useSelectedDataPoint } from "../../hooks/useSelectedDataPoint";
import {
  LineChartContextProvider,
  type LineChartContextType,
} from "../../providers/LineChartContextProvider";
import { Line } from "./Line";
import type { LineChartProps } from "./types";

export function Chart({ config }: LineChartProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  const gesture = useLineTouchHandler(x, y, 0, config.hover?.enabled ?? false, true);

  const context = useMemo<LineChartContextType>(
    () => ({
      size,
      x,
      y,
      config,
    }),
    [size, x, y, config]
  );

  // Track selected data point and trigger onHover callback
  useSelectedDataPoint({
    x,
    data: config.data,
    width: size.width,
    onHover: config.hover?.onHover,
  });

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      {size.width > 0 && size.height > 0 && (
        <GestureDetector gesture={gesture}>
          <Canvas style={{ width: size.width, height: size.height, borderWidth: 2 }}>
            <LineChartContextProvider value={context}>
              <Group>
                <Line />
              </Group>
            </LineChartContextProvider>
          </Canvas>
        </GestureDetector>
      )}
    </View>
  );
}
