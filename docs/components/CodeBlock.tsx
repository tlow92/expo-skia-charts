import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  children: string;
  language?: string;
}

export function CodeBlock({ children, language = "typescript" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (Platform.OS === "web" && typeof navigator !== "undefined") {
      try {
        await (navigator as any).clipboard.writeText(String(children));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "web" && (
        <TouchableOpacity
          style={styles.copyButton}
          onPress={handleCopy}
          accessibilityLabel="Copy code to clipboard"
        >
          <Ionicons
            name={copied ? "checkmark" : "copy-outline"}
            size={16}
            color="#ffffff"
          />
        </TouchableOpacity>
      )}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 6,
          fontSize: 14,
        }}
      >
        {children}
      </SyntaxHighlighter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginVertical: 12,
  },
  copyButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
});
