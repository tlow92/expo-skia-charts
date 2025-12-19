# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`expo-skia-charts` is a React Native library providing performant charts for iOS, Android, and Web using Skia graphics. The project is structured as a Yarn monorepo with:
- Library source in `src/` (TypeScript)
- Example app in `example/` (Expo Router-based React Native app)

## Dependencies

The library requires these peer dependencies:
- `@shopify/react-native-skia` - for Skia-based rendering
- `react-native-reanimated` - for smooth animations
- `react-native-worklets` - for high-performance JavaScript execution
- `react-native-gesture-handler` - for gesture interactions

Note: `react-native-skia` requires react-native@>=0.79 and react@>=19. For web support, follow the [manual web configuration](https://shopify.github.io/react-native-skia/docs/getting-started/web#manual-configuration).

## Development Commands

### Setup
```bash
yarn                    # Install dependencies (must use Yarn due to workspaces)
```

### Building
```bash
yarn prepare            # Build library using react-native-builder-bob
yarn clean              # Clean build artifacts
```

**IMPORTANT**: Do NOT run `yarn prepare` after every change. The example app uses the local source directly via workspace resolution, so changes are picked up immediately without building. Only run `yarn prepare` when:
- Preparing for publishing
- Testing the built output specifically
- Explicitly requested by the developer

### Type Checking and Testing
```bash
yarn typecheck          # Run TypeScript compiler
yarn test               # Run Jest tests
```

### Example App
```bash
yarn example start      # Start Metro bundler
yarn example android    # Run on Android
yarn example ios        # Run on iOS
yarn example web        # Run on Web
yarn example lint       # Lint example app
```

### Publishing
```bash
yarn release            # Run release-it for versioning and publishing
```

## Architecture

### Build Configuration
- Built with `react-native-builder-bob` targeting:
  - ESM modules output to `lib/module/`
  - TypeScript declarations output to `lib/typescript/`
- Build uses `tsconfig.build.json` which excludes `example/` and `lib/`
- TypeScript configured with strict mode and extensive compiler checks

### Monorepo Structure
- Root `package.json` manages library package
- `example/` workspace contains Expo-based demo app
- Example app uses local library source via workspace resolution

### Example App Architecture
- Built with Expo SDK ~54
- Uses Expo Router for file-based routing
- Tab-based navigation in `app/(tabs)/`
- Currently demonstrates basic Skia canvas rendering

### Code Quality
- **Linting**: Uses Biome for linting and formatting
  - Line width: 90 characters
  - 2-space indentation
  - Double quotes for JSX, ES5 trailing commas
  - Semicolons required
- **Git Hooks**: Lefthook enforces:
  - Pre-commit: TypeScript type checking on staged files
  - Commit-msg: Conventional commit validation
- **Commit Convention**: Uses Angular conventional commits (feat:, fix:, refactor:, docs:, test:, chore:)

### Font Rendering (Cross-Platform)

When rendering text with react-native-skia, use the **Paragraph API** with `useFonts` for cross-platform compatibility (iOS, Android, and Web). DO NOT use `matchFont` or `Text` component directly as they don't work on Web.

**Correct approach:**
```typescript
import { Paragraph, Skia, TextAlign, useFonts } from "@shopify/react-native-skia";
import { Platform } from "react-native";

// Load fonts with platform-specific format for web
const customFontMgr = useFonts({
  Roboto: [
    Platform.OS === "web"
      ? { default: require("../../assets/Roboto-Regular.ttf") }
      : require("../../assets/Roboto-Regular.ttf"),
  ],
});

// Build paragraph
const paragraphStyle = { textAlign: TextAlign.Center };
const textStyle = {
  color: Skia.Color("#666"),
  fontSize: 12,
};

const builder = Skia.ParagraphBuilder.Make(paragraphStyle, customFontMgr);
builder.pushStyle(textStyle);
builder.addText("Label text");
builder.pop();
const paragraph = builder.build();
paragraph.layout(100); // width

// Render
<Paragraph paragraph={paragraph} x={0} y={0} width={100} />
```

**Key points:**
- Font files are in `src/assets/` (currently: `Roboto-Regular.ttf`)
- Web requires `{ default: require(...) }` format, native platforms use `require(...)` directly
- Always wrap paragraph building in try-catch for graceful degradation
- Check if `customFontMgr` is loaded before building paragraphs
- Call `paragraph.layout(width)` before rendering

## File Organization

The project follows a consistent structure for organizing chart components:

```
src/
  components/
    [chart-name]/
      Chart.tsx              # Main container: canvas, layout, gestures
      [ChartName].tsx        # Rendering component using Skia primitives
      types.ts               # TypeScript types for config and data
      utils.ts               # Chart-specific data transformation
      [ChartName]Chart.tsx   # Namespace export wrapper
      XAxis.tsx, YAxis.tsx   # Optional axis components
  hooks/
    use[ChartName]TouchHandler.ts   # Gesture handling logic
    useSelected[DataPoint].ts       # Data selection logic
  providers/
    [ChartName]ContextProvider.tsx  # React Context for sharing state
  utils/
    math.ts                # Worklet math utilities (curve generation, etc.)
    axisCalculations.ts    # D3-based axis calculations
    pchip.ts               # Interpolation algorithms
  assets/
    Roboto-Regular.ttf     # Fonts for text rendering
```

**Export Pattern:**
Charts are exported as namespaces for clean API:
```typescript
// In src/components/line/LineChart.tsx
export const LineChart = {
  Chart,
  Line,
};

// Usage in consumer code
import { LineChart } from "expo-skia-charts";
<LineChart.Chart config={...} />
```

## Chart Component Development Patterns

### 1. Standard Chart Structure

Every chart follows this component architecture:

**Main Chart Component** (`Chart.tsx`):
- Handles canvas sizing with `onLayout`
- Creates SharedValues for interaction (`useSharedValue`)
- Sets up gesture handlers (`GestureDetector`)
- Provides context to child components
- Example: `src/components/line/Chart.tsx`

**Rendering Component** (e.g., `Line.tsx`):
- Uses Skia primitives (`Path`, `Circle`, `Group`, etc.)
- Accesses context via custom hook (`useLineChartContext`)
- Transforms data to visual elements
- Handles animations with `useDerivedValue`
- Example: `src/components/line/Line.tsx`

### 2. Context Provider Pattern

Charts use React Context to share state between components:

```typescript
// Define context type
export type ChartContextType = {
  size: { width: number; height: number };
  x: SharedValue<number>;
  y: SharedValue<number>;
  config: ChartConfig;
};

// Create context and hook
const ChartContext = createContext<ChartContextType | null>(null);

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("Component used outside of ChartContextProvider");
  }
  return context;
};
```

### 3. Gesture Handling Pattern

Interactive charts combine Hover (for web/desktop) and Pan (for mobile) gestures:

```typescript
const gesture = useMemo(() => {
  const hover = Gesture.Hover()
    .activeCursor("pointer")
    .enabled(enabled)
    .onStart((pos) => {
      x.value = pos.x - offset;
      y.value = pos.y - offset;
    })
    .onChange((pos) => {
      x.value = pos.x - offset;
      y.value = pos.y - offset;
    });

  const pan = Gesture.Pan()
    .activateAfterLongPress(1)
    .enabled(enabled)
    .onStart((pos) => { /* ... */ })
    .onChange((pos) => { /* ... */ });

  return Gesture.Race(hover, pan); // Race to handle both
}, [enabled, x, y, offset]);
```

### 4. D3 for Calculations, Skia for Rendering

**IMPORTANT**: D3 is used ONLY for mathematical calculations, NOT for rendering:

```typescript
import { scaleLinear } from "d3-scale";
import { extent } from "d3-array";

// ✅ CORRECT: Use D3 for calculations
const xScale = scaleLinear()
  .domain(extent(data.map(d => d.x)))
  .range([0, width]);

const ticks = xScale.ticks(5);

// ✅ CORRECT: Render with Skia
ticks.map(tick => (
  <Line
    p1={{ x: xScale(tick), y: 0 }}
    p2={{ x: xScale(tick), y: height }}
    color="#000"
  />
));

// ❌ WRONG: Don't use D3 for rendering (no SVG)
// d3.select(svg).append("line")...
```

See `src/utils/axisCalculations.ts` for complete examples.

### 5. Data Transformation Pipeline

Charts transform data through these steps:

1. **Extract values**: `const xValues = data.map(d => d.x)`
2. **Calculate domain**: `const [minX, maxX] = [Math.min(...xValues), Math.max(...xValues)]`
3. **Project to pixels**: `const projectedX = ((x - minX) / (maxX - minX)) * width`
4. **Apply padding**: `const adjustedHeight = height - PADDING * 2`
5. **Build path**: `const path = curveLines(projectedPoints, smoothing, "complex")`

Example: `src/components/line/utils.ts:buildLine()`

## Performance Considerations

### Worklet Functions

Mark functions with `"worklet"` directive when they:
- Perform mathematical calculations used in animations
- Are called from `useDerivedValue` or `useAnimatedStyle`
- Need to run on the UI thread with react-native-reanimated

```typescript
export const cubicBezierYForX = (x: number, a: Vector, b: Vector) => {
  "worklet";  // Required for UI thread execution
  // ... math calculations
};
```

All functions in `src/utils/math.ts` follow this pattern.

### Optimization Patterns

- **useMemo**: For expensive calculations that don't need reactive updates
  ```typescript
  const { path } = useMemo(
    () => buildLine(data, width, height),
    [data, width, height]
  );
  ```

- **useDerivedValue**: For reactive computations based on SharedValues
  ```typescript
  const cy = useDerivedValue(() => {
    return getYForX(path.toCmds(), x.value);
  }, [path, x]);
  ```

- **useSharedValue**: For values that trigger animations/re-renders
  ```typescript
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  ```

## TypeScript Configuration

The project uses strict TypeScript settings:
- `noUncheckedIndexedAccess: true` - array/object access returns `T | undefined`
- `noUnusedLocals: true` and `noUnusedParameters: true` - enforce cleanup
- `noImplicitReturns: true` - all code paths must return
- `verbatimModuleSyntax: true` - explicit type imports required

## Testing

Jest configured with:
- React Native preset
- Ignores `example/node_modules` and `lib/`
- Test files in `src/__tests__/`
