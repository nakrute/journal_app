import { buildPostItem } from "../utils/posts";

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
});
