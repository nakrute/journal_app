import { normalizePost, normalizePostList } from "./entities";
import { markUploadStatus } from "./mockBackend";
import { updatePostCaption, updatePostCaptionList } from "./postsService";

export const localPostsRepository = {
  normalize: normalizePost,
  normalizeList: normalizePostList,
  updateCaption: updatePostCaption,
  updateCaptionList: updatePostCaptionList,
  updateUploadStatus(post, postId, status, syncError = null) {
    if (!post || post.id !== postId) return post;
    return markUploadStatus(post, status, syncError);
  },
  updateUploadStatusList(posts, postId, status, syncError = null) {
    return posts.map((post) =>
      post.id === postId ? markUploadStatus(post, status, syncError) : post
    );
  },
  remove(posts, postId) {
    return posts.filter((post) => post.id !== postId);
  }
};
