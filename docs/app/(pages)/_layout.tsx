import { Slot } from "expo-router";
import { ScrollView } from "react-native";

export default function PagesLayout() {
  return (
    <ScrollView
      style={{
        flexGrow: 1,
        padding: 24,
        backgroundColor: "#ffffff",
      }}
      contentContainerStyle={{
        maxWidth: 900,
        width: "100%",
        alignSelf: "center",
      }}
    >
      <Slot />
    </ScrollView>
  );
}
