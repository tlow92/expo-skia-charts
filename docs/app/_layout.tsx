import { MDXComponents, MDXStyles } from "@bacons/mdx";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";
import { CodeBlock } from "../components/CodeBlock";
import { GettingStartedSection } from "../components/GettingStartedSection";
import { Navigation } from "../components/Navigation";
import { Table } from "../components/Table";

export default function RootLayout() {
  const mdxStyles = {
    h1: {
      fontSize: 32,
      fontWeight: "bold" as const,
      marginBottom: 16,
      marginTop: 8,
      color: "#1a1a1a",
    },
    h2: {
      fontSize: 24,
      fontWeight: "bold" as const,
      marginTop: 32,
      marginBottom: 12,
      color: "#1a1a1a",
    },
    h3: {
      fontSize: 20,
      fontWeight: "600" as const,
      marginTop: 24,
      marginBottom: 8,
      color: "#1a1a1a",
    },
    h4: {
      fontSize: 18,
      fontWeight: "600" as const,
      marginTop: 20,
      marginBottom: 8,
      color: "#374151",
    },
    p: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 12,
      color: "#374151",
    },
    strong: {
      fontWeight: "bold" as const,
      color: "#1a1a1a",
    },
    em: {
      fontStyle: "italic" as const,
    },
    a: {
      color: "#3b82f6",
      textDecorationLine: "underline" as const,
    },
    ul: {
      marginBottom: 12,
      paddingLeft: 8,
    },
    ol: {
      marginBottom: 12,
      paddingLeft: 8,
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: "#e5e7eb",
      paddingLeft: 16,
      marginVertical: 12,
      fontStyle: "italic" as const,
      color: "#6b7280",
    },
    table: {
      marginVertical: 12,
      borderWidth: 1,
      borderColor: "#e5e7eb",
      borderRadius: 6,
    },
    thead: {
      backgroundColor: "#f9fafb",
    },
    th: {
      fontSize: 14,
      fontWeight: "600" as const,
      padding: 12,
      color: "#1a1a1a",
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
    },
    td: {
      fontSize: 14,
      padding: 12,
      color: "#374151",
      borderBottomWidth: 1,
      borderBottomColor: "#f3f4f6",
    },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
    },
  };

  return (
    <ThemeProvider value={DefaultTheme}>
      <MDXStyles {...(mdxStyles as any)}>
        <MDXComponents
          components={{
            GettingStartedSection,
            Table,
            code: ({ children }) => <CodeBlock>{children}</CodeBlock>,
            li: ({ children, ...props }) => (
              <View>
                <Text {...props}>
                  <Text
                    style={{ fontSize: (props.fontSize || 14) * 1.4, fontWeight: "bold" }}
                  >{`\u2022 `}</Text>
                  {children}
                </Text>
              </View>
            ),
          }}
        >
          <View style={styles.container}>
            <Navigation />

            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(pages)" />
            </Stack>
          </View>
          <StatusBar style="auto" />
        </MDXComponents>
      </MDXStyles>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "row",
  },
  content: {
    flexGrow: 1,
  },
});
