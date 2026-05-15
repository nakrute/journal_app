import { ScrollView } from "react-native";
import { PostCard } from "../components/PostCard";
import { useStyles } from "../theme";
import { buildPostItem } from "../utils/posts";

export function FeedScreen({
  friends,
  publishedPost,
  profile,
  playbackStatus,
  onDeletePost,
  onEditPostCaption,
  onOpenPost,
  onPlayVoice,
  onReportPost,
  playbackUri
}) {
  const styles = useStyles();
  const friendPosts = friends.filter((friend) => friend.photo);
  const feed = publishedPost
    ? [buildPostItem(publishedPost, "now", profile, true), ...friendPosts]
    : friendPosts;

  return (
    <ScrollView contentContainerStyle={styles.feed}>
      {feed.map((item) => (
        <PostCard
          key={item.id}
          item={item}
          onDelete={item.isOwnPost ? onDeletePost : undefined}
          onEditCaption={item.isOwnPost ? onEditPostCaption : undefined}
          onOpen={onOpenPost}
          onPlayVoice={onPlayVoice}
          onReport={onReportPost}
          playbackStatus={playbackStatus}
          playbackUri={playbackUri}
        />
      ))}
    </ScrollView>
  );
}
