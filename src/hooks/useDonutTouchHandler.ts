import { useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import type { ProcessedSegment } from "../components/donut/types";

export const useDonutTouchHandler = (
  hoveredIndex: SharedValue<number | null>,
  size: { width: number; height: number },
  strokeWidth: number,
  chartData: ProcessedSegment[],
  enabled: boolean,
  hitSlop: number = 0
) => {
  return useMemo(() => {
    const handleTouch = (x: number, y: number) => {
      "worklet";
      const centerX = size.width / 2;
      const centerY = size.height / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Match the radius calculation from Donut.tsx (includes -10 padding)
      const radius = Math.min(size.width, size.height) / 2 - strokeWidth / 2 - 10;

      // Check if touch is within the donut ring (expanded by hitSlop)
      const innerBound = radius - strokeWidth / 2 - hitSlop;
      const outerBound = radius + strokeWidth / 2 + hitSlop;
      if (distance < outerBound && distance > innerBound) {
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        if (angle < 0) {
          angle += 360;
        }

        // Find which segment was touched
        for (let i = 0; i < chartData.length; i++) {
          const segment = chartData[i];
          if (!segment) {
            continue;
          }
          let startAngle = segment.startAngle + 90;
          let endAngle = startAngle + segment.sweepAngle;

          // Normalize angles
          if (startAngle < 0) {
            startAngle += 360;
          }
          if (endAngle < 0) {
            endAngle += 360;
          }

          if (
            (angle >= startAngle && angle <= endAngle) ||
            (endAngle > 360 && angle >= startAngle - 360 && angle <= endAngle - 360)
          ) {
            hoveredIndex.value = i;
            return;
          }
        }
      }

      hoveredIndex.value = null;
    };

    const hover = Gesture.Hover()
      .activeCursor("pointer")
      .enabled(enabled)
      .onStart((e) => {
        handleTouch(e.x, e.y);
      })
      .onUpdate((e) => {
        handleTouch(e.x, e.y);
      })
      .onEnd(() => {
        hoveredIndex.value = null;
      });

    const pan = Gesture.Pan()
      .activateAfterLongPress(1)
      .enabled(enabled)
      .onStart((e) => {
        handleTouch(e.x, e.y);
      })
      .onUpdate((e) => {
        handleTouch(e.x, e.y);
      })
      .onEnd(() => {
        hoveredIndex.value = null;
      });

    return Gesture.Race(hover, pan);
  }, [enabled, hoveredIndex, size, strokeWidth, chartData, hitSlop]);
};
