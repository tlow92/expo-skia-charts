import type { SkPoint } from "@shopify/react-native-skia";
import { curveLines } from "../../utils/math";

// TODO: move to context or somewhere elese
export const PADDING = 8;

export const buildLine = (points: SkPoint[], WIDTH: number, HEIGHT: number) => {
  // TODO: optimize
  const AJUSTED_SIZE = HEIGHT - PADDING * 2;
  const xPoints = points.map((_) => _.x);
  const yPoints = points.map((_) => _.y);
  // const yPoints = formattedValues.map((value) => value[1]);
  const minX = Math.min(...xPoints);
  const maxX = Math.max(...xPoints);
  const minY = Math.min(...yPoints);
  const maxY = Math.max(...yPoints);
  const projectedPoints = points.map(({ x, y }) => {
    const projectedX = ((x - minX) / (maxX - minX)) * WIDTH;
    const projectedY = ((y - minY) / (maxY - minY)) * AJUSTED_SIZE;
    return { x: projectedX, y: projectedY };
  });
  const lastPoint = points.at(-1);
  if (lastPoint?.y !== undefined) projectedPoints.push({ x: WIDTH + 10, y: lastPoint.y });
  const path = curveLines(projectedPoints, 0.1, "complex");
  return {
    minY,
    maxY,
    path,
  };
};
