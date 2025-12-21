import { MarkdownRenderer } from "../components/MarkdownRenderer";
import * as Installation from "../content/installation";

export default function InstallationScreen() {
  return <MarkdownRenderer content={Installation.content} />;
}
