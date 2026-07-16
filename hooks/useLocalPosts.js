import { cleanupUnusedMedia, deleteMedia } from "../utils/media";
import { UPLOAD_STATUS } from "../services/mockBackend";
import { localPostsRepository } from "../services/localPostsRepository";
import { archivePromptFromPost } from "../services/postsService";
import { usePersistedState } from "./usePersistedState";
import { STORAGE_KEYS } from "../constants/storageKeys";

export function useLocalPosts(logEvent) {
  const [publishedPost, setPublishedPost] = usePersistedState(STORAGE_KEYS.todayPost, null);
  const [generalPosts, setGeneralPosts] = usePersistedState(STORAGE_KEYS.posts, []);
  const [promptHistory, setPromptHistory] = usePersistedState(STORAGE_KEYS.promptHistory, []);

  function savePost(nextPost, { addToPosts, archivePrompt, prompt }) {
    setPublishedPost(nextPost);
    logEvent("Published daily moment");

    if (addToPosts) {
      setGeneralPosts((posts) => [nextPost, ...posts]);
      logEvent("Saved daily moment to Posts");
    }

    if (archivePrompt) {
      setPromptHistory((history) => [
        archivePromptFromPost(nextPost, prompt, addToPosts),
        ...history.slice(0, 9)
      ]);
    }
  }

  function updatePostCaption(postId, nextCaption, setSelectedPost) {
    setPublishedPost((post) => localPostsRepository.updateCaption(post, postId, nextCaption));
    setGeneralPosts((posts) => localPostsRepository.updateCaptionList(posts, postId, nextCaption));
    setSelectedPost?.((post) => {
      if (!post || post.id !== postId) return post;
      return localPostsRepository.updateCaption(post, postId, nextCaption);
    });
    logEvent("Edited post caption");
  }

  function updatePostUploadState(postId, status, syncError = null, setSelectedPost) {
    setPublishedPost((post) => {
      if (!post || post.id !== postId) return post;
      return localPostsRepository.updateUploadStatus(post, postId, status, syncError);
    });
    setGeneralPosts((posts) =>
      localPostsRepository.updateUploadStatusList(posts, postId, status, syncError)
    );
    setSelectedPost?.((post) => {
      if (!post || post.id !== postId) return post;
      return localPostsRepository.updateUploadStatus(post, postId, status, syncError);
    });
  }

  function retryPostUpload(postId, setSelectedPost) {
    updatePostUploadState(postId, UPLOAD_STATUS.uploaded, null, setSelectedPost);
    logEvent("Synced queued post to mock backend");
  }

  function simulatePostUploadFailure(postId, setSelectedPost) {
    updatePostUploadState(postId, UPLOAD_STATUS.failed, "Mock upload failed. Retry when online.", setSelectedPost);
    logEvent("Simulated post upload failure");
  }

  async function deletePost(postId, setSelectedPost) {
    let removedPost = null;

    setPublishedPost((post) => {
      if (!post || post.id !== postId) return post;
      removedPost = post;
      return null;
    });
    setGeneralPosts((posts) => {
      const nextPosts = localPostsRepository.remove(posts, postId);
      removedPost = removedPost || posts.find((post) => post.id === postId);
      return nextPosts;
    });
    setSelectedPost?.(null);

    if (removedPost) {
      await deleteMedia(removedPost.photoUri || removedPost.photo);
      await deleteMedia(removedPost.voiceUri);
    }
    logEvent("Deleted post");
  }

  async function clearLocalPosts(setSelectedPost) {
    const usedUris = [];
    await cleanupUnusedMedia(usedUris);
    setPublishedPost(null);
    setGeneralPosts([]);
    setPromptHistory([]);
    setSelectedPost?.(null);
    logEvent("Cleared local posts");
  }

  async function cleanupPostMedia(draftUris = []) {
    const postUris = [
      publishedPost?.photoUri || publishedPost?.photo,
      publishedPost?.voiceUri,
      ...generalPosts.flatMap((post) => [post.photoUri || post.photo, post.voiceUri]),
      ...draftUris
    ];
    await cleanupUnusedMedia(postUris);
  }

  return {
    cleanupPostMedia,
    clearLocalPosts,
    deletePost,
    generalPosts: localPostsRepository.normalizeList(generalPosts),
    promptHistory,
    publishedPost: localPostsRepository.normalize(publishedPost),
    retryPostUpload,
    savePost,
    setGeneralPosts,
    simulatePostUploadFailure,
    updatePostCaption
  };
}
