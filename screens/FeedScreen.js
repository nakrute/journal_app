import { ScrollView } from "react-native";
import { PostCard } from "../components/PostCard";
import { friends } from "../data/friends";
import { styles } from "../styles";
import { buildPostItem } from "../utils/posts";

export function FeedScreen({ publishedPost, playbackStatus, onPlayVoice, playbackUri }) {
  const feed = publishedPost ? [buildPostItem(publishedPost, "now"), ...friends] : friends;

  return (
    <ScrollView contentContainerStyle={styles.feed}>
      {feed.map((item) => (
        <PostCard
          key={item.id}
          item={item}
          onPlayVoice={onPlayVoice}
          playbackStatus={playbackStatus}
          playbackUri={playbackUri}
        />
      ))}
    </ScrollView>
  );
}
