import { useFonts } from "@shopify/react-native-skia";
import { Platform } from "react-native";

export function useRobotoFontManager() {
  const customFontMgr = useFonts({
    Roboto: [
      Platform.OS === "web"
        ? { default: require("../assets/Roboto-Regular.ttf") }
        : require("../assets/Roboto-Regular.ttf"),
    ],
  });
  return customFontMgr;
}
