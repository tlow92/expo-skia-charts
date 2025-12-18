# Gemini Code Assistant Context

This document provides context for the Gemini code assistant to understand the `expo-skia-charts` project.

## Project Overview

`expo-skia-charts` is a React Native library intended to provide a collection of modern, performant charts for iOS, Android, and Web, leveraging the Skia graphics engine. The project is in its early stages of development and currently contains placeholder code from the `create-react-native-library` template.

The project is structured as a monorepo with a `library` and an `example` app. The library code is written in TypeScript and is located in the `src` directory. The example app is a standard React Native application that demonstrates the library's usage.

## Key Technologies and Tools

- **React Native:** The library is built for React Native applications.
- **Expo:** The project is set up to be compatible with Expo.
- **Skia:** The library intends to use Skia for rendering charts.
- **TypeScript:** The source code is written in TypeScript.
- **Yarn Workspaces:** The project uses Yarn Workspaces to manage the library and the example app.
- **React Native Builder Bob:** This tool is used to build the library.
- **Jest:** Jest is used for testing.
- **Release It:** This tool is used for creating new releases.
- **Left Hook:** Left Hook is used for git hooks.

## Building and Running

### Building the Library

To build the library, run the following command:

```bash
yarn prepare
```

This command uses `react-native-builder-bob` to transpile the TypeScript code from `src` to JavaScript in the `lib` directory.

### Running the Example App

To run the example app, use the following command:

```bash
yarn example
```

This will start the example app. From there, you can run it on a simulator or a physical device.

## Testing

To run the tests, use the following command:

```bash
yarn test
```

This command runs Jest and executes the test files in the `src/__tests__` directory.

## Development Conventions

- The code is written in TypeScript.
- The project uses conventional commits.
- The project uses Left Hook to enforce code quality with tools like commitlint.
- The project uses `release-it` to automate the release process.
