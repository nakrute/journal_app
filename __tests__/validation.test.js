import { validateDraftPost, validateHandle, validateTimeValue } from "../utils/validation";

describe("draft post validation", () => {
  test("requires a photo", () => {
    expect(validateDraftPost({ capturedPhoto: null, voiceUri: "voice", caption: "Hi" })).toMatch(/photo/);
  });

  test("requires a voice note", () => {
    expect(validateDraftPost({ capturedPhoto: "photo", voiceUri: null, caption: "Hi" })).toMatch(/voice/);
  });

  test("accepts a complete draft", () => {
    expect(validateDraftPost({ capturedPhoto: "photo", voiceUri: "voice", caption: "Hi" })).toBeNull();
  });

  test("validates handles", () => {
    expect(validateHandle("@good_name1")).toBeNull();
    expect(validateHandle("@no")).toMatch(/3-20/);
    expect(validateHandle("@bad-name")).toMatch(/3-20/);
  });

  test("validates quiet-hour time values", () => {
    expect(validateTimeValue("22:00")).toBeNull();
    expect(validateTimeValue("25:00")).toMatch(/24-hour/);
  });
});
