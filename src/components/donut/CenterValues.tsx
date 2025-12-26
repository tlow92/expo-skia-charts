import { Group, Paint, Paragraph, Skia, TextAlign } from "@shopify/react-native-skia";
import { useMemo } from "react";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue } from "react-native-reanimated";
import { useDonutChartContext } from "../../providers/DonutChartContextProvider";
import { useRobotoFontManager } from "../../utils/useCustomFont";

export function CenterValues() {
  const { size, config, animationProgress, chartData, hoveredIndex } =
    useDonutChartContext();
  const robotoFont = useRobotoFontManager();

  const centerValuesConfig = config.centerValues;
  const updateCenterOnHover = config.hover?.updateCenterOnHover ?? false;
  const strokeWidth = config.strokeWidth ?? 30;

  // Calculate total value
  const totalValue = useMemo(() => {
    return config.data.reduce((sum, item) => sum + item.value, 0);
  }, [config.data]);

  // Calculate font size based on chart size
  const fontSize = useMemo(() => {
    const minDimension = Math.min(size.width, size.height);
    const innerRadius = minDimension / 2 - strokeWidth;
    // Font size is approximately 20-25% of inner diameter
    return Math.max(16, Math.min(48, innerRadius * 0.4));
  }, [size.width, size.height, strokeWidth]);

  // Create paragraphs for all possible values (total + each segment)
  const valueParagraphs = useMemo(() => {
    if (!robotoFont) return [];
    const paragraphStyle = {
      textAlign: TextAlign.Center,
    };
    const textStyle = {
      color: Skia.Color("#1F2937"),
      fontSize,
      fontStyle: {
        weight: 700,
      },
    };

    const paragraphs = [];

    // Always create total value paragraph
    const totalBuilder = Skia.ParagraphBuilder.Make(paragraphStyle, robotoFont);
    totalBuilder.pushStyle(textStyle);
    totalBuilder.addText(totalValue.toLocaleString());
    totalBuilder.pop();
    const totalParagraph = totalBuilder.build();
    totalParagraph.layout(200);
    paragraphs.push({ value: totalValue, paragraph: totalParagraph, index: -1 });

    // Only create segment value paragraphs if updateCenterOnHover is enabled
    if (updateCenterOnHover) {
      for (const segment of chartData) {
        const segmentBuilder = Skia.ParagraphBuilder.Make(paragraphStyle, robotoFont);
        segmentBuilder.pushStyle(textStyle);
        segmentBuilder.addText(segment.value.toLocaleString());
        segmentBuilder.pop();
        const segmentParagraph = segmentBuilder.build();
        segmentParagraph.layout(200);
        paragraphs.push({
          value: segment.value,
          paragraph: segmentParagraph,
          index: segment.index,
        });
      }
    }

    return paragraphs;
  }, [totalValue, chartData, robotoFont, updateCenterOnHover, fontSize]);

  const percentageParagraphs = useMemo(() => {
    if (!robotoFont || !updateCenterOnHover) return [];
    const paragraphStyle = {
      textAlign: TextAlign.Center,
    };
    // Make percentage font size relative to value font size (40% of value size)
    const percentageFontSize = fontSize * 0.4;
    const textStyle = {
      color: Skia.Color("#6B7280"),
      fontSize: percentageFontSize,
    };

    const paragraphs = [];

    // Create percentage paragraph for each segment
    for (const segment of chartData) {
      const builder = Skia.ParagraphBuilder.Make(paragraphStyle, robotoFont);
      builder.pushStyle(textStyle);
      builder.addText(`${(segment.percentage * 100).toFixed(1)}%`);
      builder.pop();
      const paragraph = builder.build();
      paragraph.layout(100);
      paragraphs.push({
        percentage: segment.percentage,
        paragraph,
        index: segment.index,
      });
    }

    return paragraphs;
  }, [chartData, robotoFont, updateCenterOnHover, fontSize]);

  if (!centerValuesConfig || centerValuesConfig.enabled === false) {
    return null;
  }

  // If custom renderContent is provided, we can't render it in Canvas
  // It should be rendered outside as a positioned View
  // For now, we'll just use default rendering
  if (centerValuesConfig.renderContent) {
    // Custom rendering not supported in Skia Canvas
    // Would need to be rendered outside as React Native View
    return null;
  }

  if (valueParagraphs.length === 0) {
    return null;
  }

  return (
    <>
      {/* Render all value paragraphs, show appropriate one based on hover */}
      {valueParagraphs.map((item) => (
        <ValueParagraph
          key={`value-${item.index}`}
          item={item}
          size={size}
          animationProgress={animationProgress}
          hoveredIndex={hoveredIndex}
          updateCenterOnHover={updateCenterOnHover}
        />
      ))}

      {/* Render percentage paragraphs when updateCenterOnHover is enabled */}
      {updateCenterOnHover &&
        percentageParagraphs.map((item) => (
          <PercentageParagraph
            key={`percentage-${item.index}`}
            item={item}
            size={size}
            animationProgress={animationProgress}
            hoveredIndex={hoveredIndex}
          />
        ))}
    </>
  );
}

type ValueParagraphProps = {
  item: {
    value: number;
    paragraph: ReturnType<ReturnType<typeof Skia.ParagraphBuilder.Make>["build"]>;
    index: number;
  };
  size: { width: number; height: number };
  animationProgress: SharedValue<number>;
  hoveredIndex: SharedValue<number | null>;
  updateCenterOnHover: boolean;
};

function ValueParagraph({
  item,
  size,
  animationProgress,
  hoveredIndex,
  updateCenterOnHover,
}: ValueParagraphProps) {
  const opacity = useDerivedValue(() => {
    "worklet";
    const baseOpacity = animationProgress.value;

    // If not updating on hover, only show total (index -1)
    if (!updateCenterOnHover) {
      return item.index === -1 ? baseOpacity : 0;
    }

    // If updating on hover
    const hovered = hoveredIndex.value;

    // No hover: show total
    if (hovered === null || hovered === undefined) {
      return item.index === -1 ? baseOpacity : 0;
    }

    // Hovering: show the hovered segment's value
    return item.index === hovered ? baseOpacity : 0;
  });

  const centerValueX = size.width / 2 - item.paragraph.getMaxWidth() / 2;
  // Always center the value text vertically
  const centerValueY = size.height / 2 - item.paragraph.getHeight() / 2;

  return (
    <Group layer={<Paint opacity={opacity} />}>
      <Paragraph
        paragraph={item.paragraph}
        x={centerValueX}
        y={centerValueY}
        width={200}
      />
    </Group>
  );
}

type PercentageParagraphProps = {
  item: {
    percentage: number;
    paragraph: ReturnType<ReturnType<typeof Skia.ParagraphBuilder.Make>["build"]>;
    index: number;
  };
  size: { width: number; height: number };
  animationProgress: SharedValue<number>;
  hoveredIndex: SharedValue<number | null>;
};

function PercentageParagraph({
  item,
  size,
  animationProgress,
  hoveredIndex,
}: PercentageParagraphProps) {
  const opacity = useDerivedValue(() => {
    "worklet";
    const baseOpacity = animationProgress.value;
    const hovered = hoveredIndex.value;

    // Only show percentage when hovering over this specific segment
    if (hovered === null || hovered === undefined) return 0;
    return item.index === hovered ? baseOpacity : 0;
  });

  const percentageX = size.width / 2 - item.paragraph.getMaxWidth() / 2;
  // Position percentage below center with increased spacing (30px below center point)
  const percentageY = size.height / 2 + 30;

  return (
    <Group layer={<Paint opacity={opacity} />}>
      <Paragraph paragraph={item.paragraph} x={percentageX} y={percentageY} width={100} />
    </Group>
  );
}
