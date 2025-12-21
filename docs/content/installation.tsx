export const content = `
# Installation

This guide will walk you through installing expo-skia-charts and its dependencies.

## Prerequisites

Before installing, ensure your environment meets these requirements:

- **React Native** ≥ 0.79
- **React** ≥ 19
- **Node.js** ≥ 18
- **iOS** 12+ or **Android** API 21+

## Install the Package

Install expo-skia-charts and its peer dependencies:

\`\`\`bash
npx expo install expo-skia-charts @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
\`\`\`

### Web

For web support, follow the [@shopify/react-native-skia web setup guide](https://shopify.github.io/react-native-skia/docs/getting-started/web).

## Verify Installation

Create a simple chart to verify everything is working:

\`\`\`typescript
import { View } from "react-native";
import { LineChart } from "expo-skia-charts";

export default function App() {
  const data = [
    { x: 1, y: 10 },
    { x: 2, y: 25 },
    { x: 3, y: 15 },
  ];

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ height: 300 }}>
        <LineChart.Chart config={{ data }} />
      </View>
    </View>
  );
}
\`\`\`

If you see a line chart, you're all set!
`;

export const id = "installation";
export const title = "Installation";
