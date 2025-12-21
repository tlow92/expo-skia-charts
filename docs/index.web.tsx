import "@expo/metro-runtime";

import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

LoadSkiaWeb({ locateFile: () => "/canvaskit.wasm" }).then(async () => {
  registerRootComponent(App);
});
