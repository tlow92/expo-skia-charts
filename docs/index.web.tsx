import "@expo/metro-runtime";
import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";

import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

export function App() {
  // @ts-ignore
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

LoadSkiaWeb({ locateFile: () => "/canvaskit.wasm" }).then(async () => {
  registerRootComponent(App);
});
