import { createContext, type PropsWithChildren, useContext } from "react";
import type { SharedValue } from "react-native-reanimated";
import type { BarChartConfig, BarLayout, HoveredBarInfo } from "../components/bar/types";

type Size = {
  width: number;
  height: number;
};

export type BarChartContextType = {
  size: Size;
  config: BarChartConfig;
  bars: BarLayout[];
  hoveredBar: SharedValue<HoveredBarInfo | null>;
  animationProgress: SharedValue<number>;
};

const BarChartContext = createContext<BarChartContextType | null>(null);

type Props = {
  value: BarChartContextType;
};

export const useBarChartContext = () => {
  const context = useContext(BarChartContext);

  if (!context) {
    throw new Error("Component used outside of BarChartContextProvider");
  }

  return context;
};

export const BarChartContextProvider = ({
  children,
  value,
}: PropsWithChildren<Props>) => (
  <BarChartContext.Provider value={value}>{children}</BarChartContext.Provider>
);
