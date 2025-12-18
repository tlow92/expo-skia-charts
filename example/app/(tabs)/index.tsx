import { LineChart } from "expo-skia-charts";
import { View } from "react-native";
import { useMemo } from "react";

export default function HomeScreen() {
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (9 - i));
      const value = Math.random() * 100; // Random value between 0 and 100
      data.push({ y: value, x: date.getTime() });
    }
    return data;
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <LineChart.Chart
        config={{
          data: chartData,
          hover: {
            enabled: true,
            showDot: true,
            onHover: (data) => {
              console.log(data);
            },
          },
        }}
      />
    </View>
  );
}
