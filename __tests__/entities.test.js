import {
  isPostEntity,
  normalizeFriend,
  normalizePost
} from "../services/entities";
import { localPostsRepository } from "../services/localPostsRepository";
import { localSocialRepository } from "../services/localSocialRepository";
import { UPLOAD_STATUS } from "../services/mockBackend";

describe("canonical entities and local repositories", () => {
  test("normalizes legacy posts without deleting their legacy data", () => {
    const legacy = { id: "post-1", photo: "legacy-photo", caption: "Hello" };
    expect(normalizePost(legacy)).toMatchObject({
      id: "post-1",
      photo: "legacy-photo",
      photoUri: "legacy-photo",
      visibility: "friends"
    });
  });

  test("separates a legacy friend feed item into a latest post", () => {
    const friend = normalizeFriend({
      id: "maya",
      name: "Maya",
      handle: "@maya",
      photo: "photo",
      caption: "Moment"
    });
    expect(friend.latestPost).toMatchObject({
      id: "friend-post-maya",
      photoUri: "photo",
      caption: "Moment"
    });
  });

  test("updates upload state through the repository contract", () => {
    const post = localPostsRepository.updateUploadStatus(
      { id: "post-1", uploadStatus: UPLOAD_STATUS.queued },
      "post-1",
      UPLOAD_STATUS.uploaded
    );
    expect(post.uploadStatus).toBe(UPLOAD_STATUS.uploaded);
    expect(post.backendId).toMatch(/^remote-/);
  });

  test("adds friends idempotently", () => {
    const request = { id: "sam", name: "Sam", handle: "@sam" };
    const once = localSocialRepository.addFriend([], request);
    expect(localSocialRepository.addFriend(once, request)).toEqual(once);
  });

  test("recognizes canonical and legacy post entities", () => {
    expect(isPostEntity({ photoUri: "photo" })).toBe(true);
    expect(isPostEntity({ photo: "legacy" })).toBe(true);
    expect(isPostEntity({ handle: "@person" })).toBe(false);
  });
});
