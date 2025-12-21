import { StyleSheet, Text, View } from "react-native";

interface TableColumn {
  key: string;
  header: string;
  width?: number | string;
}

interface TableRow {
  [key: string]: string | number | boolean | undefined;
}

interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
}

export function Table({ columns, data }: TableProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        {columns.map((col) => (
          <View
            key={col.key}
            style={[styles.headerCell, col.width ? { width: col.width } : { flex: 1 }]}
          >
            <Text style={styles.headerText}>{col.header}</Text>
          </View>
        ))}
      </View>

      {/* Body */}
      {data.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[styles.row, rowIndex === data.length - 1 && styles.lastRow]}
        >
          {columns.map((col) => (
            <View
              key={col.key}
              style={[styles.cell, col.width ? { width: col.width } : { flex: 1 }]}
            >
              <Text style={styles.cellText}>{String(row[col.key] ?? "")}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerCell: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  cell: {
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#f3f4f6",
  },
  cellText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
});
