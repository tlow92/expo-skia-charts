import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ChartExample } from "./ChartExample";

export function ExamplesSection() {
  // Generate sample data
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - (29 - i)
      );
      const value = 50 + Math.sin(i / 5) * 25 + Math.random() * 10;
      data.push({ y: value, x: date.getTime() });
    }
    return data;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>LineChart Examples</Text>
      <Text style={styles.intro}>
        Explore interactive LineChart examples showcasing different features and use
        cases. Hover over or touch the charts to interact with them.
      </Text>

      <Text style={styles.h2}>Basic Charts</Text>

      <ChartExample
        title="Simple Line Chart"
        description="The most basic line chart with minimal configuration showing a single data series."
        config={{
          data: chartData,
        }}
        height={250}
        code={`<LineChart.Chart
  config={{
    data: chartData,
  }}
/>`}
      />

      <ChartExample
        title="With Hover Dot"
        description="Enable hover interactions with a visible dot at the data point."
        config={{
          data: chartData,
          hover: {
            enabled: true,
            showDot: true,
          },
        }}
        height={250}
        code={`<LineChart.Chart
  config={{
    data: chartData,
    hover: {
      enabled: true,
      showDot: true,
    },
  }}
/>`}
      />

      <ChartExample
        title="With Highlighted Line"
        description="Add a vertical highlight line that follows your touch or cursor position."
        config={{
          data: chartData,
          hover: {
            enabled: true,
            showDot: true,
            highlightLine: true,
          },
        }}
        height={250}
        code={`<LineChart.Chart
  config={{
    data: chartData,
    hover: {
      enabled: true,
      showDot: true,
      highlightLine: true,
    },
  }}
/>`}
      />

      <Text style={styles.h2}>With Axes</Text>

      <ChartExample
        title="X and Y Axes"
        description="Add labeled axes to your chart for better readability."
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
        height={250}
        code={`<LineChart.Chart
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
/>`}
      />

      <ChartExample
        title="With Grid Lines"
        description="Add grid lines for precise value reading."
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
        height={250}
        code={`<LineChart.Chart
  config={{
    data: chartData,
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
/>`}
      />

      <Text style={styles.h2}>Styled Charts</Text>

      <ChartExample
        title="Custom Colors"
        description="Customize chart colors to match your brand."
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
        height={300}
        code={`<LineChart.Chart
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
    },
    yAxis: {
      enabled: true,
      showGridLines: true,
      color: "#3E63DD",
      gridLineColor: "#E0E7FF",
    },
  }}
/>`}
      />

      <Text style={styles.h2}>Multiple Series</Text>

      <ChartExample
        title="Multi-Line Chart"
        description="Display multiple data series on the same chart with different colors."
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
        height={300}
        code={`<LineChart.Chart
  config={{
    series: [
      {
        id: "series1",
        label: "Revenue",
        data: revenueData,
        colors: {
          highlightColor: "#3E63DD",
          lineBase: "#9EB1FF",
          dotBase: "#0090FF",
        },
      },
      {
        id: "series2",
        label: "Expenses",
        data: expensesData,
        colors: {
          highlightColor: "#E5484D",
          lineBase: "#FFBDBD",
          dotBase: "#E5484D",
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
/>`}
      />

      <Text style={styles.h2}>Advanced Features</Text>

      <ChartExample
        title="With Custom Tooltip"
        description="Create custom tooltip components that display formatted data."
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
                  <Text
                    style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}
                  >
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
        height={300}
        code={`<LineChart.Chart
  config={{
    data: chartData,
    hover: {
      enabled: true,
      showDot: true,
      tooltip: {
        renderContent: (dataPoint) => (
          <View style={styles.tooltip}>
            <Text>{new Date(dataPoint.x).toLocaleDateString()}</Text>
            <Text style={styles.value}>
              {dataPoint.y.toFixed(2)}
            </Text>
          </View>
        ),
        snapToPoint: true,
      },
    },
  }}
/>`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 48,
    marginBottom: 24,
    color: "#1a1a1a",
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    color: "#374151",
  },
});
