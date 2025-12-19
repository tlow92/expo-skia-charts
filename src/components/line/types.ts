/**
 * Represents a single data point on the line chart.
 */
export type LineChartDataPoint = {
  /**
   * X-axis value. Can be a number or timestamp (milliseconds since epoch).
   */
  x: number;
  /**
   * Y-axis value.
   */
  y: number;
};

/**
 * Configuration for chart axis rendering and behavior.
 */
export type AxisConfig = {
  /**
   * Whether to show the axis.
   * @default false
   */
  enabled?: boolean;
  /**
   * Number of ticks to display on the axis (approximate).
   * The actual number may vary based on D3's tick algorithm.
   * @default 5
   */
  tickCount?: number;
  /**
   * Custom formatter function for axis tick labels.
   * If not provided, uses default formatters (time-based or numeric).
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
   * Accepts any valid CSS color string.
   * @default "#666"
   */
  color?: string;
  /**
   * Whether to show grid lines extending from each tick.
   * @default false
   */
  showGridLines?: boolean;
  /**
   * Color for grid lines.
   * Only applies when showGridLines is true.
   * @default "#e0e0e0"
   */
  gridLineColor?: string;
  /**
   * Whether the data represents time values (timestamps in milliseconds).
   * If true, uses time-based scales (scaleTime) and date formatters.
   * If false, uses linear numeric scales (scaleLinear).
   * @default false
   */
  isTimeData?: boolean;
};

/**
 * Configuration for hover/touch interactions with the chart.
 */
export type HoverConfig = {
  /**
   * Whether to enable hover/touch interactions.
   * When enabled, users can hover (desktop) or pan (mobile) over the chart.
   */
  enabled: boolean;
  /**
   * Whether to show a dot at the hover position on the line.
   * @default false
   */
  showDot?: boolean;
  /**
   * Radius of the hover dot in pixels.
   * Only applies when showDot is true.
   * @default 6
   */
  dotSize?: number;
  /**
   * Whether to show a tooltip on hover.
   * @default false
   * @todo Not yet implemented
   */
  showTooltip?: boolean;
  /**
   * Callback function triggered when hovering over a data point.
   * Useful for displaying custom tooltips or updating external state.
   * @param dataPoint - The data point nearest to the hover position
   */
  onHover?: (dataPoint: LineChartDataPoint) => void;
  /**
   * Whether to highlight the portion of the line before the hover position.
   * Creates a progressive reveal effect as you move across the chart.
   * @default false
   */
  highlightLine?: boolean;
};

/**
 * Color configuration for chart elements.
 */
export type LineChartColors = {
  /**
   * Color for the unhighlighted (base) portion of the line.
   * Only visible when highlightLine is enabled in hover config.
   * @default "#666"
   */
  lineBase?: string;
  /**
   * Color for the highlighted portion of the line.
   * Used for the main line or the highlighted segment when hover is active.
   * @default "#000"
   */
  highlightColor?: string;
  /**
   * Color for the hover dot.
   * Only applies when hover.showDot is true.
   * @default "#000"
   */
  dotBase?: string;
};

/**
 * Main configuration object for the LineChart component.
 */
export type LineChartConfig = {
  /**
   * Array of data points to plot on the chart.
   * Must contain at least one point.
   */
  data: LineChartDataPoint[];
  /**
   * Configuration for hover/touch interactions.
   * If not provided, interactions are disabled.
   */
  hover?: HoverConfig;
  /**
   * Color configuration for chart elements.
   * If not provided, uses default colors.
   */
  colors?: LineChartColors;
  /**
   * Configuration for the X-axis.
   * If not provided, no X-axis is rendered.
   */
  xAxis?: AxisConfig;
  /**
   * Configuration for the Y-axis.
   * If not provided, no Y-axis is rendered.
   */
  yAxis?: AxisConfig;
};

/**
 * Props for the LineChart.Chart component.
 */
export type LineChartProps = {
  /**
   * Configuration object for the chart.
   */
  config: LineChartConfig;
};
