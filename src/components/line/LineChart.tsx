import { Canvas, Rect } from "@shopify/react-native-skia";

export type LineChartDataPoint = {
  value: number;
  date: Date;
};

export type LineChartProps = {
  data: LineChartDataPoint[];
  hover?: {
    enabled: boolean;
    showDot?: boolean;
    showTooltip?: boolean;
  };
  colors?: {
    lineBase?: string;
    lineActive?: string;
    dotBase?: string;
  };
};

export function LineChart({ data }: LineChartProps) {
  return (
    <Canvas style={{ flex: 1 }}>
      {data.map((e) => (
        <Rect key={e.date.toString()} x={0} y={0} width={100} height={100} color="red" />
      ))}
    </Canvas>
  );
}
