import { formatHandle, getLocalDateKey, getNameFromHandle } from "../utils/formatting";

describe("formatting utilities", () => {
  test("normalizes handles", () => {
    expect(formatHandle(" My Friend ")).toBe("@myfriend");
    expect(formatHandle("@AlreadyHere")).toBe("@alreadyhere");
    expect(formatHandle("")).toBe("");
  });

  test("creates a display name from a handle", () => {
    expect(getNameFromHandle("@voice")).toBe("Voice");
  });

  test("formats date keys", () => {
    expect(getLocalDateKey(new Date("2026-05-14T12:00:00Z"))).toBe("2026-05-14");
  });
});
