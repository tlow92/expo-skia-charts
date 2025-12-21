import type { SkPoint } from "@shopify/react-native-skia";
import * as math from "../../../utils/math";
import { buildLine, PADDING } from "../utils";

jest.mock("../../../utils/math", () => ({
  curveLines: jest.fn(),
}));

const mockCurveLines = math.curveLines as jest.MockedFunction<typeof math.curveLines>;

describe("buildLine", () => {
  const WIDTH = 300;
  const HEIGHT = 200;
  const ADJUSTED_SIZE = HEIGHT - PADDING * 2;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCurveLines.mockReturnValue({} as any);
  });

  it("calculates min and max Y values correctly", () => {
    const points: SkPoint[] = [
      { x: 0, y: 10 },
      { x: 1, y: 50 },
      { x: 2, y: 30 },
      { x: 3, y: 70 },
    ];

    const result = buildLine(points, WIDTH, HEIGHT);

    expect(result.minY).toBe(10);
    expect(result.maxY).toBe(70);
  });

  it("calculates min and max Y with negative numbers", () => {
    const points: SkPoint[] = [
      { x: 0, y: -10 },
      { x: 1, y: 50 },
      { x: 2, y: -30 },
      { x: 3, y: 70 },
    ];

    const result = buildLine(points, WIDTH, HEIGHT);

    expect(result.minY).toBe(-30);
    expect(result.maxY).toBe(70);
  });

  it("projects points to canvas coordinates", () => {
    const points: SkPoint[] = [
      { x: 0, y: 0 },
      { x: 10, y: 100 },
    ];

    buildLine(points, WIDTH, HEIGHT);

    const projectedPoints = mockCurveLines.mock.calls[0]?.[0];

    expect(projectedPoints).toBeDefined();
    expect(projectedPoints).toHaveLength(3);
    expect(projectedPoints?.[0]).toEqual({ x: 0, y: 0 });
    expect(projectedPoints?.[1]).toEqual({ x: WIDTH, y: ADJUSTED_SIZE });
  });

  it("adds extension point at end", () => {
    const points: SkPoint[] = [
      { x: 0, y: 10 },
      { x: 5, y: 20 },
    ];

    buildLine(points, WIDTH, HEIGHT);

    const projectedPoints = mockCurveLines.mock.calls[0]?.[0];
    const lastPoint = projectedPoints?.[projectedPoints.length - 1];

    expect(lastPoint?.x).toBe(WIDTH + 10);
    expect(lastPoint?.y).toBe(20);
  });

  it("calls curveLines with correct params", () => {
    const points: SkPoint[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ];

    buildLine(points, WIDTH, HEIGHT);

    expect(mockCurveLines).toHaveBeenCalledTimes(1);
    expect(mockCurveLines).toHaveBeenCalledWith(expect.any(Array), 0.1, "complex");
  });

  it("returns path from curveLines", () => {
    const points: SkPoint[] = [{ x: 0, y: 0 }];
    const mockPath = { test: "path" } as any;
    mockCurveLines.mockReturnValue(mockPath);

    const result = buildLine(points, WIDTH, HEIGHT);

    expect(result.path).toBe(mockPath);
  });

  it("handles single point", () => {
    const points: SkPoint[] = [{ x: 5, y: 10 }];

    const result = buildLine(points, WIDTH, HEIGHT);

    expect(result.minY).toBe(10);
    expect(result.maxY).toBe(10);
  });

  it("handles horizontal line (same Y values)", () => {
    const points: SkPoint[] = [
      { x: 0, y: 50 },
      { x: 10, y: 50 },
      { x: 20, y: 50 },
    ];

    const result = buildLine(points, WIDTH, HEIGHT);

    expect(result.minY).toBe(50);
    expect(result.maxY).toBe(50);
  });

  it("returns correct structure", () => {
    const points: SkPoint[] = [
      { x: 0, y: 10 },
      { x: 1, y: 30 },
    ];

    const result = buildLine(points, WIDTH, HEIGHT);

    expect(result).toHaveProperty("minY");
    expect(result).toHaveProperty("maxY");
    expect(result).toHaveProperty("path");
  });

  it("does not mutate original points array", () => {
    const points: SkPoint[] = [
      { x: 0, y: 10 },
      { x: 1, y: 20 },
    ];

    const originalPoints = JSON.parse(JSON.stringify(points));

    buildLine(points, WIDTH, HEIGHT);

    expect(points).toEqual(originalPoints);
  });
});
