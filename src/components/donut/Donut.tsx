import { Path, Skia } from "@shopify/react-native-skia";
import { useMemo } from "react";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue } from "react-native-reanimated";
import { useDonutChartContext } from "../../providers/DonutChartContextProvider";

export function Donut() {
  const { size, chartData, animationProgress, config, hoveredIndex } =
    useDonutChartContext();

  const strokeWidth = config.strokeWidth ?? 30;
  const animateOnHover = config.hover?.animateOnHover ?? false;
  const gap = config.gap ?? 0;
  const roundedCorners = config.roundedCorners ?? false;
  const strokeCap = roundedCorners && gap > 0 ? "round" : "butt";

  const paths = useMemo(() => {
    if (size.width === 0 || size.height === 0 || chartData.length === 0) {
      return [];
    }

    const centerX = size.width / 2;
    const centerY = size.height / 2;
    const radius = Math.min(size.width, size.height) / 2 - strokeWidth / 2 - 10;

    return chartData.map((segment) => {
      const path = Skia.Path.Make();
      const rect = Skia.XYWHRect(
        centerX - radius,
        centerY - radius,
        radius * 2,
        radius * 2
      );

      path.addArc(rect, segment.startAngle, segment.sweepAngle);

      return {
        path,
        color: segment.color,
        index: segment.index,
      };
    });
  }, [size, chartData, strokeWidth]);

  if (paths.length === 0) {
    return null;
  }

  return (
    <>
      {paths.map((pathData) => {
        return (
          <SegmentPath
            key={pathData.index}
            pathData={pathData}
            strokeWidth={strokeWidth}
            strokeCap={strokeCap}
            animationProgress={animationProgress}
            hoveredIndex={hoveredIndex}
            animateOnHover={animateOnHover}
          />
        );
      })}
    </>
  );
}

type SegmentPathProps = {
  pathData: { path: ReturnType<typeof Skia.Path.Make>; color: string; index: number };
  strokeWidth: number;
  strokeCap: "butt" | "round";
  animationProgress: SharedValue<number>;
  hoveredIndex: SharedValue<number | null>;
  animateOnHover: boolean;
};

function SegmentPath({
  pathData,
  strokeWidth,
  strokeCap,
  animationProgress,
  hoveredIndex,
  animateOnHover,
}: SegmentPathProps) {
  const opacity = useDerivedValue(() => {
    if (!animateOnHover) return 1;
    const hovered = hoveredIndex.value;
    if (hovered === null) return 1;
    return hovered === pathData.index ? 1 : 0.3;
  }, [hoveredIndex, animateOnHover, pathData.index]);

  return (
    <Path
      path={pathData.path}
      style="stroke"
      color={pathData.color}
      strokeWidth={strokeWidth}
      strokeCap={strokeCap}
      end={animationProgress}
      opacity={opacity}
    />
  );
}
