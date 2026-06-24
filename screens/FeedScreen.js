import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { PostCard } from "../components/PostCard";
import { useStyles, useTheme } from "../theme";
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
  onRetryPostUpload,
  playbackUri
}) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";
  const friendPosts = friends.filter((friend) => friend.photo);
  const feed = publishedPost
    ? [buildPostItem(publishedPost, "now", profile, true), ...friendPosts]
    : friendPosts;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.feed}>
      {feed.length === 0 ? (
        <View style={styles.emptyPanel}>
          <Ionicons name="people-outline" size={34} color={iconColor} />
          <Text style={styles.emptyTitle}>No friend posts yet</Text>
          <Text style={styles.subtle}>Friend check-ins and your latest post will appear here.</Text>
        </View>
      ) : (
        feed.map((item) => (
          <PostCard
            key={item.id}
            item={item}
            onDelete={item.isOwnPost ? onDeletePost : undefined}
            onEditCaption={item.isOwnPost ? onEditPostCaption : undefined}
            onOpen={onOpenPost}
            onPlayVoice={onPlayVoice}
            onReport={onReportPost}
            onRetryUpload={onRetryPostUpload}
            playbackStatus={playbackStatus}
            playbackUri={playbackUri}
          />
        ))
      )}
    </ScrollView>
  );
}
