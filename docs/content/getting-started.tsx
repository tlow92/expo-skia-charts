export const content = `
# Getting Started

Welcome to **expo-skia-charts** - Modern performant charts for iOS, Android, and Web using Skia.

## Overview

expo-skia-charts is a React Native library that provides high-performance, interactive charts powered by [@shopify/react-native-skia](https://shopify.github.io/react-native-skia/). Built for cross-platform compatibility, it delivers smooth 60fps animations on iOS, Android, and Web.

### Features

- **High Performance**: Powered by Skia for native rendering performance
- **Cross-Platform**: Works on iOS, Android, and Web
- **Smooth Animations**: 60fps animations using react-native-reanimated
- **Interactive**: Built-in hover interactions and custom tooltips
- **Customizable**: Flexible styling and configuration options
- **TypeScript**: Full TypeScript support with detailed type definitions

### Chart Types

Currently supported:
- **LineChart**: Single and multi-line charts with hover interactions, axes, and grid lines
- **DonutChart**: Interactive donut/pie charts with labels and values

More chart types coming soon!

## Quick Start

Get up and running with expo-skia-charts in minutes.

### Basic Example

\`\`\`typescript
import { LineChart } from "expo-skia-charts";
import { View } from "react-native";

const data = [
  { x: 1, y: 10 },
  { x: 2, y: 25 },
  { x: 3, y: 15 },
  { x: 4, y: 40 },
  { x: 5, y: 30 },
];

function MyChart() {
  return (
    <View style={{ height: 300 }}>
      <LineChart.Chart
        config={{
          data: data,
        }}
      />
    </View>
  );
}
\`\`\`

### Requirements

- React Native ≥ 0.79
- React ≥ 19
- iOS 12+ / Android API 21+
- Node.js ≥ 18

## Next Steps

Continue exploring the documentation to learn about:
- **Installation** - Detailed setup instructions
- **API Reference** - Complete API documentation
- **Examples** - Interactive chart examples
- **Guides** - Advanced usage and customization
`;

export const id = "getting-started";
export const title = "Getting Started";
