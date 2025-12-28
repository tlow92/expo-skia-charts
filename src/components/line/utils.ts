import type { SkPath, SkPoint } from "@shopify/react-native-skia";
import { Skia } from "@shopify/react-native-skia";
import { curveLines } from "../../utils/math";
import type { LineSeriesData } from "./types";

// TODO: move to context or somewhere elese
export const PADDING = 8;

/**
 * Calculates the unified domain (min/max) across multiple line series.
 * Used to ensure all lines in a multi-line chart share the same scale.
 * @param allSeries - Array of line series data
 * @returns Object containing unified min/max for both x and y axes
 */
export const calculateUnifiedDomain = (
  allSeries: LineSeriesData[]
): { minX: number; maxX: number; minY: number; maxY: number } => {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const series of allSeries) {
    for (const point of series.data) {
      if (point.x < minX) minX = point.x;
      if (point.x > maxX) maxX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.y > maxY) maxY = point.y;
    }
  }

  return { minX, maxX, minY, maxY };
};

/**
 * Builds a closed area path from line path by connecting to baseline.
 * Creates a path that goes: line path -> down to baseline at last point ->
 * along baseline to first point -> back up to start of line.
 *
 * @param linePath - The line path from curveLines()
 * @param projectedPoints - Array of projected points used to build the line
 * @returns Closed Skia Path ready for filling
 */
export const buildAreaPath = (linePath: SkPath, projectedPoints: SkPoint[]): SkPath => {
  "worklet";

  const areaPath = Skia.Path.Make();
  const firstPoint = projectedPoints[0];

  if (!firstPoint) {
    return areaPath;
  }

  // Get the last actual data point (not the extra point added for line extension)
  // The buildLine function adds an extra point at WIDTH + 10, so we need the second-to-last
  const lastDataPointIndex = projectedPoints.length - 2;
  const lastPoint =
    lastDataPointIndex >= 0 ? projectedPoints[lastDataPointIndex] : firstPoint;

  if (!lastPoint) {
    return areaPath;
  }

  // The baseline should extend to include the PADDING area at the bottom
  // In the transformed coordinate system (after scaleY: -1), y=0 is at the bottom
  // but we want to extend into the PADDING area, so use -PADDING
  const baselineY = -PADDING;

  // Start at the first point (top of area)
  areaPath.moveTo(firstPoint.x, firstPoint.y);

  // Add the entire line path (follows the curve from first to last point)
  areaPath.addPath(linePath);

  // Draw line down to baseline at last point
  areaPath.lineTo(lastPoint.x, baselineY);

  // Draw line along baseline back to first point
  areaPath.lineTo(firstPoint.x, baselineY);

  // Close path (draws line back up to start point)
  areaPath.close();

  return areaPath;
};

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
    projectedPoints,
  };
};

/**
 * Builds a line path using a pre-calculated domain.
 * Used for multi-line charts where all lines share the same scale.
 * @param points - Array of data points
 * @param WIDTH - Width of the chart
 * @param HEIGHT - Height of the chart
 * @param domain - Pre-calculated min/max values for both axes
 * @returns Object containing the path and domain values
 */
export const buildLineWithDomain = (
  points: SkPoint[],
  WIDTH: number,
  HEIGHT: number,
  domain: { minX: number; maxX: number; minY: number; maxY: number }
) => {
  const AJUSTED_SIZE = HEIGHT - PADDING * 2;
  const { minX, maxX, minY, maxY } = domain;

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
    projectedPoints,
  };
};
