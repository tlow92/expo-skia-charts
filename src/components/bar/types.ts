import type React from "react";

/**
 * Represents a single data point on the bar chart.
 */
export type BarChartDataPoint = {
  /**
   * Category label for the bar (e.g., "Jan", "Product A").
   * Displayed on the categorical axis.
   */
  label: string;
  /**
   * Numeric value for the bar.
   */
  value: number;
  /**
   * Optional numeric x value for use with numeric x-axis.
   * If not provided, bars are positioned by index.
   */
  x?: number;
};

/**
 * Configuration for a single bar series in a multi-series chart.
 */
export type BarSeriesData = {
  /**
   * Unique identifier for this bar series.
   */
  id: string;
  /**
   * Optional label for this series.
   * Can be used in tooltips or legends.
   */
  label?: string;
  /**
   * Array of data points for this series.
   */
  data: BarChartDataPoint[];
  /**
   * Color for bars in this series.
   * Overrides the global colors config for this series.
   */
  color?: string;
  /**
   * Border/stroke width for bars in this series.
   * @default 0 (no border)
   */
  strokeWidth?: number;
  /**
   * Border/stroke color for bars in this series.
   * Only visible when strokeWidth > 0.
   * @default "#000"
   */
  strokeColor?: string;
};

/**
 * Bar chart display modes.
 */
export type BarChartMode = "single" | "grouped" | "stacked";

/**
 * Bar chart orientation.
 */
export type BarChartOrientation = "vertical" | "horizontal";

/**
 * Configuration for bar styling.
 */
export type BarStyleConfig = {
  /**
   * Corner radius for bars in pixels.
   * @default 0 (sharp corners)
   */
  cornerRadius?: number;
  /**
   * Minimum bar size in pixels to ensure visibility of small values.
   * @default 2
   */
  minBarSize?: number;
  /**
   * Width of each bar in pixels, or "auto" to calculate automatically.
   * In auto mode, width is calculated based on available space.
   * @default "auto"
   */
  barWidth?: number | "auto";
  /**
   * Gap between bars within the same group in pixels.
   * Only applies in grouped mode.
   * @default 4
   */
  gap?: number;
  /**
   * Gap between bar groups in pixels.
   * @default 20
   */
  groupGap?: number;
  /**
   * Gap between stacked bar segments in pixels.
   * Only applies in stacked mode.
   * @default 2
   */
  stackGap?: number;
};

/**
 * Configuration for tooltip rendering.
 */
export type BarTooltipConfig = {
  /**
   * Whether the tooltip is enabled.
   * @default true
   */
  enabled?: boolean;
  /**
   * Function that renders the tooltip content.
   * Receives the current data point and optional series info.
   * @param dataPoint - The data point at the hovered bar
   * @param seriesId - The series ID if in multi-series mode
   * @returns React node to render inside the tooltip
   */
  renderContent: (dataPoint: BarChartDataPoint, seriesId?: string) => React.ReactNode;
  /**
   * Offset of the tooltip from the bar position.
   * For vertical bars: x offsets horizontally, y offsets vertically from top of bar
   * For horizontal bars: x offsets horizontally from right of bar, y offsets vertically
   * @default { x: 10, y: -10 }
   */
  offset?: { x: number; y: number };
  /**
   * Position strategy for the tooltip.
   * - 'auto': Smart positioning at the end of the bar (top for vertical, right for horizontal)
   * - 'start': Always position at the start of the bar (bottom for vertical, left for horizontal)
   * - 'end': Always position at the end of the bar (top for vertical, right for horizontal)
   * - 'touch': Position near the touch/hover coordinates
   * @default 'touch'
   */
  position?: "auto" | "start" | "end" | "touch";
};

/**
 * Configuration for hover/touch interactions with bars.
 */
export type BarHoverConfig = {
  /**
   * Whether to enable hover/touch interactions.
   */
  enabled: boolean;
  /**
   * Whether to highlight the hovered bar.
   * @default true
   */
  highlightBar?: boolean;
  /**
   * Color to use when highlighting a bar.
   * If not provided, uses a darker/lighter version of the bar color.
   */
  highlightColor?: string;
  /**
   * Opacity of the hovered bar when highlighted.
   * @default 0.8
   */
  highlightOpacity?: number;
  /**
   * Tooltip configuration.
   * If provided, displays a custom tooltip when hovering over bars.
   */
  tooltip?: BarTooltipConfig;
  /**
   * Callback function triggered when hovering over a bar.
   * @param dataPoint - The data point of the hovered bar
   * @param seriesId - The series ID if in multi-series mode
   */
  onHover?: (dataPoint: BarChartDataPoint, seriesId?: string) => void;
};

/**
 * Configuration for the X-axis (reused from LineChart).
 */
export type XAxisConfig = {
  /**
   * Whether to show the axis.
   * @default false
   */
  enabled?: boolean;
  /**
   * Custom formatter function for axis tick labels.
   * @param value - The tick value to format
   * @returns Formatted string to display
   */
  formatter?: (value: number) => string;
  /**
   * Font size for axis tick labels in pixels.
   * @default 12
   */
  fontSize?: number;
  /**
   * Color for the axis line and tick labels.
   * @default "#666"
   */
  color?: string;
  /**
   * Whether to show grid lines.
   * @default false
   */
  showGridLines?: boolean;
  /**
   * Color for grid lines.
   * @default "#e0e0e0"
   */
  gridLineColor?: string;
  /**
   * Number of ticks to display (for numeric axes).
   * @default 5
   */
  tickCount?: number;
  /**
   * Whether the data represents time values.
   * Only relevant for numeric x-axis in horizontal orientation.
   * @default false
   */
  isTimeData?: boolean;
};

/**
 * Configuration for the Y-axis (reused from LineChart).
 */
export type YAxisConfig = {
  /**
   * Whether to show the axis.
   * @default false
   */
  enabled?: boolean;
  /**
   * Custom formatter function for axis tick labels.
   * @param value - The tick value to format
   * @returns Formatted string to display
   */
  formatter?: (value: number) => string;
  /**
   * Font size for axis tick labels in pixels.
   * @default 12
   */
  fontSize?: number;
  /**
   * Color for the axis line and tick labels.
   * @default "#666"
   */
  color?: string;
  /**
   * Whether to show grid lines.
   * @default false
   */
  showGridLines?: boolean;
  /**
   * Color for grid lines.
   * @default "#e0e0e0"
   */
  gridLineColor?: string;
  /**
   * Number of ticks to display.
   * @default 5
   */
  tickCount?: number;
};

/**
 * Main configuration object for the BarChart component.
 */
export type BarChartConfig = {
  /**
   * Array of data points for a single series bar chart.
   * Use either `data` OR `series`, not both.
   */
  data?: BarChartDataPoint[];
  /**
   * Array of bar series for multi-series charts (grouped or stacked).
   * Use either `data` OR `series`, not both.
   */
  series?: BarSeriesData[];
  /**
   * Display mode for the bars.
   * - "single": Single series (uses `data` prop)
   * - "grouped": Multiple series displayed side-by-side
   * - "stacked": Multiple series stacked on top of each other
   * @default "single"
   */
  mode?: BarChartMode;
  /**
   * Orientation of the bars.
   * - "vertical": Bars grow upward, categories on x-axis
   * - "horizontal": Bars grow rightward, categories on y-axis
   * @default "vertical"
   */
  orientation?: BarChartOrientation;
  /**
   * Default colors for bars.
   * Used when no color is specified in series data.
   * Cycles through array for multiple series.
   */
  colors?: string[];
  /**
   * Styling configuration for bars.
   */
  style?: BarStyleConfig;
  /**
   * Configuration for hover/touch interactions.
   */
  hover?: BarHoverConfig;
  /**
   * Configuration for the X-axis.
   * For vertical bars: categorical axis showing labels
   * For horizontal bars: numeric axis showing values
   */
  xAxis?: XAxisConfig;
  /**
   * Configuration for the Y-axis.
   * For vertical bars: numeric axis showing values
   * For horizontal bars: categorical axis showing labels
   */
  yAxis?: YAxisConfig;
  /**
   * Duration of entry animation in milliseconds.
   * @default 1000
   */
  animationDuration?: number;
};

/**
 * Props for the BarChart component.
 */
export type BarChartProps = {
  /**
   * Configuration object for the chart.
   */
  config: BarChartConfig;
};

/**
 * Internal type representing a calculated bar position and dimensions.
 */
export type BarLayout = {
  /**
   * X position in canvas coordinates.
   */
  x: number;
  /**
   * Y position in canvas coordinates.
   */
  y: number;
  /**
   * Width in pixels.
   */
  width: number;
  /**
   * Height in pixels.
   */
  height: number;
  /**
   * The data point for this bar.
   */
  dataPoint: BarChartDataPoint;
  /**
   * Series ID if in multi-series mode.
   */
  seriesId?: string;
  /**
   * Color for this bar.
   */
  color: string;
  /**
   * Original value before projection (for tooltip).
   */
  value: number;
  /**
   * Index of the bar in the series.
   */
  index: number;
  /**
   * Whether this is the first segment in a stacked bar.
   * Used for corner rounding logic.
   */
  isStackStart?: boolean;
  /**
   * Whether this is the last segment in a stacked bar.
   * Used for corner rounding logic.
   */
  isStackEnd?: boolean;
};

/**
 * Internal type for hovered bar information.
 */
export type HoveredBarInfo = {
  /**
   * The bar layout that is hovered.
   */
  bar: BarLayout;
  /**
   * The series ID if in multi-series mode.
   */
  seriesId?: string;
};
