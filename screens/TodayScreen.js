import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { IconButton } from "../components/Buttons";
import { useStyles, useTheme } from "../theme";
import { formatMillis, getPlaybackProgress } from "../utils/time";

export function TodayScreen({
  addToPosts,
  caption,
  cameraFacing,
  cameraPermission,
  cameraRef,
  capturedPhoto,
  isLate,
  onFlip,
  onPlayVoice,
  onPublish,
  onRecord,
  onRetake,
  onTakePhoto,
  onToggleAddToPosts,
  onChangeCaption,
  onDiscardDraft,
  playbackStatus,
  playbackUri,
  posted,
  prompt,
  recording,
  recordingSeconds,
  recordingStatus,
  onRemovePhoto,
  onRemoveVoice,
  requestCameraPermission,
  voiceMaxSeconds,
  visibility,
  onChangeVisibility,
  voiceUri
}) {
  const styles = useStyles();
  const { isDarkMode } = useTheme();
  const foregroundIcon = isDarkMode ? "#f8f7f2" : "#111";
  const draftPlaybackStatus =
    playbackUri === voiceUri
      ? playbackStatus
      : {
          durationMillis: 0,
          isPlaying: false,
          positionMillis: 0
        };
  const progressPercent = getPlaybackProgress(draftPlaybackStatus);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
      style={styles.keyboardAvoider}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.promptBand}>
          <Text style={styles.promptLabel}>{isLate ? "Late post" : "Today's drop"}</Text>
          <Text style={styles.prompt}>{prompt}</Text>
        </View>

        <View style={styles.cameraFrame}>
          {capturedPhoto ? (
            <Image source={{ uri: capturedPhoto }} style={styles.cameraPreview} />
          ) : cameraPermission?.granted ? (
            <CameraView
              ref={cameraRef}
              animateShutter={false}
              facing={cameraFacing}
              style={styles.cameraPreview}
            />
          ) : (
            <View style={styles.permissionPanel}>
              <Ionicons name="camera-outline" size={36} color={foregroundIcon} />
              <Text style={styles.permissionTitle}>Camera access</Text>
              <Pressable style={styles.darkButton} onPress={requestCameraPermission}>
                <Text style={styles.darkButtonText}>Enable Camera</Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.actionRow}>
          <IconButton icon="camera-reverse-outline" label="Flip" onPress={onFlip} disabled={!!recording} />
          <Pressable
            style={[styles.captureButton, recording && styles.disabledButton]}
            disabled={!!recording}
            onPress={capturedPhoto ? onRetake : onTakePhoto}
            accessibilityRole="button"
            accessibilityLabel={capturedPhoto ? "Retake photo" : "Take photo"}
          >
            <Ionicons name={capturedPhoto ? "refresh-outline" : "aperture-outline"} size={28} color="#fff" />
          </Pressable>
          <IconButton icon="mic-outline" label={recording ? "Stop" : "Voice"} active={!!recording} onPress={onRecord} />
        </View>

        {capturedPhoto || voiceUri || caption !== "My real moment." ? (
          <View style={styles.composerTools}>
            <Pressable
              style={[styles.secondaryActionButton, !capturedPhoto && styles.disabledButton]}
              onPress={onRemovePhoto}
              disabled={!capturedPhoto}
            >
              <Text style={styles.secondaryActionText}>Remove photo</Text>
            </Pressable>
            <Pressable
              style={[styles.secondaryActionButton, !voiceUri && styles.disabledButton]}
              onPress={onRemoveVoice}
              disabled={!voiceUri}
            >
              <Text style={styles.secondaryActionText}>Replace voice</Text>
            </Pressable>
            <Pressable style={styles.secondaryActionButton} onPress={onDiscardDraft}>
              <Text style={styles.secondaryActionText}>Discard draft</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.voicePanel}>
          <View style={styles.voiceInfo}>
            <Text style={styles.panelTitle}>Voice message</Text>
            <Text style={styles.subtle}>
              {recording
                ? `Recording ${formatMillis(recordingSeconds * 1000)} / ${formatMillis(voiceMaxSeconds * 1000)}`
                : voiceUri
                  ? `${recordingStatus === "saving" ? "Saving..." : "Ready"} / ${formatMillis(draftPlaybackStatus.positionMillis)} / ${formatMillis(draftPlaybackStatus.durationMillis)}`
                  : "Add a short note for friends"}
            </Text>
            <Text style={styles.subtle}>Voice notes are capped at {voiceMaxSeconds} seconds for now.</Text>
            {voiceUri ? (
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>
            ) : null}
          </View>
          <Pressable
            style={[styles.playButton, (!voiceUri || recording) && styles.disabledButton]}
            disabled={!voiceUri || recording}
            onPress={onPlayVoice}
            accessibilityRole="button"
            accessibilityLabel={draftPlaybackStatus.isPlaying ? "Pause voice note" : "Play voice note"}
          >
            <Ionicons
              name={draftPlaybackStatus.isPlaying ? "pause" : "play"}
              size={18}
              color="#111"
            />
          </Pressable>
        </View>

        <View style={styles.captionPanel}>
          <View style={styles.captionHeader}>
            <Text style={styles.panelTitle}>Caption</Text>
            <Text style={styles.captionCount}>{caption.length}/90</Text>
          </View>
          <TextInput
            style={styles.captionInput}
            value={caption}
            onChangeText={onChangeCaption}
            placeholder="Write what is happening..."
            placeholderTextColor="#8a867d"
            maxLength={90}
            multiline
            textAlignVertical="top"
          />
        </View>

        <Pressable style={styles.optionPanel} onPress={onToggleAddToPosts}>
          <Ionicons
            name={addToPosts ? "checkbox-outline" : "square-outline"}
            size={24}
            color={foregroundIcon}
          />
          <View style={styles.optionCopy}>
            <Text style={styles.optionTitle}>Add to Posts</Text>
            <Text style={styles.subtle}>Save this check-in to your regular posts too.</Text>
          </View>
        </Pressable>

        <View style={styles.captionPanel}>
          <View style={styles.captionHeader}>
            <Text style={styles.panelTitle}>Visibility</Text>
            <Text style={styles.captionCount}>{formatVisibility(visibility)}</Text>
          </View>
          <View style={styles.visibilityOptions}>
            {[
              ["friends", "Friends"],
              ["close", "Close"],
              ["private", "Private"],
              ["public", "Public"]
            ].map(([value, label]) => (
              <Pressable
                key={value}
                style={[styles.reminderTimeButton, visibility === value && styles.activeReminderTimeButton]}
                onPress={() => onChangeVisibility(value)}
              >
                <Text style={[styles.reminderTimeText, visibility === value && styles.activeReminderTimeText]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable style={[styles.publishButton, posted && !voiceUri && styles.postedButton]} onPress={onPublish}>
          <Text style={styles.publishText}>{posted && !voiceUri ? "Post Another" : "Post Moment"}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function formatVisibility(visibility) {
  if (visibility === "public") return "Everyone";
  if (visibility === "private") return "Only me";
  if (visibility === "close") return "Close friends";
  return "Friends";
}
