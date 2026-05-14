import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useCameraPermissions } from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Share, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabButton } from "./components/Buttons";
import { useActivityLog } from "./hooks/useActivityLog";
import { defaultProfile, useAppSettings } from "./hooks/useAppSettings";
import { useDailyDrop } from "./hooks/useDailyDrop";
import { useDailyReminderNotifications } from "./hooks/useDailyReminderNotifications";
import { useDraftComposer } from "./hooks/useDraftComposer";
import { useLocalPosts } from "./hooks/useLocalPosts";
import { useLocalSocial } from "./hooks/useLocalSocial";
import { FeedScreen } from "./screens/FeedScreen";
import { LockScreen } from "./screens/LockScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { PostDetailScreen } from "./screens/PostDetailScreen";
import { PostsScreen } from "./screens/PostsScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { TodayScreen } from "./screens/TodayScreen";
import { ThemeProvider, useStyles } from "./theme";
import { deleteMedia, preserveMedia } from "./utils/media";
import { validateDraftPost } from "./utils/validation";
import { formatSeconds } from "./utils/time";

export default function App() {
  const appSettings = useAppSettings();

  return (
    <ThemeProvider isDarkMode={appSettings.isDarkMode}>
      <AppShell appSettings={appSettings} />
    </ThemeProvider>
  );
}

function AppShell({ appSettings }) {
  const {
    hasSeenOnboarding,
    isDarkMode,
    privacySettings,
    profile,
    securitySettings,
    setHasSeenOnboarding,
    setIsDarkMode,
    setProfile,
    storageReady,
    togglePrivacySetting,
    updateSecuritySettings
  } = appSettings;
  const styles = useStyles();
  const cameraRef = useRef(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [activeTab, setActiveTab] = useState("today");
  const [lastContentTab, setLastContentTab] = useState("today");
  const [selectedPost, setSelectedPost] = useState(null);
  const [cameraFacing, setCameraFacing] = useState("back");
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [playbackUri, setPlaybackUri] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState({
    durationMillis: 0,
    isPlaying: false,
    positionMillis: 0
  });
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState("unknown");
  const { activityLog, clearActivityLog, logEvent } = useActivityLog();
  const {
    addToPosts,
    caption,
    capturedPhoto,
    resetDraft,
    setAddToPosts,
    setCaption,
    setCapturedPhoto,
    setVoiceUri,
    voiceUri
  } = useDraftComposer();
  const {
    cleanupPostMedia,
    clearLocalPosts,
    deletePost,
    generalPosts,
    promptHistory,
    publishedPost,
    savePost,
    setGeneralPosts,
    updatePostCaption
  } = useLocalPosts(logEvent);
  const {
    acceptFriendRequest,
    addFriend,
    blockFriend,
    declineFriendRequest,
    friendRequests,
    friends,
    removeFriend,
    restoreDemoSocialData,
    setFriends,
    simulateNewFriendPost
  } = useLocalSocial(logEvent);
  const { isLate, prompt, secondsRemaining } = useDailyDrop();
  const {
    changeReminderTime,
    notificationSettings,
    sendTestNotification: handleSendTestNotification,
    toggleDailyReminder
  } = useDailyReminderNotifications();

  const permissionStatuses = {
    camera: cameraPermission?.status || "unknown",
    microphone: microphonePermissionStatus,
    notifications: notificationSettings.permissionStatus
  };

  useEffect(() => {
    Audio.getPermissionsAsync()
      .then((permission) => setMicrophonePermissionStatus(permission.status))
      .catch(() => setMicrophonePermissionStatus("unknown"));
  }, []);

  useEffect(() => {
    if (!recording) {
      setRecordingSeconds(0);
      return undefined;
    }

    const timer = setInterval(() => {
      setRecordingSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    if (!securitySettings.appLockEnabled) {
      setIsUnlocked(true);
    }
  }, [securitySettings.appLockEnabled]);

  useEffect(() => {
    cleanupPostMedia([capturedPhoto, voiceUri]).catch(() => {});
  }, [capturedPhoto, cleanupPostMedia, voiceUri]);

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

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.75,
        shutterSound: false
      });
      const savedPhotoUri = await preserveMedia(photo.uri, "photo");
      await deleteMedia(capturedPhoto);
      setCapturedPhoto(savedPhotoUri);
      logEvent("Captured photo");
    } catch (error) {
      Alert.alert("Camera issue", "OutLoud could not capture a photo. Try retaking or restarting the camera.");
      logEvent("Camera capture failed");
    }
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
    if (voiceUri) {
      Alert.alert("Replace voice note?", "Recording again will remove the current draft voice note.", [
        { text: "Cancel", style: "cancel" },
        { text: "Replace", style: "destructive", onPress: beginRecording }
      ]);
      return;
    }

    await beginRecording();
  }

  async function beginRecording() {
    const permission = await Audio.requestPermissionsAsync();
    setMicrophonePermissionStatus(permission.status);
    if (!permission.granted) {
      Alert.alert("Microphone needed", "Enable microphone access to send voice messages.");
      return;
    }

    await unloadCurrentSound();
    await deleteMedia(voiceUri);
    setVoiceUri(null);
    logEvent("Started voice recording");

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false
    });

    try {
      const { recording: nextRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(nextRecording);
    } catch (error) {
      Alert.alert("Recording issue", "OutLoud could not start recording. Check microphone access and try again.");
      logEvent("Voice recording failed to start");
    }
  }

  async function stopRecording() {
    if (!recording) return;
    let nextVoiceUri = null;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      nextVoiceUri = await preserveMedia(uri, "voice");
      setRecording(null);
      setVoiceUri(nextVoiceUri);
      resetPlaybackStatus();
      logEvent("Saved voice recording");
    } catch (error) {
      setRecording(null);
      Alert.alert("Recording issue", "OutLoud could not save that voice note. Try recording again.");
      logEvent("Voice recording failed to save");
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false
    });

    const { sound: nextSound, status } = await Audio.Sound.createAsync(
      { uri: nextVoiceUri },
      { shouldPlay: false },
      syncPlaybackStatus
    );
    setSound(nextSound);
    setPlaybackUri(nextVoiceUri);
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

    try {
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
    } catch (error) {
      Alert.alert("Voice note unavailable", "This local audio file may no longer exist. Record a new voice note to replace it.");
      if (uri === voiceUri) {
        setVoiceUri(null);
      }
      resetPlaybackStatus();
      logEvent("Voice playback failed");
    }
  }

  async function publishMoment() {
    const validationMessage = validateDraftPost({ capturedPhoto, voiceUri, caption });
    if (validationMessage) {
      Alert.alert("Almost there", validationMessage);
      return;
    }

    const nextPost = {
      id: `post-${Date.now()}`,
      caption: caption.trim() || "My real moment.",
      photo: capturedPhoto,
      prompt,
      date: new Date().toISOString(),
      voiceUri
    };

    savePost(nextPost, {
      addToPosts,
      archivePrompt: privacySettings.savePostsToArchive,
      prompt
    });

    if (sound) {
      await sound.pauseAsync();
      await sound.setPositionAsync(0);
      const status = await sound.getStatusAsync();
      syncPlaybackStatus(status);
    }

    resetDraft();
    setPlaybackUri(nextPost.voiceUri);
    openTab("feed");
  }

  function openTab(tab) {
    setActiveTab(tab);
    if (tab !== "profile") {
      setLastContentTab(tab);
    }
  }

  function toggleProfileMenu() {
    if (activeTab === "profile") {
      openTab(lastContentTab);
      return;
    }

    setLastContentTab(activeTab);
    setActiveTab("profile");
  }

  async function discardDraft() {
    await deleteMedia(capturedPhoto);
    await deleteMedia(voiceUri);
    resetDraft();
    setPlaybackUri(null);
    resetPlaybackStatus();
    logEvent("Discarded draft");
  }

  async function removeDraftPhoto() {
    await deleteMedia(capturedPhoto);
    setCapturedPhoto(null);
    logEvent("Removed draft photo");
  }

  async function removeDraftVoice() {
    await deleteMedia(voiceUri);
    setVoiceUri(null);
    setPlaybackUri(null);
    resetPlaybackStatus();
    logEvent("Removed draft voice note");
  }

  async function requestMicrophonePermission() {
    const permission = await Audio.requestPermissionsAsync();
    setMicrophonePermissionStatus(permission.status);
    logEvent(`Microphone permission ${permission.status}`);
  }

  function updateSecuritySettingsAndUnlock(nextSettings) {
    updateSecuritySettings(nextSettings);
    if (nextSettings.appLockEnabled === false) {
      setIsUnlocked(true);
    }
    logEvent("Updated app lock settings");
  }

  function resetOnboarding() {
    setHasSeenOnboarding(false);
    logEvent("Reset onboarding");
  }

  async function restoreDemoData() {
    restoreDemoSocialData();
    setProfile(defaultProfile);
    logEvent("Restored demo data");
  }

  function handleSimulateNewFriendPost() {
    const post = simulateNewFriendPost();
    Alert.alert("New friend post", `${post.name} posted a new mock check-in.`);
  }

  function runBugScenario(scenario) {
    if (scenario === "missingAudio") {
      setVoiceUri("file:///missing-local-audio.m4a");
      logEvent("Bug bash: missing audio URI");
    }
    if (scenario === "emptyFriends") {
      setFriends([]);
      logEvent("Bug bash: empty friends");
    }
    if (scenario === "manyPosts") {
      setGeneralPosts((posts) => [
        ...Array.from({ length: 6 }, (_, index) => ({
          id: `stress-${Date.now()}-${index}`,
          caption: `Long local stress post ${index + 1} with a caption that checks wrapping across compact cards.`,
          photo: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
          prompt,
          date: new Date().toISOString(),
          voiceUri: null
        })),
        ...posts
      ]);
      logEvent("Bug bash: many posts");
    }
    if (scenario === "longCaption") {
      setCaption("This is a deliberately long caption for testing how the composer behaves when someone writes right up to the limit.");
      logEvent("Bug bash: long caption");
    }
  }

  async function sharePost(item) {
    await Share.share({
      message: `${item.name} on OutLoud\n${item.caption}\n${item.voiceUri ? "Includes a local voice note." : "No voice note."}`
    });
    logEvent("Shared post summary");
  }

  if (!storageReady) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.shell} edges={["top", "bottom"]}>
          <StatusBar style={isDarkMode ? "light" : "dark"} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (securitySettings.appLockEnabled && !isUnlocked && hasSeenOnboarding) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.shell} edges={["top", "bottom"]}>
          <StatusBar style={isDarkMode ? "light" : "dark"} />
          <LockScreen pin={securitySettings.pin} onUnlock={() => setIsUnlocked(true)} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!hasSeenOnboarding) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.shell} edges={["top", "bottom"]}>
          <StatusBar style={isDarkMode ? "light" : "dark"} />
          <OnboardingScreen onComplete={() => setHasSeenOnboarding(true)} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.shell} edges={["top", "bottom"]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <View style={styles.header}>
          <View style={styles.headerIdentity}>
            <Pressable style={styles.menuButton} onPress={toggleProfileMenu}>
              <Ionicons
                name={activeTab === "profile" ? "close-outline" : "menu-outline"}
                size={25}
                color={isDarkMode ? "#f8f7f2" : "#111"}
              />
            </Pressable>
            <View>
              <Text style={styles.logo}>OutLoud</Text>
              <Text style={styles.subtle}>Daily candid photo + voice notes</Text>
            </View>
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
            onDiscardDraft={discardDraft}
            onRemovePhoto={removeDraftPhoto}
            onRemoveVoice={removeDraftVoice}
            onRetake={removeDraftPhoto}
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
            recordingSeconds={recordingSeconds}
            requestCameraPermission={requestCameraPermission}
            voiceUri={voiceUri}
          />
        ) : activeTab === "feed" ? (
          <FeedScreen
            friends={friends}
            publishedPost={publishedPost}
            profile={profile}
            playbackStatus={playbackStatus}
            onPlayVoice={toggleVoicePlayback}
            playbackUri={playbackUri}
            onEditPostCaption={(postId, nextCaption) =>
              updatePostCaption(postId, nextCaption, setSelectedPost)
            }
            onDeletePost={(postId) => deletePost(postId, setSelectedPost)}
            onOpenPost={setSelectedPost}
          />
        ) : activeTab === "posts" ? (
          <PostsScreen
            posts={generalPosts}
            profile={profile}
            playbackStatus={playbackStatus}
            onPlayVoice={toggleVoicePlayback}
            playbackUri={playbackUri}
            onEditPostCaption={(postId, nextCaption) =>
              updatePostCaption(postId, nextCaption, setSelectedPost)
            }
            onDeletePost={(postId) => deletePost(postId, setSelectedPost)}
            onOpenPost={setSelectedPost}
          />
        ) : (
          <ProfileScreen
            friendRequests={friendRequests}
            friends={friends}
            isDarkMode={isDarkMode}
            notificationSettings={notificationSettings}
            onAcceptFriendRequest={acceptFriendRequest}
            onAddFriend={addFriend}
            onBlockFriend={blockFriend}
            onClearLocalPosts={() => clearLocalPosts(setSelectedPost)}
            onClearActivityLog={clearActivityLog}
            onChangeReminderTime={changeReminderTime}
            onChangeProfile={setProfile}
            onClose={toggleProfileMenu}
            onDeclineFriendRequest={declineFriendRequest}
            onRequestCameraPermission={requestCameraPermission}
            onRequestMicrophonePermission={requestMicrophonePermission}
            onRemoveFriend={removeFriend}
            onResetOnboarding={resetOnboarding}
            onRestoreDemoData={restoreDemoData}
            onRunBugScenario={runBugScenario}
            onSendTestNotification={handleSendTestNotification}
            onSimulateFriendPost={handleSimulateNewFriendPost}
            onTogglePrivacySetting={(field) => {
              togglePrivacySetting(field);
              logEvent(`Toggled ${field}`);
            }}
            onToggleDarkMode={() => setIsDarkMode((value) => !value)}
            onToggleDailyReminder={toggleDailyReminder}
            onUpdateSecuritySettings={updateSecuritySettingsAndUnlock}
            permissionStatuses={permissionStatuses}
            activityLog={activityLog}
            profile={profile}
            privacySettings={privacySettings}
            promptHistory={promptHistory}
            securitySettings={securitySettings}
          />
        )}

        {selectedPost ? (
          <View style={styles.detailOverlay}>
            <SafeAreaView style={styles.shell} edges={["top", "bottom"]}>
              <PostDetailScreen
                item={selectedPost}
                onBack={() => setSelectedPost(null)}
                onDelete={(postId) => deletePost(postId, setSelectedPost)}
                onEditCaption={(postId, nextCaption) =>
                  updatePostCaption(postId, nextCaption, setSelectedPost)
                }
                onPlayVoice={toggleVoicePlayback}
                onShare={sharePost}
                playbackStatus={playbackStatus}
                playbackUri={playbackUri}
              />
            </SafeAreaView>
          </View>
        ) : null}

        <View style={styles.tabs}>
          <TabButton
            icon="radio-outline"
            label="Today"
            active={activeTab === "today"}
            onPress={() => openTab("today")}
          />
          <TabButton
            icon="people-outline"
            label="Friends"
            active={activeTab === "feed"}
            onPress={() => openTab("feed")}
          />
          <TabButton
            icon="albums-outline"
            label="Posts"
            active={activeTab === "posts"}
            onPress={() => openTab("posts")}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
