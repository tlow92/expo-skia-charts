// import { Canvas, Rect } from "@shopify/react-native-skia";
import { DonutChart } from "expo-skia-charts";
import { View } from "react-native";

export default function TabTwoScreen() {
  const data = [
    { label: "Label 1", value: 50000 },
    { label: "Label 2", value: 25000 },
    { label: "Label 3", value: 10000 },
    { label: "Label 4", value: 4000 },
  ];
  return (
    <View style={{ flex: 1 }}>
      <DonutChart data={data} strokeWidth={40} showLabels={true} showCenterValue={true} />
    </View>
  );
}
