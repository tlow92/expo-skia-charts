export const Skia = {
  Path: {
    Make: jest.fn(() => ({
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      close: jest.fn(),
      addPath: jest.fn(),
      toCmds: jest.fn(() => []),
    })),
  },
  Color: jest.fn((color: string) => color),
  ParagraphBuilder: {
    Make: jest.fn(() => ({
      pushStyle: jest.fn(),
      addText: jest.fn(),
      pop: jest.fn(),
      build: jest.fn(() => ({
        layout: jest.fn(),
      })),
    })),
  },
};

export const useFonts = jest.fn(() => null);

export const Canvas = "Canvas";
export const Group = "Group";
export const Path = "Path";
export const Circle = "Circle";
export const Line = "Line";
export const Text = "Text";
export const Paragraph = "Paragraph";
export const RoundedRect = "RoundedRect";

export const TextAlign = {
  Left: 0,
  Right: 1,
  Center: 2,
  Justify: 3,
  Start: 4,
  End: 5,
};

export type SkPath = any;
export type SkPoint = { x: number; y: number };
