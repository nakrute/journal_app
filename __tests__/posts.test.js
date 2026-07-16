import { buildPostItem } from "../utils/posts";
import { createPostDraft } from "../services/postsService";

describe("post utilities", () => {
  test("builds own post feed item from profile", () => {
    const item = buildPostItem(
      { id: "1", caption: "Real", photo: "photo", voiceUri: "voice" },
      "now",
      { name: "Nia", handle: "@nia" },
      true
    );

    expect(item).toMatchObject({
      handle: "@nia",
      isOwnPost: true,
      name: "Nia",
      playable: true
    });
  });

  test("creates backend-shaped post draft", () => {
    const post = createPostDraft({
      caption: "  Hello  ",
      capturedPhoto: "photo",
      prompt: "Prompt",
      visibility: "close",
      voiceUri: "voice"
    });

    expect(post).toMatchObject({
      caption: "Hello",
      photoUri: "photo",
      prompt: "Prompt",
      visibility: "close",
      voiceUri: "voice"
    });
    expect(post.id).toMatch(/^post-/);
  });
});
