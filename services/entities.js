export function normalizePost(post) {
  if (!post) return post;
  return {
    ...post,
    photoUri: post.photoUri || post.photo || null,
    voiceUri: post.voiceUri || null,
    visibility: post.visibility || "friends"
  };
}

export function normalizePostList(posts = []) {
  return posts.map(normalizePost);
}

export function normalizeProfile(profile) {
  if (!profile) return profile;
  return {
    id: profile.id || null,
    name: profile.name || "",
    handle: profile.handle || "",
    bio: profile.bio || "",
    avatarUri: profile.avatarUri || ""
  };
}

export function normalizeFriend(friend) {
  if (!friend) return friend;
  const legacyPost = friend.photo || friend.photoUri
    ? normalizePost({
        id: `friend-post-${friend.id}`,
        caption: friend.caption,
        photoUri: friend.photoUri || friend.photo,
        voiceUri: friend.voiceUri,
        date: friend.date,
        time: friend.time,
        voice: friend.voice
      })
    : null;
  return {
    ...friend,
    ...normalizeProfile(friend),
    isCloseFriend: !!friend.isCloseFriend,
    latestPost: friend.latestPost ? normalizePost(friend.latestPost) : legacyPost
  };
}

export function normalizeFriendList(friends = []) {
  return friends.map(normalizeFriend);
}

export function isPostEntity(value) {
  return !!(value?.entityType === "post" || value?.photoUri || value?.photo);
}
