import { extent } from "d3-array";
import { format } from "d3-format";
import { scaleLinear, scaleTime } from "d3-scale";
import { timeDay, timeHour, timeMinute, timeMonth, timeWeek } from "d3-time";
import type { LineChartDataPoint } from "../components/line/types";

export type TickValue = {
  value: number;
  label: string;
  position: number;
};

export type AxisCalculation = {
  scale: (value: number) => number;
  ticks: TickValue[];
  domain: [number, number];
};

/**
 * Calculate X-axis scale and ticks using d3
 */
export function calculateXAxis(
  data: LineChartDataPoint[],
  width: number,
  tickCount: number = 5,
  formatter?: (value: number) => string,
  isTimeData: boolean = false
): AxisCalculation {
  const xValues = data.map((d) => d.x);
  const [minX, maxX] = extent(xValues) as [number, number];

  let scale: (value: number) => number;
  let tickValues: number[];

  if (isTimeData) {
    const timeScale = scaleTime().domain([minX, maxX]).range([0, width]);
    scale = (value: number) => timeScale(new Date(value));

    // Generate time-based ticks
    const interval = getTimeInterval(minX, maxX, tickCount);
    const timeTickValues = interval.range(new Date(minX), new Date(maxX));

    // Add the max value if not included
    if (
      timeTickValues.length === 0 ||
      timeTickValues[timeTickValues.length - 1]?.getTime() !== maxX
    ) {
      timeTickValues.push(new Date(maxX));
    }

    tickValues = timeTickValues.map((d) => d.getTime());
  } else {
    const linearScale = scaleLinear().domain([minX, maxX]).range([0, width]);
    scale = linearScale;
    tickValues = linearScale.ticks(tickCount);
  }

  // Format ticks
  const defaultFormatter = isTimeData ? createTimeFormatter(minX, maxX) : format(".2~s");
  const finalFormatter = formatter ?? defaultFormatter;

  const ticks: TickValue[] = tickValues.map((value) => ({
    value,
    label: finalFormatter(value),
    position: scale(value),
  }));

  return {
    scale,
    ticks,
    domain: [minX, maxX],
  };
}

/**
 * Calculate Y-axis scale and ticks using d3
 */
export function calculateYAxis(
  data: LineChartDataPoint[],
  height: number,
  tickCount: number = 5,
  formatter?: (value: number) => string
): AxisCalculation {
  const yValues = data.map((d) => d.y);
  const [minY, maxY] = extent(yValues) as [number, number];

  // Add 10% padding to the domain for better visualization
  const padding = (maxY - minY) * 0.1;
  const domainMin = Math.max(0, minY - padding);
  const domainMax = maxY + padding;

  // Reverse the range so minimum is at bottom (height) and maximum at top (0)
  const scale = scaleLinear().domain([domainMin, domainMax]).range([height, 0]);

  const tickValues = scale.ticks(tickCount);

  // Default formatter for numbers
  const defaultFormatter = format(".2~s");
  const finalFormatter = formatter ?? defaultFormatter;

  const ticks: TickValue[] = tickValues.map((value) => ({
    value,
    label: finalFormatter(value),
    position: scale(value),
  }));

  return {
    scale,
    ticks,
    domain: [domainMin, domainMax],
  };
}

/**
 * Get appropriate time interval based on data range
 */
function getTimeInterval(minX: number, maxX: number, tickCount: number) {
  const range = maxX - minX;
  const targetInterval = range / tickCount;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;

  if (targetInterval < hour) return timeMinute.every(15) ?? timeMinute;
  if (targetInterval < day) return timeHour.every(6) ?? timeHour;
  if (targetInterval < week) return timeDay;
  if (targetInterval < month) return timeWeek;
  return timeMonth;
}

/**
 * Create a time formatter based on data range
 */
function createTimeFormatter(minX: number, maxX: number): (value: number) => string {
  const range = maxX - minX;
  const day = 24 * 60 * 60 * 1000;
  const month = 30 * day;

  return (value: number) => {
    const date = new Date(value);
    if (range < day) {
      // Show hours:minutes for intraday data
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
    if (range < month) {
      // Show month/day for data within a month
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
    // Show month/year for longer ranges
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };
}
