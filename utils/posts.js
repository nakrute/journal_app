export function buildPostItem(post, time) {
  return {
    id: post.id,
    name: "You",
    handle: "@yourmoment",
    time,
    photo: post.photo,
    caption: post.caption,
    playable: !!post.voiceUri,
    voice: post.voiceUri ? "Voice note" : "No voice",
    voiceUri: post.voiceUri
  };
}
