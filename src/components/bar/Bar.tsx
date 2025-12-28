import { RoundedRect } from "@shopify/react-native-skia";
import { useMemo } from "react";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue } from "react-native-reanimated";
import { useBarChartContext } from "../../providers/BarChartContextProvider";
import type { BarLayout, HoveredBarInfo } from "./types";

export function Bar() {
  const { bars, hoveredBar, animationProgress, config } = useBarChartContext();

  const { style, hover, orientation = "vertical" } = config;

  const { cornerRadius = 0, stackGap = 2 } = style ?? {};

  const { highlightBar = true, highlightOpacity = 0.8, highlightColor } = hover ?? {};

  return (
    <>
      {bars.map((bar, index) => (
        <BarRect
          key={`bar-${index}-${bar.seriesId ?? "single"}`}
          bar={bar}
          animationProgress={animationProgress}
          hoveredBar={hoveredBar}
          orientation={orientation}
          cornerRadius={cornerRadius}
          stackGap={stackGap}
          highlightBar={highlightBar}
          highlightOpacity={highlightOpacity}
          highlightColor={highlightColor}
        />
      ))}

      {/* Render stroke/border if configured */}
      {config.series?.map((series) => {
        if (!series.strokeWidth || series.strokeWidth <= 0) return null;

        const seriesBars = bars.filter((bar) => bar.seriesId === series.id);

        return seriesBars.map((bar, index) => (
          <BarStroke
            key={`bar-stroke-${index}-${series.id}`}
            bar={bar}
            animationProgress={animationProgress}
            orientation={orientation}
            cornerRadius={cornerRadius}
            stackGap={stackGap}
            strokeWidth={series.strokeWidth!}
            strokeColor={series.strokeColor ?? "#000"}
          />
        ));
      })}
    </>
  );
}

type BarRectProps = {
  bar: BarLayout;
  animationProgress: SharedValue<number>;
  hoveredBar: SharedValue<HoveredBarInfo | null>;
  orientation: "vertical" | "horizontal";
  cornerRadius: number;
  stackGap: number;
  highlightBar: boolean;
  highlightOpacity: number;
  highlightColor?: string;
};

function BarRect({
  bar,
  animationProgress,
  hoveredBar,
  orientation,
  cornerRadius,
  stackGap,
  highlightBar,
  highlightOpacity,
  highlightColor,
}: BarRectProps) {
  // Determine if we need selective corner rounding
  // Only apply selective rounding when:
  // 1. cornerRadius is set
  // 2. We're in a stack (isStackStart/End defined)
  // 3. stackGap is 0 (no gaps between segments)
  const needsSelectiveRounding = useMemo(() => {
    if (cornerRadius === 0) return false;
    const isInStack = bar.isStackStart !== undefined || bar.isStackEnd !== undefined;
    return isInStack && stackGap === 0;
  }, [cornerRadius, bar.isStackStart, bar.isStackEnd, stackGap]);
  const animatedWidth = useDerivedValue(() => {
    "worklet";
    if (orientation === "horizontal") {
      return bar.width * animationProgress.value;
    }
    return bar.width;
  }, [bar.width, animationProgress, orientation]);

  const animatedHeight = useDerivedValue(() => {
    "worklet";
    if (orientation === "vertical") {
      return bar.height * animationProgress.value;
    }
    return bar.height;
  }, [bar.height, animationProgress, orientation]);

  const animatedY = useDerivedValue(() => {
    "worklet";
    if (orientation === "vertical") {
      // Bars grow upward from bottom
      const fullHeight = bar.height;
      const currentHeight = fullHeight * animationProgress.value;
      return bar.y + (fullHeight - currentHeight);
    }
    return bar.y;
  }, [bar.y, bar.height, animationProgress, orientation]);

  // Check if this bar is hovered
  const isHovered = useDerivedValue(() => {
    "worklet";
    const hovered = hoveredBar.value;
    if (!hovered) return false;

    // Match by bar position and series
    return (
      hovered.bar.x === bar.x &&
      hovered.bar.y === bar.y &&
      hovered.bar.seriesId === bar.seriesId
    );
  }, [hoveredBar, bar]);

  // Calculate bar opacity based on hover state
  const barOpacity = useDerivedValue(() => {
    "worklet";
    if (!highlightBar) return 1;
    return isHovered.value ? highlightOpacity : 1;
  }, [isHovered, highlightBar, highlightOpacity]);

  // Calculate bar color (use highlight color if provided and hovered)
  const barColor = useDerivedValue(() => {
    "worklet";
    if (highlightColor && isHovered.value) {
      return highlightColor;
    }
    return bar.color;
  }, [isHovered, highlightColor, bar.color]);

  // Calculate which corners to round based on stack position
  const cornerRadii = useMemo(() => {
    if (orientation === "vertical") {
      // Vertical: first segment gets bottom corners, last gets top corners
      return {
        topLeft: {
          x: bar.isStackEnd ? cornerRadius : 0,
          y: bar.isStackEnd ? cornerRadius : 0,
        },
        topRight: {
          x: bar.isStackEnd ? cornerRadius : 0,
          y: bar.isStackEnd ? cornerRadius : 0,
        },
        bottomLeft: {
          x: bar.isStackStart ? cornerRadius : 0,
          y: bar.isStackStart ? cornerRadius : 0,
        },
        bottomRight: {
          x: bar.isStackStart ? cornerRadius : 0,
          y: bar.isStackStart ? cornerRadius : 0,
        },
      };
    }
    // Horizontal: first segment gets left corners, last gets right corners
    return {
      topLeft: {
        x: bar.isStackStart ? cornerRadius : 0,
        y: bar.isStackStart ? cornerRadius : 0,
      },
      topRight: {
        x: bar.isStackEnd ? cornerRadius : 0,
        y: bar.isStackEnd ? cornerRadius : 0,
      },
      bottomLeft: {
        x: bar.isStackStart ? cornerRadius : 0,
        y: bar.isStackStart ? cornerRadius : 0,
      },
      bottomRight: {
        x: bar.isStackEnd ? cornerRadius : 0,
        y: bar.isStackEnd ? cornerRadius : 0,
      },
    };
  }, [orientation, bar.isStackEnd, bar.isStackStart, cornerRadius]);

  // For selective corner rounding, create NonUniformRRect
  const rectWithRadii = useDerivedValue(() => {
    "worklet";
    return {
      rect: {
        x: bar.x,
        y: animatedY.value,
        width: animatedWidth.value,
        height: animatedHeight.value,
      },
      ...cornerRadii,
    };
  }, [animatedY, animatedWidth, animatedHeight, bar.x, cornerRadii]);

  // Render with selective or uniform corner radius
  if (needsSelectiveRounding) {
    return <RoundedRect rect={rectWithRadii} color={barColor} opacity={barOpacity} />;
  }

  // Simple uniform corner radius
  return (
    <RoundedRect
      x={bar.x}
      y={animatedY}
      width={animatedWidth}
      height={animatedHeight}
      r={cornerRadius}
      color={barColor}
      opacity={barOpacity}
    />
  );
}

type BarStrokeProps = {
  bar: BarLayout;
  animationProgress: SharedValue<number>;
  orientation: "vertical" | "horizontal";
  cornerRadius: number;
  stackGap: number;
  strokeWidth: number;
  strokeColor: string;
};

function BarStroke({
  bar,
  animationProgress,
  orientation,
  cornerRadius,
  stackGap,
  strokeWidth,
  strokeColor,
}: BarStrokeProps) {
  // Determine if we need selective corner rounding (same logic as BarRect)
  // Only apply selective rounding when stackGap is 0
  const needsSelectiveRounding = useMemo(() => {
    if (cornerRadius === 0) return false;
    const isInStack = bar.isStackStart !== undefined || bar.isStackEnd !== undefined;
    return isInStack && stackGap === 0;
  }, [cornerRadius, bar.isStackStart, bar.isStackEnd, stackGap]);
  const animatedWidth = useDerivedValue(() => {
    "worklet";
    if (orientation === "horizontal") {
      return bar.width * animationProgress.value;
    }
    return bar.width;
  }, [bar.width, animationProgress, orientation]);

  const animatedHeight = useDerivedValue(() => {
    "worklet";
    if (orientation === "vertical") {
      return bar.height * animationProgress.value;
    }
    return bar.height;
  }, [bar.height, animationProgress, orientation]);

  const animatedY = useDerivedValue(() => {
    "worklet";
    if (orientation === "vertical") {
      const fullHeight = bar.height;
      const currentHeight = fullHeight * animationProgress.value;
      return bar.y + (fullHeight - currentHeight);
    }
    return bar.y;
  }, [bar.y, bar.height, animationProgress, orientation]);

  // Calculate which corners to round based on stack position
  const cornerRadii = useMemo(() => {
    if (orientation === "vertical") {
      // Vertical: first segment gets bottom corners, last gets top corners
      return {
        topLeft: {
          x: bar.isStackEnd ? cornerRadius : 0,
          y: bar.isStackEnd ? cornerRadius : 0,
        },
        topRight: {
          x: bar.isStackEnd ? cornerRadius : 0,
          y: bar.isStackEnd ? cornerRadius : 0,
        },
        bottomLeft: {
          x: bar.isStackStart ? cornerRadius : 0,
          y: bar.isStackStart ? cornerRadius : 0,
        },
        bottomRight: {
          x: bar.isStackStart ? cornerRadius : 0,
          y: bar.isStackStart ? cornerRadius : 0,
        },
      };
    }
    // Horizontal: first segment gets left corners, last gets right corners
    return {
      topLeft: {
        x: bar.isStackStart ? cornerRadius : 0,
        y: bar.isStackStart ? cornerRadius : 0,
      },
      topRight: {
        x: bar.isStackEnd ? cornerRadius : 0,
        y: bar.isStackEnd ? cornerRadius : 0,
      },
      bottomLeft: {
        x: bar.isStackStart ? cornerRadius : 0,
        y: bar.isStackStart ? cornerRadius : 0,
      },
      bottomRight: {
        x: bar.isStackEnd ? cornerRadius : 0,
        y: bar.isStackEnd ? cornerRadius : 0,
      },
    };
  }, [orientation, bar.isStackEnd, bar.isStackStart, cornerRadius]);

  // For selective corner rounding, create NonUniformRRect
  const rectWithRadii = useDerivedValue(() => {
    "worklet";
    return {
      rect: {
        x: bar.x,
        y: animatedY.value,
        width: animatedWidth.value,
        height: animatedHeight.value,
      },
      ...cornerRadii,
    };
  }, [animatedY, animatedWidth, animatedHeight, bar.x, cornerRadii]);

  // Render with selective or uniform corner radius
  if (needsSelectiveRounding) {
    return (
      <RoundedRect
        rect={rectWithRadii}
        style="stroke"
        strokeWidth={strokeWidth}
        color={strokeColor}
      />
    );
  }

  // Simple uniform corner radius
  return (
    <RoundedRect
      x={bar.x}
      y={animatedY}
      width={animatedWidth}
      height={animatedHeight}
      r={cornerRadius}
      style="stroke"
      strokeWidth={strokeWidth}
      color={strokeColor}
    />
  );
}
