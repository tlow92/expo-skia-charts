import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Navigation } from "../components/Navigation";
import "react-native-reanimated";

export default function RootLayout() {
  const isDesktop = Platform.OS === "web" && Dimensions.get("window").width > 768;

  return (
    <ThemeProvider value={DefaultTheme}>
      <View style={styles.container}>
        {isDesktop && <Navigation />}
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
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="getting-started" />
            <Stack.Screen name="installation" />
            <Stack.Screen name="api-reference" />
            <Stack.Screen name="examples" />
            <Stack.Screen name="guides" />
          </Stack>
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: "row",
  },
  content: {
    flexGrow: 1,
  },
});
