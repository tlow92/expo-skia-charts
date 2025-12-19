import { LineChart } from "expo-skia-charts";
import { ScrollView, Text, View } from "react-native";
import { useMemo } from "react";

export default function HomeScreen() {
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (9 - i));
      const value = Math.random() * 100;
      data.push({ y: value, x: date.getTime() });
    }
    return data;
  }, []);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 8 }}>Default</Text>
      <View style={{ height: 200, marginBottom: 24 }}>
        <LineChart.Chart
          config={{
            data: chartData,
          }}
        />
      </View>

      <Text style={{ fontSize: 24, marginBottom: 8 }}>With hover dot</Text>
      <View style={{ height: 200, marginBottom: 24 }}>
        <LineChart.Chart
          config={{
            data: chartData,
            hover: {
              enabled: true,
              showDot: true,
            },
          }}
        />
      </View>

      <Text style={{ fontSize: 24, marginBottom: 8 }}>With highlighted Line</Text>
      <View style={{ height: 200, marginBottom: 24 }}>
        <LineChart.Chart
          config={{
            data: chartData,
            hover: {
              enabled: true,
              showDot: true,
              highlightLine: true,
            },
          }}
        />
      </View>

      <Text style={{ fontSize: 24, marginBottom: 8 }}>With X and Y Axes</Text>
      <View style={{ height: 200, marginBottom: 24 }}>
        <LineChart.Chart
          config={{
            data: chartData,
            xAxis: {
              enabled: true,
              isTimeData: true,
            },
            yAxis: {
              enabled: true,
            },
          }}
        />
      </View>

      <Text style={{ fontSize: 24, marginBottom: 8 }}>With Grid Lines</Text>
      <View style={{ height: 200, marginBottom: 24 }}>
        <LineChart.Chart
          config={{
            data: chartData,
            xAxis: {
              enabled: true,
              isTimeData: true,
              showGridLines: true,
              gridLineColor: "#e0e0e0",
            },
            yAxis: {
              enabled: true,
              showGridLines: true,
              gridLineColor: "#e0e0e0",
            },
          }}
        />
      </View>

      <Text style={{ fontSize: 24, marginBottom: 8 }}>
        With Axes, Grid Lines, and Hover
      </Text>
      <View style={{ height: 200, marginBottom: 24 }}>
        <LineChart.Chart
          config={{
            data: chartData,
            hover: {
              enabled: true,
              showDot: true,
              highlightLine: true,
            },
            xAxis: {
              enabled: true,
              isTimeData: true,
              showGridLines: true,
            },
            yAxis: {
              enabled: true,
              showGridLines: true,
            },
          }}
        />
      </View>

      <Text style={{ fontSize: 24, marginBottom: 8 }}>Custom styled with axes</Text>
      <View style={{ height: 200, marginBottom: 24 }}>
        <LineChart.Chart
          config={{
            data: chartData,
            hover: {
              enabled: true,
              showDot: true,
              highlightLine: true,
            },
            colors: {
              lineBase: "#9EB1FF",
              highlightColor: "#3E63DD",
              dotBase: "#0090FF",
            },
            xAxis: {
              enabled: true,
              isTimeData: true,
              showGridLines: true,
              color: "#3E63DD",
              gridLineColor: "#E0E7FF",
              tickCount: 6,
            },
            yAxis: {
              enabled: true,
              showGridLines: true,
              color: "#3E63DD",
              gridLineColor: "#E0E7FF",
            },
          }}
        />
      </View>
    </ScrollView>
  );
}
