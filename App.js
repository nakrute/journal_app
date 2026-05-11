import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabButton } from "./components/Buttons";
import { FeedScreen } from "./screens/FeedScreen";
import { PostsScreen } from "./screens/PostsScreen";
import { TodayScreen } from "./screens/TodayScreen";
import { styles } from "./styles";
import { formatSeconds } from "./utils/time";

export default function App() {
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [activeTab, setActiveTab] = useState("today");
  const [cameraFacing, setCameraFacing] = useState("back");
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [recording, setRecording] = useState(null);
  const [voiceUri, setVoiceUri] = useState(null);
  const [caption, setCaption] = useState("My real moment.");
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [sound, setSound] = useState(null);
  const [playbackUri, setPlaybackUri] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState({
    durationMillis: 0,
    isPlaying: false,
    positionMillis: 0
  });
  const [publishedPost, setPublishedPost] = useState(null);
  const [generalPosts, setGeneralPosts] = useState([]);
  const [addToPosts, setAddToPosts] = useState(false);

  const prompt = useMemo(() => {
    const prompts = [
      "You have two minutes to show what is real right now.",
      "No retakes. Send the room, the face, and the sound.",
      "Capture the moment before it gets polished."
    ];
    return prompts[new Date().getDate() % prompts.length];
  }, []);

  const isLate = secondsRemaining === 0;

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((seconds) => Math.max(0, seconds - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  async function takePhoto() {
    if (recording) {
      Alert.alert("Recording in progress", "Stop the voice note before taking or retaking a photo.");
      return;
    }

    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) return;
    }

    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.75,
      shutterSound: false
    });
    setCapturedPhoto(photo.uri);
  }

  function resetPlaybackStatus() {
    setPlaybackStatus({
      durationMillis: 0,
      isPlaying: false,
      positionMillis: 0
    });
  }

  async function unloadCurrentSound() {
    if (!sound) return;
    await sound.unloadAsync();
    setSound(null);
    setPlaybackUri(null);
    resetPlaybackStatus();
  }

  async function startRecording() {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Microphone needed", "Enable microphone access to send voice messages.");
      return;
    }

    await unloadCurrentSound();
    setVoiceUri(null);

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false
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
    resetPlaybackStatus();

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false
    });

    const { sound: nextSound, status } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false },
      syncPlaybackStatus
    );
    setSound(nextSound);
    setPlaybackUri(uri);
    syncPlaybackStatus(status);
  }

  function syncPlaybackStatus(status) {
    if (!status.isLoaded) return;
    setPlaybackStatus({
      durationMillis: status.durationMillis || 0,
      isPlaying: status.isPlaying,
      positionMillis: status.positionMillis || 0
    });
  }

  async function toggleVoicePlayback(uri = voiceUri) {
    if (!uri) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false
    });

    if (sound && playbackUri === uri) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.pauseAsync();
      } else {
        const shouldRestart =
          status.isLoaded &&
          status.durationMillis &&
          status.positionMillis >= status.durationMillis - 250;

        if (shouldRestart) {
          await sound.setPositionAsync(0);
        }
        await sound.playAsync();
      }
      return;
    }

    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    resetPlaybackStatus();

    const { sound: nextSound, status } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true },
      syncPlaybackStatus
    );
    setSound(nextSound);
    setPlaybackUri(uri);
    syncPlaybackStatus(status);
  }

  async function publishMoment() {
    if (!capturedPhoto || !voiceUri) {
      Alert.alert("Almost there", "Take a photo and record a voice note first.");
      return;
    }

    const postedVoiceUri = voiceUri;

    const nextPost = {
      id: `post-${Date.now()}`,
      caption: caption.trim() || "My real moment.",
      photo: capturedPhoto,
      voiceUri: postedVoiceUri
    };

    setPublishedPost(nextPost);
    if (addToPosts) {
      setGeneralPosts((posts) => [nextPost, ...posts]);
    }

    if (sound) {
      await sound.pauseAsync();
      await sound.setPositionAsync(0);
      const status = await sound.getStatusAsync();
      syncPlaybackStatus(status);
    }

    setCapturedPhoto(null);
    setVoiceUri(null);
    setCaption("My real moment.");
    setAddToPosts(false);
    setPlaybackUri(postedVoiceUri);
    setActiveTab("feed");
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.shell} edges={["top", "bottom"]}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>VoiceReal</Text>
            <Text style={styles.subtle}>Daily candid photo + voice notes</Text>
          </View>
          <View style={[styles.timerPill, isLate && styles.lateTimerPill]}>
            <Ionicons name={isLate ? "alert-circle-outline" : "timer-outline"} size={16} color="#111" />
            <Text style={styles.timerText}>{isLate ? "Late" : formatSeconds(secondsRemaining)}</Text>
          </View>
        </View>

        {activeTab === "today" ? (
          <TodayScreen
            addToPosts={addToPosts}
            cameraFacing={cameraFacing}
            cameraPermission={cameraPermission}
            cameraRef={cameraRef}
            capturedPhoto={capturedPhoto}
            onFlip={() => setCameraFacing((value) => (value === "back" ? "front" : "back"))}
            onPlayVoice={() => toggleVoicePlayback(voiceUri)}
            onPublish={publishMoment}
            onRecord={recording ? stopRecording : startRecording}
            onRetake={() => setCapturedPhoto(null)}
            onTakePhoto={takePhoto}
            onToggleAddToPosts={() => setAddToPosts((value) => !value)}
            caption={caption}
            isLate={isLate}
            onChangeCaption={setCaption}
            posted={!!publishedPost}
            playbackStatus={playbackStatus}
            playbackUri={playbackUri}
            prompt={prompt}
            recording={recording}
            requestCameraPermission={requestCameraPermission}
            voiceUri={voiceUri}
          />
        ) : activeTab === "feed" ? (
          <FeedScreen
            publishedPost={publishedPost}
            playbackStatus={playbackStatus}
            onPlayVoice={toggleVoicePlayback}
            playbackUri={playbackUri}
          />
        ) : (
          <PostsScreen
            posts={generalPosts}
            playbackStatus={playbackStatus}
            onPlayVoice={toggleVoicePlayback}
            playbackUri={playbackUri}
          />
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
          <TabButton
            icon="albums-outline"
            label="Posts"
            active={activeTab === "posts"}
            onPress={() => setActiveTab("posts")}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
