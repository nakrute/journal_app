import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { Avatar } from "../components/Avatar";
import { useStyles, useTheme } from "../theme";
import { formatMillis } from "../utils/time";

export function PostDetailScreen({
  item,
  onBack,
  onDelete,
  onEditCaption,
  onPlayVoice,
  onReport,
  onShare,
  playbackStatus,
  playbackUri
}) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";
  const [draftCaption, setDraftCaption] = useState(item.caption);
  const isActiveVoice = playbackUri === item.voiceUri;

  function saveCaption() {
    onEditCaption?.(item.id, draftCaption);
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.detailHeader}>
        <Pressable style={styles.postIconButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={20} color={iconColor} />
        </Pressable>
        <Avatar name={item.name} uri={item.avatarUri} size="small" />
        <View style={styles.detailTitleCopy}>
          <Text style={styles.friendName}>{item.name}</Text>
          <Text style={styles.subtle}>{item.handle} / {item.time}</Text>
          <Text style={styles.visibilityText}>{item.visibility || "friends"}</Text>
        </View>
      </View>

      <Image source={{ uri: item.photo }} style={styles.detailImage} />

      <View style={styles.profilePanel}>
        <Text style={styles.profileLabel}>Caption</Text>
        {item.isOwnPost ? (
          <>
            <TextInput
              style={styles.editCaptionInput}
              value={draftCaption}
              onChangeText={setDraftCaption}
              maxLength={90}
              multiline
              placeholder="Update caption..."
              placeholderTextColor="#8a867d"
            />
            <Pressable style={styles.smallActionButton} onPress={saveCaption}>
              <Text style={styles.smallActionText}>Save caption</Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.caption}>{item.caption}</Text>
        )}

        <Pressable
          style={[styles.voiceBubble, !item.playable && styles.disabledVoiceBubble]}
          disabled={!item.playable}
          onPress={() => onPlayVoice(item.voiceUri)}
        >
          <View style={styles.voiceBubbleMain}>
            <Ionicons
              name={isActiveVoice && playbackStatus.isPlaying ? "pause" : "play"}
              size={18}
              color={iconColor}
            />
            <Text style={styles.voiceLength}>
              {isActiveVoice
                ? `${formatMillis(playbackStatus.positionMillis)} / ${formatMillis(playbackStatus.durationMillis)}`
                : item.voice}
            </Text>
          </View>
        </Pressable>

        <Pressable style={styles.secondaryActionButton} onPress={() => onShare(item)}>
          <Text style={styles.secondaryActionText}>Share summary</Text>
        </Pressable>

        {item.isOwnPost ? (
          <Pressable style={styles.destructiveButton} onPress={() => onDelete(item.id)}>
            <Ionicons name="trash-outline" size={18} color="#111" />
            <Text style={styles.destructiveButtonText}>Delete post</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.destructiveButton} onPress={() => onReport(item)}>
            <Ionicons name="flag-outline" size={18} color="#111" />
            <Text style={styles.destructiveButtonText}>Report post</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}
