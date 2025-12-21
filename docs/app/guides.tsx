import { ScrollView, StyleSheet } from "react-native";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import * as Guides from "../content/guides";

export default function GuidesScreen() {
  return <MarkdownRenderer content={Guides.content} />;
}
