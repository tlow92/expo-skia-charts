import type { SkPoint } from "@shopify/react-native-skia";
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
  };
};
