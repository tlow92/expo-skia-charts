import type { BarChartConfig } from "expo-skia-charts";
import { BarChart } from "expo-skia-charts";
import { Platform, StyleSheet, Text, View } from "react-native";
import { CodeBlock } from "./CodeBlock";

interface BarChartExampleProps {
  title: string;
  description?: string;
  config: BarChartConfig;
  code?: string;
  height?: number;
}

export function BarChartExample({
  title,
  description,
  config,
  code,
  height = 250,
}: BarChartExampleProps) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}

      <View style={styles.chartContainer}>
        <View style={{ height }}>
          <BarChart config={config} />
        </View>
      </View>

      {code && Platform.OS === "web" && (
        <CodeBlock language="typescript">{code}</CodeBlock>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  description: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 16,
    lineHeight: 22,
  },
  chartContainer: {
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    backgroundColor: "#ffffff",
  },
});
