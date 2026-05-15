import { cleanupUnusedMedia, deleteMedia } from "../utils/media";
import {
  archivePromptFromPost,
  updatePostCaption,
  updatePostCaptionList
} from "../services/postsService";
import { usePersistedState } from "./usePersistedState";

export function useLocalPosts(logEvent) {
  const [publishedPost, setPublishedPost] = usePersistedState("voiceReal.todayPost", null);
  const [generalPosts, setGeneralPosts] = usePersistedState("voiceReal.posts", []);
  const [promptHistory, setPromptHistory] = usePersistedState("voiceReal.promptHistory", []);

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
    setPublishedPost((post) => updatePostCaption(post, postId, nextCaption));
    setGeneralPosts((posts) => updatePostCaptionList(posts, postId, nextCaption));
    setSelectedPost?.((post) => {
      if (!post || post.id !== postId) return post;
      return updatePostCaption(post, postId, nextCaption);
    });
    logEvent("Edited post caption");
  }

  async function deletePost(postId, setSelectedPost) {
    let removedPost = null;

    setPublishedPost((post) => {
      if (!post || post.id !== postId) return post;
      removedPost = post;
      return null;
    });
    setGeneralPosts((posts) => {
      const nextPosts = posts.filter((post) => post.id !== postId);
      removedPost = removedPost || posts.find((post) => post.id === postId);
      return nextPosts;
    });
    setSelectedPost?.(null);

    if (removedPost) {
      await deleteMedia(removedPost.photo);
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
      publishedPost?.photo,
      publishedPost?.voiceUri,
      ...generalPosts.flatMap((post) => [post.photo, post.voiceUri]),
      ...draftUris
    ];
    await cleanupUnusedMedia(postUris);
  }

  return {
    cleanupPostMedia,
    clearLocalPosts,
    deletePost,
    generalPosts,
    promptHistory,
    publishedPost,
    savePost,
    setGeneralPosts,
    updatePostCaption
  };
}
