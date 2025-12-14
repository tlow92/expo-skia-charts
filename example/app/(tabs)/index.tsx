import { LineChart } from "expo-skia-charts";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <LineChart data={[{ value: 1, date: new Date() }]} />
    </View>
  );
}
