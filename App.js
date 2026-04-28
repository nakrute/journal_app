import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { CameraView, useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

const friends = [
  {
    id: "maya",
    name: "Maya",
    handle: "@mayaday",
    time: "2m ago",
    photo:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    caption: "Caught right before rehearsal.",
    voice: "0:18"
  },
  {
    id: "leo",
    name: "Leo",
    handle: "@leonotes",
    time: "14m ago",
    photo:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    caption: "Desk chaos, honest version.",
    voice: "0:11"
  },
  {
    id: "nina",
    name: "Nina",
    handle: "@ninasignal",
    time: "29m ago",
    photo:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    caption: "Walked outside for five minutes.",
    voice: "0:24"
  }
];

export default function App() {
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [activeTab, setActiveTab] = useState("today");
  const [cameraFacing, setCameraFacing] = useState("back");
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [recording, setRecording] = useState(null);
  const [voiceUri, setVoiceUri] = useState(null);
  const [sound, setSound] = useState(null);
  const [posted, setPosted] = useState(false);

  const prompt = useMemo(() => {
    const prompts = [
      "You have two minutes to show what is real right now.",
      "No retakes. Send the room, the face, and the sound.",
      "Capture the moment before it gets polished."
    ];
    return prompts[new Date().getDate() % prompts.length];
  }, []);

  async function takePhoto() {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) return;
    }

    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.75 });
    setCapturedPhoto(photo.uri);
  }

  async function startRecording() {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Microphone needed", "Enable microphone access to send voice messages.");
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true
    });

    const { recording: nextRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(nextRecording);
  }

  async function stopRecording() {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    setVoiceUri(uri);
  }

  async function playVoice() {
    if (!voiceUri) return;
    if (sound) {
      await sound.replayAsync();
      return;
    }

    const { sound: nextSound } = await Audio.Sound.createAsync({ uri: voiceUri });
    setSound(nextSound);
    await nextSound.playAsync();
  }

  function publishMoment() {
    if (!capturedPhoto || !voiceUri) {
      Alert.alert("Almost there", "Take a photo and record a voice note first.");
      return;
    }
    setPosted(true);
    setActiveTab("feed");
  }

  return (
    <SafeAreaView style={styles.shell}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>VoiceReal</Text>
          <Text style={styles.subtle}>Daily candid photo + voice notes</Text>
        </View>
        <View style={styles.timerPill}>
          <Ionicons name="timer-outline" size={16} color="#111" />
          <Text style={styles.timerText}>01:47</Text>
        </View>
      </View>

      {activeTab === "today" ? (
        <TodayScreen
          cameraFacing={cameraFacing}
          cameraPermission={cameraPermission}
          cameraRef={cameraRef}
          capturedPhoto={capturedPhoto}
          onFlip={() => setCameraFacing((value) => (value === "back" ? "front" : "back"))}
          onPlayVoice={playVoice}
          onPublish={publishMoment}
          onRecord={recording ? stopRecording : startRecording}
          onRetake={() => setCapturedPhoto(null)}
          onTakePhoto={takePhoto}
          posted={posted}
          prompt={prompt}
          recording={recording}
          requestCameraPermission={requestCameraPermission}
          voiceUri={voiceUri}
        />
      ) : (
        <FeedScreen posted={posted} capturedPhoto={capturedPhoto} voiceUri={voiceUri} />
      )}

      <View style={styles.tabs}>
        <TabButton
          icon="radio-outline"
          label="Today"
          active={activeTab === "today"}
          onPress={() => setActiveTab("today")}
        />
        <TabButton
          icon="people-outline"
          label="Friends"
          active={activeTab === "feed"}
          onPress={() => setActiveTab("feed")}
        />
      </View>
    </SafeAreaView>
  );
}

function TodayScreen({
  cameraFacing,
  cameraPermission,
  cameraRef,
  capturedPhoto,
  onFlip,
  onPlayVoice,
  onPublish,
  onRecord,
  onRetake,
  onTakePhoto,
  posted,
  prompt,
  recording,
  requestCameraPermission,
  voiceUri
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.promptBand}>
        <Text style={styles.promptLabel}>Today's drop</Text>
        <Text style={styles.prompt}>{prompt}</Text>
      </View>

      <View style={styles.cameraFrame}>
        {capturedPhoto ? (
          <Image source={{ uri: capturedPhoto }} style={styles.cameraPreview} />
        ) : cameraPermission?.granted ? (
          <CameraView ref={cameraRef} facing={cameraFacing} style={styles.cameraPreview} />
        ) : (
          <View style={styles.permissionPanel}>
            <Ionicons name="camera-outline" size={36} color="#111" />
            <Text style={styles.permissionTitle}>Camera access</Text>
            <Pressable style={styles.darkButton} onPress={requestCameraPermission}>
              <Text style={styles.darkButtonText}>Enable Camera</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.actionRow}>
        <IconButton icon="camera-reverse-outline" label="Flip" onPress={onFlip} />
        <Pressable style={styles.captureButton} onPress={capturedPhoto ? onRetake : onTakePhoto}>
          <Ionicons name={capturedPhoto ? "refresh-outline" : "aperture-outline"} size={28} color="#fff" />
        </Pressable>
        <IconButton icon="mic-outline" label={recording ? "Stop" : "Voice"} active={!!recording} onPress={onRecord} />
      </View>

      <View style={styles.voicePanel}>
        <View>
          <Text style={styles.panelTitle}>Voice message</Text>
          <Text style={styles.subtle}>
            {recording ? "Recording..." : voiceUri ? "Ready to send" : "Add a short note for friends"}
          </Text>
        </View>
        <Pressable
          style={[styles.playButton, !voiceUri && styles.disabledButton]}
          disabled={!voiceUri}
          onPress={onPlayVoice}
        >
          <Ionicons name="play" size={18} color="#111" />
        </Pressable>
      </View>

      <Pressable style={[styles.publishButton, posted && styles.postedButton]} onPress={onPublish}>
        <Text style={styles.publishText}>{posted ? "Posted Today" : "Post Moment"}</Text>
      </Pressable>
    </ScrollView>
  );
}

function FeedScreen({ posted, capturedPhoto, voiceUri }) {
  const feed = posted
    ? [
        {
          id: "you",
          name: "You",
          handle: "@yourmoment",
          time: "now",
          photo: capturedPhoto,
          caption: "My real moment.",
          voice: voiceUri ? "Voice note" : "No voice"
        },
        ...friends
      ]
    : friends;

  return (
    <ScrollView contentContainerStyle={styles.feed}>
      {feed.map((item) => (
        <View key={item.id} style={styles.post}>
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
            <View style={styles.voiceBubble}>
              <Ionicons name="volume-medium-outline" size={18} color="#111" />
              <View style={styles.waveform}>
                {[28, 16, 34, 22, 38, 18, 30].map((height, index) => (
                  <View key={index} style={[styles.waveBar, { height }]} />
                ))}
              </View>
              <Text style={styles.voiceLength}>{item.voice}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function TabButton({ active, icon, label, onPress }) {
  return (
    <Pressable style={[styles.tabButton, active && styles.activeTab]} onPress={onPress}>
      <Ionicons name={icon} size={22} color={active ? "#111" : "#777"} />
      <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
    </Pressable>
  );
}

function IconButton({ active, icon, label, onPress }) {
  return (
    <Pressable style={[styles.iconButton, active && styles.recordingButton]} onPress={onPress}>
      <Ionicons name={icon} size={22} color="#111" />
      <Text style={styles.iconLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: "#f8f7f2"
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10
  },
  logo: {
    color: "#111",
    fontSize: 26,
    fontWeight: "800"
  },
  subtle: {
    color: "#67645e",
    fontSize: 13
  },
  timerPill: {
    alignItems: "center",
    backgroundColor: "#e8ff66",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  timerText: {
    color: "#111",
    fontSize: 13,
    fontWeight: "800"
  },
  content: {
    padding: 20,
    paddingBottom: 120
  },
  promptBand: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 18
  },
  promptLabel: {
    color: "#e8ff66",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase"
  },
  prompt: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "800",
    lineHeight: 29
  },
  cameraFrame: {
    aspectRatio: 3 / 4,
    backgroundColor: "#dedbd0",
    borderRadius: 8,
    marginTop: 18,
    overflow: "hidden"
  },
  cameraPreview: {
    height: "100%",
    width: "100%"
  },
  permissionPanel: {
    alignItems: "center",
    flex: 1,
    gap: 12,
    justifyContent: "center",
    padding: 24
  },
  permissionTitle: {
    color: "#111",
    fontSize: 18,
    fontWeight: "800"
  },
  darkButton: {
    backgroundColor: "#111",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 11
  },
  darkButtonText: {
    color: "#fff",
    fontWeight: "800"
  },
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    height: 68,
    justifyContent: "center",
    width: 86
  },
  recordingButton: {
    backgroundColor: "#ffb8a5",
    borderColor: "#111"
  },
  iconLabel: {
    color: "#111",
    fontSize: 12,
    fontWeight: "700"
  },
  captureButton: {
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 999,
    height: 74,
    justifyContent: "center",
    width: 74
  },
  voicePanel: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    padding: 16
  },
  panelTitle: {
    color: "#111",
    fontSize: 17,
    fontWeight: "800"
  },
  playButton: {
    alignItems: "center",
    backgroundColor: "#e8ff66",
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  disabledButton: {
    opacity: 0.35
  },
  publishButton: {
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 8,
    marginTop: 18,
    paddingVertical: 16
  },
  postedButton: {
    backgroundColor: "#2f6f56"
  },
  publishText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900"
  },
  feed: {
    gap: 16,
    padding: 20,
    paddingBottom: 120
  },
  post: {
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden"
  },
  postImage: {
    aspectRatio: 1,
    width: "100%"
  },
  postBody: {
    padding: 16
  },
  postHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  friendName: {
    color: "#111",
    fontSize: 18,
    fontWeight: "900"
  },
  time: {
    color: "#67645e",
    fontSize: 12,
    fontWeight: "700"
  },
  caption: {
    color: "#25231f",
    fontSize: 15,
    marginTop: 12
  },
  voiceBubble: {
    alignItems: "center",
    backgroundColor: "#f0eee7",
    borderRadius: 8,
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    padding: 12
  },
  waveform: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 5,
    height: 40
  },
  waveBar: {
    backgroundColor: "#111",
    borderRadius: 999,
    width: 5
  },
  voiceLength: {
    color: "#111",
    fontSize: 12,
    fontWeight: "800"
  },
  tabs: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#dfdcd2",
    borderRadius: 8,
    borderWidth: 1,
    bottom: 18,
    flexDirection: "row",
    gap: 8,
    left: 20,
    padding: 6,
    position: "absolute",
    right: 20
  },
  tabButton: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 12
  },
  activeTab: {
    backgroundColor: "#e8ff66"
  },
  tabText: {
    color: "#777",
    fontSize: 13,
    fontWeight: "800"
  },
  activeTabText: {
    color: "#111"
  }
});
