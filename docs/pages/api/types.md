---
sidebar_position: 1
---

# API Reference

Complete TypeScript API documentation for expo-skia-charts.

## Components

### LineChart.Chart

Main line chart component.

```typescript
import { LineChart } from "expo-skia-charts";

<LineChart.Chart config={config} />
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `LineChartConfig` | Yes | Chart configuration object |

## Types

### LineChartConfig

Main configuration interface for the LineChart component.

```typescript
interface LineChartConfig {
  data?: DataPoint[];
  series?: SeriesConfig[];
  hover?: HoverConfig;
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  colors?: ColorConfig;
}
```

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `data` | `DataPoint[]` | No* | Data points for single line chart |
| `series` | `SeriesConfig[]` | No* | Multiple series configuration |
| `hover` | `HoverConfig` | No | Hover interaction settings |
| `xAxis` | `AxisConfig` | No | X-axis configuration |
| `yAxis` | `AxisConfig` | No | Y-axis configuration |
| `colors` | `ColorConfig` | No | Global color configuration |

*Either `data` or `series` must be provided.

### DataPoint

Represents a single data point on the chart.

```typescript
interface DataPoint {
  x: number;
  y: number;
}
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | `number` | X-axis value (timestamp for time series) |
| `y` | `number` | Y-axis value |

### SeriesConfig

Configuration for a single data series in multi-line charts.

```typescript
interface SeriesConfig {
  id: string;
  label: string;
  data: DataPoint[];
  colors?: ColorConfig;
}
```

#### Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the series |
| `label` | `string` | Yes | Display label for the series |
| `data` | `DataPoint[]` | Yes | Data points for this series |
| `colors` | `ColorConfig` | No | Colors specific to this series |

### HoverConfig

Configuration for hover interactions.

```typescript
interface HoverConfig {
  enabled?: boolean;
  showDot?: boolean;
  highlightLine?: boolean;
  tooltip?: TooltipConfig;
  onHover?: (data: DataPoint) => void;
}
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable hover interactions |
| `showDot` | `boolean` | `false` | Show dot at hovered point |
| `highlightLine` | `boolean` | `false` | Show vertical highlight line |
| `tooltip` | `TooltipConfig` | - | Tooltip configuration |
| `onHover` | `(data: DataPoint) => void` | - | Callback when hovering over a point |

### TooltipConfig

Configuration for custom tooltips.

```typescript
interface TooltipConfig {
  renderContent: (dataPoint: DataPoint) => React.ReactNode;
  snapToPoint?: boolean;
}
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `renderContent` | `(dataPoint: DataPoint) => React.ReactNode` | - | Function to render tooltip content |
| `snapToPoint` | `boolean` | `true` | Whether tooltip snaps to nearest point |

### AxisConfig

Configuration for chart axes.

```typescript
interface AxisConfig {
  enabled?: boolean;
  showGridLines?: boolean;
  gridLineColor?: string;
  color?: string;
  isTimeData?: boolean;
  formatter?: (value: number) => string;
  tickCount?: number;
}
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Show the axis |
| `showGridLines` | `boolean` | `false` | Show grid lines |
| `gridLineColor` | `string` | `'#e0e0e0'` | Color of grid lines (hex or rgba) |
| `color` | `string` | `'#000'` | Color of axis labels (hex or rgba) |
| `isTimeData` | `boolean` | `false` | Format as time series (x-axis only) |
| `formatter` | `(value: number) => string` | - | Custom label formatter function |
| `tickCount` | `number` | Auto | Number of tick marks to display |

### ColorConfig

Color configuration for chart elements.

```typescript
interface ColorConfig {
  lineBase?: string;
  highlightColor?: string;
  dotBase?: string;
}
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `lineBase` | `string` | `'#3E63DD'` | Base color for the line |
| `highlightColor` | `string` | `'#0090FF'` | Color when highlighted/hovered |
| `dotBase` | `string` | `'#3E63DD'` | Color for data point dots |

## Usage Examples

### Basic Configuration

```typescript
const config: LineChartConfig = {
  data: [
    { x: 1, y: 10 },
    { x: 2, y: 25 },
    { x: 3, y: 15 },
  ]
};
```

### With Hover

```typescript
const config: LineChartConfig = {
  data: myData,
  hover: {
    enabled: true,
    showDot: true,
    highlightLine: true,
    onHover: (dataPoint) => {
      console.log('Hovered:', dataPoint);
    }
  }
};
```

### With Custom Tooltip

```typescript
const config: LineChartConfig = {
  data: myData,
  hover: {
    enabled: true,
    showDot: true,
    tooltip: {
      renderContent: (dataPoint) => (
        <View style={{ backgroundColor: 'white', padding: 8 }}>
          <Text>{dataPoint.y.toFixed(2)}</Text>
        </View>
      ),
      snapToPoint: true
    }
  }
};
```

### With Axes

```typescript
const config: LineChartConfig = {
  data: myTimeSeriesData,
  xAxis: {
    enabled: true,
    isTimeData: true,
    showGridLines: true,
    formatter: (value) => new Date(value).toLocaleDateString()
  },
  yAxis: {
    enabled: true,
    showGridLines: true,
    formatter: (value) => `$${value.toFixed(0)}`
  }
};
```

### Multiple Series

```typescript
const config: LineChartConfig = {
  series: [
    {
      id: 'revenue',
      label: 'Revenue',
      data: revenueData,
      colors: {
        lineBase: '#9EB1FF',
        highlightColor: '#3E63DD',
        dotBase: '#0090FF'
      }
    },
    {
      id: 'expenses',
      label: 'Expenses',
      data: expensesData,
      colors: {
        lineBase: '#FFBDBD',
        highlightColor: '#E5484D',
        dotBase: '#E5484D'
      }
    }
  ],
  hover: {
    enabled: true,
    showDot: true,
    highlightLine: true
  },
  xAxis: {
    enabled: true,
    isTimeData: true,
    showGridLines: true
  },
  yAxis: {
    enabled: true,
    showGridLines: true
  }
};
```

### Custom Styling

```typescript
const config: LineChartConfig = {
  data: myData,
  colors: {
    lineBase: '#9EB1FF',
    highlightColor: '#3E63DD',
    dotBase: '#0090FF'
  },
  xAxis: {
    enabled: true,
    showGridLines: true,
    color: '#3E63DD',
    gridLineColor: '#E0E7FF'
  },
  yAxis: {
    enabled: true,
    showGridLines: true,
    color: '#3E63DD',
    gridLineColor: '#E0E7FF'
  }
};
```

## Type Guards

### isTimeSeriesData

Check if data represents a time series:

```typescript
function isTimeSeriesData(data: DataPoint[]): boolean {
  return data.every(point => point.x > 1000000000000);
}
```

## Best Practices

### TypeScript Usage

Always define your data with proper types:

```typescript
import type { DataPoint, LineChartConfig } from 'expo-skia-charts';

const data: DataPoint[] = [
  { x: 1, y: 10 },
  { x: 2, y: 25 },
];

const config: LineChartConfig = {
  data,
  // TypeScript will provide autocomplete and type checking
};
```

### Memoization

Memoize configuration objects to prevent unnecessary re-renders:

```typescript
import { useMemo } from 'react';

function MyChart() {
  const config = useMemo((): LineChartConfig => ({
    data: generateData(),
    hover: {
      enabled: true,
      showDot: true
    }
  }), []); // or include dependencies

  return <LineChart.Chart config={config} />;
}
```

### Custom Formatters

Use Intl APIs for localized formatting:

```typescript
const config: LineChartConfig = {
  data: myData,
  xAxis: {
    enabled: true,
    isTimeData: true,
    formatter: (value) => new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(value))
  },
  yAxis: {
    enabled: true,
    formatter: (value) => new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }
};
```

## Related

- [LineChart Guide](../charts/line-chart.mdx) - Feature documentation with examples
- [Examples](../charts/examples.mdx) - Interactive example gallery
