import { BarChart } from "expo-skia-charts";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";

export default function BarScreen() {
  const simpleData = useMemo(
    () => [
      { label: "Jan", value: 65 },
      { label: "Feb", value: 59 },
      { label: "Mar", value: 80 },
      { label: "Apr", value: 81 },
      { label: "May", value: 56 },
      { label: "Jun", value: 55 },
    ],
    []
  );

  const groupedSeries = useMemo(
    () => [
      {
        id: "revenue",
        label: "Revenue",
        data: [
          { label: "Q1", value: 120 },
          { label: "Q2", value: 150 },
          { label: "Q3", value: 180 },
          { label: "Q4", value: 200 },
        ],
        color: "#3B82F6",
      },
      {
        id: "expenses",
        label: "Expenses",
        data: [
          { label: "Q1", value: 80 },
          { label: "Q2", value: 95 },
          { label: "Q3", value: 110 },
          { label: "Q4", value: 125 },
        ],
        color: "#EF4444",
      },
      {
        id: "profit",
        label: "Profit",
        data: [
          { label: "Q1", value: 40 },
          { label: "Q2", value: 55 },
          { label: "Q3", value: 70 },
          { label: "Q4", value: 75 },
        ],
        color: "#10B981",
      },
    ],
    []
  );

  const stackedSeries = useMemo(
    () => [
      {
        id: "design",
        label: "Design",
        data: [
          { label: "Week 1", value: 30 },
          { label: "Week 2", value: 45 },
          { label: "Week 3", value: 40 },
          { label: "Week 4", value: 55 },
        ],
        color: "#8B5CF6",
      },
      {
        id: "development",
        label: "Development",
        data: [
          { label: "Week 1", value: 50 },
          { label: "Week 2", value: 60 },
          { label: "Week 3", value: 70 },
          { label: "Week 4", value: 65 },
        ],
        color: "#3B82F6",
      },
      {
        id: "testing",
        label: "Testing",
        data: [
          { label: "Week 1", value: 20 },
          { label: "Week 2", value: 25 },
          { label: "Week 3", value: 30 },
          { label: "Week 4", value: 35 },
        ],
        color: "#10B981",
      },
    ],
    []
  );

  return (
    <GestureHandlerRootView>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>Simple Vertical Bar</Text>
        <View style={{ height: 200, marginBottom: 24 }}>
          <BarChart
            config={{
              data: simpleData,
              orientation: "vertical",
            }}
          />
        </View>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>With Hover & Tooltip</Text>
        <View style={{ height: 200, marginBottom: 24 }}>
          <BarChart
            config={{
              data: simpleData,
              orientation: "vertical",
              hover: {
                enabled: true,
                highlightBar: true,
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
                        {dataPoint.label}
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>
                        {dataPoint.value}
                      </Text>
                    </View>
                  ),
                },
              },
            }}
          />
        </View>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>With Axes & Grid Lines</Text>
        <View style={{ height: 250, marginBottom: 24 }}>
          <BarChart
            config={{
              data: simpleData,
              orientation: "vertical",
              xAxis: {
                enabled: true,
              },
              yAxis: {
                enabled: true,
                showGridLines: true,
                gridLineColor: "#e0e0e0",
              },
            }}
          />
        </View>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>Custom Styled Bars</Text>
        <View style={{ height: 250, marginBottom: 24 }}>
          <BarChart
            config={{
              data: simpleData,
              orientation: "vertical",
              colors: ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#EC4899"],
              style: {
                cornerRadius: 8,
                groupGap: 8,
              },
              xAxis: {
                enabled: true,
              },
              yAxis: {
                enabled: true,
                showGridLines: true,
                gridLineColor: "#e0e0e0",
              },
              hover: {
                enabled: true,
                highlightBar: true,
                highlightOpacity: 0.7,
              },
            }}
          />
        </View>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>Grouped Bars</Text>
        <View style={{ height: 250, marginBottom: 24 }}>
          <BarChart
            config={{
              series: groupedSeries,
              mode: "grouped",
              orientation: "vertical",
              style: {
                cornerRadius: 4,
                gap: 4,
              },
              xAxis: {
                enabled: true,
              },
              yAxis: {
                enabled: true,
                showGridLines: true,
                gridLineColor: "#e0e0e0",
              },
              hover: {
                enabled: true,
                highlightBar: true,
                tooltip: {
                  renderContent: (dataPoint, seriesId) => (
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
                      <Text style={{ fontSize: 10, color: "#666" }}>
                        {seriesId?.toUpperCase()}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#666" }}>
                        {dataPoint.label}
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>
                        {dataPoint.value}
                      </Text>
                    </View>
                  ),
                },
              },
            }}
          />
        </View>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>
          Stacked Bars (no gap radius test)
        </Text>
        <View style={{ height: 250, marginBottom: 24 }}>
          <BarChart
            config={{
              series: stackedSeries,
              mode: "stacked",
              orientation: "vertical",
              style: {
                cornerRadius: 8,
                stackGap: 0, // No gap between segments
              },
              xAxis: {
                enabled: true,
              },
              yAxis: {
                enabled: true,
                showGridLines: true,
                gridLineColor: "#e0e0e0",
              },
              hover: {
                enabled: true,
                highlightBar: true,
                tooltip: {
                  position: "end",
                  renderContent: (dataPoint, seriesId) => (
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
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#666",
                          textTransform: "uppercase",
                        }}
                      >
                        {seriesId}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#666" }}>
                        {dataPoint.label}
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>
                        {dataPoint.value} hours
                      </Text>
                    </View>
                  ),
                },
              },
            }}
          />
        </View>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>Stacked Bars (with gaps)</Text>
        <View style={{ height: 250, marginBottom: 24 }}>
          <BarChart
            config={{
              series: stackedSeries,
              mode: "stacked",
              orientation: "vertical",
              style: {
                cornerRadius: 4,
                stackGap: 3, // Gap between stacked segments
              },
              xAxis: {
                enabled: true,
              },
              yAxis: {
                enabled: true,
                showGridLines: true,
                gridLineColor: "#e0e0e0",
              },
              hover: {
                enabled: true,
                highlightBar: true,
                tooltip: {
                  position: "end", // Always show at end of bar (top for vertical)
                  renderContent: (dataPoint, seriesId) => (
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
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#666",
                          textTransform: "uppercase",
                        }}
                      >
                        {seriesId}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#666" }}>
                        {dataPoint.label}
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>
                        {dataPoint.value} hours
                      </Text>
                    </View>
                  ),
                },
              },
            }}
          />
        </View>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>Horizontal Bar Chart</Text>
        <View style={{ height: 300, marginBottom: 24 }}>
          <BarChart
            config={{
              data: simpleData,
              orientation: "horizontal",
              xAxis: {
                enabled: true,
                showGridLines: true,
                gridLineColor: "#e0e0e0",
              },
              yAxis: {
                enabled: true,
              },
              hover: {
                enabled: true,
                highlightBar: true,
              },
            }}
          />
        </View>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>Horizontal Grouped Bars</Text>
        <View style={{ height: 350, marginBottom: 24 }}>
          <BarChart
            config={{
              series: groupedSeries,
              mode: "grouped",
              orientation: "horizontal",
              style: {
                cornerRadius: 6,
                gap: 3,
              },
              xAxis: {
                enabled: true,
                showGridLines: true,
                gridLineColor: "#e0e0e0",
              },
              yAxis: {
                enabled: true,
              },
              hover: {
                enabled: true,
                highlightBar: true,
                tooltip: {
                  renderContent: (dataPoint, seriesId) => (
                    <View
                      style={{
                        backgroundColor: "#3B82F6",
                        padding: 8,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ fontSize: 10, color: "#fff" }}>
                        {seriesId?.toUpperCase()}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#fff" }}>
                        {dataPoint.label}
                      </Text>
                      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
                        ${dataPoint.value}k
                      </Text>
                    </View>
                  ),
                },
              },
            }}
          />
        </View>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>
          Horizontal Stacked Bars (with touch tooltip)
        </Text>
        <View style={{ height: 300, marginBottom: 24 }}>
          <BarChart
            config={{
              series: stackedSeries,
              mode: "stacked",
              orientation: "horizontal",
              style: {
                cornerRadius: 4,
                stackGap: 2, // Gap between segments
              },
              xAxis: {
                enabled: true,
                showGridLines: true,
                gridLineColor: "#e0e0e0",
              },
              yAxis: {
                enabled: true,
              },
              hover: {
                enabled: true,
                highlightBar: true,
                tooltip: {
                  position: "touch", // Follow touch/cursor position
                  renderContent: (dataPoint, seriesId) => (
                    <View
                      style={{
                        backgroundColor: "#3B82F6",
                        padding: 8,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ fontSize: 10, color: "#fff" }}>
                        {seriesId?.toUpperCase()}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#fff" }}>
                        {dataPoint.label}
                      </Text>
                      <Text style={{ fontSize: 14, fontWeight: "bold", color: "#fff" }}>
                        {dataPoint.value}h
                      </Text>
                    </View>
                  ),
                },
              },
            }}
          />
        </View>
        <Text style={{ fontSize: 24, marginBottom: 8 }}>
          Simple horizontal stacked bars
        </Text>
        <View style={{ height: 200, marginBottom: 24 }}>
          <BarChart
            config={{
              series: stackedSeries,
              mode: "stacked",
              orientation: "horizontal",
              style: {
                cornerRadius: 18,
                stackGap: 8,
              },
              hover: {
                enabled: true,
                highlightBar: true,
                tooltip: {
                  position: "touch", // Follow touch/cursor position
                  renderContent: (dataPoint, seriesId) => (
                    <View
                      style={{
                        backgroundColor: "#3B82F6",
                        padding: 8,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ fontSize: 10, color: "#fff" }}>
                        {seriesId?.toUpperCase()}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#fff" }}>
                        {dataPoint.label}
                      </Text>
                      <Text style={{ fontSize: 14, fontWeight: "bold", color: "#fff" }}>
                        {dataPoint.value}h
                      </Text>
                    </View>
                  ),
                },
              },
            }}
          />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}
