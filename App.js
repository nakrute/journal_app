import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Alert, Share } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { BETA_INVITE_CODE, DEFAULT_BETA_ACCESS } from "./constants/app";
import { FEATURE_FLAGS } from "./constants/featureFlags";
import { useActivityLog } from "./hooks/useActivityLog";
import { useAudioController } from "./hooks/useAudioController";
import { useCameraController } from "./hooks/useCameraController";
import { defaultProfile, useAppSettings } from "./hooks/useAppSettings";
import { useDailyDrop } from "./hooks/useDailyDrop";
import { useDailyReminderNotifications } from "./hooks/useDailyReminderNotifications";
import { useDraftComposer } from "./hooks/useDraftComposer";
import { useLocalPosts } from "./hooks/useLocalPosts";
import { useLocalReports } from "./hooks/useLocalReports";
import { useLocalSocial } from "./hooks/useLocalSocial";
import { AppNavigator } from "./navigation/AppNavigator";
import { BetaAccessScreen } from "./screens/BetaAccessScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { ThemeProvider, useStyles } from "./theme";
import { deleteMedia, preserveMedia } from "./utils/media";
import { validateDraftPost } from "./utils/validation";
import { createPostDraft } from "./services/postsService";

export default function App() {
  const appSettings = useAppSettings();

  return (
    <ThemeProvider isDarkMode={appSettings.isDarkMode}>
      <ErrorBoundary>
        <AppShell appSettings={appSettings} />
      </ErrorBoundary>
    </ThemeProvider>
  );
}

function AppShell({ appSettings }) {
  const {
    betaAccess,
    hasSeenOnboarding,
    isDarkMode,
    privacySettings,
    profile,
    safetySettings,
    setHasSeenOnboarding,
    setIsDarkMode,
    setProfile,
    storageReady,
    togglePrivacySetting,
    toggleSafetySetting,
    updateBetaAccess,
    updatePrivacySetting
  } = appSettings;
  const styles = useStyles();
  const { activityLog, clearActivityLog, logEvent } = useActivityLog();
  const {
    addToPosts,
    caption,
    capturedPhoto,
    resetDraft,
    setAddToPosts,
    setCaption,
    setCapturedPhoto,
    setVisibility,
    setVoiceUri,
    visibility,
    voiceUri
  } = useDraftComposer();
  const {
    microphonePermissionStatus,
    playbackStatus,
    playbackUri,
    recording,
    recordingSeconds,
    recordingStatus,
    requestMicrophonePermission,
    resetAudioDraft,
    resetPlaybackStatus,
    setPlaybackUri,
    sound,
    startRecording,
    stopRecording,
    syncPlaybackStatus,
    toggleVoicePlayback
  } = useAudioController({ logEvent, setVoiceUri, voiceUri });
  const {
    cameraFacing,
    cameraPermission,
    cameraRef,
    requestCameraPermission,
    setCameraFacing,
    takePhoto
  } = useCameraController({ capturedPhoto, logEvent, recording, setCapturedPhoto });
  const {
    cleanupPostMedia,
    clearLocalPosts,
    deletePost,
    generalPosts,
    promptHistory,
    publishedPost,
    retryPostUpload,
    savePost,
    setGeneralPosts,
    simulatePostUploadFailure,
    updatePostCaption
  } = useLocalPosts(logEvent);
  const { reportContent, reports } = useLocalReports(logEvent);
  const {
    acceptFriendRequest,
    addFriend,
    blockFriend,
    blockedProfiles,
    cancelFriendRequest,
    clearLocalSocialData,
    declineFriendRequest,
    friendRequests,
    friends,
    outgoingFriendRequests,
    removeFriend,
    restoreDemoSocialData,
    setFriends,
    simulateNewFriendPost,
    toggleFriendCloseStatus,
    unblockProfile
  } = useLocalSocial(logEvent);
  const { prompt } = useDailyDrop();
  const {
    changeReminderTime,
    notificationSettings,
    sendTestNotification: handleSendTestNotification,
    toggleDailyReminder,
    toggleNotificationPreference,
    updateQuietHours
  } = useDailyReminderNotifications();

  const permissionStatuses = {
    camera: cameraPermission?.status || "unknown",
    microphone: microphonePermissionStatus,
    notifications: notificationSettings.permissionStatus
  };

  useEffect(() => {
    cleanupPostMedia([capturedPhoto, voiceUri, profile.avatarUri]).catch(() => {});
  }, [capturedPhoto, cleanupPostMedia, profile.avatarUri, voiceUri]);

  useEffect(() => {
    setVisibility(privacySettings.defaultPostVisibility);
  }, [privacySettings.defaultPostVisibility, setVisibility]);

  async function publishMoment() {
    const validationMessage = validateDraftPost({ capturedPhoto, voiceUri, caption });
    if (validationMessage) {
      Alert.alert("Almost there", validationMessage);
      return false;
    }

    const nextPost = createPostDraft({ caption, capturedPhoto, prompt, visibility, voiceUri });

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
    return true;
  }

  async function discardDraft() {
    await resetAudioDraft();
    await deleteMedia(capturedPhoto);
    await deleteMedia(voiceUri);
    resetDraft();
    logEvent("Discarded draft");
  }

  async function removeDraftPhoto() {
    await deleteMedia(capturedPhoto);
    setCapturedPhoto(null);
    logEvent("Removed draft photo");
  }

  async function removeDraftVoice() {
    await resetAudioDraft();
    await deleteMedia(voiceUri);
    setVoiceUri(null);
    logEvent("Removed draft voice note");
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

  async function pickProfilePhoto() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Photo access needed", "Enable photo access to choose a profile picture.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8
      });

      if (result.canceled || !result.assets?.[0]?.uri) return;

      const savedAvatarUri = await preserveMedia(result.assets[0].uri, "photo");
      await deleteMedia(profile.avatarUri);
      setProfile((current) => ({ ...current, avatarUri: savedAvatarUri }));
      logEvent("Updated profile photo");
    } catch (error) {
      Alert.alert("Photo issue", "OutLoud could not update that profile photo.");
      logEvent("Profile photo update failed");
    }
  }

  function reportItem(item) {
    Alert.alert("Report", `Report ${item.name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Spam", onPress: () => reportContent(item, "Spam") },
      { text: "Safety", style: "destructive", onPress: () => reportContent(item, "Safety concern") }
    ]);
  }

  function handleTogglePrivacySetting(field) {
    togglePrivacySetting(field);
    logEvent(`Toggled ${field}`);
  }

  function handleToggleSafetySetting(field) {
    toggleSafetySetting(field);
    logEvent(`Toggled safety ${field}`);
  }

  function handleUpdatePrivacySetting(field, value) {
    updatePrivacySetting(field, value);
    logEvent(`Updated privacy ${field}`);
  }

  function handleUpdateBetaAccess(nextSettings) {
    updateBetaAccess(nextSettings);
    logEvent("Updated beta access settings");
  }

  function submitBetaCode(code) {
    if (code.trim().toUpperCase() !== BETA_INVITE_CODE) {
      Alert.alert("Invite code needed", "That beta code did not match. Try OUTLOUD-BETA for this local build.");
      return;
    }

    updateBetaAccess({
      acceptedAt: new Date().toISOString(),
      acceptedCode: code.trim()
    });
    logEvent("Unlocked beta access");
  }

  async function exportLocalData() {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      profile,
      privacySettings,
      safetySettings,
      betaAccess,
      publishedPost,
      generalPosts,
      promptHistory,
      friends,
      friendRequests,
      outgoingFriendRequests,
      blockedProfiles,
      reports,
      activityLog
    };

    await Share.share({
      message: `OutLoud local data export\n\n${JSON.stringify(exportPayload, null, 2)}`
    });
    logEvent("Exported local data summary");
  }

  function deleteLocalAccount() {
    Alert.alert(
      "Delete local account?",
      "This resets your dummy profile, local posts, draft, friends, and onboarding on this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await clearLocalPosts();
            await discardDraft();
            clearActivityLog();
            clearLocalSocialData();
            setProfile(defaultProfile);
            setHasSeenOnboarding(false);
            updateBetaAccess(DEFAULT_BETA_ACCESS);
            logEvent("Deleted local account data");
          }
        }
      ]
    );
  }

  function signOutDummyProfile() {
    Alert.alert("Dummy profile only", "Real sign out will be added with Google or Supabase auth.");
    logEvent("Viewed dummy sign-out placeholder");
  }

  function openLegalPlaceholder(kind) {
    const title = kind === "terms" ? "Terms placeholder" : "Privacy placeholder";
    const body =
      kind === "terms"
        ? "Production terms will cover posting rules, account use, reporting, and acceptable content."
        : "Production privacy copy will explain account data, photos, voice notes, notifications, retention, and deletion.";

    Alert.alert(title, body);
    logEvent(`Viewed ${kind} placeholder`);
  }

  function contactSupportPlaceholder() {
    Alert.alert("Support", `For this prototype, support routes to ${safetySettings.supportEmail}.`);
    logEvent("Viewed support contact");
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
          photoUri: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
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
    if (scenario === "uploadFailure") {
      const postId = publishedPost?.id || generalPosts[0]?.id;
      if (!postId) {
        Alert.alert("No post to fail", "Create a local post first, then run this upload scenario.");
        return;
      }
      simulatePostUploadFailure(postId);
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

  if (FEATURE_FLAGS.betaGate && betaAccess.requireInvite && !betaAccess.acceptedAt) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.shell} edges={["top", "bottom"]}>
          <StatusBar style={isDarkMode ? "light" : "dark"} />
          <BetaAccessScreen onSubmitCode={submitBetaCode} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!hasSeenOnboarding) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.shell} edges={["top", "bottom"]}>
          <StatusBar style={isDarkMode ? "light" : "dark"} />
          <OnboardingScreen
            notificationSettings={notificationSettings}
            onChangeProfile={setProfile}
            onComplete={() => setHasSeenOnboarding(true)}
            onPickProfilePhoto={pickProfilePhoto}
            onRequestCameraPermission={requestCameraPermission}
            onRequestMicrophonePermission={requestMicrophonePermission}
            onToggleDailyReminder={toggleDailyReminder}
            profile={profile}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const screenContext = {
    acceptFriendRequest,
    activityLog,
    addFriend,
    addToPosts,
    betaAccess,
    blockFriend,
    blockedProfiles,
    cameraFacing,
    cameraPermission,
    cameraRef,
    caption,
    capturedPhoto,
    changeReminderTime,
    clearActivityLog,
    clearLocalPosts,
    declineFriendRequest,
    deletePost,
    discardDraft,
    friendRequests,
    friends,
    generalPosts,
    handleSendTestNotification,
    handleSimulateNewFriendPost,
    isDarkMode,
    notificationSettings,
    outgoingFriendRequests,
    permissionStatuses,
    pickProfilePhoto,
    playbackStatus,
    playbackUri,
    privacySettings,
    profile,
    publishMoment,
    prompt,
    promptHistory,
    publishedPost,
    recording,
    recordingSeconds,
    recordingStatus,
    removeDraftPhoto,
    removeDraftVoice,
    removeFriend,
    reportItem,
    reports,
    requestCameraPermission,
    requestMicrophonePermission,
    resetOnboarding,
    restoreDemoData,
    runBugScenario,
    safetySettings,
    retryPostUpload,
    setAddToPosts,
    setCameraFacing,
    setCaption,
    setGeneralPosts,
    setHasSeenOnboarding,
    setIsDarkMode,
    setProfile,
    setVisibility,
    sharePost,
    stopRecording,
    startRecording,
    takePhoto,
    toggleDailyReminder,
    toggleFriendCloseStatus,
    toggleNotificationPreference,
    togglePrivacySetting: handleTogglePrivacySetting,
    toggleSafetySetting: handleToggleSafetySetting,
    toggleVoicePlayback,
    updateBetaAccess: handleUpdateBetaAccess,
    updatePostCaption,
    updatePrivacySetting: handleUpdatePrivacySetting,
    updateQuietHours,
    cancelFriendRequest,
    unblockProfile,
    exportLocalData,
    deleteLocalAccount,
    signOutDummyProfile,
    openLegalPlaceholder,
    contactSupportPlaceholder,
    visibility,
    voiceUri
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.shell} edges={["top", "bottom"]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <AppNavigator context={screenContext} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
