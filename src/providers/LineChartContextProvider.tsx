import { createContext, type PropsWithChildren, useContext } from "react";
import type { SharedValue } from "react-native-reanimated";
import type { LineChartConfig } from "../components/line/types";

type Size = {
  width: number;
  height: number;
};

export type LineChartContextType = {
  size: Size;
  x: SharedValue<number>;
  y: SharedValue<number>;
  config: LineChartConfig;
};

const LineChartContext = createContext<LineChartContextType | null>(null);

type Props = {
  value: LineChartContextType;
};

export const useLineChartContext = () => {
  const context = useContext(LineChartContext);

  if (!context) {
    throw new Error("Component used outside of LineChartContextProvider");
  }

  return context;
};

export const LineChartContextProvider = ({
  children,
  value,
}: PropsWithChildren<Props>) => (
  <LineChartContext.Provider value={value}>{children}</LineChartContext.Provider>
);
