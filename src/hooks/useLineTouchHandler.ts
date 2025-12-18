import { useMemo } from "react";
import { Gesture } from "react-native-gesture-handler";
import type { SharedValue } from "react-native-reanimated";

export const useLineTouchHandler = (
  x: SharedValue<number>,
  y: SharedValue<number>,
  offset: number,
  enabled: boolean,
  removeOnEnd?: boolean
) => {
  return useMemo(() => {
    const hover = Gesture.Hover()
      .activeCursor("pointer")
      .enabled(enabled)
      .onStart((pos) => {
        x.value = pos.x - 1 - offset;
        y.value = pos.y - 1 - offset;
      })
      .onChange((pos) => {
        x.value = pos.x - 1 - offset;
        y.value = pos.y - 1 - offset;
      })
      .onEnd((pos) => {
        x.value = pos.x - 1 - offset;
        y.value = pos.y - 1 - offset;
        if (removeOnEnd) {
          x.value = Infinity;
          y.value = Infinity;
        }
      });
    const pan = Gesture.Pan()
      .activateAfterLongPress(1)
      .enabled(enabled)
      .onStart((pos) => {
        x.value = pos.x - 1 - offset;
        y.value = pos.y - 1 - offset;
      })
      .onChange((pos) => {
        x.value = pos.x - 1 - offset;
        y.value = pos.y - 1 - offset;
      })
      .onEnd((pos) => {
        x.value = pos.x - 1 - offset;
        y.value = pos.y - 1 - offset;

        if (removeOnEnd) {
          x.value = Infinity;
          y.value = Infinity;
        }
      });
    const composed = Gesture.Race(hover, pan);
    return composed;
  }, [enabled, x, y, offset, removeOnEnd]);
};
