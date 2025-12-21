import { useMemo } from "react";
import { Line } from "./Line";
import type { LineSeriesData } from "./types";
import { calculateUnifiedDomain } from "./utils";

interface MultiLineProps {
  series: LineSeriesData[];
}

/**
 * Renders multiple line series on a single chart.
 * All lines share the same unified domain (scale) for consistency.
 */
export function MultiLine({ series }: MultiLineProps) {
  // Calculate unified domain across all series
  const domain = useMemo(() => calculateUnifiedDomain(series), [series]);

  return (
    <>
      {series.map((seriesData) => (
        <Line
          key={seriesData.id}
          data={seriesData.data}
          colors={seriesData.colors}
          strokeWidth={seriesData.strokeWidth}
          domain={domain}
        />
      ))}
    </>
  );
}
