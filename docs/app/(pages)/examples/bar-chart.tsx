import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BarChartExample } from "../../../components/BarChartExample";

export default function BarChartExamplesScreen() {
  // Generate sample data for single series
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

  // Generate sample data for grouped series
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

  // Generate sample data for stacked series
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
    <View style={styles.container}>
      <Text style={styles.h1}>BarChart Examples</Text>
      <Text style={styles.intro}>
        Explore interactive BarChart examples showcasing different features and use cases.
        Supports vertical and horizontal orientations, grouped and stacked modes, with
        customizable styling and hover interactions.
      </Text>

      <Text style={styles.h2}>Basic Charts</Text>

      <BarChartExample
        title="Simple Vertical Bar Chart"
        description="The most basic bar chart with minimal configuration showing a single data series."
        config={{
          data: simpleData,
          orientation: "vertical",
        }}
        height={250}
        code={`<BarChart
  config={{
    data: [
      { label: "Jan", value: 65 },
      { label: "Feb", value: 59 },
      { label: "Mar", value: 80 },
      // ...
    ],
    orientation: "vertical",
  }}
/>`}
      />

      <BarChartExample
        title="With Hover Effects"
        description="Enable hover interactions to highlight bars and show tooltips on touch or cursor."
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
                  <Text style={{ fontSize: 12, color: "#666" }}>{dataPoint.label}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>
                    {dataPoint.value}
                  </Text>
                </View>
              ),
            },
          },
        }}
        height={250}
        code={`<BarChart
  config={{
    data: simpleData,
    orientation: "vertical",
    hover: {
      enabled: true,
      highlightBar: true,
      tooltip: {
        renderContent: (dataPoint) => (
          <View style={styles.tooltip}>
            <Text>{dataPoint.label}</Text>
            <Text>{dataPoint.value}</Text>
          </View>
        ),
      },
    },
  }}
/>`}
      />

      <Text style={styles.h2}>With Axes</Text>

      <BarChartExample
        title="With X and Y Axes"
        description="Add labeled axes and grid lines for better readability."
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
        height={300}
        code={`<BarChart
  config={{
    data: simpleData,
    orientation: "vertical",
    xAxis: {
      enabled: true,
    },
    yAxis: {
      enabled: true,
      showGridLines: true,
    },
  }}
/>`}
      />

      <Text style={styles.h2}>Styled Charts</Text>

      <BarChartExample
        title="Custom Colors and Rounded Corners"
        description="Customize bar colors, corner radius, and spacing to match your brand."
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
        height={300}
        code={`<BarChart
  config={{
    data: simpleData,
    orientation: "vertical",
    colors: ["#8B5CF6", "#3B82F6", "#10B981"],
    style: {
      cornerRadius: 8,
      groupGap: 8,
    },
    hover: {
      enabled: true,
      highlightBar: true,
    },
  }}
/>`}
      />

      <Text style={styles.h2}>Grouped Bars</Text>

      <BarChartExample
        title="Grouped Bar Chart"
        description="Display multiple data series side-by-side for easy comparison."
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
                  <Text style={{ fontSize: 12, color: "#666" }}>{dataPoint.label}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>
                    {dataPoint.value}
                  </Text>
                </View>
              ),
            },
          },
        }}
        height={300}
        code={`<BarChart
  config={{
    series: [
      {
        id: "revenue",
        label: "Revenue",
        data: revenueData,
        color: "#3B82F6",
      },
      {
        id: "expenses",
        label: "Expenses",
        data: expensesData,
        color: "#EF4444",
      },
    ],
    mode: "grouped",
    orientation: "vertical",
    style: {
      cornerRadius: 4,
      gap: 4,
    },
  }}
/>`}
      />

      <Text style={styles.h2}>Stacked Bars</Text>

      <BarChartExample
        title="Stacked Bar Chart"
        description="Stack multiple series on top of each other to show cumulative values. With gaps between segments for visual separation."
        config={{
          series: stackedSeries,
          mode: "stacked",
          orientation: "vertical",
          style: {
            cornerRadius: 4,
            stackGap: 3,
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
                    style={{ fontSize: 10, color: "#666", textTransform: "uppercase" }}
                  >
                    {seriesId}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#666" }}>{dataPoint.label}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: "#000" }}>
                    {dataPoint.value} hours
                  </Text>
                </View>
              ),
            },
          },
        }}
        height={300}
        code={`<BarChart
  config={{
    series: stackedSeries,
    mode: "stacked",
    orientation: "vertical",
    style: {
      cornerRadius: 4,
      stackGap: 3, // Gap between segments
    },
    hover: {
      enabled: true,
      tooltip: {
        position: "end", // Always show at top
      },
    },
  }}
/>`}
      />

      <BarChartExample
        title="Stacked without Gaps"
        description="When stackGap is 0, only the outer corners of the entire stack are rounded for a seamless appearance."
        config={{
          series: stackedSeries,
          mode: "stacked",
          orientation: "vertical",
          style: {
            cornerRadius: 8,
            stackGap: 0,
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
          },
        }}
        height={300}
        code={`<BarChart
  config={{
    series: stackedSeries,
    mode: "stacked",
    style: {
      cornerRadius: 8,
      stackGap: 0, // Seamless stacking
    },
  }}
/>`}
      />

      <Text style={styles.h2}>Horizontal Orientation</Text>

      <BarChartExample
        title="Horizontal Bar Chart"
        description="Bars grow rightward instead of upward, with categories on the Y-axis."
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
        height={350}
        code={`<BarChart
  config={{
    data: simpleData,
    orientation: "horizontal",
    xAxis: {
      enabled: true,
      showGridLines: true,
    },
    yAxis: {
      enabled: true,
    },
  }}
/>`}
      />

      <BarChartExample
        title="Horizontal Grouped Bars"
        description="Multiple series displayed side-by-side in horizontal orientation."
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
          },
        }}
        height={400}
        code={`<BarChart
  config={{
    series: groupedSeries,
    mode: "grouped",
    orientation: "horizontal",
    style: {
      cornerRadius: 6,
      gap: 3,
    },
  }}
/>`}
      />

      <Text style={styles.h2}>Advanced Features</Text>

      <BarChartExample
        title="Tooltip Position: Touch + Custom Tooltip"
        description="Position tooltip near the touch coordinate."
        config={{
          series: stackedSeries,
          mode: "stacked",
          orientation: "horizontal",
          style: {
            cornerRadius: 4,
            stackGap: 2,
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
              position: "touch",
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
                  <Text style={{ fontSize: 12, color: "#fff" }}>{dataPoint.label}</Text>
                  <Text style={{ fontSize: 14, fontWeight: "bold", color: "#fff" }}>
                    {dataPoint.value}h
                  </Text>
                </View>
              ),
            },
          },
        }}
        height={350}
        code={`<BarChart
  config={{
    hover: {
      enabled: true,
      tooltip: {
        position: "touch", // Follow cursor
        renderContent: (dataPoint, seriesId) => (
          <View style={styles.tooltip}>
            <Text>{seriesId}</Text>
            <Text>{dataPoint.value}</Text>
          </View>
        ),
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
