// import { Canvas, Rect } from "@shopify/react-native-skia";
import { DonutChart } from "expo-skia-charts";
import type { PropsWithChildren } from "react";
import { Text, View } from "react-native";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";

export default function TabTwoScreen() {
  const data = [
    { label: "Label 1", value: 50000 },
    { label: "Label 2", value: 25000 },
    { label: "Label 3", value: 10000 },
    { label: "Label 4", value: 4000 },
  ];
  return (
    <View style={{ flexGrow: 1, flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
      <ChartWrapper title="Basic Donutchart">
        <DonutChart
          data={data}
          strokeWidth={40}
          showLabels={true}
          showCenterValue={true}
        />
      </ChartWrapper>
      <ChartWrapper title="Basic Donutchart">
        <DonutChart
          data={data}
          strokeWidth={40}
          showLabels={true}
          showCenterValue={true}
        />
      </ChartWrapper>
      <ChartWrapper title="Basic Donutchart">
        <DonutChart
          data={data}
          strokeWidth={40}
          showLabels={true}
          showCenterValue={true}
        />
      </ChartWrapper>
    </View>
  );
}

function ChartWrapper({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <View style={{ width: 400, height: 400 }}>
      <Text style={{ fontSize: 24 }}>{title}</Text>
      {children}
    </View>
  );
}
