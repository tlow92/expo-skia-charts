import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function ExamplesIndexScreen() {
  return (
    <>
      <Text style={styles.h1}>Examples</Text>
      <Text style={styles.intro}>
        Explore interactive chart examples showcasing different features and use cases.
        Choose a chart type to see live examples.
      </Text>

      <View style={styles.cardContainer}>
        <Link href="/examples/line-chart" asChild>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>LineChart Examples</Text>
            <Text style={styles.cardDescription}>
              Explore single and multi-line charts with hover interactions, axes, grid
              lines, custom tooltips, and more.
            </Text>
            <Text style={styles.cardLink}>View Examples →</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/examples/donut-chart" asChild>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>DonutChart Examples</Text>
            <Text style={styles.cardDescription}>
              Interactive donut and pie charts with labels, center values, and custom
              styling options.
            </Text>
            <Text style={styles.cardLink}>View Examples →</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    color: "#374151",
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
    color: "#6b7280",
  },
  cardLink: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3b82f6",
  },
});
