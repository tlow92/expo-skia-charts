# expo-skia-charts

Modern, performant, and highly customizable chart library for React Native built with Skia. Supports iOS, Android, and Web with smooth animations and interactive features.

## Features

- **High Performance**: Built on top of react-native-skia for native rendering performance
- **Smooth Animations**: Powered by react-native-reanimated for 60fps animations
- **Interactive**: Touch and hover interactions with customizable tooltips
- **Cross-Platform**: Works on iOS, Android, and Web
- **TypeScript**: Full TypeScript support with comprehensive type definitions
- **Customizable**: Extensive configuration options for styling and behavior

## Available Charts

- **LineChart**: Single and multi-line charts with smooth curves, axes, grid lines, and interactive tooltips
- **DonutChart**: Donut and pie charts with hover effects, legends, custom center values, and segment gaps

## Requirements

This library is built on top of the following peer dependencies:

- `@shopify/react-native-skia`
- `react-native-reanimated`
- `react-native-worklets`
- `react-native-gesture-handler`

**Important**: react-native-skia requires `react-native@>=0.79` and `react@>=19`. See the [compatibility documentation](https://shopify.github.io/react-native-skia/docs/getting-started/installation) for details.

### Installing Dependencies

If you don't have the required dependencies installed yet:

```sh
npx expo install @shopify/react-native-skia react-native-reanimated react-native-worklets react-native-gesture-handler
```

**Web Setup**: If you haven't used react-native-skia before, follow the [manual web configuration guide](https://shopify.github.io/react-native-skia/docs/getting-started/web#manual-configuration).

## Installation

```sh
npm install expo-skia-charts
# or
yarn add expo-skia-charts
```

## Usage

### LineChart

```tsx
import { LineChart } from "expo-skia-charts";

function MyChart() {
  const data = [
    { x: 1, y: 20 },
    { x: 2, y: 35 },
    { x: 3, y: 25 },
    { x: 4, y: 45 },
    { x: 5, y: 30 },
  ];

  return (
    <View style={{ height: 300 }}>
      <LineChart
        config={{
          series: [
            {
              id: "series1",
              label: "Revenue",
              data: data,
            },
          ],
          xAxis: { enabled: true },
          yAxis: { enabled: true, showGridLines: true },
          hover: { enabled: true, showDot: true },
        }}
      />
    </View>
  );
}
```

### DonutChart

```tsx
import { DonutChart } from "expo-skia-charts";

function MyChart() {
  const data = [
    { label: "Design", value: 50000 },
    { label: "Development", value: 25000 },
    { label: "Marketing", value: 10000 },
  ];

  return (
    <View style={{ height: 350 }}>
      <DonutChart
        config={{
          data: data,
          strokeWidth: 25,
          gap: 5,
          roundedCorners: true,
          centerValues: { enabled: true },
          legend: { enabled: true },
          hover: { enabled: true, animateOnHover: true },
        }}
      />
    </View>
  );
}
```

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
