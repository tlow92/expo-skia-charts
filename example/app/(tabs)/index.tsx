import { Canvas, Rect } from "@shopify/react-native-skia";
import { View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={100} height={100} color="red" />
      </Canvas>
    </View>
  );
}
