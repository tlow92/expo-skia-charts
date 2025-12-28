import { useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";
import { runOnJS } from "react-native-reanimated";
import type { BarLayout, HoveredBarInfo } from "../components/bar/types";

/**
 * Hit test to find which bar is under the cursor
 */
const findBarAtPosition = (x: number, y: number, bars: BarLayout[]): BarLayout | null => {
  "worklet";

  for (const bar of bars) {
    if (x >= bar.x && x <= bar.x + bar.width && y >= bar.y && y <= bar.y + bar.height) {
      return bar;
    }
  }

  return null;
};

/**
 * Custom hook for handling bar chart touch/hover gestures
 * @param hoveredBar - SharedValue to store currently hovered bar info
 * @param bars - Array of bar layouts for hit testing
 * @param offsetX - X offset (margin left)
 * @param offsetY - Y offset (margin top)
 * @param enabled - Whether gestures are enabled
 * @param onHoverCallback - Optional callback when bar is hovered
 * @param touchX - SharedValue to store touch X coordinate (for tooltip positioning)
 * @param touchY - SharedValue to store touch Y coordinate (for tooltip positioning)
 * @returns Composed gesture (hover + pan)
 */
export const useBarTouchHandler = (
  hoveredBar: SharedValue<HoveredBarInfo | null>,
  bars: BarLayout[],
  offsetX: number,
  offsetY: number,
  enabled: boolean,
  onHoverCallback?: (bar: BarLayout) => void,
  touchX?: SharedValue<number>,
  touchY?: SharedValue<number>
) => {
  return useMemo(() => {
    const handlePosition = (x: number, y: number) => {
      "worklet";
      const adjustedX = x - offsetX;
      const adjustedY = y - offsetY;

      // Store touch coordinates for tooltip positioning
      if (touchX) touchX.value = adjustedX;
      if (touchY) touchY.value = adjustedY;

      const bar = findBarAtPosition(adjustedX, adjustedY, bars);

      if (bar) {
        hoveredBar.value = {
          bar,
          seriesId: bar.seriesId,
        };

        if (onHoverCallback) {
          runOnJS(onHoverCallback)(bar);
        }
      } else {
        hoveredBar.value = null;
      }
    };

    const hover = Gesture.Hover()
      .activeCursor("pointer")
      .enabled(enabled)
      .onStart((pos) => {
        handlePosition(pos.x, pos.y);
      })
      .onChange((pos) => {
        handlePosition(pos.x, pos.y);
      })
      .onEnd(() => {
        hoveredBar.value = null;
      });

    const pan = Gesture.Pan()
      .enabled(enabled)
      .minDistance(0)
      .shouldCancelWhenOutside(false)
      .onStart((pos) => {
        handlePosition(pos.x, pos.y);
      })
      .onChange((pos) => {
        handlePosition(pos.x, pos.y);
      })
      .onEnd(() => {
        hoveredBar.value = null;
      });

    return Gesture.Race(hover, pan);
  }, [enabled, hoveredBar, bars, offsetX, offsetY, onHoverCallback, touchX, touchY]);
};
