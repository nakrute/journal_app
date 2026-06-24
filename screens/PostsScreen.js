import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { PostCard } from "../components/PostCard";
import { useStyles, useTheme } from "../theme";
import { buildPostItem } from "../utils/posts";

export function PostsScreen({
  posts,
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
  const feed = posts.map((post) => buildPostItem(post, "saved", profile, true));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.feed}>
      {feed.length === 0 ? (
        <View style={styles.emptyPanel}>
          <Ionicons name="albums-outline" size={34} color={iconColor} />
          <Text style={styles.emptyTitle}>No regular posts yet</Text>
          <Text style={styles.subtle}>Add a daily check-in to Posts when you publish it.</Text>
        </View>
      ) : (
        feed.map((item) => (
          <PostCard
            key={item.id}
            item={item}
            onDelete={onDeletePost}
            onEditCaption={onEditPostCaption}
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
