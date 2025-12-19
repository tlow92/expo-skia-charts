import { Circle, Group, Path, rect } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { useLineChartContext } from "../../providers/LineChartContextProvider";
import { getYForX } from "../../utils/math";
import { PADDING, buildLine } from "./utils";

export function Line() {
  const {
    size: { width, height },
    x,
    config: { hover, colors, data },
  } = useLineChartContext();

  const { path } = useMemo(() => buildLine(data, width, height), [data, width, height]);

  const DOT_SIZE = hover?.dotSize ?? 6;

  // Clamp x to stay within the data range (0 to width in screen coordinates)
  const clampedX = useDerivedValue(() => {
    "worklet";
    if (x.value < 0) return 0;
    if (x.value > width) return width;
    return x.value;
  }, [x, width]);

  const cy = useDerivedValue(() => {
    const newy = getYForX(path.toCmds(), clampedX.value);
    return newy || -300;
  }, [path, clampedX]);

  // TODO: update to real props
  const pointRadius = useSharedValue(0);

  const clipBeforeCursor = useDerivedValue(() => {
    if (colors?.lineBase)
      return rect(-PADDING, -PADDING, width + PADDING, height + PADDING);
    return rect(
      clampedX.value + DOT_SIZE * 0.5,
      -PADDING,
      width + 2,
      height + PADDING
    );
  }, [clampedX, colors?.highlightColor, width, height]);

  const clipAfterCursor = useDerivedValue(() => {
    if (!hover?.highlightLine)
      return rect(-PADDING, -PADDING, width + PADDING, height + PADDING);
    return rect(
      -2,
      -PADDING,
      clampedX.value + pointRadius.value * 0.5,
      height + PADDING
    );
  }, [clampedX, colors?.highlightColor, width, height]);

  return (
    <Group transform={[{ translateY: height - PADDING }, { scaleY: -1 }]}>
      {hover?.highlightLine && (
        <Group clip={clipBeforeCursor}>
          <Path
            path={path}
            style="stroke"
            color={colors?.lineBase ?? "#666"}
            strokeWidth={2}
            opacity={0.3}
          />
        </Group>
      )}

      <Group clip={clipAfterCursor}>
        <Path
          path={path}
          style="stroke"
          strokeWidth={2}
          strokeJoin="round"
          strokeCap="round"
          color={colors?.highlightColor ?? "#000"}
        />
      </Group>
      {hover?.showDot && (
        <Circle cx={clampedX} cy={cy} r={DOT_SIZE} color={colors?.dotBase ?? "#000"} />
      )}
    </Group>
  );
}
