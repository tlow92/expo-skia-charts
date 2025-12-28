import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Line",
        }}
      />
      <Tabs.Screen
        name="bar"
        options={{
          title: "Bar",
        }}
      />
      <Tabs.Screen
        name="donut"
        options={{
          title: "Donut",
        }}
      />
    </Tabs>
  );
}
