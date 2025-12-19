import { useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";

export const useLineTouchHandler = (
  x: SharedValue<number>,
  y: SharedValue<number>,
  offsetX: number,
  offsetY: number,
  enabled: boolean,
  removeOnEnd?: boolean
) => {
  return useMemo(() => {
    const hover = Gesture.Hover()
      .activeCursor("pointer")
      .enabled(enabled)
      .onStart((pos) => {
        x.value = pos.x - offsetX;
        y.value = pos.y - offsetY;
      })
      .onChange((pos) => {
        x.value = pos.x - offsetX;
        y.value = pos.y - offsetY;
      })
      .onEnd((pos) => {
        x.value = pos.x - offsetX;
        y.value = pos.y - offsetY;
        if (removeOnEnd) {
          x.value = Infinity;
          y.value = Infinity;
        }
      });
    const pan = Gesture.Pan()
      .activateAfterLongPress(1)
      .enabled(enabled)
      .onStart((pos) => {
        x.value = pos.x - offsetX;
        y.value = pos.y - offsetY;
      })
      .onChange((pos) => {
        x.value = pos.x - offsetX;
        y.value = pos.y - offsetY;
      })
      .onEnd((pos) => {
        x.value = pos.x - offsetX;
        y.value = pos.y - offsetY;

        if (removeOnEnd) {
          x.value = Infinity;
          y.value = Infinity;
        }
      });
    const composed = Gesture.Race(hover, pan);
    return composed;
  }, [enabled, x, y, offsetX, offsetY, removeOnEnd]);
};
