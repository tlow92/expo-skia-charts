export const content = `
# Guides

Advanced usage guides and best practices for expo-skia-charts.

## Custom Tooltips

Learn how to create custom tooltip components that display rich information when users interact with your charts.

### Basic Custom Tooltip

Create a simple custom tooltip with formatted text:

\`\`\`typescript
const config = {
  data: myData,
  hover: {
    enabled: true,
    showDot: true,
    tooltip: {
      renderContent: (dataPoint) => (
        <View style={{ backgroundColor: 'white', padding: 8, borderRadius: 4 }}>
          <Text style={{ fontSize: 12, color: '#666' }}>
            {new Date(dataPoint.x).toLocaleDateString()}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            {dataPoint.y.toFixed(2)}
          </Text>
        </View>
      ),
      snapToPoint: true
    }
  }
};
\`\`\`

### Rich Tooltip with Multiple Values

For multi-line charts, show data from all series:

\`\`\`typescript
tooltip: {
  renderContent: (dataPoint) => (
    <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', padding: 12, borderRadius: 6 }}>
      <Text style={{ color: 'white', fontSize: 12, marginBottom: 4 }}>
        {formatDate(dataPoint.x)}
      </Text>
      {series.map(s => (
        <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 10, height: 10, backgroundColor: s.color, marginRight: 6 }} />
          <Text style={{ color: 'white' }}>{s.label}: {s.valueAt(dataPoint.x)}</Text>
        </View>
      ))}
    </View>
  )
}
\`\`\`

## Theming and Customization

### Color Schemes

Apply consistent color schemes across your charts:

\`\`\`typescript
const blueTheme: ColorConfig = {
  lineBase: '#9EB1FF',
  highlightColor: '#3E63DD',
  dotBase: '#0090FF',
};

const redTheme: ColorConfig = {
  lineBase: '#FFBDBD',
  highlightColor: '#E5484D',
  dotBase: '#E5484D',
};
\`\`\`

### Dark Mode Support

Adjust colors based on color scheme:

\`\`\`typescript
const isDark = useColorScheme() === 'dark';

const colors: ColorConfig = {
  lineBase: isDark ? '#7DD3FC' : '#3E63DD',
  highlightColor: isDark ? '#06B6D4' : '#0090FF',
  dotBase: isDark ? '#22D3EE' : '#3E63DD',
};
\`\`\`

### Axis Styling

Customize axis appearance:

\`\`\`typescript
xAxis: {
  enabled: true,
  showGridLines: true,
  color: isDark ? '#94A3B8' : '#475569',
  gridLineColor: isDark ? '#334155' : '#E2E8F0',
}
\`\`\`

## Performance Optimization

### Memoization

Always memoize chart data and configuration:

\`\`\`typescript
import { useMemo } from 'react';

function MyChart() {
  const data = useMemo(() => {
    return generateChartData(); // Expensive operation
  }, [dependencies]);

  const config = useMemo(() => ({
    data,
    hover: { enabled: true }
  }), [data]);

  return <LineChart.Chart config={config} />;
}
\`\`\`

### Data Point Limits

For optimal performance:
- Keep data points under 1000 for smooth animations
- Use data decimation for larger datasets
- Consider pagination or time-range filtering

### Tooltip Optimization

Keep tooltip components lightweight:

\`\`\`typescript
// Good - Simple and fast
tooltip: {
  renderContent: (d) => (
    <View style={styles.tooltip}>
      <Text>{d.y.toFixed(2)}</Text>
    </View>
  )
}

// Avoid - Complex calculations in render
tooltip: {
  renderContent: (d) => (
    <View>
      {heavyCalculation(d)} {/* Don't do this! */}
    </View>
  )
}
\`\`\`

## Web Deployment

### Build Configuration

When deploying to web, ensure proper configuration:

1. **Install web dependencies:**
   \`\`\`bash
   yarn add react-native-web canvaskit-wasm
   \`\`\`

2. **Configure webpack** to handle React Native Web

3. **Load Skia for web:**
   \`\`\`typescript
   import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

   LoadSkiaWeb({
     locateFile: () => "/canvaskit.wasm"
   }).then(() => {
     // Render app
   });
   \`\`\`

### Expo Web Export

For Expo projects:

\`\`\`bash
expo export -p web
\`\`\`

This generates a static site in the \`dist\` folder ready for deployment.

### GitHub Pages Deployment

Deploy your documentation site:

\`\`\`bash
# Install gh-pages
yarn add -D gh-pages

# Add script to package.json
"docs:deploy": "expo export -p web && gh-pages -d dist"

# Deploy
yarn docs:deploy
\`\`\`

## Advanced Patterns

### Dynamic Data Updates

Update chart data in real-time:

\`\`\`typescript
function LiveChart() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => [
        ...prev.slice(1),
        { x: Date.now(), y: Math.random() * 100 }
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <LineChart.Chart config={{ data }} />;
}
\`\`\`

### Responsive Charts

Adapt chart sizing to screen size:

\`\`\`typescript
import { useWindowDimensions } from 'react-native';

function ResponsiveChart() {
  const { width } = useWindowDimensions();
  const height = width > 768 ? 400 : 250;

  return (
    <View style={{ height }}>
      <LineChart.Chart config={config} />
    </View>
  );
}
\`\`\`

### Multi-Chart Synchronization

Synchronize hover state across multiple charts:

\`\`\`typescript
function SynchronizedCharts() {
  const [hoveredX, setHoveredX] = useState<number | null>(null);

  const onHover = (data: DataPoint) => setHoveredX(data.x);

  return (
    <>
      <LineChart.Chart config={{ data: data1, hover: { onHover } }} />
      <LineChart.Chart config={{ data: data2, hover: { onHover } }} />
    </>
  );
}
\`\`\`
`;

export const id = "guides";
export const title = "Guides";
