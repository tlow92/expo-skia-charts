# expo-skia-charts

Collection of modern performant charts for iOS/Android/Web using skia

## Requirements

We built on top of the following libraries:

- react-native-skia
- react-native-reanimated
- - react-native-worklets
- react-native-gesture-handler

If you don't have them installed yet, you can install them with the following command:

```sh
npx expo install @shopify/react-native-skia react-native-reanimated react-native-worklets react-native-gesture-handler
```

If you have not added react-native-skia before, [note this for web](https://shopify.github.io/react-native-skia/docs/getting-started/web#manual-configuration)

[Also note react-native-skia compatibility: react-native@>=0.79 and react@>=19](https://shopify.github.io/react-native-skia/docs/getting-started/installation)

We support the following platforms:

- iOS
- Android
- Web

## Installation

```sh
npm install expo-skia-charts
```

## Usage

```js
import { multiply } from "expo-skia-charts";

// ...

const result = await multiply(3, 7);
```

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
