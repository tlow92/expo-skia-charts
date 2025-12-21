import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const lines = content.trim().split("\n");
  const elements: React.ReactElement[] = [];
  let currentCodeBlock: string[] = [];
  let codeLanguage = "";
  let inCodeBlock = false;

  const renderLine = (line: string, index: number) => {
    // Code block detection
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim() || "typescript";
        currentCodeBlock = [];
        return null;
      } else {
        inCodeBlock = false;
        const code = currentCodeBlock.join("\n");
        const element = (
          <View key={`code-${index}`} style={styles.codeBlock}>
            {Platform.OS === "web" ? (
              <SyntaxHighlighter
                language={codeLanguage}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: 6,
                  fontSize: 14,
                }}
              >
                {code}
              </SyntaxHighlighter>
            ) : (
              <Text style={styles.codeText}>{code}</Text>
            )}
          </View>
        );
        currentCodeBlock = [];
        return element;
      }
    }

    if (inCodeBlock) {
      currentCodeBlock.push(line);
      return null;
    }

    // H1
    if (line.startsWith("# ")) {
      return (
        <Text key={index} style={styles.h1}>
          {line.slice(2)}
        </Text>
      );
    }

    // H2
    if (line.startsWith("## ")) {
      return (
        <Text key={index} style={styles.h2}>
          {line.slice(3)}
        </Text>
      );
    }

    // H3
    if (line.startsWith("### ")) {
      return (
        <Text key={index} style={styles.h3}>
          {line.slice(4)}
        </Text>
      );
    }

    // Bold text **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    if (boldRegex.test(line)) {
      const parts = line.split(boldRegex);
      return (
        <Text key={index} style={styles.paragraph}>
          {parts.map((part, i) => {
            if (i % 2 === 1) {
              return (
                <Text key={i} style={styles.bold}>
                  {part}
                </Text>
              );
            }
            return part;
          })}
        </Text>
      );
    }

    // Inline code `code`
    const codeRegex = /`([^`]+)`/g;
    if (codeRegex.test(line)) {
      const parts = line.split(codeRegex);
      return (
        <Text key={index} style={styles.paragraph}>
          {parts.map((part, i) => {
            if (i % 2 === 1) {
              return (
                <Text key={i} style={styles.inlineCode}>
                  {part}
                </Text>
              );
            }
            return part;
          })}
        </Text>
      );
    }

    // Bullet points
    if (line.startsWith("- ")) {
      return (
        <Text key={index} style={styles.listItem}>
          • {line.slice(2)}
        </Text>
      );
    }

    // Table row (simplified)
    if (line.startsWith("|")) {
      const cells = line.split("|").filter((c) => c.trim());
      return (
        <View key={index} style={styles.tableRow}>
          {cells.map((cell, i) => (
            <Text key={i} style={styles.tableCell}>
              {cell.trim()}
            </Text>
          ))}
        </View>
      );
    }

    // Empty line
    if (line.trim() === "") {
      return <View key={index} style={styles.spacing} />;
    }

    // Regular paragraph
    return (
      <Text key={index} style={styles.paragraph}>
        {line}
      </Text>
    );
  };

  lines.forEach((line, index) => {
    const element = renderLine(line, index);
    if (element) {
      elements.push(element);
    }
  });

  return <View style={styles.container}>{elements}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 12,
    color: "#1a1a1a",
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 8,
    color: "#1a1a1a",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    color: "#374151",
  },
  bold: {
    fontWeight: "bold",
  },
  inlineCode: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 14,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    color: "#e11d48",
  },
  codeBlock: {
    marginVertical: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  codeText: {
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 14,
    backgroundColor: "#1e1e1e",
    color: "#d4d4d4",
    padding: 16,
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 8,
    color: "#374151",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    paddingHorizontal: 8,
  },
  spacing: {
    height: 12,
  },
});
