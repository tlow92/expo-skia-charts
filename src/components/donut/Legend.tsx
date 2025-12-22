import { StyleSheet, Text, View } from "react-native";
import { useDonutChartContext } from "../../providers/DonutChartContextProvider";

export function Legend() {
  const { chartData, config } = useDonutChartContext();

  const legendConfig = config.legend;

  if (!legendConfig || legendConfig.enabled === false) {
    return null;
  }

  // If custom renderContent is provided, use it
  if (legendConfig.renderContent) {
    return <>{legendConfig.renderContent(chartData)}</>;
  }

  // Default rendering
  return (
    <View style={styles.legendContainer}>
      {chartData.map((segment, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: segment.color }]} />
          <Text style={styles.legendText}>{segment.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 16,
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#1F2937",
  },
});
