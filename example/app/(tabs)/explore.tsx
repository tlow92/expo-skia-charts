// import { Canvas, Rect } from "@shopify/react-native-skia";
import { DonutChart } from "expo-skia-charts";
import { View } from "react-native";

export default function TabTwoScreen() {
  const data = [
    { label: "Shopify Payments", value: 50000 },
    { label: "Paypal", value: 25000 },
    { label: "Other", value: 10000 },
    { label: "Amazon Pay", value: 4000 },
  ];
  return (
    <View style={{ flex: 1 }}>
      <DonutChart data={data} strokeWidth={40} showLabels={true} showCenterValue={true} />
    </View>
  );
}
