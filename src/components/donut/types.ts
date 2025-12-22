import type React from "react";

export type DonutChartDataPoint = {
  label: string;
  value: number;
};

export type ProcessedSegment = DonutChartDataPoint & {
  percentage: number;
  startAngle: number;
  sweepAngle: number;
  color: string;
  index: number;
};

export type CenterValuesConfig = {
  enabled?: boolean;
  renderContent?: (
    segments: ProcessedSegment[],
    total: number,
    hoveredSegment: ProcessedSegment | null
  ) => React.ReactNode;
};

export type LegendConfig = {
  enabled?: boolean;
  renderContent?: (segments: ProcessedSegment[]) => React.ReactNode;
};

export type HoverConfig = {
  enabled?: boolean;
  animateOnHover?: boolean;
  updateCenterOnHover?: boolean;
};

export type DonutChartConfig = {
  data: DonutChartDataPoint[];
  colors?: string[];
  strokeWidth?: number;
  animationDuration?: number;
  centerValues?: CenterValuesConfig;
  legend?: LegendConfig;
  hover?: HoverConfig;
};

export type DonutChartProps = {
  config: DonutChartConfig;
};
