import { createContext, type PropsWithChildren, useContext } from "react";
import type { SharedValue } from "react-native-reanimated";
import type { DonutChartConfig, ProcessedSegment } from "../components/donut/types";

type Size = {
  width: number;
  height: number;
};

export type DonutChartContextType = {
  size: Size;
  hoveredIndex: SharedValue<number | null>;
  config: DonutChartConfig;
  chartData: ProcessedSegment[];
  animationProgress: SharedValue<number>;
};

const DonutChartContext = createContext<DonutChartContextType | null>(null);

type Props = {
  value: DonutChartContextType;
};

export const useDonutChartContext = () => {
  const context = useContext(DonutChartContext);

  if (!context) {
    throw new Error("Component used outside of DonutChartContextProvider");
  }

  return context;
};

export const DonutChartContextProvider = ({
  children,
  value,
}: PropsWithChildren<Props>) => (
  <DonutChartContext.Provider value={value}>{children}</DonutChartContext.Provider>
);
