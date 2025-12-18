export type LineChartDataPoint = {
  x: number;
  y: number;
};

export type LineChartConfig = {
  data: LineChartDataPoint[];
  hover?: {
    enabled: boolean;
    showDot?: boolean;
    /**
     * TODO: tbd
     * Shows a tooltip on hover
     */
    showTooltip?: boolean;
    onHover?: (data: LineChartDataPoint) => void;
  };
  // colors?: {
  //   lineBase?: string;
  //   lineActive?: string;
  //   dotBase?: string;
  // };
};

export type LineChartProps = {
  config: LineChartConfig;
};
