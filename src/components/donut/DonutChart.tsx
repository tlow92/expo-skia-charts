import type { LayoutChangeEvent } from "react-native";
import { Platform, StyleSheet, Text, View } from "react-native";
import {
  Canvas,
  Paragraph,
  Path,
  Skia,
  TextAlign,
  useFonts,
} from "@shopify/react-native-skia";
import { useMemo, useState } from "react";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";

export type DonutChartDataPoint = {
  label: string;
  value: number;
};

export type DonutChartProps = {
  data: DonutChartDataPoint[];
  colors?: string[];
  strokeWidth?: number;
  showLabels?: boolean;
  showCenterValue?: boolean;
  animationDuration?: number;
};

const DEFAULT_COLORS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#6B7280", // Gray
  "#10B981", // Green
  "#F59E0B", // Amber
];

export function DonutChart({
  data,
  colors = DEFAULT_COLORS,
  strokeWidth = 40,
  showLabels = true,
  showCenterValue = true,
  animationDuration = 1000,
}: DonutChartProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const customFontMgr = useFonts({
    Roboto: [
      Platform.OS === "web"
        ? { default: require("../../assets/Roboto-Regular.ttf") }
        : require("../../assets/Roboto-Regular.ttf"),
    ],
  });
  // Animation values
  const animationProgress = useSharedValue(0);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
    // Start animation when layout is complete
    animationProgress.value = withTiming(1, {
      duration: animationDuration,
      easing: Easing.out(Easing.cubic),
    });
  };

  const chartData = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) {
      return [];
    }

    let currentAngle = -90; // Start from top
    return data.map((item, index) => {
      const percentage = item.value / total;
      const sweepAngle = percentage * 360;
      const segment = {
        ...item,
        percentage,
        startAngle: currentAngle,
        sweepAngle,
        color: colors[index % colors.length] ?? DEFAULT_COLORS[0],
        index,
      };
      currentAngle += sweepAngle;
      return segment;
    });
  }, [data, colors]);

  const paths = useMemo(() => {
    if (size.width === 0 || size.height === 0 || chartData.length === 0) {
      return [];
    }

    const centerX = size.width / 2;
    const centerY = size.height / 2;
    const radius = Math.min(size.width, size.height) / 2 - strokeWidth / 2 - 10;

    return chartData.map((segment) => {
      const path = Skia.Path.Make();
      const rect = Skia.XYWHRect(
        centerX - radius,
        centerY - radius,
        radius * 2,
        radius * 2
      );

      path.addArc(rect, segment.startAngle, segment.sweepAngle);

      return {
        path,
        color: segment.color,
        index: segment.index,
        startAngle: segment.startAngle,
        sweepAngle: segment.sweepAngle,
      };
    });
  }, [size, chartData, strokeWidth]);

  // Calculate total value
  const totalValue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  // Gesture handling for hover effect
  const gesture = Gesture.Pan()
    .onBegin((e) => {
      const centerX = size.width / 2;
      const centerY = size.height / 2;
      const dx = e.x - centerX;
      const dy = e.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = Math.min(size.width, size.height) / 2 - strokeWidth / 2;

      // Check if touch is within the donut ring
      if (distance < radius + strokeWidth / 2 && distance > radius - strokeWidth / 2) {
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        if (angle < 0) {
          angle += 360;
        }

        // Find which segment was touched
        for (let i = 0; i < chartData.length; i++) {
          const segment = chartData[i];
          if (!segment) {
            continue;
          }
          let startAngle = segment.startAngle + 90;
          let endAngle = startAngle + segment.sweepAngle;

          // Normalize angles
          if (startAngle < 0) {
            startAngle += 360;
          }
          if (endAngle < 0) {
            endAngle += 360;
          }

          if (
            (angle >= startAngle && angle <= endAngle) ||
            (endAngle > 360 && angle >= startAngle - 360 && angle <= endAngle - 360)
          ) {
            setHoveredIndex(i);
            return;
          }
        }
      }

      setHoveredIndex(null);
    })
    .onUpdate((e) => {
      const centerX = size.width / 2;
      const centerY = size.height / 2;
      const dx = e.x - centerX;
      const dy = e.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius = Math.min(size.width, size.height) / 2 - strokeWidth / 2;

      if (distance < radius + strokeWidth / 2 && distance > radius - strokeWidth / 2) {
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        if (angle < 0) {
          angle += 360;
        }

        for (let i = 0; i < chartData.length; i++) {
          const segment = chartData[i];
          if (!segment) {
            continue;
          }
          let startAngle = segment.startAngle + 90;
          let endAngle = startAngle + segment.sweepAngle;

          if (startAngle < 0) {
            startAngle += 360;
          }
          if (endAngle < 0) {
            endAngle += 360;
          }

          if (
            (angle >= startAngle && angle <= endAngle) ||
            (endAngle > 360 && angle >= startAngle - 360 && angle <= endAngle - 360)
          ) {
            if (hoveredIndex !== i) {
              setHoveredIndex(i);
            }
            return;
          }
        }
      }

      if (hoveredIndex !== null) {
        setHoveredIndex(null);
      }
    })
    .onEnd(() => {
      if (hoveredIndex !== null) {
        setHoveredIndex(null);
      }
    });

  // Create paragraphs for center text
  const centerValueParagraph = useMemo(() => {
    if (!customFontMgr) return null;
    const paragraphStyle = {
      textAlign: TextAlign.Center,
    };
    const textStyle = {
      color: Skia.Color("#1F2937"),
      fontSize: 32,
      fontStyle: {
        weight: 700,
      },
    };

    const builder = Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr);
    builder.pushStyle(textStyle);
    builder.addText(totalValue.toLocaleString());
    builder.pop();
    const paragraph = builder.build();
    paragraph.layout(200);
    return paragraph;
  }, [totalValue]);

  const percentageParagraph = useMemo(() => {
    if (!customFontMgr) return null;
    const paragraphStyle = {
      textAlign: TextAlign.Center,
    };
    const textStyle = {
      color: Skia.Color("#6B7280"),
      fontSize: 14,
    };

    const builder = Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr);
    builder.pushStyle(textStyle);
    builder.addText("▲ 6%");
    builder.pop();
    const paragraph = builder.build();
    paragraph.layout(100);
    return paragraph;
  }, []);

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <GestureDetector gesture={gesture}>
          <View onLayout={onLayout} style={styles.chartContainer}>
            {size.width > 0 && size.height > 0 && (
              <>
                <Canvas style={{ width: size.width, height: size.height }}>
                  {paths.map((pathData, index) => {
                    const segment = chartData[index];
                    if (!segment) {
                      return null;
                    }

                    return (
                      <Path
                        key={index}
                        path={pathData.path}
                        style="stroke"
                        color={pathData.color}
                        strokeWidth={strokeWidth}
                        strokeCap="butt"
                        end={animationProgress}
                      />
                    );
                  })}

                  {showCenterValue && centerValueParagraph && percentageParagraph && (
                    <>
                      <Paragraph
                        paragraph={centerValueParagraph}
                        x={size.width / 2 - centerValueParagraph.getLongestLine() / 2}
                        y={size.height / 2 - centerValueParagraph.getHeight() - 5}
                        width={200}
                        opacity={animationProgress}
                      />
                      <Paragraph
                        paragraph={percentageParagraph}
                        x={size.width / 2 - percentageParagraph.getLongestLine() / 2}
                        y={size.height / 2 + 10}
                        width={100}
                        opacity={animationProgress}
                      />
                    </>
                  )}
                </Canvas>

                {showLabels && (
                  <View style={styles.legendContainer}>
                    {chartData.map((segment, index) => (
                      <View key={index} style={styles.legendItem}>
                        <View
                          style={[styles.legendColor, { backgroundColor: segment.color }]}
                        />
                        <Text style={styles.legendText}>{segment.label}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gestureContainer: {
    flex: 1,
  },
  chartContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  legendContainer: {
    marginLeft: 20,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#1F2937",
  },
});
