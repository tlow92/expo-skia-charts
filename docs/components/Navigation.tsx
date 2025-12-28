import { AntDesign } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link, usePathname } from "expo-router";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface NavItem {
  title: string;
  href: string;
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  { title: "Getting Started", href: "/getting-started" },
  { title: "Installation", href: "/installation" },
  { title: "API Reference", href: "/api-reference" },
  {
    title: "Examples",
    href: "/examples",
    subItems: [
      { title: "LineChart", href: "/examples/line-chart" },
      { title: "BarChart", href: "/examples/bar-chart" },
      { title: "DonutChart", href: "/examples/donut-chart" },
    ],
  },
];

export const Navigation = React.memo(function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/examples") {
      return pathname.startsWith("/examples");
    }
    return pathname === href;
  };

  const handleGitHubPress = () => {
    Linking.openURL("https://github.com/tlow92/expo-skia-charts");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Documentation</Text>
        <TouchableOpacity
          style={styles.githubButton}
          onPress={handleGitHubPress}
          accessibilityLabel="View on GitHub"
        >
          <AntDesign name="github" size={20} color="#111827" />
        </TouchableOpacity>
      </View>
      {navItems.map((item) => {
        const itemActive = isActive(item.href);
        return (
          <View key={item.href}>
            {/* @ts-ignore - asChild prop is valid but type definitions are incomplete */}
            <Link href={item.href as Href} asChild>
              <TouchableOpacity
                style={StyleSheet.flatten([styles.item, itemActive && styles.itemActive])}
              >
                <Text
                  style={StyleSheet.flatten([
                    styles.itemText,
                    itemActive && styles.itemTextActive,
                  ])}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            </Link>
            {item.subItems && pathname.startsWith(item.href) && (
              <View style={styles.subItems}>
                {item.subItems.map((subItem) => {
                  const subItemActive = isActive(subItem.href);
                  return (
                    // @ts-expect-error - asChild prop is valid but type definitions are incomplete
                    <Link key={subItem.href} href={subItem.href as Href} asChild>
                      <TouchableOpacity
                        style={StyleSheet.flatten([
                          styles.subItem,
                          subItemActive && styles.subItemActive,
                        ])}
                      >
                        <Text
                          style={StyleSheet.flatten([
                            styles.subItemText,
                            subItemActive && styles.subItemTextActive,
                          ])}
                        >
                          {subItem.title}
                        </Text>
                      </TouchableOpacity>
                    </Link>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    maxWidth: 250,
    backgroundColor: "#f9fafb",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  content: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  githubButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  itemActive: {
    backgroundColor: "#3b82f6",
  },
  itemText: {
    fontSize: 15,
    color: "#6b7280",
  },
  itemTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  subItems: {
    marginLeft: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  subItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 2,
  },
  subItemActive: {
    backgroundColor: "#dbeafe",
  },
  subItemText: {
    fontSize: 14,
    color: "#6b7280",
  },
  subItemTextActive: {
    color: "#1e40af",
    fontWeight: "500",
  },
});
