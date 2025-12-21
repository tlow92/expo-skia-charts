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

### Using npm

\`\`\`bash
npm install expo-skia-charts @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
\`\`\`

### Using Yarn

\`\`\`bash
yarn add expo-skia-charts @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
\`\`\`

### Using Expo

If you're using Expo:

\`\`\`bash
npx expo install expo-skia-charts @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
\`\`\`

## Platform-Specific Setup

### iOS

After installing, run pod install:

\`\`\`bash
cd ios && pod install && cd ..
\`\`\`

### Android

No additional setup required for Android.

### Web

For web support, you need to configure your bundler to handle React Native web and Skia's CanvasKit. Follow the [@shopify/react-native-skia web setup guide](https://shopify.github.io/react-native-skia/docs/getting-started/web).

**Install additional dependencies:**

\`\`\`bash
npm install react-native-web canvaskit-wasm
\`\`\`

**Configure webpack** to alias \`react-native\` to \`react-native-web\`.

## Configure react-native-reanimated

Add the Reanimated Babel plugin to your \`babel.config.js\`:

\`\`\`javascript
module.exports = {
  presets: [
    // ... your other presets
  ],
  plugins: [
    // ... your other plugins
    'react-native-reanimated/plugin', // Must be last!
  ],
};
\`\`\`

**Important**: The Reanimated plugin must be listed **last** in the plugins array.

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

## Troubleshooting

### Metro bundler issues

If you encounter bundling issues, try clearing the Metro cache:

\`\`\`bash
npx react-native start --reset-cache
\`\`\`

### iOS build errors

If you get build errors on iOS:

1. Clean the build folder: \`cd ios && xcodebuild clean && cd ..\`
2. Reinstall pods: \`cd ios && rm -rf Pods Podfile.lock && pod install && cd ..\`
3. Try building again

### Web rendering issues

If charts don't render on web:

1. Ensure \`canvaskit-wasm\` is installed
2. Check that your webpack configuration includes the react-native-web alias
3. Verify the Reanimated Babel plugin is configured correctly

### Version conflicts

If you encounter peer dependency warnings or conflicts:

1. Check that you're using React ≥ 19 and React Native ≥ 0.79
2. Ensure all peer dependencies match the required versions
3. Try using \`npm install --legacy-peer-deps\` or \`yarn install --ignore-engines\` if necessary
`;

export const id = "installation";
export const title = "Installation";
