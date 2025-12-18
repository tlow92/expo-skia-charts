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
