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

export type XAxisConfig = AxisConfig & {
  /**
   * Number of ticks to display on the axis (approximate).
   * The actual number may vary based on D3's tick algorithm.
   * @default 2
   */
  tickCount?: number;
};

export type YAxisConfig = AxisConfig & {
  /**
   * Number of ticks to display on the axis (approximate).
   * The actual number may vary based on D3's tick algorithm.
   * @default 5
   */
  tickCount?: number;
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
 * Configuration for tooltip rendering.
 */
export type TooltipConfig = {
  /**
   * Whether the tooltip is enabled.
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether to snap tooltip position to the nearest data point.
   * If true (default), tooltip jumps between data points (stepped behavior).
   * If false, tooltip follows cursor smoothly.
   * @default true
   */
  snapToPoint?: boolean;
  /**
   * Function that renders the tooltip content.
   * Receives the current data point and should return a React node.
   * @param dataPoint - The data point at the current position
   * @returns React node to render inside the tooltip
   */
  renderContent: (dataPoint: LineChartDataPoint) => React.ReactNode;
  /**
   * Offset of the tooltip from the data point position.
   * Positive x moves right, positive y moves down.
   * @default { x: 10, y: -10 }
   */
  offset?: { x: number; y: number };
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
   * @deprecated Use `tooltip` config instead
   */
  showTooltip?: boolean;
  /**
   * Tooltip configuration.
   * If provided, displays a custom tooltip when hovering over the chart.
   */
  tooltip?: TooltipConfig;
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
 * Configuration for a single line series in a multi-line chart.
 */
export type LineSeriesData = {
  /**
   * Unique identifier for this line series.
   * Used to distinguish between multiple lines.
   */
  id: string;
  /**
   * Array of data points for this line.
   * Must contain at least one point.
   */
  data: LineChartDataPoint[];
  /**
   * Optional label for this series.
   * Can be used in tooltips or legends.
   */
  label?: string;
  /**
   * Color configuration specific to this line.
   * Overrides the global colors config for this series.
   */
  colors?: LineChartColors;
  /**
   * Stroke width for this line in pixels.
   * Overrides the default stroke width for this series.
   * @default 2
   */
  strokeWidth?: number;
};

/**
 * Configuration for multi-line hover behavior.
 */
export type MultiLineHoverConfig = {
  /**
   * Whether to show hover dots on all lines at the current x-coordinate.
   * If true (default), displays dots on all lines at the hover position.
   * If false, only shows the dot on the closest line to cursor.
   * @default true
   */
  showAllAtX?: boolean;
  /**
   * Whether to highlight the closest line to the cursor.
   * If true, the nearest line is visually emphasized.
   * @default false
   */
  highlightClosest?: boolean;
};

/**
 * Main configuration object for the LineChart component.
 */
export type LineChartConfig = {
  /**
   * Array of data points to plot on the chart (single line mode).
   * Must contain at least one point.
   * Use either `data` OR `series`, not both.
   */
  data?: LineChartDataPoint[];
  /**
   * Array of line series to plot on the chart (multi-line mode).
   * Each series represents a separate line with its own data and styling.
   * Use either `data` OR `series`, not both.
   */
  series?: LineSeriesData[];
  /**
   * Configuration for multi-line hover behavior.
   * Only applies when using `series` (multi-line mode).
   */
  multiLineHover?: MultiLineHoverConfig;
  /**
   * Configuration for hover/touch interactions.
   * If not provided, interactions are disabled.
   */
  hover?: HoverConfig;
  /**
   * Color configuration for chart elements.
   * If not provided, uses default colors.
   * In multi-line mode, this serves as the default for series without specific colors.
   */
  colors?: LineChartColors;
  /**
   * Configuration for the X-axis.
   * If not provided, no X-axis is rendered.
   */
  xAxis?: XAxisConfig;
  /**
   * Configuration for the Y-axis.
   * If not provided, no Y-axis is rendered.
   */
  yAxis?: YAxisConfig;
  /**
   * Duration of entry animation in milliseconds.
   * Animation reveals the line from left to right on mount.
   * @default 1000
   */
  animationDuration?: number;
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
