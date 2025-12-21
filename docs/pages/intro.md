---
sidebar_position: 1
---

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

More chart types coming soon!

## Quick Start

Get up and running with expo-skia-charts in minutes.

### Installation

Install the library and its peer dependencies:

```bash
npm install expo-skia-charts @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
```

Or with Yarn:

```bash
yarn add expo-skia-charts @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
```

For detailed installation instructions, see the [Installation Guide](./installation.md).

### Basic Usage

Here's a simple example to get you started:

```typescript
import { LineChart } from "expo-skia-charts";

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
```

### Next Steps

- **[Installation](./installation.md)** - Detailed setup instructions
- **[LineChart](./charts/line-chart.mdx)** - Learn about LineChart features and options
- **[Examples](./charts/examples.mdx)** - Browse interactive examples

## Requirements

- React Native ≥ 0.79
- React ≥ 19
- iOS 12+ / Android API 21+
- Node.js ≥ 18

## Support

- [GitHub Issues](https://github.com/tlow92/expo-skia-charts/issues) - Report bugs and request features
- [GitHub Discussions](https://github.com/tlow92/expo-skia-charts/discussions) - Ask questions and share ideas
- [npm](https://www.npmjs.com/package/expo-skia-charts) - Package page
