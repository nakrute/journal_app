import { Ionicons } from "@expo/vector-icons";
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { Avatar } from "./Avatar";
import { useStyles, useTheme } from "../theme";
import { formatMillis } from "../utils/time";

export function PostCard({
  item,
  onDelete,
  onEditCaption,
  onOpen,
  onReport,
  onRetryUpload,
  playbackStatus,
  onPlayVoice,
  playbackUri
}) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const iconColor = isDarkMode ? "#f8f7f2" : "#111";
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [draftCaption, setDraftCaption] = useState(item.caption);

  function saveCaption() {
    onEditCaption?.(item.id, draftCaption);
    setIsEditingCaption(false);
  }

  function cancelCaptionEdit() {
    setDraftCaption(item.caption);
    setIsEditingCaption(false);
  }

  function confirmDelete() {
    Alert.alert("Delete post?", "This removes the post from this local prototype.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete?.(item.id) }
    ]);
  }

  return (
    <View style={styles.post}>
      <Pressable onPress={() => onOpen?.(item)}>
        <Image source={{ uri: item.photo }} style={styles.postImage} />
      </Pressable>
      <View style={styles.postBody}>
        <View style={styles.postHeader}>
          <View style={styles.postAuthor}>
            <Avatar name={item.name} uri={item.avatarUri} size="small" />
            <View style={styles.postAuthorCopy}>
              <Text style={styles.friendName}>{item.name}</Text>
              <Text style={styles.subtle}>{item.handle}</Text>
            </View>
          </View>
          <View style={styles.postActions}>
            <Text style={styles.time}>{item.time}</Text>
            {item.isOwnPost ? (
              <View style={styles.postActionButtons}>
                <Pressable style={styles.postIconButton} onPress={() => setIsEditingCaption(true)}>
                  <Ionicons name="create-outline" size={17} color={iconColor} />
                </Pressable>
                <Pressable style={styles.postIconButton} onPress={confirmDelete}>
                  <Ionicons name="trash-outline" size={17} color={iconColor} />
                </Pressable>
              </View>
            ) : (
              <Pressable style={styles.postIconButton} onPress={() => onReport?.(item)}>
                <Ionicons name="flag-outline" size={17} color={iconColor} />
              </Pressable>
            )}
          </View>
        </View>
        <Text style={styles.visibilityText}>{formatVisibility(item.visibility)}</Text>
        {item.isOwnPost ? (
          <View style={styles.uploadStatusRow}>
            <View style={[styles.statusPill, item.uploadStatus === "failed" && styles.failedStatusPill]}>
              <Ionicons name={getUploadIcon(item.uploadStatus)} size={14} color="#111" />
              <Text style={styles.statusPillText}>{formatUploadStatus(item.uploadStatus)}</Text>
            </View>
            {item.uploadStatus === "failed" || item.uploadStatus === "queued" ? (
              <Pressable
                style={styles.statusActionButton}
                onPress={() => onRetryUpload?.(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.uploadStatus === "failed" ? "Retry upload" : "Sync post"}
              >
                <Ionicons
                  name={item.uploadStatus === "failed" ? "refresh-outline" : "cloud-upload-outline"}
                  size={15}
                  color={iconColor}
                />
              </Pressable>
            ) : null}
          </View>
        ) : null}
        {item.isOwnPost && item.syncError ? <Text style={styles.errorText}>{item.syncError}</Text> : null}
        {isEditingCaption ? (
          <View style={styles.editCaptionPanel}>
            <TextInput
              style={styles.editCaptionInput}
              value={draftCaption}
              onChangeText={setDraftCaption}
              maxLength={90}
              multiline
              placeholder="Update caption..."
              placeholderTextColor="#8a867d"
            />
            <View style={styles.editCaptionActions}>
              <Pressable style={styles.secondaryActionButton} onPress={cancelCaptionEdit}>
                <Text style={styles.secondaryActionText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.smallActionButton} onPress={saveCaption}>
                <Text style={styles.smallActionText}>Save</Text>
              </Pressable>
            </View>
          </View>
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
              name={getFeedVoiceIcon(item, playbackUri, playbackStatus)}
              size={18}
              color={iconColor}
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

function formatVisibility(visibility) {
  if (visibility === "public") return "Public";
  if (visibility === "private") return "Private archive";
  if (visibility === "close") return "Close friends";
  return "Friends";
}

function getFeedVoiceIcon(item, playbackUri, playbackStatus) {
  return isFeedVoicePlaying(item, playbackUri, playbackStatus) ? "pause" : "play";
}

function isFeedVoicePlaying(item, playbackUri, playbackStatus) {
  return item.playable && playbackUri === item.voiceUri && playbackStatus.isPlaying;
}

function formatUploadStatus(status) {
  if (status === "failed") return "Upload failed";
  if (status === "uploading") return "Uploading";
  if (status === "uploaded") return "Synced";
  if (status === "deleted") return "Deleted remotely";
  return "Queued";
}

function getUploadIcon(status) {
  if (status === "failed") return "cloud-offline-outline";
  if (status === "uploaded") return "cloud-done-outline";
  if (status === "uploading") return "cloud-upload-outline";
  if (status === "deleted") return "trash-outline";
  return "cloud-outline";
}
