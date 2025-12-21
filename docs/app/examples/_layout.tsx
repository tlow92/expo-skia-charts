import { Stack } from "expo-router";

export default function ExamplesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Examples" }} />
      <Stack.Screen name="line-chart" options={{ title: "LineChart Examples" }} />
      <Stack.Screen name="donut-chart" options={{ title: "DonutChart Examples" }} />
    </Stack>
  );
}
