import { validateDraftPost } from "../utils/validation";

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
});
