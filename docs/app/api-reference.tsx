import { MarkdownRenderer } from "../components/MarkdownRenderer";
import * as ApiReference from "../content/api-reference";

export default function ApiReferenceScreen() {
  return <MarkdownRenderer content={ApiReference.content} />;
}
