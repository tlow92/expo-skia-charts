import { Circle, Group, Path } from "@shopify/react-native-skia";
import { useMemo } from "react";
import { useDerivedValue } from "react-native-reanimated";
import { useLineChartContext } from "../../providers/LineChartContextProvider";
import { getYForX } from "../../utils/math";
import { PADDING, buildLine } from "./utils";

export function Line() {
  const {
    size: { width, height },
    x,
    config,
  } = useLineChartContext();

  const { path } = useMemo(
    () => buildLine(config.data, width, height),
    [config.data, width, height]
  );

  const cy = useDerivedValue(() => {
    const newy = getYForX(path.toCmds(), x.value);
    return newy || -300;
  }, [path, x]);

  return (
    <Group transform={[{ translateY: height - PADDING }, { scaleY: -1 }]}>
      <Path path={path} style="stroke" color={"#000"} strokeWidth={2} />

      {config.hover?.showDot && <Circle cx={x} cy={cy} r={6} color={"red"} />}
    </Group>
  );
}
