import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "../styles";
import { formatMillis } from "../utils/time";

export function PostCard({ item, playbackStatus, onPlayVoice, playbackUri }) {
  return (
    <View style={styles.post}>
      <Image source={{ uri: item.photo }} style={styles.postImage} />
      <View style={styles.postBody}>
        <View style={styles.postHeader}>
          <View>
            <Text style={styles.friendName}>{item.name}</Text>
            <Text style={styles.subtle}>{item.handle}</Text>
          </View>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.caption}>{item.caption}</Text>
        <Pressable
          style={[styles.voiceBubble, !item.playable && styles.disabledVoiceBubble]}
          disabled={!item.playable}
          onPress={() => onPlayVoice(item.voiceUri)}
        >
          <View style={styles.voiceBubbleMain}>
            <Ionicons
              name={getFeedVoiceIcon(item, playbackUri, playbackStatus)}
              size={18}
              color="#111"
            />
            <View style={styles.waveform}>
              {[28, 16, 34, 22, 38, 18, 30].map((height, index) => (
                <View
                  key={index}
                  style={[
                    styles.waveBar,
                    { height },
                    isFeedVoicePlaying(item, playbackUri, playbackStatus) && styles.activeWaveBar
                  ]}
                />
              ))}
            </View>
            <Text style={styles.voiceLength}>
              {item.playable && playbackUri === item.voiceUri
                ? `${formatMillis(playbackStatus.positionMillis)} / ${formatMillis(playbackStatus.durationMillis)}`
                : item.voice}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function getFeedVoiceIcon(item, playbackUri, playbackStatus) {
  return isFeedVoicePlaying(item, playbackUri, playbackStatus) ? "pause" : "play";
}

function isFeedVoicePlaying(item, playbackUri, playbackStatus) {
  return item.playable && playbackUri === item.voiceUri && playbackStatus.isPlaying;
}
