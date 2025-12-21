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
              formatter: (value) =>
                Intl.DateTimeFormat("de-DE", {
                  dateStyle: "short",
                }).format(new Date(value)),
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
              onHover: (data) => {
                // biome-ignore lint/suspicious/noConsole: demo purpose
                console.log(new Date(data.x));
              },
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

      <Text style={{ fontSize: 24, marginBottom: 8 }}>
        With Custom Tooltip (Snap to Point)
      </Text>
      <View style={{ height: 200, marginBottom: 24 }}>
        <LineChart.Chart
          config={{
            data: chartData,
            hover: {
              enabled: true,
              showDot: true,
              tooltip: {
                renderContent: (dataPoint) => (
                  <View
                    style={{
                      backgroundColor: "white",
                      padding: 8,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#e0e0e0",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      {new Date(dataPoint.x).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>
                      {dataPoint.y.toFixed(2)}
                    </Text>
                  </View>
                ),
                snapToPoint: true,
              },
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

      <Text style={{ fontSize: 24, marginBottom: 8 }}>
        With Smooth Follow Tooltip (No Snap)
      </Text>
      <View style={{ height: 200, marginBottom: 24 }}>
        <LineChart.Chart
          config={{
            data: chartData,
            hover: {
              enabled: true,
              showDot: true,
              tooltip: {
                renderContent: (dataPoint) => (
                  <View
                    style={{
                      backgroundColor: "#3E63DD",
                      padding: 8,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#fff" }}>
                      {new Date(dataPoint.x).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
                      {dataPoint.y.toFixed(2)}
                    </Text>
                  </View>
                ),
                snapToPoint: false,
              },
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

      <Text style={{ fontSize: 24, marginBottom: 8 }}>Multiple Lines</Text>
      <View style={{ height: 200, marginBottom: 24 }}>
        <LineChart.Chart
          config={{
            series: [
              {
                id: "series1",
                label: "Revenue",
                data: chartData,
                colors: {
                  highlightColor: "#3E63DD",
                  lineBase: "#9EB1FF",
                  dotBase: "#0090FF",
                },
              },
              {
                id: "series2",
                label: "Expenses",
                data: chartData.map((point) => ({
                  x: point.x,
                  y: point.y * 0.7 + 10,
                })),
                colors: {
                  highlightColor: "#E5484D",
                  lineBase: "#FFBDBD",
                  dotBase: "#E5484D",
                },
              },
              {
                id: "series3",
                label: "Profit",
                data: chartData.map((point) => ({
                  x: point.x,
                  y: point.y * 0.3 - 5,
                })),
                colors: {
                  highlightColor: "#30A46C",
                  lineBase: "#B4E5C9",
                  dotBase: "#30A46C",
                },
              },
            ],
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
    </ScrollView>
  );
}
