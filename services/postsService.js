import { createLocalId, createTimestamp } from "./ids";

export function createPostDraft({ caption, capturedPhoto, prompt, visibility, voiceUri }) {
  return {
    id: createLocalId("post"),
    caption: caption.trim() || "My real moment.",
    photo: capturedPhoto,
    prompt,
    date: createTimestamp(),
    visibility: visibility || "friends",
    voiceUri
  };
}

export function archivePromptFromPost(post, prompt, savedToPosts) {
  return {
    id: createLocalId("prompt"),
    prompt,
    caption: post.caption,
    date: post.date,
    savedToPosts
  };
}

export function updatePostCaption(post, postId, nextCaption) {
  if (!post || post.id !== postId) return post;
  return { ...post, caption: normalizeCaption(nextCaption) };
}

export function updatePostCaptionList(posts, postId, nextCaption) {
  return posts.map((post) => updatePostCaption(post, postId, nextCaption));
}

export function normalizeCaption(value) {
  return value.trim() || "My real moment.";
}
