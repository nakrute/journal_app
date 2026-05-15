export function buildPostItem(post, time, profile, isOwnPost = false) {
  return {
    id: post.id,
    name: profile.name,
    handle: profile.handle,
    avatarUri: profile.avatarUri,
    time,
    photo: post.photo,
    caption: post.caption,
    playable: !!post.voiceUri,
    isOwnPost,
    voice: post.voiceUri ? "Voice note" : "No voice",
    visibility: post.visibility || "friends",
    voiceUri: post.voiceUri
  };
}
