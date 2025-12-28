import {
  Circle,
  Group,
  LinearGradient,
  Path,
  rect,
  vec,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { useDerivedValue } from "react-native-reanimated";
import { useLineChartContext } from "../../providers/LineChartContextProvider";
import { getYForX } from "../../utils/math";
import type { LineChartColors, LineChartDataPoint } from "./types";
import { buildAreaPath, buildLine, buildLineWithDomain, PADDING } from "./utils";

interface LineProps {
  data?: LineChartDataPoint[];
  colors?: LineChartColors;
  strokeWidth?: number;
  domain?: { minX: number; maxX: number; minY: number; maxY: number };
}

export function Line({
  data: propData,
  colors: propColors,
  strokeWidth,
  domain,
}: LineProps) {
  const {
    size: { width, height },
    x,
    config: { hover, colors: defaultColors, data: contextData },
    animationProgress,
  } = useLineChartContext();

  // Use prop data if provided, otherwise fall back to context data
  const data = propData ?? contextData;
  const colors = propColors ?? defaultColors;

  const { path, areaPath } = useMemo(() => {
    if (!data)
      return { path: null, areaPath: null, minY: 0, maxY: 0, projectedPoints: [] };

    let result;
    if (domain) {
      result = buildLineWithDomain(data, width, height, domain);
    } else {
      result = buildLine(data, width, height);
    }

    // Build area path if fill is configured
    let areaPath = null;
    if (colors?.areaFill && result.path && result.projectedPoints) {
      areaPath = buildAreaPath(result.path, result.projectedPoints);
    }

    return { ...result, areaPath };
  }, [data, width, height, domain, colors?.areaFill]);

  const DOT_SIZE = hover?.dotSize ?? 6;

  // Clamp x to stay within the data range (0 to width in screen coordinates)
  const clampedX = useDerivedValue(() => {
    "worklet";
    if (x.value < 0) return 0;
    if (x.value > width) return width;
    return x.value;
  }, [x, width]);

  const cy = useDerivedValue(() => {
    if (!path) return -300;
    const newy = getYForX(path.toCmds(), clampedX.value);
    return newy || -300;
  }, [path, clampedX]);

  // Check if cursor is over canvas (not Infinity) - returns 1 or 0 for opacity
  const isHovering = useDerivedValue(() => {
    "worklet";
    return Number.isFinite(x.value) ? 1 : 0;
  }, [x]);

  const clipBeforeCursor = useDerivedValue(() => {
    // TODO: we probably need to fix this properly if we want to introduce reverse highlighting
    // if (colors?.lineBase)
    return rect(-PADDING, -PADDING, width + PADDING, height + PADDING);
    // return rect(clampedX.value + DOT_SIZE * 0.5, -PADDING, width + 2, height + PADDING);
  }, [clampedX, colors?.highlightColor, width, height]);

  const clipAfterCursor = useDerivedValue(() => {
    if (!hover?.highlightLine)
      return rect(-PADDING, -PADDING, width + PADDING, height + PADDING);
    return rect(-2, -PADDING, clampedX.value + DOT_SIZE * 0.5, height + PADDING);
  }, [clampedX, colors?.highlightColor, width, height]);

  const lineStrokeWidth = strokeWidth ?? 2;

  if (!data || !path) return null;

  return (
    <Group transform={[{ translateY: height - PADDING }, { scaleY: -1 }]}>
      {/* Area Fill - Base (unhighlighted) */}
      {areaPath && colors?.areaFill && hover?.highlightLine && (
        <Group clip={clipBeforeCursor}>
          <Path
            path={areaPath}
            style="fill"
            opacity={0.3}
            color={colors.areaFill.type === "solid" ? colors.areaFill.color : undefined}
          >
            {colors.areaFill.type === "gradient" && (
              <LinearGradient
                start={vec(0, height - PADDING * 2)}
                end={vec(0, 0)}
                colors={[colors.areaFill.startColor, colors.areaFill.endColor]}
              />
            )}
          </Path>
        </Group>
      )}

      {/* Area Fill - Highlighted */}
      {areaPath && colors?.areaFill && (
        <Group clip={clipAfterCursor}>
          <Path
            path={areaPath}
            style="fill"
            end={animationProgress}
            color={colors.areaFill.type === "solid" ? colors.areaFill.color : undefined}
          >
            {colors.areaFill.type === "gradient" && (
              <LinearGradient
                start={vec(0, height - PADDING * 2)}
                end={vec(0, 0)}
                colors={[colors.areaFill.startColor, colors.areaFill.endColor]}
              />
            )}
          </Path>
        </Group>
      )}

      {/* Line Stroke - Base (unhighlighted) */}
      {hover?.highlightLine && (
        <Group clip={clipBeforeCursor}>
          <Path
            path={path}
            style="stroke"
            color={colors?.lineBase ?? "#666"}
            strokeWidth={lineStrokeWidth}
            opacity={0.3}
            end={animationProgress}
          />
        </Group>
      )}

      {/* Line Stroke - Highlighted */}
      <Group clip={clipAfterCursor}>
        <Path
          path={path}
          style="stroke"
          strokeWidth={lineStrokeWidth}
          strokeJoin="round"
          strokeCap="round"
          color={colors?.highlightColor ?? "#000"}
          end={animationProgress}
        />
      </Group>

      {/* Hover Dot */}
      {hover?.showDot && (
        <Circle
          cx={clampedX}
          cy={cy}
          r={DOT_SIZE}
          color={colors?.dotBase ?? "#000"}
          opacity={isHovering}
        />
      )}
    </Group>
  );
}
