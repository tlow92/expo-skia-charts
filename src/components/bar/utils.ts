import type {
  BarChartDataPoint,
  BarChartOrientation,
  BarLayout,
  BarSeriesData,
  BarStyleConfig,
} from "./types";

const DEFAULT_COLORS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#10B981", // Green
  "#F59E0B", // Amber
  "#6B7280", // Gray
];

/**
 * Projects a value to screen coordinates with minimum bar size enforcement.
 * @param value - The data value
 * @param domain - [min, max] value domain
 * @param range - Available pixels for rendering
 * @param minBarSize - Minimum bar size in pixels
 * @returns Projected size in pixels
 */
export const projectBarValue = (
  value: number,
  domain: [number, number],
  range: number,
  minBarSize: number = 2
): number => {
  "worklet";
  const [min, max] = domain;
  if (max === min) return range / 2;

  const normalizedValue = (value - min) / (max - min);
  const projectedSize = normalizedValue * range;

  // Ensure minimum size for visibility
  return Math.max(projectedSize, minBarSize);
};

/**
 * Calculates the unified domain (min/max) across multiple bar series.
 * Used to ensure all bars in a multi-series chart share the same scale.
 * @param series - Array of bar series data
 * @returns Object containing unified min/max values
 */
export const calculateUnifiedDomain = (
  series: BarSeriesData[]
): { min: number; max: number } => {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (const s of series) {
    for (const point of s.data) {
      if (point.value < min) min = point.value;
      if (point.value > max) max = point.value;
    }
  }

  // If all values are positive, start from 0
  if (min > 0) min = 0;

  // Add 10% padding to top
  const padding = (max - min) * 0.1;
  max = max + padding;

  return { min, max };
};

/**
 * Calculates the stacked domain (max cumulative value) for stacked bar charts.
 * @param series - Array of bar series data
 * @returns Max cumulative value
 */
export const calculateStackedDomain = (series: BarSeriesData[]): number => {
  if (series.length === 0) return 0;

  // Group by label to find max stacked value
  const labelGroups = new Map<string, number>();

  for (const s of series) {
    for (const point of s.data) {
      const current = labelGroups.get(point.label) ?? 0;
      labelGroups.set(point.label, current + point.value);
    }
  }

  const maxStacked = Math.max(...Array.from(labelGroups.values()));

  // Add 10% padding
  return maxStacked * 1.1;
};

/**
 * Calculate bar layout for single series (vertical orientation).
 * @param data - Array of data points
 * @param width - Chart width in pixels
 * @param height - Chart height in pixels
 * @param orientation - Bar orientation
 * @param style - Style configuration
 * @param colors - Color array
 * @returns Array of bar layouts
 */
export const calculateBarLayout = (
  data: BarChartDataPoint[],
  width: number,
  height: number,
  orientation: BarChartOrientation,
  style: BarStyleConfig,
  colors: string[]
): BarLayout[] => {
  const { barWidth: configBarWidth = "auto", groupGap = 20, minBarSize = 2 } = style;

  const numBars = data.length;
  if (numBars === 0) return [];

  // Calculate value domain
  const values = data.map((d) => d.value);
  const minValue = Math.min(...values, 0); // Include 0 in domain
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.1;
  const domain: [number, number] = [minValue < 0 ? minValue : 0, maxValue + padding];

  // Calculate bar width (thickness)
  // For vertical: barWidth is the actual width of the bar
  // For horizontal: barWidth is the thickness (height) of the bar
  let barWidth: number;
  if (configBarWidth === "auto") {
    const availableSpace =
      orientation === "vertical"
        ? width - groupGap * (numBars + 1)
        : height - groupGap * (numBars + 1);
    barWidth = Math.max(availableSpace / numBars, 4);
  } else {
    barWidth = configBarWidth;
  }

  const colorArray = colors.length > 0 ? colors : DEFAULT_COLORS;

  return data.map((dataPoint, index) => {
    const color = colorArray[index % colorArray.length] ?? DEFAULT_COLORS[0]!;

    if (orientation === "vertical") {
      // Vertical bars grow upward
      const x = groupGap + index * (barWidth + groupGap);
      const barHeight = projectBarValue(dataPoint.value, domain, height, minBarSize);
      const y = height - barHeight; // Position from bottom

      return {
        x,
        y,
        width: barWidth,
        height: barHeight,
        dataPoint,
        color,
        value: dataPoint.value,
        index,
      };
    }

    // Horizontal bars grow rightward
    const y = groupGap + index * (barWidth + groupGap);
    const barHeight = barWidth; // Height is the bar "thickness"
    const barWidthHorizontal = projectBarValue(
      dataPoint.value,
      domain,
      width,
      minBarSize
    );
    const x = 0;

    return {
      x,
      y,
      width: barWidthHorizontal,
      height: barHeight,
      dataPoint,
      color,
      value: dataPoint.value,
      index,
    };
  });
};

/**
 * Calculate bar layout for grouped series.
 * @param series - Array of bar series
 * @param width - Chart width in pixels
 * @param height - Chart height in pixels
 * @param orientation - Bar orientation
 * @param style - Style configuration
 * @returns Map of series ID to bar layouts
 */
export const calculateGroupedBars = (
  series: BarSeriesData[],
  width: number,
  height: number,
  orientation: BarChartOrientation,
  style: BarStyleConfig
): Map<string, BarLayout[]> => {
  const {
    barWidth: configBarWidth = "auto",
    groupGap = 20,
    gap = 4,
    minBarSize = 2,
  } = style;

  if (series.length === 0) return new Map();

  // Calculate unified domain
  const { min: minValue, max: maxValue } = calculateUnifiedDomain(series);
  const domain: [number, number] = [minValue, maxValue];

  // Get all unique labels (categories)
  const labels = Array.from(new Set(series.flatMap((s) => s.data.map((d) => d.label))));
  const numGroups = labels.length;
  const numSeries = series.length;

  // Calculate dimensions
  // For vertical: use width to position bars horizontally
  // For horizontal: use height to position bars vertically
  let groupWidth: number;
  let barWidth: number;

  if (configBarWidth === "auto") {
    const availableSpace =
      orientation === "vertical"
        ? width - groupGap * (numGroups + 1)
        : height - groupGap * (numGroups + 1);
    groupWidth = availableSpace / numGroups;
    barWidth = Math.max((groupWidth - gap * (numSeries - 1)) / numSeries, 2);
  } else {
    barWidth = configBarWidth;
    groupWidth = barWidth * numSeries + gap * (numSeries - 1);
  }

  const result = new Map<string, BarLayout[]>();

  series.forEach((s, seriesIndex) => {
    const seriesColor = s.color ?? DEFAULT_COLORS[seriesIndex % DEFAULT_COLORS.length];
    const layouts: BarLayout[] = [];

    s.data.forEach((dataPoint) => {
      const groupIndex = labels.indexOf(dataPoint.label);
      if (groupIndex === -1) return;

      if (orientation === "vertical") {
        // Vertical grouped bars
        const groupX = groupGap + groupIndex * (groupWidth + groupGap);
        const x = groupX + seriesIndex * (barWidth + gap);
        const barHeight = projectBarValue(dataPoint.value, domain, height, minBarSize);
        const y = height - barHeight;

        layouts.push({
          x,
          y,
          width: barWidth,
          height: barHeight,
          dataPoint,
          seriesId: s.id,
          color: seriesColor ?? DEFAULT_COLORS[0]!,
          value: dataPoint.value,
          index: groupIndex,
        });
      } else {
        // Horizontal grouped bars
        const groupY = groupGap + groupIndex * (groupWidth + groupGap);
        const y = groupY + seriesIndex * (barWidth + gap);
        const barWidthHorizontal = projectBarValue(
          dataPoint.value,
          domain,
          width,
          minBarSize
        );
        const x = 0;

        layouts.push({
          x,
          y,
          width: barWidthHorizontal,
          height: barWidth,
          dataPoint,
          seriesId: s.id,
          color: seriesColor ?? DEFAULT_COLORS[0]!,
          value: dataPoint.value,
          index: groupIndex,
        });
      }
    });

    result.set(s.id, layouts);
  });

  return result;
};

/**
 * Calculate bar layout for stacked series.
 * @param series - Array of bar series
 * @param width - Chart width in pixels
 * @param height - Chart height in pixels
 * @param orientation - Bar orientation
 * @param style - Style configuration
 * @returns Array of bar layouts (stacked segments)
 */
export const calculateStackedBars = (
  series: BarSeriesData[],
  width: number,
  height: number,
  orientation: BarChartOrientation,
  style: BarStyleConfig
): BarLayout[] => {
  const {
    barWidth: configBarWidth = "auto",
    groupGap = 20,
    minBarSize = 2,
    stackGap = 2,
  } = style;

  if (series.length === 0) return [];

  // Get all unique labels
  const labels = Array.from(new Set(series.flatMap((s) => s.data.map((d) => d.label))));
  const numGroups = labels.length;

  // Calculate max stacked value for domain
  const maxStacked = calculateStackedDomain(series);
  const domain: [number, number] = [0, maxStacked];

  // Calculate bar width (thickness)
  // For vertical: barWidth is the actual width of the bar
  // For horizontal: barWidth is the thickness (height) of the bar
  let barWidth: number;
  if (configBarWidth === "auto") {
    const availableSpace =
      orientation === "vertical"
        ? width - groupGap * (numGroups + 1)
        : height - groupGap * (numGroups + 1);
    barWidth = Math.max(availableSpace / numGroups, 4);
  } else {
    barWidth = configBarWidth;
  }

  const layouts: BarLayout[] = [];

  // For each label (group), stack bars from bottom to top
  labels.forEach((label, labelIndex) => {
    let cumulativeValue = 0;
    let cumulativeGapPixels = 0; // Track pixel gaps separately

    // Count valid segments for this label to mark first/last
    const validSegments = series.filter((s) => s.data.find((d) => d.label === label));
    const numSegments = validSegments.length;
    let segmentCounter = 0;

    series.forEach((s, seriesIndex) => {
      const dataPoint = s.data.find((d) => d.label === label);
      if (!dataPoint) return;

      const seriesColor = s.color ?? DEFAULT_COLORS[seriesIndex % DEFAULT_COLORS.length];
      const isFirst = segmentCounter === 0;
      const isLast = segmentCounter === numSegments - 1;
      segmentCounter++;

      if (orientation === "vertical") {
        // Vertical stacked bars
        const groupX = groupGap + labelIndex * (barWidth + groupGap);
        const segmentHeight = projectBarValue(
          dataPoint.value,
          domain,
          height,
          minBarSize
        );

        // Calculate cumulative position from bottom, including gaps
        const cumulativeHeight = projectBarValue(cumulativeValue, domain, height, 0);
        const y = height - cumulativeHeight - cumulativeGapPixels - segmentHeight;

        layouts.push({
          x: groupX,
          y: y + stackGap, // Add gap above this segment
          width: barWidth,
          height: Math.max(segmentHeight - stackGap, minBarSize), // Reduce height by gap
          dataPoint,
          seriesId: s.id,
          color: seriesColor ?? DEFAULT_COLORS[0]!,
          value: dataPoint.value,
          index: labelIndex,
          isStackStart: isFirst,
          isStackEnd: isLast,
        });

        // Add gap for next segment
        cumulativeGapPixels += stackGap;
      } else {
        // Horizontal stacked bars
        const groupY = groupGap + labelIndex * (barWidth + groupGap);
        const segmentWidth = projectBarValue(dataPoint.value, domain, width, minBarSize);

        // Calculate cumulative position from left, including gaps
        const cumulativeWidth = projectBarValue(cumulativeValue, domain, width, 0);
        const x = cumulativeWidth + cumulativeGapPixels;

        layouts.push({
          x,
          y: groupY,
          width: Math.max(segmentWidth - stackGap, minBarSize), // Reduce width by gap
          height: barWidth,
          dataPoint,
          seriesId: s.id,
          color: seriesColor ?? DEFAULT_COLORS[0]!,
          value: dataPoint.value,
          index: labelIndex,
          isStackStart: isFirst,
          isStackEnd: isLast,
        });

        // Add gap for next segment
        cumulativeGapPixels += stackGap;
      }

      cumulativeValue += dataPoint.value;
    });
  });

  return layouts;
};
